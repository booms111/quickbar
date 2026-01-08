
import React from 'react';
import { CommandAction } from './config';

interface CommandButtonProps {
  command: CommandAction;
  onClick: (cmd: CommandAction) => void;
  active?: boolean;
  isLoading?: boolean;
}

const CommandButton: React.FC<CommandButtonProps> = ({ command, onClick, active, isLoading }) => {
  return (
    <button
      onClick={() => !isLoading && onClick(command)}
      disabled={isLoading}
      className={`
        relative group flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-200
        ${active 
          ? 'bg-indigo-600 text-white shadow-lg scale-90' 
          : 'hover:bg-white/10 text-white/80 active:scale-75'
        }
        ${isLoading ? 'animate-pulse bg-white/5' : ''}
      `}
    >
      <span className={`text-[12px] transition-all duration-200 ${active || isLoading ? 'scale-0 opacity-0' : 'group-hover:scale-110 opacity-100'}`}>
        {command.icon}
      </span>
      
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center text-[8px] animate-spin">
          ⌛
        </span>
      )}
      <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        ✓
      </span>

      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1.5 bg-[#0a0a0a] text-white text-[9px] font-medium rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl z-50 transform translate-x-2 group-hover:translate-x-0">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold">{command.name}</span>
          {command.description && <span className="text-[7px] text-white/40">{command.description}</span>}
        </div>
        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0a0a0a] rotate-45 border-r border-t border-white/10"></div>
      </div>
    </button>
  );
};

export default CommandButton;
