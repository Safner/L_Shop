<<<<<<< HEAD

import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/products', (_req, res) => {
  res.json([]);
});

app.post('/api/products', (_req, res) => {
  res.status(501).json({ error: 'Реализует участник B (товары)' });
});

app.delete('/api/products/:id', (_req, res) => {
  res.status(501).json({ error: 'Реализует участник B (товары)' });
});

app.get('/api/cart', (_req, res) => {
  res.json({ items: [], total: 0 });
});

app.post('/api/cart/add', (_req, res) => {
  res.status(501).json({ error: 'Реализует участник C (корзина)' });
});

app.delete('/api/cart/clear', (_req, res) => {
  res.status(501).json({ error: 'Реализует участник C (корзина)' });
});

const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`Сервер: http://localhost:${PORT}`);
});
=======
/**
 * Магазин: товары, корзина, регистрация и вход (JWT).
 */
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', productsRouter);
app.use('/api', cartRouter);

const publicDir = path.join(__dirname, '..', 'public');

app.get('/', (_req, res) => {
  res.redirect(302, '/register');
});

app.get('/register', (_req, res) => {
  res.sendFile(path.join(publicDir, 'register.html'));
});

app.get('/shop', (_req, res) => {
  res.sendFile(path.join(publicDir, 'shop.html'));
});

app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`Сервер: http://localhost:${PORT} → открывается /register`);
});

app.get("/delivery", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/delivery.html"));
});

app.get("/delivery/success", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/delivery-success.html"));
});
>>>>>>> 240dd9b (another some changes)
