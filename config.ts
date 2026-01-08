
export type CommandCategory = 'email' | 'code' | 'social' | 'custom' | 'ai';

export interface CommandAction {
  id: string;
  name: string;
  category: CommandCategory;
  icon: string;
  content: string;
  description?: string;
}

export interface UserSettings {
  userName: string;
  userRole: string;
  userCompany: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Alex Smith',
  userRole: 'Senior Developer',
  userCompany: 'Nexus Systems'
};

export const INITIAL_COMMANDS: CommandAction[] = [
  {
    id: 'sig',
    name: 'My Signature',
    category: 'email',
    icon: '✍️',
    content: 'Best regards,\n[Name]\n[Role] @ [Company]',
    description: 'Professional email footer'
  },
  {
    id: 'gh',
    name: 'GitHub',
    category: 'social',
    icon: '🐙',
    content: 'https://github.com/my-username',
    description: 'Portfolio link'
  },
  {
    id: 'todo',
    name: 'Today Template',
    category: 'custom',
    icon: '📝',
    content: '## Tasks for Today\n- [ ] Morning Sync\n- [ ] Deep Work Block',
    description: 'Daily planning'
  },
  {
    id: 'ai-gen',
    name: 'AI Smart Slot',
    category: 'custom',
    icon: '➕',
    content: '',
    description: 'Click to generate a custom snippet with AI'
  }
];
