import Sort from "@/components/Sort";
import {
  getFiles,
  getTotalSpaceUsed,
  getFolders,
} from "@/app/actions/file.action";
import Card from "@/components/Card";
import { getFileTypeParams, convertFileSize } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";

import FolderCreationWrapper from "@/components/FolderCreationWrapper";
import FolderMenu from "@/components/FolderMenu";

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams?: Promise<{ query?: string; sort?: string }>;
};


const typeMap: Record<string, string> = {
  images: "image",
  videos: "video",
  documents: "document",
  audios: "audio",
  others: "other",
};
type TotalSpaceKey = "image" | "document" | "video" | "audio" | "other";



const Page = async ({ searchParams, params }: PageProps) => {
  const type = (await params)?.type as string;
  const totalSpaceUsed = await getTotalSpaceUsed();
  console.log("totalSpaceUsed", totalSpaceUsed);

  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const fileType = getFileTypeParams(type);
  const files = await getFiles({ type: fileType, sort, folderId: undefined });
  const folders = await getFolders(type);
  console.log("folders", folders);

  // ---- FIXED KEY MAPPING LOGIC ----
const safeKey = (typeMap[type] || type) as TotalSpaceKey;// convert plural → singular
  let totalSize = 0;

  if (type === "media") {
    totalSize =
      (totalSpaceUsed?.audio?.size || 0) + (totalSpaceUsed?.video?.size || 0);
  } else {
    const safeKey = typeMap[type] || type;
    totalSize = totalSpaceUsed?.[safeKey]?.size || 0;
  }

  return (
    <div className="page-container px-6">
      <section className="w-full">
        <h1 className="text-2xl font-semibold capitalize">{type}</h1>

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-600">
            Total: <span>{convertFileSize(totalSize)}</span>
          </p>
    


          <div className="flex gap-2 items-center mt-2 ">
          <FolderCreationWrapper path={type} />
        
            <p className="text-sm text-gray-500">Sort by</p>
            <Sort />
          </div>
        </div>
      </section>
      <div className="for folder">
        {folders.total > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 my-6">
            {folders.documents.map((folder) => (
              // 👇 KEY CHANGE: Wrap in a div with relative positioning
              <div 
                key={folder.$id} 
                className="flex flex-col items-center group relative"
              >
                {/* Link only wraps the clickable folder content */}
                <Link 
                  href={`/dashboard/${type}/folder/${folder.$id}`}
                  className="flex flex-col items-center cursor-pointer w-full"
                >
                  {/* Folder Icon */}
                  <div className="text-5xl group-hover:scale-105 transition">
                    📁
                  </div>

                  {/* Folder Name */}
                  <p className="text-xs text-center mt-1 truncate w-20 group-hover:text-blue-600">
                    {folder.name}
                  </p>
                </Link>
             
                <FolderMenu 
                  folderId={folder.$id}
                  folderName={folder.name}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 my-4">No folders found</p>
        )}
      </div>

      {files.total > 0 ? (
        <section
          className="
            grid 
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4  
            xl:grid-cols-5
            gap-6
          "
        >
          {files.documents.map((file) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="text-gray-500 mt-10">No files found</p>
      )}
    </div>
  );
};

export default Page;