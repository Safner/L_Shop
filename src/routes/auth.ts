import { Router } from 'express';
import * as users from '../store/usersMemory.js';
import { signToken } from '../auth/jwt.js';
import { requireAuth } from '../middleware/requireAuth.js';
import type { AuthedRequest } from '../middleware/requireAuth.js';

const router = Router();

router.post('/auth/register', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Нужны username и password' });
    return;
  }
  const result = await users.registerUser(username, password);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  const token = signToken(result.user.id);
  res.status(201).json({
    token,
    user: { id: result.user.id, username: result.user.username },
  });
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Нужны username и password' });
    return;
  }
  const result = await users.verifyLogin(username, password);
  if (!result.ok) {
    res.status(401).json({ error: result.error });
    return;
  }
  const token = signToken(result.user.id);
  res.json({
    token,
    user: { id: result.user.id, username: result.user.username },
  });
});

router.get('/auth/me', requireAuth, (req, res) => {
  const { userId } = req as AuthedRequest;
  const u = users.getUserById(userId);
  if (!u) {
    res.status(401).json({ error: 'Пользователь не найден' });
    return;
  }
  res.json({ user: u });
});

export default router;
