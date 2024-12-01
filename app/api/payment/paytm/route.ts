import { NextResponse } from "next/server";
import PaytmChecksum from "paytmchecksum";

export async function POST(req: Request) {
  try {
    const { orderId, amount, customerId } = await req.json();

    const paytmParams: any = {
      MID: process.env.PAYTM_MID!,
      WEBSITE: process.env.PAYTM_WEBSITE!,
      INDUSTRY_TYPE_ID: "Retail",
      CHANNEL_ID: "WEB",
      ORDER_ID: orderId,
      CUST_ID: customerId,
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: `${process.env.NEXT_PUBLIC_URL}/api/payment/paytm/callback`,
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams),
      process.env.PAYTM_MERCHANT_KEY!
    );

    return NextResponse.json({
      ...paytmParams,
      CHECKSUMHASH: checksum,
    });
  } catch (error) {
    console.error("Paytm error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}