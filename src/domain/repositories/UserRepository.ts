/**
 * Repository interface for User entities
 */
import { User, UserRole } from '../entities/User';

export interface UserFilter {
  roles?: UserRole[];
  search?: string;
  teams?: string[];
}

export interface IUserRepository {
  /**
   * Get a user by their ID
   */
  getById(id: string): Promise<User | null>;
  
  /**
   * Get a user by their email
   */
  getByEmail(email: string): Promise<User | null>;
  
  /**
   * Get all users with optional filtering
   */
  getAll(filter?: UserFilter): Promise<User[]>;
  
  /**
   * Save a user (create or update)
   */
  save(user: User): Promise<User>;
  
  /**
   * Delete a user by their ID
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Update user preferences
   */
  updatePreferences(id: string, preferences: Partial<User['preferences']>): Promise<User>;
  
  /**
   * Update user's last login timestamp
   */
  updateLastLogin(id: string): Promise<User>;
}
