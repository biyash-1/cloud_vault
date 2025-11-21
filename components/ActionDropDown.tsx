

"use client";
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import {
  AiOutlineDelete,
  AiOutlineShareAlt,
  AiOutlineDownload,
} from "react-icons/ai";
import { MdDriveFileRenameOutline, MdInfoOutline ,MdDriveFileMoveOutline} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { constructDownloadUrl } from "@/lib/utils";
import {
  renameFile,
  updateFileUsers,
  removeUser,deleteFile ,moveFile
} from "@/app/actions/file.action";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileDetails from "./FileDetails";
import Share from "./Share";
import Delete from "./Delete";
import MoveComponent from "./MoveComponent";

type ActionType = "rename" | "details" | "share" | "download" | "delete" | "move" | null;

interface ActionDropDownProps {
  file: any;
}

const ActionDropDown = ({ file }: ActionDropDownProps) => {
  const [action, setAction] = useState<ActionType>(null);
  const [name, setName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isRemovingUser, setIsRemovingUser] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Add this state
  const path = usePathname();
const pathSegments = path.split("/");
const type = pathSegments[pathSegments.length - 1] || 'files';

  const actionItems = [
    {
      label: "Rename",
      icon: <MdDriveFileRenameOutline className="mr-2 text-blue-500" />,
      value: "rename",
    },
    {
      label: "Details",
      icon: <MdInfoOutline className="mr-2 text-yellow-400" />,
      value: "details",
    },
    {
      label: "Share",
      icon: <AiOutlineShareAlt className="mr-2 text-green-600" />,
      value: "share",
    },
    {
      label: "Download",
      icon: <AiOutlineDownload className="mr-2 text-purple-500" />,
      value: "download",
    },
    {
      label: "Delete",
      icon: <AiOutlineDelete className="mr-2 text-red-500" />,
      value: "delete",
    },
     {
      label: "move",
      icon: <MdDriveFileMoveOutline className="mr-2 text-red-500" />,
      value: "move",
    },
  ];

  // ---- Handlers ----
  const handleActionClick = (value: ActionType) => {
    setAction(value);
  };

  const handleRename = async () => {
    if (!file) return;
    setIsRenaming(true);
    try {
      await renameFile({
        fileId: file.$id,
        name: name.replace(/\.[^/.]+$/, ""),
        extension: file.extension,
        path,
      });
      toast.success("File renamed successfully");
      setAction(null);
    } catch (err) {
      console.error("❌ Rename failed:", err);
      toast.error("Rename failed");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleShare = async () => {
    if (emails.length === 0) return;
    setIsSharing(true);
    try {
      await updateFileUsers({
        fileId: file.$id,
        emails,
        path,
      });
      toast.success("File shared successfully");
      setAction(null);
    } catch (err) {
      console.error("❌ Share failed:", err);
      toast.error("Share failed");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    setIsRemovingUser(true);
    try {
      await removeUser({
        fileId: file.$id,
        email,
        path,
      });
      file.users = file.users.filter((e: string) => e !== email);
      toast.success("User removed successfully");
    } catch (err) {
      console.error("❌ Remove user failed:", err);
      toast.error("Failed to remove user");
    } finally {
      setIsRemovingUser(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true); // Set deleting state to true
    try {
      await deleteFile({
        fileId: file.$id,
        bucketFileId: file.bucketFileId,
        path
      });
      toast.success("File deleted successfully");
      setAction(null); // Close the dialog on success
    } catch (error: any) {
      toast.error("Error deleting file: " + error.message);
    } finally {
      setIsDeleting(false); // Reset deleting state
    }
  };

 
  // ---- Dialog ----
  const renderDialog = () => {
    if (!action || !["rename", "details", "share", "delete","move"].includes(action))
      return null;

    return (
      <Dialog open={!!action} onOpenChange={() => setAction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {action === "rename"
                ? "Rename File"
                : action === "share"
                ? "Share File"
                : action === "delete"
                ? "Delete File"
                :action ==="move"
                ? "Move file"
                : "File Details"}
            </DialogTitle>
          </DialogHeader>

          {action === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="my-4"
            />
          )}

          {action === "details" && (
            <div className="my-4">
              <FileDetails file={file} />
            </div>
          )}
          {action ==="move" && (
            <MoveComponent type={type} file ={file} onClose={() => setAction(null)}/>
          )}

          {action === "share" && (
            <Share
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
              loading={isRemovingUser}
            />
          )}

          {action === "delete" && <Delete file={file} />}

          <DialogFooter className={`flex gap-2 ${action === 'delete' ? 'justify-center' : 'justify-end'}`}>
          {action !== "move" && (
  <DialogClose asChild>
    <Button variant="outline" disabled={isDeleting}>
      Close
    </Button>
  </DialogClose>
)}


            {action === "rename" && (
              <Button onClick={handleRename} disabled={isRenaming}>
                {isRenaming ? "Renaming..." : "Rename"}
              </Button>
            )}

            {action === "share" && (
              <Button
                onClick={handleShare}
                disabled={isSharing || emails.length === 0}
              >
                {isSharing ? "Sharing..." : "Share"}
              </Button>
            )}
            

            {action === "delete" && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="min-w-[100px]" 
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // ---- Render ----
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiMoreVertical size={18} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="truncate">{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {actionItems.map((item) =>
            item.value === "download" ? (
              <Link
                key={item.value}
                href={constructDownloadUrl(file.bucketFileId)}
                download={file.name}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <DropdownMenuItem
                key={item.value}
                onClick={() => handleActionClick(item.value as ActionType)}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialog()}
    </>
  );
};

export default ActionDropDown;
