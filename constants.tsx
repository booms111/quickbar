
import { CommandAction } from './types';

export const INITIAL_COMMANDS: CommandAction[] = [
  {
    id: 'signature',
    name: 'Email Signature',
    category: 'email',
    icon: '✍️',
    content: 'Best regards,\n[Name]\n[Role] @ [Company]',
    description: 'Professional signature'
  },
  {
    id: 'terminal',
    name: 'Terminal Start',
    category: 'code',
    icon: '🐚',
    content: 'cd ~/Documents && clear',
    description: 'Quick terminal command'
  },
  {
    id: 'task-mgr',
    name: 'System Monitor',
    category: 'code',
    icon: '📊',
    content: 'top -o cpu',
    description: 'Performance check'
  },
  {
    id: 'custom1',
    name: 'Custom Action 1',
    category: 'custom',
    icon: '🔹',
    content: 'Custom command content 1',
    description: 'User defined action'
  },
  {
    id: 'custom2',
    name: 'Custom Action 2',
    category: 'custom',
    icon: '🔸',
    content: 'Custom command content 2',
    description: 'User defined action'
  },
  {
    id: 'custom3',
    name: 'Custom Action 3',
    category: 'custom',
    icon: '🔳',
    content: 'Custom command content 3',
    description: 'User defined action'
  }
];

export const CATEGORY_ICONS: Record<string, string> = {
  email: '📧',
  code: '📂',
  social: '🤝',
  custom: '🛠️',
  ai: '✨'
};
