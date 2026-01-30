"use client";

import Navbar from "@/components/Navbar";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/PaymentForm";
import styles from "@/app/payments/page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`,
);

export default function PaymentPage() {
  const router = useRouter();
  const [currentTokens, setCurrentTokens] = useState(0);

   useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/accounts/profile`;

    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          setCurrentTokens(json.tokenBalance);
        }
      });
  }, []);

  return (
    <div className={styles.paymentsContainer}>
      <Navbar currentPage="/payments" currentTokens={currentTokens} />
      <div className={styles.paymentFormContainer}>
            <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>  
      </div>
    </div>
  );
}
