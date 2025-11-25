"use client";
import Head from 'next/head';
import TestModel from '@/components/TestModel';
import { useCloudfox } from "@/hooks/useCloudfox";
import styles from "@/app/register/page.module.css";

export default function MiFormulario() {
  useCloudfox();

  return (
    <div className={styles.testContainer}>
     
    <Head>
        <title>Cloudfox - Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <TestModel  />
  
    </div>
  );
}
