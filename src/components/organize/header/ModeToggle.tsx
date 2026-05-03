import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";

interface Props {
  autoEnabled: boolean;
  onChange: (auto: boolean) => void;
}

export function ModeToggle({ autoEnabled, onChange }: Props) {
  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5 text-xs font-medium">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onChange(false)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                !autoEnabled
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Manuel
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Planifiez vos taches manuellement
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onChange(true)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                autoEnabled
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Auto
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Revisions espacees generees automatiquement (J2/J7/J10/J30)
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
