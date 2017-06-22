"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataTable {
    constructor() {
        this.data = [];
        this.columns = [];
        this.row_headers = [];
    }
    static FromString(input) {
        console.log("DataTable, create new...", input);
        let newTable = new DataTable();
        let isFirstLine = true;
        //assume that the string contains headers, then data, tab separated
        let lines = input.split("\n");
        for (var line of lines) {
            var cols = line.split("\t");
            let dataObj = {};
            let colIndex = 0;
            for (var col of cols) {
                if (isFirstLine) {
                    newTable.columns.push(col);
                }
                else {
                    dataObj[newTable.columns[colIndex]] = col;
                    colIndex++;
                }
            }
            if (!isFirstLine) {
                newTable.data.push(dataObj);
            }
            isFirstLine = false;
        }
        return newTable;
    }
}
exports.DataTable = DataTable;
//# sourceMappingURL=DataTable.js.map