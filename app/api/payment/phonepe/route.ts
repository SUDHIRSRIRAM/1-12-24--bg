import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { amount, orderId, customerId } = await req.json();

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID!,
      merchantTransactionId: orderId,
      amount: amount * 100, // Convert to paisa
      merchantUserId: customerId,
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}/api/payment/phonepe/callback`,
      redirectMode: "POST",
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payment/phonepe/callback`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const saltKey = process.env.PHONEPE_SALT_KEY!;
    const saltIndex = process.env.PHONEPE_SALT_INDEX!;

    const string = `${base64Payload}/pg/v1/pay${saltKey}`;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${saltIndex}`;

    return NextResponse.json({
      payload: base64Payload,
      checksum,
    });
  } catch (error) {
    console.error("PhonePe error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}