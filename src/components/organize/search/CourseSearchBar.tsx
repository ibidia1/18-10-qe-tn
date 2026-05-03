import React from "react";
import { Search } from "lucide-react";

interface Props {
  onOpen: () => void;
}

export function CourseSearchBar({ onOpen }: Props) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm hover:bg-muted transition-colors w-[280px] text-left"
    >
      <Search className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="flex-1 text-xs">Rechercher un cours...</span>
      <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        <span>⌘</span>K
      </kbd>
    </button>
  );
}
