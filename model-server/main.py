from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware
from xgboost import XGBRegressor
import pandas as pd
import numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExecutionRequest(BaseModel):
    model_path: str
    payload: dict


@app.post("/execute-model")
async def execute_model(request: ExecutionRequest):
    try:
        model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), request.model_path))

        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail="Modelo no encontrado")

        model = XGBRegressor()
        model.load_model(model_path)

        input_df = pd.DataFrame([{k: float(v) for k, v in request.payload.items()}])

        prediction = model.predict(input_df)

        return {"success": True, "prediction": float(prediction[0])}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "model-execution-api"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
