import "server-only";
import Stripe from "stripe";
import { keys } from "./keys";

const env = keys();

export const stripe =
  env.STRIPE_SECRET_KEY
    ? new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-11-17.clover",
      })
    : null;

export type { Stripe } from "stripe";
