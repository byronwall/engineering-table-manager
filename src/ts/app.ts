import * as nedb from "nedb";
import * as d3 from "d3";

import { DataTable } from "./DataTable";
import { D3Table } from "./D3Table";

import { remote, ipcRenderer } from "electron";

ipcRenderer.on('test', (event, arg) => {
    //this will respond to the global keyboard shortcut... need to focus on the search
    console.log("args from IPC", arg); // prints "pong"
});

//TODO: generalize this code
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

    db.find({}, (err, _docs) => {

        let docs = DataTable.transformJsonArrToType(_docs);

        console.log("docs", docs);

        let li = ul.selectAll("li")
            .data(docs).enter()
            .append("li")
            .classed("list-group-item", true)
            .text((d) => { return d.title });

        let delete_label = li.append("span")
            .text("delete")
            .classed("label", true)
            .classed("label-danger", true);

        li.on("click", (d) => {
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

        delete_label.on("click", (d) => {
            console.log("attempt delete", d, d.dbId);
            db.remove(d.dbId, (err, num) => {
                console.log("deleted?", err, num)

                render_list();
            });

            d3.event.stopPropagation();
        })
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

//TODO: this active_table really needs to be a part of a larger Type
let active_table: DataTable;

count_records();
render_list();

//TODO: move this scraper code to its own Webview type class

import * as $ from "jquery";

let webview = document.getElementById("scraper");

interface WebViewEvent extends Event {
    args: any[];
}

webview.addEventListener("dom-ready", function () {
    //this will open the dev tools for the webview if needed
    //webview.openDevTools();
});
webview.addEventListener("ipc-message", function (e: WebViewEvent) {

    //TODO: right now the processing takes place in the WebView to determine visibility.

    let tableHtml = e.args[0];
    let newHtml = e.args[1];

    console.log("newHTML", newHtml);
    $("#table-in").val(newHtml)

    //import is ready to take place... create a new DataTable

    //TODO: instead of moving text to the TEXTAREA, go ahead and create the DataTable

});