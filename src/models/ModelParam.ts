export default class ModelParam {
  featureName: string;
  dataType: string;

  constructor(featureName: string, dataType: string) {
    this.featureName = featureName;
    this.dataType = dataType;
  }
}