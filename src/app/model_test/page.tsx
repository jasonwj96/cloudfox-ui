"use client";
import React, { useEffect } from 'react';
import CloudfoxForm from '@/components/CloudfoxForm';
import { getTimestamp } from '@/utils/utils';
import Head from 'next/head';
import TestModel from '@/components/TestModel';
import styles from "@/app/register/page.module.css";


const Home: React.FC = () => {
  useEffect(() => {
    console.info(`[${getTimestamp()}][INFO] Initializing Cloudfox service.`);
    console.info(`[${getTimestamp()}][INFO] Finished initializing Cloudfox service.`);
  }, []);

  return (
    <div className={styles.testContainer}>
     
    <Head>
        <title>Cloudfox - Testing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <TestModel  />
  
    </div>
  );
};

export default Home;
