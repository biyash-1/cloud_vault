import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { Input } from "./ui/input";
import React from "react";
import { Button } from "./ui/button";
import { TiDelete } from "react-icons/ti";

interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

interface FileDetailsProps {
  file: Models.Document;
}

const ImageThumbnail = ({ file }: FileDetailsProps) => {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <Thumbnail
        type={file.mimeType || file.type}
        extension={file.extension}
        url={file?.url}
      />
      <div className="mt-2">
        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
          {file?.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(file?.$createdAt).toLocaleString()}
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
          onChange={(e: any) => onInputChange(e.target.value.trim().split(","))}
          className="share-input"
        />

        <div className="pt-4">
          <div className="flex justify-between mb-1">
            <p className="subtitle-2 text-gray">Shared with</p>
            <p className="subtitle-2 text-gray">
              {file?.users?.length || 0}
            </p>
          </div>

          <ul className="pt-2 border rounded-xl divide-y">
            {file?.users?.map((email: any) => (
              <li
                key={email}
                className="flex items-center justify-between px-2 py-1"
              >
                <p className="text-sm truncate">{email}</p>
                <TiDelete
                  size={22} // 👈 make it bigger
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
