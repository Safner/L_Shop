import bcrypt from 'bcryptjs';

export type User = { id: number; username: string };

let nextId = 1;
const users = new Map<number, { username: string; passwordHash: string }>();
const byName = new Map<string, number>();

export async function registerUser(
  username: string,
  password: string,
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const u = username.trim().toLowerCase();
  if (u.length < 2) return { ok: false, error: 'Логин не короче 2 символов' };
  if (password.length < 4) return { ok: false, error: 'Пароль не короче 4 символов' };
  if (byName.has(u)) return { ok: false, error: 'Такой пользователь уже есть' };
  const id = nextId++;
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(id, { username: u, passwordHash });
  byName.set(u, id);
  return { ok: true, user: { id, username: u } };
}

export async function verifyLogin(
  username: string,
  password: string,
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const u = username.trim().toLowerCase();
  const id = byName.get(u);
  if (!id) return { ok: false, error: 'Неверный логин или пароль' };
  const row = users.get(id);
  if (!row) return { ok: false, error: 'Неверный логин или пароль' };
  const ok = await bcrypt.compare(password, row.passwordHash);
  if (!ok) return { ok: false, error: 'Неверный логин или пароль' };
  return { ok: true, user: { id, username: row.username } };
}

export function getUserById(id: number): User | undefined {
  const row = users.get(id);
  if (!row) return undefined;
  return { id, username: row.username };
}
