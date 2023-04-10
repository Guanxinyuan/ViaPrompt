import { approveSubscription } from "@/lib/paypal";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { subscriptionId } = req.body;
            const approvedSubscription = await approveSubscription(subscriptionId);
            res.status(200).json(approvedSubscription);
        } catch (error) {
            res.status(500).json({ message: "Error approving subscription" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
