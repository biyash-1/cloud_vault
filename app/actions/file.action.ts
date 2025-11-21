"use server";
import { appwriteConfig } from "@/app/appwrite/config";
import { getCurrentUser } from "./user.action";
import { createAdminClient, createSessionedClient } from "@/app/appwrite/index";
import { InputFile } from "node-appwrite/file";
import { ID, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Models } from "node-appwrite";

interface UploadFileProps {
  file: {
    name: string;
    type: string;
    size: number;
    buffer: number[];
  };
  ownerId: string;
  accountId: string;
  path: string;
}
interface RenRenameFilePropsme {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}

interface RemoveUserProps {
  fileId: string;
  email: string;
  path?: string;
}

interface DeleteFileProp {
  fileId: string;
  bucketFileId: string;
  path: string;
}

export interface GetFileTypeProp {
  type?: string[];
  searchText?: string;
  sort?: string;    
  limit?: number | string;
  folderId?: string;
}
export type FolderDocument = Models.Document & { name: string };
export type FolderListResponse = Models.DocumentList<FolderDocument> & {
  documents: FolderDocument[];
};

export type FileDocument = Models.Document & {
  name: string;
  type: string;
  size: number;
  url: string;
  extension: string;
  owner: string;
  folderId?: string;
};

export type FileListResponse = Models.DocumentList<FileDocument> & {
  documents: FileDocument[];
};




const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    if (!file?.buffer || !Array.isArray(file.buffer)) {
      console.error("❌ Invalid or missing file buffer:", file);
      throw new Error("File buffer missing or invalid");
    }

    console.log("🟢 Received file:", {
      name: file.name,
      size: file.size,
      bufferLength: file.buffer.length,
    });
    const currentUser = await getCurrentUser();
    console.log("current user", currentUser);
    if (!currentUser) throw new Error("No user logged in");
    // Convert buffer array -> Node Buffer
    const buffer = Buffer.from(file.buffer);
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    // Upload to Appwrite storage
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileType = getFileType(bucketFile.name);

    const fileDocument = {
      type: fileType.type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: fileType.extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      ownerName: currentUser?.username,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.fileCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: any) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    if (path) {
      revalidatePath(path);
    }

    console.log("✅ File uploaded successfully:", bucketFile.$id);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
const createQueries = (
  currentUser: any, 
  types: string[] = [], 
  searchText: string, 
  sort: string, 
  limit?: number | string, 
  folderId?: string
) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
    ]),
  ];

  if (types.length === 1) {
    queries.push(Query.equal("type", types[0]));
  } else if (types.length > 1) {
    queries.push(Query.or(types.map((type) => Query.equal("type", type))));
  }

  if (searchText && searchText.trim() !== "") {
    queries.push(Query.contains("name", searchText.trim()));
  }

  // FIXED: Properly handle folderId filtering
  if (folderId !== undefined && folderId !== null) {
    console.log("✅ Filtering by folderId:", folderId);
    queries.push(Query.equal("folderId", folderId));
  } else {
    // When folderId is null, we want files that don't belong to any folder
    console.log("✅ Filtering for root files (no folder)");
    queries.push(Query.isNull("folderId"));
  }

  if (limit) {
    queries.push(Query.limit(Number(limit)));
  }

  const [sortBy, orderby] = sort.split("-");
  queries.push(orderby === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy));

  return queries;
};

export const getFiles = async ({type  =[],searchText="", sort='$createdAt-desc',limit='',folderId}:GetFileTypeProp):Promise<FileListResponse> => {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("user not found");
    const queries = createQueries(currentUser,type,searchText,sort,limit,folderId);
        console.log("🔍 DEBUG - Folder ID:", folderId);
    console.log("🔍 DEBUG - All queries:", queries);
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      queries
    );

    return parseStringify(files) ;
  } catch (error) {
  console.error("❌ Failed to fetch user files:", error);
    return { total: 0, documents: [] } as FileListResponse;
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenRenameFilePropsme) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      { name: newName }
    );

    if (path) {
      revalidatePath(path); // refresh page or cache
    }

    return updatedFile;
  } catch (error) {
    console.error("Failed to rename file:", error);
    throw error;
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProp) => {
  const { databases, storage } = await createAdminClient();
  try {
    const deleteFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId
    );

    if (deleteFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    if (path) {
      revalidatePath(path);
    }
    return parseStringify({ status: "sucess" });
  } catch (error: any) {
    handleError("error deleting file", error);
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: RenRenameFilePropsme) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId, // database ID
      appwriteConfig.fileCollectionId, // collection ID
      fileId, // document ID
      { users: emails } // data to update
    );

    if (path) {
      revalidatePath(path); // refresh page or cache
    }

    return updatedFile;
  } catch (error) {
    console.error("Failed to rename file:", error);
    throw error;
  }
};

export const removeUser = async ({ fileId, email, path }: RemoveUserProps) => {
  const { databases } = await createAdminClient();

  try {
    // 1️⃣ Get the current file document
    const fileDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId
    );

    // 2️⃣ Remove the given email from the `users` array
    const updatedUsers = (fileDoc.users || []).filter(
      (userEmail: string) => userEmail !== email
    );

    // 3️⃣ Update the document in Appwrite
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      { users: updatedUsers }
    );

    // 4️⃣ Revalidate the cache or path if needed
    if (path) revalidatePath(path);
    console.log(`✅ Removed user ${email} from file ${fileId}`);
    return updatedFile;
  } catch (error) {
    console.error("❌ Failed to remove user from file:", error);
    throw error;
  }
};

// Add the missing interface

// Remove unnecessary revalidate function as we're using revalidatePath


export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionedClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      [Query.equal("owner", [currentUser.$id])]
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024,
    };

    const categoryMap: Record<string, keyof typeof totalSpace> = {
      image: "image",
      img: "image",
      picture: "image",

      document: "document",
      doc: "document",
      pdf: "document",

      video: "video",
      vid: "video",
      mp4: "video",

      audio: "audio",
      sound: "audio",
      mp3: "audio",

      other: "other",
    };

    files.documents.forEach((file) => {
      const fileType = (file.type || "other").toLowerCase();
      const key = categoryMap[fileType] || "other";

      totalSpace[key].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[key].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[key].latestDate)
      ) {
        totalSpace[key].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:");
  }
}



export const createFolder = async ({ name, path }: { name: string, path?: string }) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("No user logged in");

    // Check duplicate folder for same user & same type
    const existingFolders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.folderCollectionId,
      [
        Query.equal("owner", currentUser.$id),
        Query.equal("name", name),
        Query.equal("type", path),   // <— IMPORTANT (same section only)
      ]
    );

    if (existingFolders.total > 0) {
      throw new Error("Folder with this name already exists");
    }

    const newFolder = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.folderCollectionId,
      ID.unique(),
      {
        name,
        type: path, // <— image / video / documents / media etc
        owner: currentUser.$id,
        ownerName: currentUser.username,
        accountId: currentUser.accountId,
        createdAt: new Date().toISOString(),
      }
    );

    // Fix path: must revalidate the route `/dashboard/{type}`
    if (path) {
      revalidatePath(`/dashboard/${path}`);
    }

    return parseStringify(newFolder);
  } catch (error) {
    console.error("❌ Failed to create folder:", error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    const { databases } = await createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.folderCollectionId,
      folderId
    );

    return { status: "success" };
  } catch (error) {
    console.error("❌ Failed to delete folder:", error);
    throw error;
  }
};



export const getFolders = async (type: string) :Promise<FolderListResponse> => {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const folders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.folderCollectionId,
      [
        Query.equal("owner", currentUser.$id),
      Query.equal("type", type),  // filter by section
      ]
    );

    return parseStringify(folders);
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return { total: 0, documents: [] };
  }
};


export const moveFile = async ({
  fileId,
  destinationFolderId,
}: {
  fileId: string;
  destinationFolderId: string;
}) => {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("No user logged in");

    // Verify the destination folder exists
    const folder = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.folderCollectionId,
      destinationFolderId
    );

    if (!folder) throw new Error("Destination folder not found");

    // Move file → only change folderId
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        folderId: folder.$id,
      }
    );

    return parseStringify(updatedFile);
  } catch (error) {
    console.error("❌ Move file failed:", error);
    throw error;
  }
};

