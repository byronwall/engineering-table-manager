"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nedb = require("nedb");
const d3 = require("d3");
const DataTable_1 = require("./DataTable");
const D3Table_1 = require("./D3Table");
let db = new nedb({ filename: "./_data/test.db", autoload: true });
let input = document.getElementById("table-in");
document.getElementById("btn-submit").onclick = () => {
    //create new table
    console.log("click event");
    let new_table = DataTable_1.DataTable.FromString(input.value);
    console.log(new_table);
    //add record
    db.insert(new_table, () => {
        console.log("inserted");
        count_records();
    });
};
document.getElementById("btn-load").onclick = () => {
    //display the record as a table
    db.find({}, (err, docs) => {
        console.log("docs", docs);
        d3.select("#main-col").html(null);
        for (var doc of docs) {
            let newTable = new D3Table_1.D3Table(doc);
            newTable.render("#main-col");
        }
    });
};
function count_records() {
    db.count({}, (err, count) => {
        d3.select("#db-status").text("db contains " + count + " entries");
    });
}
count_records();
//# sourceMappingURL=app.js.map