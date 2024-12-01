"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

declare global {
  interface Window {
    Paytm: any;
    PhonePe: any;
    Cashfree: any;
  }
}

export default function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payment/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe failed to initialize");

      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaytmPayment = async () => {
    try {
      setLoading(true);
      const orderId = "ORDER_" + Date.now();
      const customerId = "CUSTOMER_" + Date.now();

      const response = await fetch("/api/payment/paytm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: parseFloat(amount),
          customerId,
        }),
      });

      const data = await response.json();
      const txnToken = data.txnToken;

      const config = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId,
          token: txnToken,
          tokenType: "TXN_TOKEN",
          amount: amount,
        },
        handler: {
          notifyMerchant: function (eventName: string, data: any) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          },
        },
      };

      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error: any) {
          console.log("error => ", error);
          toast.error("Paytm payment failed");
        });
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePePayment = async () => {
    try {
      setLoading(true);
      const orderId = "ORDER_" + Date.now();
      const customerId = "CUSTOMER_" + Date.now();

      const response = await fetch("/api/payment/phonepe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: parseFloat(amount),
          customerId,
        }),
      });

      const data = await response.json();
      window.location.href = data.redirectUrl;
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCashfreePayment = async () => {
    try {
      setLoading(true);
      const orderId = "ORDER_" + Date.now();
      const customerId = "CUSTOMER_" + Date.now();

      const response = await fetch("/api/payment/cashfree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: parseFloat(amount),
          customerId,
        }),
      });

      const data = await response.json();
      window.location.href = data.payment_link;
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    switch (paymentMethod) {
      case "stripe":
        await handleStripePayment();
        break;
      case "paytm":
        await handlePaytmPayment();
        break;
      case "phonepe":
        await handlePhonePePayment();
        break;
      case "cashfree":
        await handleCashfreePayment();
        break;
      default:
        toast.error("Please select a payment method");
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select
            value={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="paytm">Paytm</SelectItem>
              <SelectItem value="phonepe">PhonePe</SelectItem>
              <SelectItem value="cashfree">Cashfree</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </Card>
  );
}