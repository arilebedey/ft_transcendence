import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative w-[400px] md:w-[600px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        className="pl-12 h-12 text-base rounded-full bg-secondary border-none focus-visible:ring-primary"
      />
    </div>
  );
}
