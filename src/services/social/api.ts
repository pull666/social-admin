import { request } from '@umijs/max';

export interface SocialUser {
  id: string;
  username: string;
  nickname: string;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
}

export interface SocialPost {
  id: string;
  authorId: string;
  nickname: string;
  body: string;
  status: 'pending' | 'published' | 'hidden';
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  targetId: string;
  reason: string;
  createdAt: string;
}

interface Result<T> {
  success: true;
  data: T;
}

export async function currentUser(options?: Record<string, unknown>): Promise<{ data: API.CurrentUser }> {
  const result = await request<Result<SocialUser>>('/api/admin/v1/auth/me', options ?? {});
  return {
    data: {
      ...result.data,
      name: result.data.nickname,
      userid: result.data.id,
      access: result.data.role,
    },
  };
}

export const login = (data: { username: string; password: string }) =>
  request<Result<{ user: SocialUser }>>('/api/admin/v1/auth/login', {
    method: 'POST',
    data,
    skipErrorHandler: true,
  });

export const outLogin = () => request('/api/admin/v1/auth/logout', { method: 'POST' });

export const listUsers = () => request<Result<SocialUser[]>>('/api/admin/v1/users');

export const listAudit = () => request<Result<AuditEntry[]>>('/api/admin/v1/audit');

export const listPosts = (status: string, cursor?: string | null) =>
  request<Result<{ items: SocialPost[]; nextCursor: string | null }>>('/api/admin/v1/posts', {
    params: { status, limit: 20, cursor: cursor ?? undefined },
  });

export const moderate = (id: string, status: 'published' | 'hidden', reason: string) =>
  request(`/api/admin/v1/posts/${id}/moderation`, {
    method: 'PATCH',
    data: { status, reason },
  });
