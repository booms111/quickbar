
import React from 'react';
import { CommandAction } from '../types';

interface CommandButtonProps {
  command: CommandAction;
  onClick: (cmd: CommandAction) => void;
  active?: boolean;
}

const CommandButton: React.FC<CommandButtonProps> = ({ command, onClick, active }) => {
  return (
    <button
      onClick={() => onClick(command)}
      className={`
        relative group flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200
        ${active 
          ? 'bg-indigo-600 text-white shadow-inner scale-90' 
          : 'hover:bg-white/10 text-white/80 active:scale-75'
        }
      `}
    >
      <span className={`text-[10px] transition-all duration-200 ${active ? 'scale-0 opacity-0' : 'group-hover:scale-110 opacity-100'}`}>
        {command.icon}
      </span>
      
      {/* Success Indicator */}
      <span className={`absolute inset-0 flex items-center justify-center text-[8px] font-bold transition-all duration-200 ${active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        ✓
      </span>

      {/* Side Tooltip for Vertical Stack */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-1.5 py-1 bg-[#121212] text-white text-[8px] font-semibold rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl z-50 transform translate-x-1 group-hover:translate-x-0">
        {command.name}
        <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#121212] rotate-45 border-r border-t border-white/10"></div>
      </div>
    </button>
  );
};

export default CommandButton;
