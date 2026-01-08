
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CommandAction, UserSettings, INITIAL_COMMANDS, DEFAULT_SETTINGS } from './config';
import CommandButton from './CommandButton';
import { generateSnippet } from './geminiService';

const App: React.FC = () => {
  const [commands, setCommands] = useState<CommandAction[]>(() => {
    const saved = localStorage.getItem('cmd-dock-items');
    return saved ? JSON.parse(saved) : INITIAL_COMMANDS;
  });
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('cmd-dock-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isVisible, setIsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [lastCopiedId, setLastCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('cmd-dock-items', JSON.stringify(commands));
    localStorage.setItem('cmd-dock-settings', JSON.stringify(settings));
  }, [commands, settings]);

  const handleAction = useCallback(async (command: CommandAction) => {
    if (!command.content || command.icon === '➕') {
      const prompt = window.prompt(`Describe the command for "${command.name}":`);
      if (!prompt) return;

      setIsGenerating(command.id);
      try {
        const result = await generateSnippet(prompt, settings);
        setCommands(prev => prev.map(c => 
          c.id === command.id ? { ...c, ...result, id: command.id } : c
        ));
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(null);
      }
      return;
    }

    const content = command.content
      .replace(/\[Name\]/g, settings.userName)
      .replace(/\[Role\]/g, settings.userRole)
      .replace(/\[Company\]/g, settings.userCompany);

    try {
      await navigator.clipboard.writeText(content);
      setLastCopiedId(command.id);
      setTimeout(() => setLastCopiedId(null), 1500);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  }, [settings]);

  const exportData = () => {
    const data = JSON.stringify({ commands, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `command-dock-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.commands && json.settings) {
          setCommands(json.commands);
          setSettings(json.settings);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Failed to import file. Make sure it is a valid backup.');
      }
    };
    reader.readAsText(file);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-0 right-0 p-1 z-50 pointer-events-auto">
        <button 
          onClick={() => setIsVisible(true)}
          className="w-6 h-6 flex items-center justify-center bg-black/90 hover:bg-indigo-600 text-white/50 hover:text-white rounded-lg shadow-xl border border-white/10 transition-all"
        >
          <span className="text-[10px]">▲</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-2 right-2 z-50 flex flex-col items-end pointer-events-none">
      
      {isSettingsOpen && (
        <div className="pointer-events-auto absolute bottom-32 right-0 w-48 p-4 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Profile Settings</h3>
            <button onClick={() => setIsSettingsOpen(false)} className="text-white/20 hover:text-white/60 text-[10px]">✕</button>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[7px] text-white/30 uppercase font-bold tracking-wider px-1">Display Name</label>
              <input 
                type="text" 
                className="bg-black border border-white/10 text-[10px] text-white px-3 py-2 rounded-xl focus:border-indigo-500 outline-none transition-all"
                value={settings.userName}
                onChange={(e) => setSettings({...settings, userName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[7px] text-white/30 uppercase font-bold tracking-wider px-1">Professional Role</label>
              <input 
                type="text" 
                className="bg-black border border-white/10 text-[10px] text-white px-3 py-2 rounded-xl focus:border-indigo-500 outline-none transition-all"
                value={settings.userRole}
                onChange={(e) => setSettings({...settings, userRole: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button 
                onClick={exportData}
                className="py-2 bg-white/5 hover:bg-white/10 text-white/60 text-[8px] font-bold rounded-xl transition-all border border-white/5 flex flex-col items-center justify-center gap-1"
              >
                <span>📤</span> EXPORT
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="py-2 bg-white/5 hover:bg-white/10 text-white/60 text-[8px] font-bold rounded-xl transition-all border border-white/5 flex flex-col items-center justify-center gap-1"
              >
                <span>📥</span> IMPORT
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json" 
                onChange={importData} 
              />
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="mt-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Update Identity
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-auto p-1.5 bg-[#0f0f0f]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-1.5 ring-1 ring-black w-9">
        <div className="flex flex-col gap-1">
          {commands.map((cmd) => (
            <CommandButton 
              key={cmd.id} 
              command={cmd} 
              onClick={handleAction} 
              active={lastCopiedId === cmd.id}
              isLoading={isGenerating === cmd.id}
            />
          ))}
        </div>
        
        <div className="h-px bg-white/5 mx-1.5 my-1"></div>
        
        <div className="flex flex-col gap-1 items-center">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors group ${isSettingsOpen ? 'bg-indigo-500/10' : ''}`}
            title="Identity Settings"
          >
            <span className={`text-[12px] ${isSettingsOpen ? 'text-indigo-400' : 'text-white/10 group-hover:text-white/60'}`}>⚙️</span>
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-white/10 hover:text-red-400 transition-all text-[10px]"
            title="Minimize Dock"
          >
            ✕
          </button>
        </div>
      </div>

      <div className={`
        fixed bottom-3 right-14 px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-xl shadow-2xl transition-all duration-300 pointer-events-none tracking-widest
        ${lastCopiedId ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}
      `}>
        COPIED TO CLIPBOARD
      </div>
    </div>
  );
};

export default App;
