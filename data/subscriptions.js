export const dummySubscription = {
    "status": "ACTIVE",
    "status_update_time": "2023-04-10T03:58:52Z",
    "status_changed_by": "MERCHANT",
    "id": "I-DF341WG5HV6Y",
    "plan_id": "P-79633757P1179854LMQVKV3A",
    "start_time": "2023-04-10T03:58:18Z",
    "quantity": "1",
    "shipping_amount": {
        "currency_code": "USD",
        "value": "0.0"
    },
    "subscriber": {
        "email_address": "sb-e47pss25430246@personal.example.com",
        "payer_id": "HE53WQ96UY2BE",
        "name": {
            "given_name": "John",
            "surname": "Doe"
        },
        "shipping_address": {
            "address": {
                "address_line_1": "NO 1 Nan Jin Road",
                "admin_area_2": "Shanghai",
                "admin_area_1": "Shanghai",
                "postal_code": "200000",
                "country_code": "C2"
            }
        }
    },
    "billing_info": {
        "outstanding_balance": {
            "currency_code": "USD",
            "value": "0.0"
        },
        "cycle_executions": [
            {
                "tenure_type": "REGULAR",
                "sequence": 1,
                "cycles_completed": 1,
                "cycles_remaining": 0,
                "current_pricing_scheme_version": 2,
                "total_price_per_cycle": {
                    "gross_amount": {
                        "currency_code": "USD",
                        "value": "5.0"
                    },
                    "total_item_amount": {
                        "currency_code": "USD",
                        "value": "5.0"
                    },
                    "shipping_amount": {
                        "currency_code": "USD",
                        "value": "0.0"
                    },
                    "tax_amount": {
                        "currency_code": "USD",
                        "value": "0.0"
                    }
                },
                "total_cycles": 0
            }
        ],
        "last_payment": {
            "amount": {
                "currency_code": "USD",
                "value": "5.0"
            },
            "time": "2023-04-10T03:58:51Z"
        },
        "next_billing_time": "2023-05-10T10:00:00Z",
        "failed_payments_count": 0
    },
    "create_time": "2023-04-10T03:58:51Z",
    "update_time": "2023-04-10T03:58:52Z",
    "plan_overridden": false,
    "links": [
        {
            "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-DF341WG5HV6Y/cancel",
            "rel": "cancel",
            "method": "POST"
        },
        {
            "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-DF341WG5HV6Y",
            "rel": "edit",
            "method": "PATCH"
        },
        {
            "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-DF341WG5HV6Y",
            "rel": "self",
            "method": "GET"
        },
        {
            "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-DF341WG5HV6Y/suspend",
            "rel": "suspend",
            "method": "POST"
        },
        {
            "href": "https://api.sandbox.paypal.com/v1/billing/subscriptions/I-DF341WG5HV6Y/capture",
            "rel": "capture",
            "method": "POST"
        }
    ]
}