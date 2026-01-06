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
          <div className={styles.navbarLeft}>
            <img className={styles.navbarLogo} src="/Cloudfox logo white.png" />
            <span className={styles.navbarLogoName}>Cloudfox</span>
          </div>

          <div className={styles.navbarCenter}>
            <Link className={styles.navbarLink} href="/dashboard">Dashboard</Link>
            <Link className={styles.navbarLink} href="/marketplace">Marketplace</Link>
            <Link className={styles.navbarLink} href="/login">Logout</Link>
          </div>
        </div>
        <Link href="/payments">
          <div className={styles.tokensCounter}>
            <img className={styles.tokensLogo} src="/cloudfox logo mini.png" />
            {/* <span className={styles.tokensText}>
              {currentTokens >= 1000
                ? `${parseFloat((currentTokens / 1000).toFixed(2))}k`
                : currentTokens} tokens
            </span> */}
            <span className={styles.tokensText}>
              54312.98k tokens
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}
