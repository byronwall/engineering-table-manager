import * as nedb from "nedb";
import * as d3 from "d3";

class DataTable {
    data: {}[] = [];
    columns: string[] = [];
    row_headers: string[] = [];

    static FromString(input: string): DataTable {
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
                } else {
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

class D3Table {
    data: DataTable;
    constructor(data: DataTable) {
        this.data = data;
    }

    render(elementId: string) {
        let container = d3.select(elementId);

        console.log("render", elementId, container)

        container.empty();


        let table = container.append("table");
        let thead = table.append('thead')
        let tbody = table.append('tbody');

        // append the header row
        thead.append('tr')
            .selectAll('th')
            .data(this.data.columns).enter()
            .append('th')
            .text(function (column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
            .data(this.data.data)
            .enter()
            .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
            .data((row) => {
                return this.data.columns.map(function (column) {
                    return { column: column, value: row[column] };
                });
            })
            .enter()
            .append('td')
            .text(function (d) { return d.value; });

    }
}

let db = new nedb();

let input = document.getElementById("table-in") as HTMLTextAreaElement;

document.getElementById("btn-submit").onclick = () => {
    //create new table
    console.log("click event");

    let new_table = DataTable.FromString(input.value);

    console.log(new_table);

    //add record
    db.insert(new_table, () => {
        console.log("inserted");
    })

    //display the record as a table
    db.find<DataTable>({}, (err, docs) => {
        console.log("docs", docs);

        let newTable = new D3Table(docs[0]);
        newTable.render("#main-col");
    })

}
