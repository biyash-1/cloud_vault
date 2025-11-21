


import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { appwriteConfig } from "@/app/appwrite/config";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const calculatePercentage = (sizeInBytes: number) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024;
  const percentage = (sizeInBytes / totalSizeInBytes) * 100;
  return Number(percentage.toFixed(2));
};
export const getUsageSummary = (totalSpace: any) => {
  return [
    {
      title: "Documents",
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      icon: "https://static.vecteezy.com/system/resources/previews/049/539/797/large_2x/3d-render-business-document-for-business-icon-transparent-background-png.png",
      url: "/dashboard/documents",
      color: "bg-blue-50"
    },
    {
      title: "Images",
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      icon: "https://as2.ftcdn.net/v2/jpg/09/95/62/83/1000_F_995628393_4uqTQ5H4dBz7NcammMToczViuuAlNNlO.jpg",
      url: "/dashboard/images",
       color: "bg-pink-50"
    },
    {
      title: "Media",
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: "https://cdn-icons-png.freepik.com/512/2696/2696537.png?ga=GA1.1.1597048708.1763291475",
      url: "/dashboard/media",
       color: "bg-green-50"
    },
    {
      title: "Others",
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      icon: "https://cdn-icons-png.freepik.com/512/7131/7131125.png?ga=GA1.1.1597048708.1763291475",
      url: "/dashboard/others",
       color: "bg-violet-50"
    },
  ];
};


export const convertFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes";
  } 
  else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(2) + " KB";
  } 
  else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(2) + " MB";
  } 
  else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(2) + " GB";  // <— Accurate (no rounding to 1 decimal)
  }
};

export const getFileType = (fileName?: string) => {
  if (!fileName || typeof fileName !== "string") {
    return { type: "others", extension: "" };
  }

  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  let type: "document" | "image" | "audio" | "video" | "others";

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      type = "image";
      break;
    case "mp3":
    case "wav":
    case "ogg":
    case "m4a":
      type = "audio";
      break;
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
    case "webm":
      type = "video";
      break;
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
    case "csv":
    case "xlsx":
    case "xls":
    case "ppt":
    case "pptx":
      type = "document";
      break;
    default:
      type = "others";
  }

  return { type, extension };
};

export const parseStringify = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj)) as T;
};


// ✅ Add this:
export function getFileIcon(type: string, extension: string): string {
  const ext = extension?.toLowerCase().trim();

  switch (type.toLowerCase().trim()) {
    case "image":
      return "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/photo.svg";
    case "video":
      return "https://cdn-icons-png.flaticon.com/512/187/187326.png";
    case "audio":
      return "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/music.svg";
    case "document":
      if (ext === "pdf") return "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg";
      if (["doc", "docx"].includes(ext)) return "https://www.svgrepo.com/show/217122/docs.svg";
      if (["xls", "xlsx"].includes(ext)) return "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/file-xls.svg";
      if (["ppt", "pptx"].includes(ext)) return "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/file-ppt.svg";
      return "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/file.svg";
    case "archive":
      return "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/archive.svg";
    default:
      return "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/file.svg";
  }
}


export const convertFileToUrl = (file?: File) => {
  if (!file || !(file instanceof File)) return "";
  return URL.createObjectURL(file);
};


export const constructFileUrl = (bucketFileId: string) => {
  const { endpoint, bucketId, projectId } = appwriteConfig;

  if (!endpoint || !bucketId || !projectId) {
    console.error("Missing Appwrite configuration:", { endpoint, bucketId, projectId });
    return "";
  }

  return `${endpoint}/storage/buckets/${bucketId}/files/${bucketFileId}/view?project=${projectId}`;
};

export const constructDownloadUrl = (bucketFileId:string) =>{
 const {endpoint,bucketId,projectId} = appwriteConfig;
return `${endpoint}/storage/buckets/${bucketId}/files/${bucketFileId}/download?project=${projectId}`;
}


export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "—";

  const date = new Date(isoString);

  // Get hours and adjust for 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time and date parts
  const time = `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  return `${time}, ${day} ${month}`;
};







export const getFileTypeParams = (type:string) => {
  switch(type) {
    case "document":
      return ["document"]
      case "images":
        return ["image"]
        case "media":
          return ["video","audio"]
          case "others":
            return ["other"];
            default:
              return ["document"]
  }
}