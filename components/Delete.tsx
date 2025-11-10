import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from './Thumbnail'
import { Button } from './ui/button';
interface FileDetailsProps{
    file: Models.Document
    
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

const Delete = ({file}:FileDetailsProps) => {
  return (
    <>
    <div>
      <h1 className='text-center'>Are you sure you want to delete?</h1>
        <ImageThumbnail file={file}/>
    </div>
    <div className='flex gap-2 items-center '>
 
    </div>
    </>
   
  )
}

export default Delete
