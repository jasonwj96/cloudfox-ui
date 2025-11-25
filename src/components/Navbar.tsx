import Link from 'next/link';
import Image from 'next/image';
import { FormEvent } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  currentPage: string;
  currentTokens: number
}

export default function Navbar({ currentPage, currentTokens }: NavbarProps) {
  return (
    <>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLinks}>
          <img className={styles.navbarLogo} src="/Cloudfox logo white.png" />
          <span className={styles.navbarLogoName}>Cloudfox</span>

          <Link
            className={`${styles.navbarLink} ${currentPage === '/dashboard' ? styles.navbarLinkSelected : ''
              }`}
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`${styles.navbarLink} ${currentPage === '/marketplace' ? styles.navbarLinkSelected : ''
              }`}
            href="/marketplace"
          >
            Marketplace
          </Link>
          <Link
            className={`${styles.navbarLink} ${currentPage === '/login' ? styles.navbarLinkSelected : ''
              }`}
            href="/login"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
            }}
          >
            Logout
          </Link>
        </div>

        <Link href="/payments">
          <div className={styles.tokensCounter}>
            <img className={styles.tokensLogo} src="/cloudfox logo mini.png" />
            <span  className={styles.tokensText}>
              {currentTokens >= 1000
                ? `${parseFloat((currentTokens / 1000).toFixed(2))}k`
                : currentTokens} tokens
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}
