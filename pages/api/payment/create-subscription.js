import { callPaypalAPI } from "@/lib/paypal";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { planId } = req.body;
            const data = {
                plan_id: planId,
            };
            const subscription = await callPaypalAPI("POST", "https://api-m.sandbox.paypal.com/v1/billing/subscriptions", data);
            res.status(201).json(subscription);
        } catch (error) {
            res.status(500).json({ message: "Error creating subscription" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
