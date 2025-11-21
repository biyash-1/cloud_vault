"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getFiles } from "@/app/actions/file.action";
import Thumbnail from "./Thumbnail";
import { Models } from "node-appwrite";
import { useDebounce } from 'use-debounce';
interface SearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
 
}
export interface FileDocument extends Models.Document {
  name: string;
  type: string;
  mimeType?: string;
  url: string;
  extension: string;
}


export default function Search({
  placeholder = "Search...",
  onSearch,
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileDocument[]>([]);
  const [open, setOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query,300)

  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    const fetchFiles = async () => {
    
      if (debouncedQuery.length===0) {
        setResults([]);
        setOpen(false);
        return;
      }

      const files = await getFiles({
        type: [],
        searchText: debouncedQuery,
      });

      setResults(files.documents || []);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  // ✅ Keep query synced with URL (optional behavior)
  useEffect(() => {
    if (!searchQuery) setQuery("");
  }, [searchQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
     // 🚀 Immediately clear old results if input is cleared
  if (value.trim().length === 0) {
    setResults([]);
    setOpen(false);
  }

    if (onSearch) onSearch(value);
  };

  const handleClickItem = (file: FileDocument) => {
    setResults([]);
    setOpen(false);
 
    const fileType = (file?.type || "files").toString().toLowerCase();
    const routeBase =
      fileType === "video" || fileType === "audio" ? "media" : `${fileType}s`;

    const q = encodeURIComponent(query?.trim() || file?.name || "");
    router.replace(`/dashboard/${routeBase}?query=${q}`);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
      />

      {query && open && results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
          {results.map((file: any) => (
            <li
              key={file.$id}
              onClick={() => handleClickItem(file)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <Thumbnail
                type={file.type}
                extension={file.extension}
                url={file.url}
                className="size-9 min-w-9"
              />
              <span className="text-gray-700">{file.name}</span>
            </li>
          ))}
        </ul>
      )}

      {open && query && results.length === 0 && (
        <p className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md p-3 text-sm text-gray-500">
          No files found
        </p>
      )}
    </div>
  );
}
