"use client";

import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import styles from "@/app/dashboard/page.module.css";
import ModelForm from "@/components/ModelForm";
import ModelDetails from "@/models/ModelDetails";
import TableData from "@/models/TableData";
import { useState, useEffect, useCallback } from "react";

export default function DashboardPage() {
  const [modelList, setModelList] = useState(new TableData([], []));
  const [currentTokens, setCurrentTokens] = useState(0);
  const [selected, setSelected] = useState<ModelDetails | null>(null);
  const [tableData, setTableData] = useState<TableData>(new TableData([], []));

  const handleRowClick = useCallback((row: ModelDetails) => {
    setSelected(row);
  }, []);

  const closeModelForm = () => setSelected(null);

  const handleUpdate = (updated: ModelDetails) => {
    setTableData((td) => {
      const rows = td.rows.map((row) =>
        row.id === updated.id ? updated : row
      );
      return new TableData(td.columns, rows);
    });

    setSelected(updated);
  };

  const loadModels = () => {
    const columns = [
      "Model Id",
      "Model name",
      "Uploaded by",
      "Upload date",
      "Tokens gained",
      "Status",
    ];

    let url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/model/find-by-account`;

    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.models) {
          const modelsList: any[] = json.models;
          let rows: ModelDetails[] = modelsList.map(
            (model) =>
              new ModelDetails(
                model.id,
                model.name,
                model.accountName,
                model.creationDate,
                model.generatedTokens,
                model.active,
                []
              )
          );
          setModelList(new TableData(columns, rows));
        }
      });
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Navbar currentPage="/dashboard" currentTokens={currentTokens} />
      <div className={styles.dashboardRow}>
        <Table
          data={modelList}
          onRowClick={handleRowClick}
          selected={selected}
        />
        {selected && (
          <ModelForm
            selected={selected}
            onClose={closeModelForm}
            onSave={handleUpdate}
            onRefresh={loadModels}
            readOnly={false}
          />
        )}
      </div>
    </div>
  );
}
