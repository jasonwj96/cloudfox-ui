'use client';

import Head from 'next/head';
import { FormEvent } from 'react';
import LoginForm from '@/components/LoginForm';
import styles from '@/app/login/page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.loginPageContainer}>
      <Head>
        <title>Cloudfox - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <LoginForm isLogin={true} />
    </div>
  )
}