import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, amount, customerId } = await req.json();

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_email: "customer@example.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/cashfree/callback?order_id={order_id}`,
      },
    };

    const response = await fetch(
      `${process.env.CASHFREE_API_URL}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2022-09-01",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Cashfree error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}