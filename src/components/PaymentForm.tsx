"use client";

import Link from "next/link";
import styles from "@/components/PaymentForm.module.css";
import { useEffect, useState, useRef } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [cardName, setCardName] = useState("");
  const paymentIdempotencyKeyRef = useRef<string | null>(null);

  const PRICE_PER_UNIT = 0.001;

  const CARD_NUMBER_ELEMENT_OPTIONS = {
    placeholder: "XXXX XXXX XXXX XXXX",
    style: {
      base: {
        fontFamily: "Quicksand, sans-serif",
        fontStyle: "normal",
        fontSize: "1.2em",
        color: "#ffffff",
        fontWeight: 100,
        backgroundColor: "transparent",
        wordSpacing: "5px",
        letterSpacing: "1px",
        padding: "5px",
        border: "none",
        "::placeholder": {
          color: "#969696ff",
        },
      },
      invalid: {
        color: "#fe0000ff",
      },
    },
  };

  const CARD_CVC_ELEMENT_OPTIONS = {
    placeholder: "cvc",
    style: {
      base: {
        textAlign: "center",
        fontFamily: "Quicksand, sans-serif",
        fontStyle: "normal",
        fontSize: "1em",
        lineHeight: "1.5",
        fontWeight: "bold",
        color: "#303030",
        letterSpacing: "1px",
        "::placeholder": {
          color: "#a0aec0",
        },
      },
      invalid: {
        color: "#fe0000ff",
      },
    },
  };

  const CARD_DATE_ELEMENT_OPTIONS = {
    style: {
      base: {
        textAlign: "center",
        fontFamily: "Quicksand, sans-serif",
        fontStyle: "normal",
        fontSize: "0.9em",
        lineHeight: "1.5",
        fontWeight: "100",
        color: "#ffffff",
        letterSpacing: "1px",
        "::placeholder": {
          color: "#a0aec0",
        },
      },
      invalid: {
        color: "#fe0000ff",
      },
    },
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCardName(user.fullname);
    }
  }, []);

  const getIdempotencyKey = () => {
    if (!paymentIdempotencyKeyRef.current) {
      paymentIdempotencyKeyRef.current = crypto.randomUUID();
    }

    return paymentIdempotencyKeyRef.current;
  };

  const createPaymentIntent = async (): Promise<string> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/payment/intent`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        tokenAmount,
        idempotencyKey: getIdempotencyKey(),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create PaymentIntent");
    }

    const json = await res.json();
    setClientSecret(json.stripeClientSecret);
    return json.stripeClientSecret;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (tokenAmount <= 0) {
        throw new Error("Invalid token amount");
      }

      const secret = clientSecret ?? (await createPaymentIntent());

      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error("Card details not entered.");
      }

      const result = await stripe.confirmCardPayment(secret, {
        payment_method: { card: cardNumberElement },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (!result.paymentIntent) {
        throw new Error("Payment confirmation failed");
      }

      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error("Payment is processing or requires additional action.");
      }

      alert("Payment successful. Tokens will be credited shortly.");
    } catch (err: any) {
      setError(err.message || "Payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.paymentsFormContainer}>
      <div className={styles.paymentsCover}>
        <img src="/cloudfox-payments.png" alt="Cloudfox cover" />
      </div>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div>
          <img
            className={styles.stripeLogo}
            src="/stripe-logo.png"
            alt="Stripe logo"
          />
          <h1 className={styles.loginFormTitle}>Fill your payment info</h1>
          <h1 className={styles.loginFormSubtitle}>to continue</h1>
          <div className={styles.creditCards}>
            <div className={styles.creditCardContainer}>
              <div className={styles.creditCardHeader}>
                <div className={styles.cardIssuerLogo}>
                  <div className={styles.creditCardIssuer}>Credit Card</div>
                </div>
                <img
                  src="credit-card-chip.png"
                  className={styles.creditCardChip}
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardRow1}>
                  <div className={styles.cardNumberTitle}>Card Number</div>
                  <div>
                    <div className={styles.cardNumber}>
                      <CardNumberElement
                        options={CARD_NUMBER_ELEMENT_OPTIONS}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.cardRow2}>
                  <div className={styles.cardName}>{cardName}</div>
                  <div className={styles.validDate}>
                    <div className={styles.validDateTitle}>Valid Thru</div>
                    <div className={styles.validDateValue}>
                      <CardExpiryElement options={CARD_DATE_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.creditCardBackContainer}>
              <div className={styles.creditCardHeader}>
                <div className={styles.creditCardReadBand}></div>
              </div>
              <div className={styles.cardRow3}>
                <div className={styles.holoCard} />
                <div className={styles.cardRow3}>
                  <div className={styles.holocardNumber}>
                    <CardCvcElement options={CARD_CVC_ELEMENT_OPTIONS} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.paymentFormCheckout}>
            <div className={styles.paymentFormCheckoutAmount}>
              <label className={styles.loginFormLabel} htmlFor="login-user">
                Token amount
              </label>
              <input
                name="login-user"
                className={styles.input}
                type="number"
                minLength={3}
                maxLength={30}
                required
                value={tokenAmount}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setTokenAmount(val);
                  } else {
                    setTokenAmount(0);
                  }
                }}
              />
              <p
                className={`${styles.loginUserError} ${styles.inputErrorMsg}`}
                style={{ display: "none" }}
              ></p>
            </div>
          </div>
        </div>

        <div className={styles.paymentFormButtons}>
          <Link href="/dashboard" className={styles.returnButton}>
            Back to dashboard
          </Link>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={styles.buyButton}
          >
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tokenAmount * PRICE_PER_UNIT)}
          </button>
        </div>
      </form>
    </div>
  );
}
