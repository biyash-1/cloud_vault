import React from 'react';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import ActionDropDown from './ActionDropDown';
import { formatDateTime } from '@/lib/utils';

interface CardProps {
  file: Models.Document;
}
export interface FileDocument extends Models.Document {
  name: string;
  type: string;       
  mimeType?: string; 
  url: string;
  extension: string;
  size: number;
  users?: string[];
  folderId?: string;
  ownerName?: string;
}
interface FileProps {
  file: FileDocument;
}

const FileCard = ({ file }: FileProps) => {
  return (
    <div className="relative flex flex-col p-6 px-2 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl min-h-[130px] transition-all duration-400 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:bg-blue-50/30 dark:hover:bg-gray-700/80 group cursor-pointer">
      
      <div className="flex flex-row items-center">
        {/* Thumbnail */}
        <div className="transition-transform duration-500 group-hover:scale-110">
          <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        </div>

        {/* File Info */}
        <div className="ml-4 flex-1 flex flex-col overflow-hidden">
          <h2 className="text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {file.name || "Unnamed file"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            {file.type} • {formatSize(file.size)}
          </p>
          <p>
            {formatDateTime(file.$updatedAt)}
          </p>
        </div>

        {/* Dropdown */}
        <div className="absolute top-2 right-2 group-hover:scale-110 transition-transform duration-300">
          <ActionDropDown file={file} />
        </div>
      </div>

      {/* Owner info */}
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-gray-600 transition-colors duration-300">
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
          By: {file.ownerName}
        </p>
      </div>
    </div>
  );
};

// Helper function
function formatSize(bytes: number) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default FileCard;