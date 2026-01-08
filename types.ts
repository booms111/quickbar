
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
