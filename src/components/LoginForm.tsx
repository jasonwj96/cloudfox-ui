"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import styles from "@/components/LoginForm.module.css";
import { useRouter } from "next/navigation";
import LoginFormData from "@/models/LoginFormData";
import { validateField } from "@/lib/utils";

interface LoginFormProps {
  isLogin: boolean;
}

export default function LoginForm({ isLogin }: LoginFormProps) {
  const [formData, setFormData] = useState(new LoginFormData("", "", "", ""));

  const fieldRefs = {
    username: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    fullname: useRef<HTMLInputElement>(null),
  };

  const errorRefs = {
    username: useRef<HTMLParagraphElement>(null),
    email: useRef<HTMLParagraphElement>(null),
    password: useRef<HTMLParagraphElement>(null),
    fullname: useRef<HTMLParagraphElement>(null),
  };

  const router = useRouter();

  function onFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => prev.updateFields({ [name]: value }));
  }

  function onBlur(field: keyof typeof fieldRefs) {
    validateField(fieldRefs[field].current, errorRefs[field].current);
  }

  async function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    const requiredFields = ["username", "password"];

    if (!isLogin) {
      requiredFields.push("fullname", "email");
    }

    const isValid = requiredFields.every((key) =>
      validateField(
        fieldRefs[key as keyof typeof fieldRefs].current!,
        errorRefs[key as keyof typeof errorRefs].current!,
      ),
    );

    if (!isValid) {
      return;
    }

    let url = "";

    if (isLogin) {
      url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/session/login`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/accounts/register`;
    }

    const body = {
      username: fieldRefs.username.current!.value,
      email: fieldRefs.email.current?.value ?? "",
      password: fieldRefs.password.current!.value,
      fullname: fieldRefs.fullname.current?.value ?? "",
    };

    await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.message);
          return;
        }
        router.push(isLogin ? "/dashboard" : "/login");
      })
      .catch((e) => {
        // Login/Register modal popup
      });
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCover}>
        <img src="/cloudfox-cover.png" alt="Cloudfox cover" />
      </div>

      <form className={styles.loginForm} onSubmit={onFormSubmit} noValidate>
        <img className={styles.loginLogo} src="/cloudfox-logo.png" />
        <h1 className={styles.loginFormTitle}>
          {isLogin ? "Login" : "Register"}
        </h1>
        <h1 className={styles.loginFormSubtitle}>to continue</h1>

        <label className={styles.loginFormLabel} htmlFor="username">
          Username
        </label>
        <input
          ref={fieldRefs.username}
          name="username"
          value={formData.username}
          className={styles.loginInput}
          onChange={onFormChange}
          onBlur={() => onBlur("username")}
          type="text"
          minLength={3}
          maxLength={32}
          required
          placeholder="username123"
        />
        <p
          ref={errorRefs.username}
          className={styles.inputErrorMsg}
          style={{ display: "none" }}
        ></p>

        {!isLogin && (
          <>
            <label className={styles.loginFormLabel} htmlFor="email">
              Email
            </label>
            <input
              ref={fieldRefs.email}
              name="email"
              value={formData.email}
              className={styles.loginInput}
              onChange={onFormChange}
              onBlur={() => onBlur("email")}
              type="text"
              minLength={3}
              maxLength={255}
              required
              placeholder="jdoe@gmail.com"
            />
            <p
              ref={errorRefs.email}
              className={styles.inputErrorMsg}
              style={{ display: "none" }}
            ></p>
          </>
        )}

        {!isLogin && (
          <>
            <label className={styles.loginFormLabel} htmlFor="fullname">
              Full name
            </label>
            <input
              ref={fieldRefs.fullname}
              name="fullname"
              value={formData.fullname}
              className={styles.loginInput}
              onChange={onFormChange}
              onBlur={() => onBlur("fullname")}
              type="text"
              minLength={1}
              maxLength={255}
              required
              placeholder="John Doe"
            />
            <p
              ref={errorRefs.fullname}
              className={styles.inputErrorMsg}
              style={{ display: "none" }}
            ></p>
          </>
        )}

        <label className={styles.loginFormLabel} htmlFor="password">
          Password
        </label>
        <input
          ref={fieldRefs.password}
          value={formData.password}
          name="password"
          className={styles.loginInput}
          onChange={onFormChange}
          onBlur={() => onBlur("password")}
          type="password"
          minLength={12}
          maxLength={64}
          required
          placeholder="***************"
        />
        <p
          ref={errorRefs.password}
          className={styles.inputErrorMsg}
          style={{ display: "none" }}
        ></p>

        {isLogin ? (
          <Link href="/register" className={styles.prompt}>
            Don't have an account? Click here to register
          </Link>
        ) : (
          <Link href="/login" className={styles.prompt}>
            Click here to go back to the login page
          </Link>
        )}

        <button type="submit" className={styles.btnLogin}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
