
export const dynamic = "force-dynamic";

import Sort from "@/components/Sort";
import {
  getFiles,
  getTotalSpaceUsed,
  getFolders,
} from "@/app/actions/file.action";
import Card from "@/components/Card";
import { getFileTypeParams, convertFileSize } from "@/lib/utils";
import Link from "next/link";
import { FileDocument,FolderDocument } from "@/app/actions/file.action";

import FolderCreationWrapper from "@/components/FolderCreationWrapper";
import FolderMenu from "@/components/FolderMenu";

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams?: Promise<{ query?: string; sort?: string }>;
};

type TotalSpaceKey = "image" | "document" | "video" | "audio" | "other";

type TotalSpaceUsed = {
  image: { size: number; latestDate: string };
  document: { size: number; latestDate: string };
  video: { size: number; latestDate: string };
  audio: { size: number; latestDate: string };
  other: { size: number; latestDate: string };
  used: number;
  all: number;
};

type FolderListResponse = {
  total: number;
  documents: FolderDocument[];
};

type FileListResponse = {
  total: number;
  documents: FileDocument[];
};

const typeMap: Record<string, TotalSpaceKey> = {
  images: "image",
  videos: "video",
  documents: "document",
  audios: "audio",
  others: "other",
};

interface fileProp {
  file:FileDocument
}

const Page = async ({ searchParams, params }: PageProps) => {
  const type = (await params)?.type;
  const totalSpaceUsed: TotalSpaceUsed | undefined = await getTotalSpaceUsed();

  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const fileType = getFileTypeParams(type);
  const files = await getFiles({ type: fileType, sort, folderId: undefined });
  const folders= await getFolders(type);

  // ---- FIXED KEY MAPPING LOGIC ----
  const safeKey: TotalSpaceKey = typeMap[type] || "other";
  let totalSize = 0;

  if (type === "media") {
    totalSize =
      (totalSpaceUsed?.audio?.size || 0) + (totalSpaceUsed?.video?.size || 0);
  } else if (totalSpaceUsed && safeKey in totalSpaceUsed) {
    totalSize = totalSpaceUsed[safeKey]?.size || 0;
  }

  return (
    <div className="page-container px-6">
      <section className="w-full">
        <h1 className="text-2xl font-semibold capitalize">{type}</h1>

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-600">
            Total: <span>{convertFileSize(totalSize)}</span>
          </p>

          <div className="flex gap-2 items-center mt-2">
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
              <div
                key={folder.$id}
                className="flex flex-col items-center group relative"
              >
                <Link
                  href={`/dashboard/${type}/folder/${folder.$id}`}
                  className="flex flex-col items-center cursor-pointer w-full"
                >
                  <div className="text-5xl group-hover:scale-105 transition">📁</div>
                  <p className="text-xs text-center mt-1 truncate w-20 group-hover:text-blue-600">
                    {folder.name}
                  </p>
                </Link>

                <FolderMenu folderId={folder.$id} folderName={folder.name} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 my-4">No folders found</p>
        )}
      </div>

      {files.total > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
       {files.documents.map((file: FileDocument) => (
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
