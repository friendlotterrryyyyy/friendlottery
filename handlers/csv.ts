import { PlayedNumber } from "../types";

export class CsvHandler {
  static generateCsv(data: PlayedNumber[]) {
    const headers = Object.keys(data[0]).join(";");
  
    const content = data
      .map((row: PlayedNumber) => `"${row.combination}";"${row.price}"\n`)
      .join("")
      .replaceAll(",", "");
  
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + content;
  
    window.open(encodeURI(csvContent));
  }
}
