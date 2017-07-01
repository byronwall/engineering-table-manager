
import { ipcRenderer } from "electron";


document.addEventListener("click", function (e) {
    var hoveredEl = e.target as HTMLElement;

    let parent = hoveredEl;
    //search for the table parent
    while (parent.tagName !== "TABLE") {

        parent = parent.parentElement;
        if (parent.tagName === "BODY") {
            break;
        }
    }

    var $ = require("jquery");

    if (parent.tagName !== "TABLE") {
        return;
    }

    //do the scraping logic
    let tableHtml = parent.outerHTML;

    //need to parse the table down here, then feed it back to the main table saver
    let table = $(tableHtml);

    let newTable = $("<table></table>");
    let newTHead = $("<thead></thead>").appendTo(newTable);
    let newTBody = $("<tbody></tbody>").appendTo(newTable);

    console.log(table.children());

    for (var tblChild of table.children()) {
        console.log("tblChild", tblChild);

        if (tblChild.tagName == "THEAD") {
            for (var theadChild of $(tblChild).children()) {
                console.log("theadChild", theadChild);

                if (theadChild.tagName == "TR") {
                    let isHeaderRow = false;
                    let headers: HTMLElement[] = [];

                    for (var theadTrChild of $(theadChild).children()) {
                        console.log("theadTrChild", theadTrChild);

                        if (theadTrChild.tagName == "TH") {
                            isHeaderRow = true;
                            headers.push(theadTrChild);
                        }
                    }

                    if (isHeaderRow) {
                        //spit these back into the header
                        let newTheadTr = $("<tr></tr>").appendTo(newTHead);

                        for (var header of headers) {

                            //keep only the text
                            let newHeader = $("<th></th>").text($(header).text().trim());
                            newTheadTr.append(newHeader);
                        }
                    }
                }
            }
        }

        if (tblChild.tagName == "TBODY") {
            for (var theadChild of $(tblChild).children()) {
                console.log("theadChild", theadChild);

                if (theadChild.tagName == "TR") {
                    let isHeaderRow = false;
                    let headers: HTMLElement[] = [];

                    for (var theadTrChild of $(theadChild).children()) {
                        console.log("theadTrChild", theadTrChild);

                        if (theadTrChild.tagName == "TD") {
                            isHeaderRow = true;
                            headers.push(theadTrChild);
                        }
                    }

                    if (isHeaderRow) {
                        //spit these back into the header
                        let newTheadTr = $("<tr></tr>").appendTo(newTBody);

                        for (var header of headers) {

                            //this only grabs the leaf nodes that are visible
                            let headerLeafs = $(header).find(':not(:has(*))').filter(
                                function () { return $(this).css('display') != 'none'; });

                            let headerText = headerLeafs.text();

                            let newHeader = $("<td></td>").text(headerText);
                            newTheadTr.append(newHeader);
                        }
                    }
                }
            }
        }
    }

    let newHtml = newTable[0].outerHTML;

    ipcRenderer.sendToHost("click", tableHtml, newHtml);
});