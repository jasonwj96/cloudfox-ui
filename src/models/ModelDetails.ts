import ModelParam from "./ModelParam";

export default class ModelDetails {
  id: string;
  name: string;
  accountName: string;
  creationDate: string;
  generatedTokens: number;
  status: string;
  fileName: string;
  framework: string;
  lastModified: Date;
  modelParams: ModelParam[];

  constructor(
    id: string,
    name: string,
    accountName: string,
    creationDate: string,
    generatedTokens: number,
    status: string,
    fileName: string,
    framework: string,
    lastModified: Date,
    modelParams: ModelParam[],
  ) {
    this.id = id;
    this.name = name;
    this.accountName = accountName;
    this.creationDate = creationDate;
    this.generatedTokens = generatedTokens;
    this.status = status;
    this.fileName = fileName;
    this.framework = framework;
    this.lastModified = lastModified;
    this.modelParams = modelParams;
  }
}
