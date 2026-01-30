import type { StripeCardElementOptions } from "@stripe/stripe-js";

export const CARD_NUMBER_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      fontFamily: "Quicksand, sans-serif",
      fontStyle: "normal",
      fontSize: "1.2em",
      color: "#ffffff",
      fontWeight: 100,
      backgroundColor: "transparent",
      letterSpacing: "1px",
      padding: "5px",
      "::placeholder": {
        color: "#969696ff",
      },
    },
    invalid: {
      color: "#fe0000ff",
    },
  },
};

export const CARD_CVC_ELEMENT_OPTIONS: StripeCardElementOptions = {
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

export const CARD_DATE_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      textAlign: "center",
      fontFamily: "Quicksand, sans-serif",
      fontStyle: "normal",
      fontSize: "0.9em",
      lineHeight: "1.5",
      fontWeight: 100,
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