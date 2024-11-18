export interface IAuthUser {
  token: string;
  id: number;
  role: 'admin' | 'user';
}
