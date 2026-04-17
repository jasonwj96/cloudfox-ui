"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent } from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/navigation";
import { FetchRequest, fetchService } from "@/utils/net";

interface NavbarProps {
  currentPage: string;
  currentTokens: number;
}

export default function Navbar({ currentPage, currentTokens }: NavbarProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/security/csrf-token", {
      method: "GET",
      credentials: "include",
    });

    const request = new FetchRequest();

    request.url = "/session/logout";
    request.method = "POST";
    request.headers = {
      "Content-Type": "application/json",
    };

    await fetchService(request)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.message);
          return;
        }
        router.push("/login");
      })
      .catch((e) => {
        // Login/Register modal popup
      });

    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLinks}>
          <div className={styles.navbarLeft}>
            <img className={styles.navbarLogo} src="/Cloudfox logo white.png" />
            <span className={styles.navbarLogoName}>Cloudfox</span>
          </div>

          <div className={styles.navbarCenter}>
            <Link className={styles.navbarLink} href="/dashboard">
              Dashboard
            </Link>
            <Link className={styles.navbarLink} href="/marketplace">
              Marketplace
            </Link>
            <button onClick={logout} className={styles.navbarLink}>
              Logout
            </button>
          </div>
        </div>
        <Link href="/payments">
          <div className={styles.tokensCounter}>
            <img className={styles.tokensLogo} src="/cloudfox logo mini.png" />
            <span className={styles.tokensText}>
              {currentTokens >= 1000
                ? `${parseFloat((currentTokens / 1000).toFixed(2))}k`
                : currentTokens}{" "}
              tokens
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}
