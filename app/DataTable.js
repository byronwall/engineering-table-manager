"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
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
        //TODO: add a guessing step here to see if CSV or <table>
        if (input.substring(0, 7) === "<table>") {
            //this assumes a <table> input
            //need to parse the table using jquery for now
            let table = $(input);
            let thead = table.find("thead");
            console.log("thead", thead);
            if (thead.length > 0) {
                //get the headers
                let thtr = thead.find("tr");
                if (thtr.length > 0) {
                    for (var th of thtr.children()) {
                        console.log("th", th);
                        //push the column header into the data
                        newTable.columns.push($(th).text());
                    }
                }
            }
            let tbody = table.find("tbody");
            console.log("tbody", tbody);
            if (tbody.length > 0) {
                let trtr = tbody.find("tr");
                if (trtr.length > 0) {
                    console.log("trtr", trtr);
                    for (var tr of trtr) {
                        let dataObj = {};
                        let colIndex = 0;
                        console.log("tr", tr);
                        for (var td of $(tr).children()) {
                            console.log("td", colIndex, td);
                            dataObj[newTable.columns[colIndex]] = $(td).text();
                            colIndex++;
                        }
                        newTable.data.push(dataObj);
                    }
                }
            }
            //read the thead block to get the headers
            //read the tbody to get the data
        }
        else {
            //this assumes a CSV file
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