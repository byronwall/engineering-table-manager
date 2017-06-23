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
    get dbId() {
        let output = {};
        output["_id"] = this._id;
        console.log(output);
        return output;
    }
    static transformJsonToType(json) {
        let newObj = new DataTable();
        for (var prop in json) {
            newObj[prop] = json[prop];
        }
        return newObj;
    }
    static transformJsonArrToType(json_arr) {
        let output = [];
        for (var json of json_arr) {
            output.push(DataTable.transformJsonToType(json));
        }
        return output;
    }
}
exports.DataTable = DataTable;
//# sourceMappingURL=DataTable.js.map