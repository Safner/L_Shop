import { Router } from 'express';
import * as store from '../store/productsMemory.js';

const router = Router();

router.get('/products', (_req, res) => {
  res.json(store.listProducts());
});

router.post('/products', (req, res) => {
  const { name, price } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Укажите название товара' });
    return;
  }
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0) {
    res.status(400).json({ error: 'Укажите цену неотрицательным числом' });
    return;
  }
  const p = store.addProduct(name.trim(), n);
  res.status(201).json(p);
});

router.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Неверный id' });
    return;
  }
  const ok = store.removeProduct(id);
  if (!ok) {
    res.status(404).json({ error: 'Товар не найден' });
    return;
  }
  res.status(204).send();
});

export default router;
