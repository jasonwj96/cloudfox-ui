'use client';

import styles from '@/components/MarketplaceItem.module.css';
import ModelDetails from '@/models/ModelDetails';

interface MarketplaceItemProps {
  data: ModelDetails,
  onItemClick?: (item: ModelDetails) => void
}

export default function MarketplaceItem({ data, onItemClick }: MarketplaceItemProps) {
  return (
    <div className={styles.marketplaceItemContainer}
      onClick={() => onItemClick?.(data)}
    >
      <div>
        <div className={styles.modelId}>
          {data.modelId}
        </div>
        <div className={styles.modelName}>
          {data.modelName}
        </div>
        <div className={styles.uploadedBy}>
          {data.uploadedBy}
        </div>
      </div>
      <div>
        <div className={styles.marketplaceItemFooter}>
          <div className={styles.tokensCounter}>
            <img className={styles.tokensLogo} src="/cloudfox logo mini.png" />
            <span className={styles.tokensText}>{data.generatedTokens}</span>
          </div>
          {
            data.modelStatus ? (
              <div className={styles.modelStatusEnabled}>
                Enabled
              </div>
            ) :
              (<div className={styles.modelStatusDisabled}>
                Disabled
              </div>)
          }
        </div>
      </div>
    </div>
  )
}