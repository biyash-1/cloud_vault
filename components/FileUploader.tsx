"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { convertFileToUrl, getFileType, cn } from "@/lib/utils";
import Thumbnail from "@/components/Thumbnail";
import { CiCircleRemove } from "react-icons/ci";
import { AiOutlineUpload, AiOutlineFileAdd } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";
import { uploadFile } from "@/app/actions/file.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  path: string;
  className?: string;
}

interface FileWithStatus {
  file: File;
  name: string;
  type: string;
  size: number;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  failed?: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB


const FileUploader = ({ ownerId, accountId, path, className }: Props) => {

  const router = useRouter();
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileToSerializable = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      buffer: Array.from(new Uint8Array(arrayBuffer)),
    };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const newFiles: FileWithStatus[] = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      uploading: false,
      uploaded: false,
      progress: 0,
      failed: false,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLDivElement>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    const uploadPromises = files.map(async (fileObj) => {
      const file = fileObj.file;

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Max 50MB.`);
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, failed: true, uploading: false } : f
          )
        );
        return;
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, uploading: true, failed: false } : f
        )
      );

      let progressInterval: NodeJS.Timeout | null = null;

      try {
        progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, progress: Math.min(f.progress + 8, 95) }
                : f
            )
          );
        }, 200);

        const serializableFile = await fileToSerializable(file);

        const result = await uploadFile({
          file: serializableFile,
          ownerId,
          accountId,
          path,
        });

        if (progressInterval) clearInterval(progressInterval);

        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, uploading: false, uploaded: true, progress: 100 }
              : f
          )
        );

        toast.success(`${file.name} uploaded successfully`);
        router.refresh();
        console.log("✅ Upload successful:", result);
      } catch (error: any) {
        if (progressInterval) clearInterval(progressInterval);
        console.error("❌ Upload error for", file.name, ":", error);

        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, uploading: false, failed: true } : f
          )
        );

        toast.error(`Failed to upload ${file.name}`);
      }
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
  };

  const totalFiles = files.length;
  const uploadedFiles = files.filter((f) => f.uploaded).length;
  const hasUnuploadedFiles = files.some((f) => !f.uploaded && !f.uploading);

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Button (replaces dropzone) */}
      <div {...getRootProps()} className="flex justify-center">
        <input {...getInputProps()} />
        <Button
          onClick={open}
          className="flex items-center gap-2 px-6 py-2"
          variant="default"
        >
          <AiOutlineFileAdd className="w-5 h-5" />
          Upload Files
        </Button>
      </div>

      {/* Floating Preview Section - Bottom Right */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800 text-sm">
                  Upload Files
                </h3>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {totalFiles}
                </span>
                {uploadedFiles > 0 && (
                  <span className="text-xs text-green-600">
                    {uploadedFiles} done
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAllFiles}
                  disabled={isUploading}
                  className="h-7 w-7 p-0"
                >
                  <CiCircleRemove className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Files List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-2">
                <AnimatePresence>
                  {files.map((file, index) => {
                    const { type, extension } = getFileType(file.name);
                    const bgColor = file.failed
                      ? "bg-red-50 border-red-200"
                      : file.uploaded
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200";

                    return (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={cn(
                          "p-3 border rounded-lg transition-all",
                          bgColor
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0">
                            <Thumbnail
                              type={type}
                              extension={extension}
                              url={convertFileToUrl(file.file)}
                              className="w-10 h-10"
                            />
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <span className="font-medium text-sm text-gray-800 truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {(file.size / 1024 / 1024).toFixed(1)}MB
                              </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-1">
                              <div
                                className={cn(
                                  "h-full transition-all duration-300",
                                  file.failed
                                    ? "bg-red-500"
                                    : file.uploaded
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                )}
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>

                            {/* Status */}
                            <div className="flex justify-between items-center">
                              <span
                                className={cn(
                                  "text-xs",
                                  file.failed
                                    ? "text-red-500"
                                    : file.uploaded
                                    ? "text-green-600"
                                    : file.uploading
                                    ? "text-blue-500"
                                    : "text-gray-500"
                                )}
                              >
                                {file.failed
                                  ? "Failed"
                                  : file.uploaded
                                  ? "Uploaded"
                                  : file.uploading
                                  ? `Uploading ${file.progress}%`
                                  : "Ready"}
                              </span>

                              {/* Remove Button */}
                              {!file.uploading && (
                                <div
                                  className="cursor-pointer p-1 hover:bg-gray-200 rounded transition-colors"
                                  onClick={(e) =>
                                    handleRemoveFile(e, file.name)
                                  }
                                >
                                  <CiCircleRemove className="w-3 h-3 text-red-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="p-3 border-t bg-gray-50 text-xs text-gray-600 rounded-b-lg">
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <ImSpinner2 className="animate-spin w-3 h-3" />
                  <span>Uploading files...</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>
                    {uploadedFiles === totalFiles && totalFiles > 0
                      ? "All files uploaded"
                      : `${uploadedFiles} of ${totalFiles} uploaded`}
                  </span>
                  {hasUnuploadedFiles && (
                    <Button
                      size="sm"
                      onClick={handleUploadAll}
                      className="h-6 text-xs"
                    >
                      Upload All
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
