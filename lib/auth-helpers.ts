import { auth } from './auth';
import { UserRole } from './types';

/**
 * Get the current session on the server side
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === role;
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Check if user has editor or admin role
 */
export async function canEdit(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'admin' || session?.user?.role === 'editor';
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Require specific role - throws error if user doesn't have role
 */
export async function requireRole(role: UserRole) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return session;
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin() {
  return requireRole('admin');
}

/**
 * Require editor or admin role - throws error if neither
 */
export async function requireEditor() {
  const session = await requireAuth();
  if (session.user.role !== 'admin' && session.user.role !== 'editor') {
    throw new Error('Forbidden: Editor or Admin role required');
  }
  return session;
}
