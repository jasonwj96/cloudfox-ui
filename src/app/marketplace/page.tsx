'use client';

import Navbar from '@/components/Navbar';
import styles from '@/app/marketplace/page.module.css';
import MarketplaceItem from '@/components/MarketplaceItem';
import ModelForm from '@/components/ModelForm';
import ModelDetails from '@/models/ModelDetails';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {

  const [modelList, setModelList] = useState<ModelDetails[]>(new Array<ModelDetails>());
  const [selected, setSelected] = useState<ModelDetails | null>(null);
  const [currentTokens, setCurrentTokens] = useState(0);
  
  const router = useRouter();

  const handleItemClick = useCallback((item: ModelDetails) => {
    setSelected(item);
  }, []);

  const closeModelForm = () => setSelected(null);

  const loadModels = () => {

    let url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/profile`;

      // fetch(url, {
      //   method: "POST",
      //   body: JSON.stringify({
         
      //   })
      // }).then(response => response.json())
      //   .then(json => {
      //     setCurrentTokens(json.user.currentTokens);
      //   });

    url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/model`;
    fetch(url, {
      method: "GET",
      credentials: "include"
    })
      .then(response => response.json())
      .then(json => {
        setModelList(json.models);
      })
      .catch(err => {
      });
  }

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className={styles.marketplaceContainer}>
      <Navbar currentPage="/marketplace" currentTokens={currentTokens} />
      <div className={styles.dashboardRow}>
        <div className={styles.dashboardRowItems}>
          <div className={styles.marketPlaceHeader}>
            <div className={styles.marketPlaceHeaderTitle}>Available models</div>
          </div>
          {
            modelList.length > 0 ? (<div className={styles.modelsList}>
              {
                modelList.map((model: ModelDetails) => {
                  return (<MarketplaceItem key={model.id} data={model} onItemClick={handleItemClick} />)
                })
              }
            </div>) : (
              <div className={styles.noRecordsFound}>
                <img src="cloudfox-missing.png" />
                <div >No models found.</div>
              </div>)
          }

        </div>
        {selected && <ModelForm
          selected={selected}
          onClose={closeModelForm}
          onRefresh={loadModels}
          onSave={() => { }}
          readOnly={true}
        />}
      </div>
    </div>
  )
}