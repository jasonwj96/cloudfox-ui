"use client";

import { FormEvent, useState, useEffect } from "react";
import styles from "@/components/ModelForm.module.css";
import ModelDetails from "@/models/ModelDetails";
import ModelParam from "@/models/ModelParam";

interface ModelFormProps {
  selected: ModelDetails;
  onClose: () => void;
  onSave: (updated: ModelDetails) => void;
  onRefresh: () => void;
  readOnly: boolean;
}

export default function ModelForm({
  selected,
  onClose,
  onSave,
  onRefresh,
  readOnly,
}: ModelFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelData, setModelData] = useState<any>();
  const [modelName, setModelName] = useState(selected.modelName);
  const [modelStatus, setModelStatus] = useState<boolean>(selected.modelStatus);
  const [modelParams, setModelParams] = useState<ModelParam[]>(
    selected.modelParams,
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === "string") {
          const parsedText = text.replace(/\bNaN\b/g, "null");
          const parsed = JSON.parse(parsedText);

          if (parsed.learner) {
            let features = parsed.learner.feature_names;
            let dataTypes = parsed.learner.feature_types;

            const minLength = Math.min(features.length, dataTypes.length);
            let paramList = Array.from({ length: minLength }, (_, i) => [
              features[i],
              dataTypes[i],
            ]);

            let params: any = paramList.map((param: string[]) => {
              return new ModelParam(param[0], param[1]);
            });
            setModelData(text);
            setModelParams(params);
          }
        }
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        setModelData("");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      parseFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      parseFile(file);
    }
  };

  const parseFeatureType = (dataType: string): string => {
    const types: Record<string, string> = {
      c: "String",
      categorical: "String",
      i: "Integer",
      int: "Integer",
      float: "Float",
      q: "Float",
    };

    return types[dataType] || "Unknown";
  };

  const clearModel = () => {
    setSelectedFile(null);
    setModelData(null);
    setModelParams([]);
  };

  const uploadModel = () => {
    if (!selectedFile) {
      throw new Error("File must be selected.");
    }

    const body = new FormData();
    body.append("modelName", modelName);
    body.append("modelStatus", modelStatus.toString());
    body.append("framework", "xgboost");
    body.append("filePayload", selectedFile, selectedFile.name);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/cloudfox-api/v1/model/create`,
      {
        method: "POST",
        body: body,
        credentials: "include",
      },
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          alert("Model uploaded successfully.");
          onRefresh();
        } else {
          alert(json.error);
        }
      })
      .catch((err) => {
        alert("There was an error while uploading the model.");
        console.error("Upload failed:", err);
      });
  };

  const deleteModel = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/api/delete-model`;
    const user = localStorage.getItem("user");

    if (user) {
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          modelId: selected.modelId,
          user: JSON.parse(user),
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            alert("Model deleted successfully");
            onRefresh();
          } else {
            alert("Failed to delete model");
            console.error(json.message);
          }
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          alert("Error deleting model");
        });
    }
  };

  const saveModel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedFile && !selected.modelId) {
      alert("No file selected.");
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === "string") {
          setModelData(text);
        }
      } catch (err) {
        alert("There was an error while reading the file.");
        console.error("Failed to parse JSON:", err);
      }
      uploadModel();
    };

    if (selectedFile) {
      reader.readAsText(selectedFile);
    } else {
      uploadModel();
    }
  };

  useEffect(() => {
    setModelName(selected.modelName);
    setModelStatus(selected.modelStatus);
  }, [selected]);
  return (
    <div className={styles.modelFormContainer}>
      <div className={styles.formGroup}>
        <div className={styles.modelFormHeader}>
          <div className={styles.modelFormHeaderTitle}>
            {selected.modelId ? "Edit model" : "Add model"}
          </div>
          <div onClick={onClose} className={styles.modelFormHeaderButton}>
            x
          </div>
        </div>

        <form className={styles.modelForm}>
          {selected.modelId ? (
            <div>
              <label className={styles.loginFormLabel} htmlFor="model-id">
                Model Id
              </label>
              <input
                name="model-id"
                value={selected.modelId}
                onChange={(e) => setModelName(e.target.value)}
                className={styles.input}
                type="text"
                minLength={3}
                maxLength={30}
                disabled={true}
                required
              />
            </div>
          ) : (
            <div></div>
          )}

          <label className={styles.loginFormLabel} htmlFor="model-name">
            Model name
          </label>
          <input
            name="model-name"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className={styles.input}
            type="text"
            minLength={3}
            maxLength={30}
            disabled={readOnly}
            required
          />
          <p
            className={`${styles.loginUserError} ${styles.inputErrorMsg}`}
            style={{ display: "none" }}
          ></p>

          {!readOnly ? (
            <div>
              <label className={styles.loginFormLabel} htmlFor="model-status">
                Model status
              </label>
              <div className={styles.radioButtonGroup}>
                <div className={styles.radioInput} />
                <label
                  htmlFor="status-active"
                  className={
                    modelStatus === true
                      ? styles.radioLabelSelected
                      : styles.radioLabel
                  }
                  onClick={() => setModelStatus(true)}
                >
                  Enabled
                </label>
                <div
                  className={styles.radioInput}
                  onClick={() => setModelStatus(false)}
                />
                <label
                  htmlFor="status-inactive"
                  className={
                    modelStatus === false
                      ? styles.radioLabelSelected
                      : styles.radioLabel
                  }
                  onClick={() => setModelStatus(false)}
                >
                  Disabled
                </label>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {!readOnly ? (
            <div>
              <label className={styles.loginFormLabel} htmlFor="model-file">
                Model file
              </label>
              <div
                className={styles.inputFileDrop}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <p className={styles.dropMessage}>
                  {selectedFile
                    ? `${selectedFile.name}`
                    : "Drag & drop a file, or click the area to upload"}
                </p>
                <input
                  type="file"
                  className={styles.inputFile}
                  onChange={handleFileChange}
                  disabled={readOnly}
                />
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </form>
      </div>

      {modelParams && (
        <table className={styles.featuresTable}>
          {modelParams.length > 0 ? (
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Data Type</th>
              </tr>
            </thead>
          ) : (
            <thead></thead>
          )}
          <tbody>
            {modelParams.map((param: ModelParam) => (
              <tr key={param.featureName}>
                <td>{param.featureName}</td>
                <td>{parseFeatureType(param.dataType)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!readOnly ? (
        <div className={styles.modelFormFooter}>
          {selected.modelId ? (
            <button
              type="submit"
              className={styles.deleteModelBtn}
              onClick={deleteModel}
            >
              Delete
            </button>
          ) : (
            <div></div>
          )}
          <button
            type="submit"
            className={styles.secondaryActionBtn}
            onClick={clearModel}
          >
            Clear
          </button>
          <button
            type="submit"
            className={styles.primaryActionBtn}
            onClick={saveModel}
          >
            Save
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
