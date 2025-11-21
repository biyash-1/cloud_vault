import { getFiles, getFolders } from "@/app/actions/file.action";
import Card from "@/components/Card";
import { getFileTypeParams, convertFileSize } from "@/lib/utils";
import Link from "next/link";

interface FolderPageProps {
  params: Promise<{
    type: string;
    folderId: string;
  }>;
  searchParams: Promise<{
    query?: string;
    sort?: string;
  }>;
}

const FolderPage = async ({ params, searchParams }: FolderPageProps) => {
  const { type, folderId } = await params;
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  // Get the current folder details
  const folders = await getFolders(type);
  const currentFolder = folders.documents.find((folder: any) => folder.$id === folderId);
   console.log("🔄 Folder Page - Params:", { type, folderId });
  console.log("🔄 Folder Page - Search Params:", { searchText, sort });

  // Get files in this specific folder
  const fileType = getFileTypeParams(type);
  const files = await getFiles({ 
    type: fileType, 
    sort, 
    searchText, 
    folderId 
  });

  return (
    <div className="page-container px-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={`/dashboard/${type}`} className="hover:text-blue-600">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{currentFolder?.name || 'Folder'}</span>
      </nav>

      <section className="w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold capitalize">
              {currentFolder?.name || 'Folder'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {files.total} file{files.total !== 1 ? 's' : ''} in this folder
            </p>
          </div>
          
          <Link 
            href={`/dashboard/${type}`}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Back to {type}
          </Link>
        </div>
      </section>

      {/* Files Grid - Same as your main page */}
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
            mt-6
          "
        >
          {files.documents.map((file: any) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No files in this folder</p>
          <p className="text-sm text-gray-400 mt-2">
            Move files to this folder to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default FolderPage;