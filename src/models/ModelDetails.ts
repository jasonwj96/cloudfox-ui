import ModelParam from "./ModelParam";

export default class ModelDetails {

  modelId: string;
  modelName: string;
  uploadedBy: string;
  uploadDate: string;
  generatedTokens: number;
  modelStatus: boolean;
  modelParams: ModelParam[]

  constructor(
    modelId: string,
    modelName: string,
    uploadedBy: string,
    uploadDate: string,
    generatedTokens: number,
    modelStatus: boolean,
    modelParams: ModelParam[]) {
    this.modelId = modelId;
    this.modelName = modelName;
    this.uploadedBy = uploadedBy;
    this.uploadDate = uploadDate;
    this.generatedTokens = generatedTokens;
    this.modelStatus = modelStatus;
    this.modelParams = modelParams;
  }
}