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

function render_list() {
    let element = d3.select("#db-list");

    //clear the list
    element.html(null);

    //get the list of titles
    let ul = element.append("ul").classed("list-group", true);

    //put each title into a li

    db.find<DataTable>({}, (err, docs) => {
        console.log("docs", docs);

        ul.selectAll("li")
            .data(docs).enter()
            .append("li")
            .classed("list-group-item", true)
            .text((d) => { return d.title })

            .on("click", (d) => {
                console.log("li clicked", d);

                //set the active doc
                active_table = d;

                //render this table
                let newTable = new D3Table(d);
                d3.select("#main-col").html(null);
                newTable.render("#main-col");

                //refresh the editor
                refresh_editor();
            });
    })
}

function refresh_editor() {
    //set the textbox value equal to the title
    let editor = d3.select("#edit-title");
    console.log("text", editor.property("value"))
}

d3.select("#edit-save").on("click", () => {
    if (active_table !== null) {
        console.log("active table", active_table);

        let editor = d3.select("#edit-title");
        active_table.title = editor.property("value");

        db.update({ _id: active_table._id }, active_table, {}, (err, num) => {
            console.log("update", err, num);
            render_list();
        })
    }
})

let active_table: DataTable;

count_records();
render_list();