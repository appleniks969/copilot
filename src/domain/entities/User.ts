/**
 * User entity represents a user of the dashboard system
 */
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultDashboardId?: string;
  refreshInterval: number; // in seconds
  notifications: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teams?: string[];
  preferences: UserPreferences;
  lastLogin?: Date;
}

/**
 * Factory function to create a new User
 */
export function createUser(email: string, name: string, role: UserRole = 'viewer'): User {
  return {
    id: crypto.randomUUID(),
    email,
    name,
    role,
    preferences: {
      theme: 'system',
      refreshInterval: 60,
      notifications: true
    }
  };
}
