import { Request, Response } from "express";
import { addDelivery } from "../storage/deliveriesStorage.js";
import { getCartByUser, clearCartByUser } from "../storage/cartStorage.js";
import { DeliveryOrder } from "../types/delivery.js";
import { randomUUID } from "crypto";

export async function createDelivery(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { address, contact, paymentMethod } = req.body;

    const cart = await getCartByUser(userId);
    if (!cart.items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order: DeliveryOrder = {
      id: randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      address,
      contact,
      paymentMethod,
      items: cart.items,
      totalPrice,
    };

    await addDelivery(order);
    await clearCartByUser(userId);

    return res.json({ success: true, orderId: order.id });
  } catch (err) {
    return res.status(500).json({ error: "Internal error" });
  }
}
