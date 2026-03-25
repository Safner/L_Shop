import * as products from './productsMemory.js';

/** productId -> количество */
const lines = new Map<number, number>();

export function addToCart(productId: number, qty: number): { ok: true } | { ok: false; error: string } {
  const p = products.getProductById(productId);
  if (!p) return { ok: false, error: 'Товар не найден' };
  if (!Number.isFinite(qty) || qty < 1) return { ok: false, error: 'Неверное количество' };
  const cur = lines.get(productId) ?? 0;
  lines.set(productId, cur + qty);
  return { ok: true };
}

export function clearCart(): void {
  lines.clear();
}

export type CartLineView = {
  name: string;
  qty: number;
  price: number;
  lineTotal: number;
};

export function getCartView(): { items: CartLineView[]; total: number } {
  const items: CartLineView[] = [];
  let total = 0;
  for (const [productId, qty] of lines) {
    const p = products.getProductById(productId);
    if (!p) continue;
    const lineTotal = p.price * qty;
    items.push({ name: p.name, qty, price: p.price, lineTotal });
    total += lineTotal;
  }
  return { items, total };
}
