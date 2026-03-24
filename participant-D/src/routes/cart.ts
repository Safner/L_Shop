import { Router } from 'express';
import * as cart from '../store/cartMemory.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/cart', (_req, res) => {
  res.json(cart.getCartView());
});

router.post('/cart/add', requireAuth, (req, res) => {
  const { productId, qty } = req.body ?? {};
  const id = Number(productId);
  const q = Number(qty ?? 1);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Неверный productId' });
    return;
  }
  const result = cart.addToCart(id, q);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(204).send();
});

router.delete('/cart/clear', requireAuth, (_req, res) => {
  cart.clearCart();
  res.status(204).send();
});

export default router;
