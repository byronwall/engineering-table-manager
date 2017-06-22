"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
class D3Table {
    constructor(data) {
        this.data = data;
    }
    render(elementId) {
        let container = d3.select(elementId);
        console.log("render", elementId, container);
        let table = container.append("table");
        let thead = table.append('thead');
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
exports.D3Table = D3Table;
//# sourceMappingURL=D3Table.js.map