const fetch = require('node-fetch');

// const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
// const secret = process.env.NEXT_PUBLIC_PAYPAL_SECRET;

const clientId = 'AQC5GzVijzZ6PcNtiinAH1puxoVXrpFFvCyj4wrvEzVFjlMOuoI4dyXBYhg-PvizW154Kz30t83hW7yL'
const secret = 'EDYgSxI4UKpc620EbnK647O1OLaqdcpbyvXJrvwBwiNqRHFev53wrbCC_JPnT1BWnq-2VGKcm7FtD99y'
const subscriber_email = 'sb-e47pss25430246@personal.example.com'

const getAccessToken = async () => {
    const paypalEndpoint = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    const response = await fetch(paypalEndpoint, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Accept-Language": "en_US",
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            "grant_type": "client_credentials"
        })
    });
    const data = await response.json();
    console.log('data in getAccessToken', data);
}

const createSubscription = async (authToken) => {
    const paypalEndpoint = 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions';
    console.log(clientId, secret)
    const response = await fetch(paypalEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            "plan_id": "P-79633757P1179854LMQVKV3A",
            "start_time": "2023-04-10T00:00:00Z",
            "subscriber": {
                "name": {
                    "given_name": "John",
                    "surname": "Doe"
                },
                "email_address": "customer@example.com",
            },
        })
    });
    const data = await response.json();
    console.log('data in createSubscription', data);
    return {
        subscription_id: data.id,
        status: data.status,
        plan_id: data.plan_id,
        start_time: data.start_time,
        create_time: data.create_time,
    }
}

const signSubscriptionAgreement = async (subscriptionId, authToken) => {
    const paypalEndpoint = `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/agreement-execute`;

    // Set up headers for authentication
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
    };

    // Send POST request to execute agreement
    const response = await fetch(paypalEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({})
    });

    // Handle response data and errors
    const data = await response.json();
    if (response.ok) {
        // Handle successful response
        console.log(data)
        console.log('Agreement executed successfully');
    } else {
        // Handle error response
        console.log('Agreement execution failed')
    }
}


const main = async () => {
    const authToken = Buffer.from(`${clientId}:${secret}`).toString('base64');

    // await getAccessToken();
    const { subscription_id, ...rest } = await createSubscription(authToken);
    await signSubscriptionAgreement(subscription_id, authToken)
}

main()

const curl = `
curl -v https://api-m.sandbox.paypal.com/v1/oauth2/token \ -H "Accept: application/json" \ -H "Accept-Language: en_US" \ -u "AQC5GzVijzZ6PcNtiinAH1puxoVXrpFFvCyj4wrvEzVFjlMOuoI4dyXBYhg-PvizW154Kz30t83hW7yL:EDYgSxI4UKpc620EbnK647O1OLaqdcpbyvXJrvwBwiNqRHFev53wrbCC_JPnT1BWnq-2VGKcm7FtD99y" \ -d "grant_type=client_credentials"
curl -v https://api-m.sandbox.paypal.com/v1/oauth2/token -H "Accept: application/json" -H "Accept-Language: en_US" -u "AQC5GzVijzZ6PcNtiinAH1puxoVXrpFFvCyj4wrvEzVFjlMOuoI4dyXBYhg-PvizW154Kz30t83hW7yL:EDYgSxI4UKpc620EbnK647O1OLaqdcpbyvXJrvwBwiNqRHFev53wrbCC_JPnT1BWnq-2VGKcm7FtD99y" -d "grant_type=client_credentials"

`