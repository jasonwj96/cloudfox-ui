'use client';

import Head from 'next/head';
import { FormEvent } from 'react';
import LoginForm from '@/components/LoginForm';
import styles from '@/app/register/page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.registerPageContainer}>
      <Head>
        <title>Cloudfox - Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <LoginForm isLogin={false} />
    </div>
  )
}