import crypto from 'crypto';
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_SECRET;

export const getAccessToken = async () => {
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

export const callPaypalAPI = async (method, url, data) => {
    const accessToken = await getAccessToken();
    let response
    if (method === "GET") {
        response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        response = await fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    try {
        const responseData = await response.json();
        // console.log("responseData answer:", responseData);
        return responseData;
    } catch (error) {
        if (response.status >= 200 && response.status < 300) {
            console.log("response.status:", response.status);
        } else {
            console.error("Error in callPaypalAPI:", error);
        }
    }
};

export const approveSubscription = async (subscriptionId) => {
    try {
        const approvedSubscription = await callPaypalAPI("POST", `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/approve`, {});
        return approvedSubscription;
    } catch (error) {
        console.error("Error in approveSubscription:", error);
        throw error;
    }
};

export const cancelSubscription = async (subscriptionId) => {
    try {
        const data = { reason: "User requested cancellation" };
        await callPaypalAPI("POST", `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`, data);
    } catch (error) {
        console.error("Error in cancelSubscription:", error);
        throw error;
    }
};

export const suspendSubscription = async (subscriptionId) => {
    try {
        const data = { reason: "User requested suspending" };
        await callPaypalAPI("POST", `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/suspend`, data);
        console.log('Successful in suspendSubscription')
    } catch (error) {
        console.error("Error in suspendSubscription:", error);
        throw error;
    }
};

export const resumeSubscription = async (subscriptionId) => {
    try {
        const data = { "note": "Reactivating the profile." };
        await callPaypalAPI("POST", `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/activate`, data);
    } catch (error) {
        console.error("Error in resumeSubscription:", error);
        throw error;
    }
};


export const getPayPalHistory = async (subscriptionId, startTime, endTime) => {
    console.log("subscriptionId:", subscriptionId)
    const url = `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${startTime}&end_time=${endTime}`
    const method = "GET"
    const data = await callPaypalAPI(method, url);
    console.log("data in getPayPalHistory:", data.transactions)
    return data.transactions;
}

export const getSubscriptionInfo = async (subscriptionId) => {
    console.log("subscriptionId:", subscriptionId)
    const url = `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`
    const method = "GET"
    const data = await callPaypalAPI(method, url);
    console.log("data in getSubscriptionInfo:", data.transactions)
    return data
}


export async function verifyWebhookSignature(req) {

    console.log('verify signature:');

    // const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const webhookId = "8FS45042CN588893A";

    // Retrieve the necessary headers and body from the request
    const transmissionId = req.headers['paypal-transmission-id'];
    const transmissionTime = req.headers['paypal-transmission-time'];
    const certUrl = req.headers['paypal-cert-url'];
    const authAlgorithm = req.headers['paypal-auth-algo'];
    const transmissionSig = req.headers['paypal-transmission-sig'];
    const rawBody = req.rawBody; // You need to provide rawBody in your request object

    // Create the expected signature using the raw body and your webhook ID
    const expectedSignature = crypto
        .createVerify(authAlgorithm)
        .update(transmissionId + '|' + transmissionTime + '|' + webhookId + '|' + rawBody)
        .verify(certUrl, transmissionSig, 'base64');

    // Return true if the expected signature matches the transmission signature
    console.log(expectedSignature)
    return expectedSignature;
}


