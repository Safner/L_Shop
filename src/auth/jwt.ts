import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
const TTL: jwt.SignOptions['expiresIn'] = '7d';

export function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, SECRET, { expiresIn: TTL });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const p = jwt.verify(token, SECRET) as jwt.JwtPayload;
    const userId = Number(p.sub);
    if (!Number.isInteger(userId) || userId < 1) return null;
    return { userId };
  } catch {
    return null;
  }
}
