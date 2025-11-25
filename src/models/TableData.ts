import ModelDetails from "./ModelDetails";

export default class TableData {
  columns: string[];
  rows: ModelDetails[];

  constructor(columns: string[], rows: any[]) {
    this.columns = columns;
    this.rows = rows;
  }
}