const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_SECRET;

const getAccessToken = async () => {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
        },
    });

    const data = await response.json();
    return data.access_token;
};

const callPaypalAPI = async (method, url, data) => {
    const accessToken = await getAccessToken();
    const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    try {
        const responseData = await response.json();
        console.log("responseData answer:", responseData);
        return responseData;
    } catch (error) {
        if (response.status >= 200 && response.status < 300) {
            console.log("response.status:", response.status);
        } else {
            console.error("Error in callPaypalAPI:", error);
        }
    }
};

const approveSubscription = async (subscriptionId) => {
    try {
        const approvedSubscription = await callPaypalAPI("POST", `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/approve`, {});
        return approvedSubscription;
    } catch (error) {
        console.error("Error in approveSubscription:", error);
        throw error;
    }
};

const cancelSubscription = async (subscriptionId) => {
    try {
        const data = { reason: "User requested cancellation" };
        await callPaypalAPI("POST", `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`, data);
    } catch (error) {
        console.error("Error in cancelSubscription:", error);
        throw error;
    }
};

const getPayPalInvoices = async (subscriptionId) => {
    const url = `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/invoices`;
    const invoices = await callPaypalAPI('GET', url);
    return invoices;
};


export { callPaypalAPI, approveSubscription, cancelSubscription, getPayPalInvoices };
