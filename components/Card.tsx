import React from 'react';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import ActionDropDown from './ActionDropDown';

interface CardProps {
  file: Models.Document;
}

const FileCard = ({ file }: CardProps) => {
  return (
    <div className="relative flex flex-col p-6 px-2 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg  min-h-[130px]">
      
   
      <div className="flex flex-row items-center">
        {/* Thumbnail */}
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />

        {/* File Info */}
        <div className="ml-4 flex-1 flex flex-col overflow-hidden">
          <h2 className="text-sm font-medium truncate">{file.name || "Unnamed file"}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {file.type} • {formatSize(file.size)}
          </p>
        </div>

        {/* Dropdown positioned at top-right */}
        <div className="absolute top-2 right-2">
          <ActionDropDown file={file} />
        </div>
      </div>

      {/* Owner info at bottom with faded text */}
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
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