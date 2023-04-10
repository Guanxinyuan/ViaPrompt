import { callPaypalAPI } from "@/lib/paypal";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { subscriptionId, newPlanId } = req.body;
            const data = {
                plan_id: newPlanId,
            };
            const updatedSubscription = await callPaypalAPI("PATCH", `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, [{ op: "replace", path: "/plan", value: data }]);
            res.status(200).json(updatedSubscription);
        } catch (error) {
            res.status(500).json({ message: "Error upgrading subscription" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
