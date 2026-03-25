import { Router } from "express";
import { createDelivery } from "../controllers/deliveryController.js";

export const deliveryRouter = Router();

deliveryRouter.post("/", createDelivery);
