import fs from "fs/promises";
import path from "path";
import { DeliveryOrder } from "../types/delivery.js";

const FILE_PATH = path.join(__dirname, "../../data/deliveries.json");

async function readAll(): Promise<DeliveryOrder[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(raw) as DeliveryOrder[];
  } catch {
    return [];
  }
}

async function writeAll(data: DeliveryOrder[]): Promise<void> {
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function addDelivery(order: DeliveryOrder): Promise<void> {
  const all = await readAll();
  all.push(order);
  await writeAll(all);
}

export async function getDeliveriesByUser(userId: string): Promise<DeliveryOrder[]> {
  const all = await readAll();
  return all.filter((o) => o.userId === userId);
}
