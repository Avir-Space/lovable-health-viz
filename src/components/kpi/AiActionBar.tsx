import React from 'react';
import { ChevronDown } from 'lucide-react';

export function AiActionBar({ onGenerate }:{ onGenerate:()=>void }) {
  return (
    <div className="mt-3 bg-gradient-to-r from-fuchsia-600/10 via-violet-600/10 to-indigo-600/10
                    rounded-xl p-3 flex items-center justify-between">
      <div className="text-[13px] font-medium">✨ Get AI suggested action</div>
      <button onClick={onGenerate}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[13px] hover:bg-indigo-500">
        Generate Action <ChevronDown className="w-4 h-4 opacity-80" />
      </button>
    </div>
  );
}
