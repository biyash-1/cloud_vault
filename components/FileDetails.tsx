import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";

export interface FileDocument extends Models.Document {
  name: string;
  type: string;   
  fullName: string;    
  mimeType?: string; 
  owner: string;
  url: string;
  extension: string;
  size: number;
  users?: string[];
  folderId?: string;
  ownerName?: string;
}

interface FileDetailsProps {
  file: FileDocument;
}

const ImageThumbnail = ({ file }: FileDetailsProps) => {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <Thumbnail
        type={file.mimeType || file.type}
        extension={file.extension}
        url={file.url}
      />
      <div className="mt-2">
        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
          {file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(file.$createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string | number | undefined;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
    <p className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[60%] text-right">
      {value || "—"}
    </p>
  </div>
);

const FileDetails = ({ file }: FileDetailsProps) => {
      console.log("File data:", file);
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm w-full max-w-md mx-auto">
      <ImageThumbnail file={file} />

      <div className="mt-4 space-y-2">
        <DetailRow label="Format" value={file.extension} />
        <DetailRow
          label="Size"
          value={file.size ? `${(file.size / 1024).toFixed(2)} KB` : undefined}
        />
        <DetailRow
          label="Owner"
          value={ file.ownerName || "Unknown"}
        />
        <DetailRow
          label="Last Edit"
          value={new Date(file.$updatedAt).toLocaleString()}
        />
      </div>
    </div>
  );
};

export default FileDetails;
