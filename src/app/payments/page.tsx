'use client';

import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/PaymentForm';
import styles from '@/app/payments/page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


import {
  Elements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`);

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login");
    }
  }, []);

  return (
    <div className={styles.paymentsContainer}>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
}