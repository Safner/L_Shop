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
