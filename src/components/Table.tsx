'use client';

import styles from '@/components/Table.module.css';
import ModelDetails from '@/models/ModelDetails';
import TableData from '@/models/TableData';

interface TableProps {
  data: TableData;
  onRowClick?: (row: ModelDetails) => void;
  selected?: ModelDetails | null;
}

export default function Table({ data, onRowClick, selected }: TableProps) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderTitle}>My models</div>
        <div className={styles.tableHeaderButton} onClick={() => onRowClick?.(new ModelDetails("", "", "", "", 0, false, []))}>+</div>
      </div>

      {data.rows.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              {data.columns.map((col: string) => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              data.rows.map((row: ModelDetails) => {
                const isSelected = selected?.id === row.id;

                const date = new Date(row.creationDate);

                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const year = date.getUTCFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={isSelected ? styles.activeRow : ''}
                  >
                    <td key={row.id}>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.accountName}</td>
                    <td>{formattedDate}</td>
                    <td>{row.generatedTokens}</td>
                    <td>
                      <span className={row.active ?
                        styles.modelStatusEnabled : styles.modelStatusDisabled}>
                        {row.active ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                  </tr>)
              })
            }
          </tbody>
        </table>
      ) : (
        <div className={styles.noRecordsFound}>
          <img src="cloudfox-missing.png" />
          <div >No models found.</div>
        </div>)
      }
    </div >
  );
}
