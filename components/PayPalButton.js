import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton({ fundingSource, color }) {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const currency = 'USD'

    return (
        <PayPalScriptProvider options={{
            "client-id": clientId,
            "currency": "USD",
            "intent": "capture",
            "vault": true,
            "components": "buttons",
        }}>
            {/* Your component that will contain the PayPal button */}
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: "10.00",
                                    currency_code: "USD"
                                }
                            }
                        ]
                    });
                }}
                onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    alert("Transaction completed by " + details.payer.name.given_name);
                }}
                style={{
                    layout: "vertical",
                    shape: "rect",
                    label: "paypal",
                    color: color,
                }}
                fundingSource={fundingSource}
            />

        </PayPalScriptProvider>

    )
}