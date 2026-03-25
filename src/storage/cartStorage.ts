import fs from "fs/promises";
import path from "path";
import { UserCart, CartItem } from "../types/cart.js";

const FILE_PATH = path.join(__dirname, "../../data/cart.json");

async function readAll(): Promise<UserCart[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw) as UserCart[];
  } catch {
    return [];
  }
}

async function writeAll(data: UserCart[]): Promise<void> {
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getCartByUser(userId: string): Promise<UserCart> {
  const all = await readAll();
  let cart = all.find((c) => c.userId === userId);

  if (!cart) {
    cart = { userId, items: [] };
    all.push(cart);
    await writeAll(all);
  }

  return cart;
}

export async function addToCart(
  userId: string,
  item: CartItem
): Promise<UserCart> {
  const all = await readAll();
  let cart = all.find((c) => c.userId === userId);

  if (!cart) {
    cart = { userId, items: [] };
    all.push(cart);
  }

  const existing = cart.items.find((i) => i.productId === item.productId);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  await writeAll(all);
  return cart;
}

export async function updateQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<UserCart> {
  const all = await readAll();
  const cart = all.find((c) => c.userId === userId);

  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((i) => i.productId === productId);
  if (!item) throw new Error("Item not found");

  item.quantity = quantity;

  if (item.quantity <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
  }

  await writeAll(all);
  return cart;
}

export async function removeFromCart(
  userId: string,
  productId: string
): Promise<UserCart> {
  const all = await readAll();
  const cart = all.find((c) => c.userId === userId);

  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter((i) => i.productId !== productId);

  await writeAll(all);
  return cart;
}

export async function clearCartByUser(userId: string): Promise<void> {
  const all = await readAll();
  const cart = all.find((c) => c.userId === userId);

  if (cart) {
    cart.items = [];
    await writeAll(all);
  }
}
