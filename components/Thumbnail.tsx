
import Image from "next/image";
import { getFileIcon } from "@/lib/utils";

interface Props {
  type?: string;
  extension?: string;
  url?: string;
   className?: string;
}

const Thumbnail = ({ type = "", extension = "", url = "" }: Props) => {
  const normalizedType = type.toLowerCase().trim();
  const normalizedExt = extension.toLowerCase().trim();

  const isImage =
    normalizedType === "image" &&
    url &&
    !["svg"].includes(normalizedExt);

  const src = isImage ? url : getFileIcon(normalizedType, normalizedExt);
  console.log("src is", src);

  return (
    <figure className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm">
      <Image
        src={src}
        alt={isImage ? "file thumbnail" : "file icon"}
        width={64}
        height={64}
        className="object-cover w-full h-full"
      />
    </figure>
  );
};

export default Thumbnail;
