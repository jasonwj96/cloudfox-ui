'use client';

import Navbar from '@/components/Navbar';
import Table from '@/components/Table';
import styles from '@/app/dashboard/page.module.css';
import ModelForm from '@/components/ModelForm';
import ModelDetails from '@/models/ModelDetails';
import TableData from '@/models/TableData';
import { useState, useEffect, useCallback } from 'react';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {

  const [modelList, setModelList] = useState(new TableData([], []));
  const [currentTokens, setCurrentTokens] = useState(0);
  const [selected, setSelected] = useState<ModelDetails | null>(null);
  const [tableData, setTableData] = useState<TableData>(new TableData([], []));

  const router = useRouter();

  const handleRowClick = useCallback((row: ModelDetails) => {
    setSelected(row);
  }, []);

  const closeModelForm = () => setSelected(null);

  const handleUpdate = (updated: ModelDetails) => {
    setTableData(td => {
      const rows = td.rows.map(row =>
        row.modelId === updated.modelId ? updated : row
      );
      return new TableData(td.columns, rows);
    });

    setSelected(updated);
  };

  const loadModels = () => {
    const columns = [
      'Model Id',
      'Model name',
      'Uploaded by',
      'Upload date',
      'Tokens gained',
      'Status',
    ];

    const userData = localStorage.getItem("user");
    const tokenData = localStorage.getItem("token");

    if (userData && tokenData) {
      let url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/profile`;

      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          user: JSON.parse(userData),
          token: JSON.parse(tokenData)
        })
      }).then(response => response.json())
        .then(json => {
          setCurrentTokens(json.user.currentTokens);
        });

      url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/get-models`;

      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          user: JSON.parse(userData),
          token: JSON.parse(tokenData)
        })
      })
        .then(response => response.json())
        .then(json => {
          if (json.models) {
            const modelsList: any[] = json.models;
            let rows: ModelDetails[] = modelsList.map(model =>
              new ModelDetails(
                model.modelId,
                model.modelName,
                model.uploadedBy,
                model.uploadDate,
                model.generatedTokens,
                model.modelStatus,
                model.modelParams)
            );

            setModelList(new TableData(columns, rows));
          }

        })
        .catch(err => {
        });
    }
  }

  useEffect(() => {
    // if (!localStorage.getItem("user")) {
    //   router.push("/login");
    // }

    loadModels();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Navbar currentPage="/dashboard" currentTokens={currentTokens} />
      <div className={styles.dashboardRow}>
        <Table data={modelList} onRowClick={handleRowClick} selected={selected} />
        {selected && <ModelForm
          selected={selected}
          onClose={closeModelForm}
          onSave={handleUpdate}
          onRefresh={loadModels}
          readOnly={false}
        />}
      </div>
    </div>
  )
}