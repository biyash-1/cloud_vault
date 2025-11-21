"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

const sortTypes = [
  { label: "Date created (newest)", value: "$createdAt-desc" },
  { label: "Created Date (oldest)", value: "$createdAt-asc" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Size (Highest)", value: "size-desc" },
  { label: "Size (Lowest)", value: "size-asc" },
];

const Sort = () => {
  const path = usePathname();
  const router = useRouter();

  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <div>
      <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={sortTypes[0].label} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            {sortTypes.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sort;
