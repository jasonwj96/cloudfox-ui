'use client';

import styles from '@/components/TestModel.module.css'; 

export default function CloudfoxForm() {
  

  return (
    <main data-cloudfox-app="App" className={styles.main}>
      <div className={styles.formContainer}>
        <form
          data-cloudfox-form
          data-cloudfox-model="CFX-868991"
          data-cloudfox-handler="methodA"
          data-cloudfox-callback="methodC"
          className={styles.form}
        >
          <label className={styles.label}>passenger_count</label>
          <input className={styles.input} data-cloudfox-input="passenger_count" type="text" />

          <label className={styles.label}>pickup_hour</label>
          <input className={styles.input} data-cloudfox-input="pickup_hour" type="text" />

          <label className={styles.label}>pickup_day</label>
          <input className={styles.input} data-cloudfox-input="pickup_day" type="text" />

          <label className={styles.label}>pickup_month</label>
          <input className={styles.input} data-cloudfox-input="pickup_month" type="text" />

          <label className={styles.label}>store_and_fwd_flag</label>
          <input className={styles.input} data-cloudfox-input="store_and_fwd_flag" type="text" />

          <label className={styles.label}>distance_km</label>
          <input className={styles.input} data-cloudfox-input="distance_km" type="text" />

          <button type="submit" className={styles.button}>Ingresar</button>
        </form>
      </div>

      <div data-cloudfox-container data-cloudfox-model="CDFX-GGBV1551" className={styles.secondaryContainer}>
        <div data-cloudfox-input="input2">ABCDE</div>
        <div data-cloudfox-handler="methodB" data-cloudfox-callback="methodC" className={styles.secondaryButton}>
          Enviar
        </div>
      </div>
    </main>
  );
}
