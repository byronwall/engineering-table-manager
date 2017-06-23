"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nedb = require("nedb");
const d3 = require("d3");
const DataTable_1 = require("./DataTable");
const D3Table_1 = require("./D3Table");
const electron_1 = require("electron");
electron_1.ipcRenderer.on('test', (event, arg) => {
    //this will respond to the global keyboard shortcut... need to focus on the search
    console.log("args from IPC", arg); // prints "pong"
});
//TODO: generalize this code
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
function render_list() {
    let element = d3.select("#db-list");
    //clear the list
    element.html(null);
    //get the list of titles
    let ul = element.append("ul").classed("list-group", true);
    //put each title into a li
    db.find({}, (err, _docs) => {
        let docs = DataTable_1.DataTable.transformJsonArrToType(_docs);
        console.log("docs", docs);
        let li = ul.selectAll("li")
            .data(docs).enter()
            .append("li")
            .classed("list-group-item", true)
            .text((d) => { return d.title; });
        let delete_label = li.append("span")
            .text("delete")
            .classed("label", true)
            .classed("label-danger", true);
        li.on("click", (d) => {
            console.log("li clicked", d);
            //set the active doc
            active_table = d;
            //render this table
            let newTable = new D3Table_1.D3Table(d);
            d3.select("#main-col").html(null);
            newTable.render("#main-col");
            //refresh the editor
            refresh_editor();
        });
        delete_label.on("click", (d) => {
            console.log("attempt delete", d, d.dbId);
            db.remove(d.dbId, (err, num) => {
                console.log("deleted?", err, num);
                render_list();
            });
            d3.event.stopPropagation();
        });
    });
}
function refresh_editor() {
    //set the textbox value equal to the title
    let editor = d3.select("#edit-title");
    console.log("text", editor.property("value"));
}
d3.select("#edit-save").on("click", () => {
    if (active_table !== null) {
        console.log("active table", active_table);
        let editor = d3.select("#edit-title");
        active_table.title = editor.property("value");
        db.update({ _id: active_table._id }, active_table, {}, (err, num) => {
            console.log("update", err, num);
            render_list();
        });
    }
});
let active_table;
count_records();
render_list();
//# sourceMappingURL=app.js.map