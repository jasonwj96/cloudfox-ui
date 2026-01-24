import ModelParam from "./ModelParam";

export default class ModelDetails {

  id: string;
  name: string;
  accountName: string;
  creationDate: string;
  generatedTokens: number;
  active: boolean;
  modelParams: ModelParam[]

  constructor(
    id: string,
    name: string,
    accountName: string,
    creationDate: string,
    generatedTokens: number,
    active: boolean,
    modelParams: ModelParam[]) {
    this.id = id;
    this.name = name;
    this.accountName = accountName;
    this.creationDate = creationDate;
    this.generatedTokens = generatedTokens;
    this.active = active;
    this.modelParams = modelParams;
  }
}