import { NotebookPen } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <NotebookPen size={20} strokeWidth={1.8} />
      <span className="text-lg font-medium tracking-tight">Briefly</span>
    </div>
  );
}