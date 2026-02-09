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
import {
  CARD_NUMBER_ELEMENT_OPTIONS,
  CARD_CVC_ELEMENT_OPTIONS,
  CARD_DATE_ELEMENT_OPTIONS,
} from "@/components/StripeElementOptions";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [cardName, setCardName] = useState("");
  const [pricePerToken, setPricePerToken] = useState(0);
  const [pricingPlanCurrency, setPricingPlanCurrency] = useState<
    string | undefined
  >(undefined);
  const paymentIdempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    fetch("/api/accounts/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          setCardName(json.fullname);
          setPricePerToken(json.pricingPlanMicros);
          setPricingPlanCurrency(json.pricingPlanCurrency);
        }
      });
  }, []);

  const getIdempotencyKey = () => {
    if (!paymentIdempotencyKeyRef.current) {
      paymentIdempotencyKeyRef.current = crypto.randomUUID();
    }

    return paymentIdempotencyKeyRef.current;
  };

  const createPaymentIntent = async (): Promise<string> => {
    const res = await fetch("/api/payment/intent", {
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
      return;
    }

    setIsProcessing(true);

    try {
      if (tokenAmount <= 0) {
        throw new Error("Invalid token amount");
      }
      
      setClientSecret(await createPaymentIntent());

      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error("Card details not entered.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: { name: cardName },
        },
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

      alert("Payment successful. Your tokens will be credited shortly.");
    } catch (err: any) {
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
              {pricingPlanCurrency && pricePerToken !== undefined && (
                <label className={styles.loginFormLabel} htmlFor="login-user">
                  Token amount (
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: pricingPlanCurrency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(pricePerToken / 100)}{" "}
                  per token)
                </label>
              )}
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
          {pricingPlanCurrency ? (
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className={styles.buyButton}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: pricingPlanCurrency,
              }).format(tokenAmount * pricePerToken / 100)}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}