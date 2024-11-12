import {Input} from "@/components/ui/input.tsx";
import {ChangeEvent} from "react";

interface SearchBarProps {
  setSearchTerm: (e: ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

export default function SearchBar({setSearchTerm, searchTerm}: SearchBarProps) {
  return (<Input placeholder="Package Name Search..."
                 onChange={setSearchTerm}
                 value={searchTerm}
                 className='md:w-3/6 md:h-5/6 text-gray-900 my-2 md:my-0 md:text-sm text-xs md:mx-2'/>)
}
