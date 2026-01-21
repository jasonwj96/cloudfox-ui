"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent } from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/navigation";

interface NavbarProps {
  currentPage: string;
  currentTokens: number;
}

export default function Navbar({ currentPage, currentTokens }: NavbarProps) {
  const router = useRouter();

  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/session/logout`, {
      method: "POST",
      credentials: "include",
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
