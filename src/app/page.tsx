// app/page.tsx or pages/index.tsx
'use client'; // only if using app directory and client-side logic

import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import '../../styles/globals.css';
import { redirect } from 'next/navigation';

export default function TestPage() {

  useEffect(() => {
    redirect('/login');
  }, []);

  return (
    <>
      <Head>
        <title>Cloudfox</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <link rel="stylesheet" href="/theme.css" />
      </Head>

      <main data-cloudfox-app="App">
        <div className="navbar">
          <Image src="/Cloudfox logo white.png" alt="logo" width={100} height={50} />
          <p id="logo">
            <span>Cloud</span>fox
          </p>
        </div>

        <div className="form-container">
          <form
            data-cloudfox-form
            data-cloudfox-model="CDFX-AFGA4561"
            data-cloudfox-handler="methodA"
            data-cloudfox-callback="methodC"
          >
            <input data-cloudfox-input="input1" type="text" placeholder="name" />
            <button type="submit">Ingresar</button>
          </form>
        </div>

        <div data-cloudfox-container data-cloudfox-model="CDFX-GGBV1551">
          <div data-cloudfox-input="input2">ABCDE</div>
          <div data-cloudfox-handler="methodB" data-cloudfox-callback="methodC">Enviar</div>
        </div>
      </main>
    </>
  );
}