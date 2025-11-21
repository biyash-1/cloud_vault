"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { getFolders, moveFile } from "@/app/actions/file.action";

interface MoveComponentProps {
  file: any;
  type: string;
  onClose: () => void; // callback from parent to close dialog
}

const MoveComponent = ({ file, type, onClose }: MoveComponentProps) => {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getFolders(type); // server action
        if (!mounted) return;
        setFolders(res.documents || []);
      } catch (err) {
        console.error("Error fetching folders", err);
        toast.error("Failed to load folders");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [type]);

  const handleSelect = (folderId: string) => {
    setSelectedFolderId((prev) => (prev === folderId ? null : folderId));
  };

  const handleMove = async () => {
    if (!selectedFolderId) return;
    setIsMoving(true);
    try {
      await moveFile({
        fileId: file.$id,
        destinationFolderId: selectedFolderId,
 
      });

      toast.success("File moved successfully");
      // close dialog + refresh UI
      onClose();
      // Optionally refresh client list — simplest is reload
      // You can replace this with a better state update if you have one
      setTimeout(() => window.location.reload(), 200);
    } catch (err: any) {
      console.error("Move failed", err);
      toast.error(err?.message || "Failed to move file");
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="min-w-[320px]">
      <h3 className="font-semibold mb-2">Select folder to move</h3>

      {loading ? (
        <p>Loading folders…</p>
      ) : folders.length === 0 ? (
        <p className="text-sm text-gray-500">No folders found</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto mb-4">
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.$id;
            return (
              <div
                key={folder.$id}
                onClick={() => handleSelect(folder.$id)}
                role="button"
                className={
                  "flex items-center gap-3 p-2 rounded border transition " +
                  (isSelected
                    ? "bg-blue-50 border-blue-300 ring-1 ring-blue-200"
                    : "hover:bg-gray-50")
                }
              >
                <div className="text-2xl">📁</div>
                <div className="flex-1">
                  <div className="text-sm font-medium truncate">{folder.name}</div>
                  <div className="text-xs text-gray-400">{folder.type}</div>
                </div>
                {isSelected && (
                  <div className="text-sm text-blue-600 font-medium">Selected</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 rounded border text-sm"
          disabled={isMoving}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleMove}
          disabled={!selectedFolderId || isMoving}
          className={
            "px-3 py-1 rounded text-sm text-white " +
            (selectedFolderId && !isMoving
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed")
          }
        >
          {isMoving ? "Moving…" : "Move"}
        </button>
      </div>
    </div>
  );
};

export default MoveComponent;
