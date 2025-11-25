"use client";

import Link from 'next/link';
import styles from '@/components/PaymentForm.module.css';
import { useEffect, useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

export default function PaymentForm() {

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [cardName, setCardName] = useState("");

  const PRICE_PER_UNIT = 0.001;

  const CARD_NUMBER_ELEMENT_OPTIONS = {
    placeholder: 'XXXX XXXX XXXX XXXX',
    style: {
      base: {
        fontFamily: 'Quicksand, sans-serif',
        fontStyle: 'normal',
        fontSize: '1.2em',
        color: '#ffffff',
        fontWeight: 100,
        backgroundColor: 'transparent',
        wordSpacing: '5px',
        letterSpacing: '1px',
        padding: '5px',
        border: 'none',
        '::placeholder': {
          color: '#969696ff',
        },
      },
      invalid: {
        color: '#fe0000ff',
      },
    },
  };

  const CARD_CVC_ELEMENT_OPTIONS = {
    placeholder: "cvc",
    style: {
      base: {
        textAlign: 'center',
        fontFamily: 'Quicksand, sans-serif',
        fontStyle: 'normal',
        fontSize: '1em',
        lineHeight: '1.5',
        fontWeight: 'bold',
        color: '#303030',
        letterSpacing: '1px',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#fe0000ff',
      },
    },
  };

  const CARD_DATE_ELEMENT_OPTIONS = {
    style: {
      base: {
        textAlign: 'center',
        fontFamily: 'Quicksand, sans-serif',
        fontStyle: 'normal',
        fontSize: '0.9em',
        lineHeight: '1.5',
        fontWeight: '100',
        color: '#ffffff',
        letterSpacing: '1px',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#fe0000ff',
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

  const createPaymentIntent = async () => {
    const user = localStorage.getItem("user");

    if (user) {
      if (!tokenAmount || tokenAmount <= 0) return;

      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/create-payment-intent`;

        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: tokenAmount,
            pricePerUnit: PRICE_PER_UNIT
          }),
        }).then(response => response.json())
          .then(json => {
            setClientSecret(json.clientSecret);

            url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/add-tokens`;

            fetch(url, {
              method: "POST",
              body: JSON.stringify({
                user: JSON.parse(user),
                tokenAmount
              })
            });

            alert(`${tokenAmount} tokens added successfully to your account.`);

          });
      } catch (err) {
        console.error(err);
        setError("Failed to initialize payment.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createPaymentIntent();

    if (!stripe || !elements || !clientSecret) {
      setError('Stripe has not loaded yet.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setError('Card details not entered.');
      setIsProcessing(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
      },
    });

    setIsProcessing(false);

    if (result.error) {
      setError(result.error.message || 'Payment failed.');
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {

      // TODO: Enviar usuario
      const url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/buy-tokens`;
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: "",
          tokenAmount
        })
      })
        .then(response => response.json())
        .then(json => {
          alert('Payment successful!');
        });
    } else {
      setError('Payment failed or was cancelled.');
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
                <img src="credit-card-chip.png" className={styles.creditCardChip} />
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
                    <CardCvcElement
                      options={CARD_CVC_ELEMENT_OPTIONS}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.paymentFormCheckout}>
            <div className={styles.paymentFormCheckoutAmount}>
              <label className={styles.loginFormLabel} htmlFor="login-user">Token amount</label>
              <input
                name="login-user"
                className={styles.input}
                type="number"
                minLength={3}
                maxLength={30}
                required
                value={tokenAmount}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setTokenAmount(val);
                  } else {
                    setTokenAmount(0);
                  }
                }}
              />
              <p className={`${styles.loginUserError} ${styles.inputErrorMsg}`} style={{ display: 'none' }}></p>
            </div>
          </div>

        </div>

        <div className={styles.paymentFormButtons}>
          <Link href="/dashboard" className={styles.returnButton}>
            Back to dashboard
          </Link>
          <button type="submit"
            disabled={!stripe || isProcessing}
            className={styles.buyButton}>
            {
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(tokenAmount * PRICE_PER_UNIT)
            }
          </button>
        </div>
      </form>
    </div>
  )
}
