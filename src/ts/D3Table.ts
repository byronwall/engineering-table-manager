import { DataTable } from "./DataTable";
import * as d3 from "d3";

export class D3Table {
    data: DataTable;
    constructor(data: DataTable) {
        this.data = data;
    }

    render(elementId: string) {
        let container = d3.select(elementId);

        console.log("render", elementId, container)

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