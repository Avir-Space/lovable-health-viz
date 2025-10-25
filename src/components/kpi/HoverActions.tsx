import React from 'react';
import { Bookmark, Pin, Copy, MoreVertical } from 'lucide-react';

export function HoverActions({ onBookmark, onPin, onCopy, onMore }:{
  onBookmark?:()=>void; onPin?:()=>void; onCopy?:()=>void; onMore?:()=>void;
}) {
  const Btn = ({ label, children, onClick }: any) => (
    <button aria-label={label} onClick={onClick}
      className="p-2 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
      {children}
    </button>
  );

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-10 z-10
                    flex flex-col rounded-xl bg-white/95 shadow ring-1 ring-slate-200 overflow-hidden">
      <Btn label="Bookmark" onClick={onBookmark}><Bookmark className="w-4 h-4 text-slate-600"/></Btn>
      <Btn label="Pin"       onClick={onPin}><Pin className="w-4 h-4 text-slate-600"/></Btn>
      <Btn label="Copy"      onClick={onCopy}><Copy className="w-4 h-4 text-slate-600"/></Btn>
      <Btn label="More"      onClick={onMore}><MoreVertical className="w-4 h-4 text-slate-600"/></Btn>
    </div>
  );
}
