import { useEffect } from "react";

type ShortcutMap = Partial<Record<string, () => void>>;

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      const combo = mod ? `mod+${key}` : key;
      if (shortcuts[combo]) {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
        if (combo === "mod+k" || !isInput) {
          e.preventDefault();
          shortcuts[combo]!();
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
