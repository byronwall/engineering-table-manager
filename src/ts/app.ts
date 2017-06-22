import * as nedb from "nedb";
import * as d3 from "d3";

import { DataTable } from "./DataTable";
import { D3Table } from "./D3Table";

let db = new nedb({ filename: "./_data/test.db", autoload: true });

let input = document.getElementById("table-in") as HTMLTextAreaElement;

document.getElementById("btn-submit").onclick = () => {
    //create new table
    console.log("click event");

    let new_table = DataTable.FromString(input.value);

    console.log(new_table);

    //add record
    db.insert(new_table, () => {
        console.log("inserted");

        count_records();
    });
}

document.getElementById("btn-load").onclick = () => {
    //display the record as a table
    db.find({}, (err, docs) => {
        console.log("docs", docs);

        d3.select("#main-col").html(null);

        for (var doc of docs) {
            let newTable = new D3Table(doc);
            newTable.render("#main-col");
        }
    })
}

function count_records() {
    db.count({}, (err, count) => {
        d3.select("#db-status").text("db contains " + count + " entries");
    });
}

count_records();