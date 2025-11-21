import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { Input } from "./ui/input";
import React from "react";
import { Button } from "./ui/button";
import { TiDelete } from "react-icons/ti";

// Define a proper type for your file
export interface FileDocument extends Models.Document {
  name: string;
  type: string;       // file type like "image", "video"
  mimeType?: string;  // optional mimeType
  url: string;
  extension: string;
  size: number;
  users: string[];
  folderId?: string;
}

interface Props {
  file: FileDocument;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
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

const Share = ({ file, onInputChange, onRemove }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="font-medium mb-2">Share file with others</p>

        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInputChange(e.target.value.trim().split(","))
          }
          className="share-input"
        />

        <div className="pt-4">
          <div className="flex justify-between mb-1">
            <p className="subtitle-2 text-gray">Shared with</p>
            <p className="subtitle-2 text-gray">{file.users.length}</p>
          </div>

          <ul className="pt-2 border rounded-xl divide-y">
            {file.users.length === 0 && (
              <p className="text-sm text-gray-500 p-2">
                No users shared yet.
              </p>
            )}
            {file.users.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between px-2 py-1"
              >
                <p className="text-sm truncate">{email}</p>
                <TiDelete
                  size={26}
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={() => onRemove(email)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Share;
