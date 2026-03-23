
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

/* --- заглушки: только GET отдают пустые данные; POST/DELETE — 501 --- */
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
