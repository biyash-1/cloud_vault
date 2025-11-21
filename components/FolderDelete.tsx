// components/FolderDelete.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
// import { deleteFolder } from "@/app/actions/file.action";
import toast from "react-hot-toast";

interface FolderDeleteProps {
  folderId: string;
  folderName: string;
  onDelete?: () => void; // Optional callback after successful deletion
}

const FolderDelete = ({ folderId, folderName, onDelete }: FolderDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
    //   await deleteFolder(folderId);
      toast.success("Folder deleted successfully");
      setIsOpen(false);
      onDelete?.(); // Call callback if provided
    } catch (error: any) {
      toast.error(error.message || "Failed to delete folder");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 w-6 h-6"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation when clicking delete
            e.stopPropagation();
          }}
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Are you sure you want to delete the folder "<strong>{folderName}</strong>"?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Folder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDelete;