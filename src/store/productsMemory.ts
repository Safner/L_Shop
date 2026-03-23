import type { Product } from '../types/product.js';

let nextId = 1;
const products: Product[] = [];

export function listProducts(): Product[] {
  return [...products];
}

export function addProduct(name: string, price: number): Product {
  const p: Product = { id: nextId++, name, price };
  products.push(p);
  return p;
}

export function removeProduct(id: number): boolean {
  const i = products.findIndex((x) => x.id === id);
  if (i === -1) return false;
  products.splice(i, 1);
  return true;
}
