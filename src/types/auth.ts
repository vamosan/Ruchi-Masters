export type AuthRole = 'spectator' | 'admin' | 'team';

export interface AuthUser {
  role: AuthRole;
  teamId?: string;
  teamName?: string;
  teamLogo?: string;
  teamCode?: string;
  name: string;
}
