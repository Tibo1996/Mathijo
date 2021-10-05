function init() {
    document.getElementById("mainContainer").innerHTML = "";
    $.ajax({
        url: "/Values/GetSortedActiveOrders",
        async: false,
        success: function (orders) {
            for (let i = 0; i < orders.length; i++) {
                $.ajax({
                    url: "/Values/GetOrderedProducts" + "?" + $.param({ "idOrder": orders[i].id }),
                    async: false,
                    success: function (orderedProducts) {
                        if (orderedProducts.length !== 0) {
                            $.ajax({
                                url: "/Values/GetTableNumberByID" + "?" + $.param({ "idTable": orders[i].iD_Tisch }),
                                async: false,
                                success: function (tableNumber) {
                                    CreateTable(i, tableNumber);
                                    for (var j = 0; j < orderedProducts.length; j++) {
                                        $('<tr/>', {
                                            class: "orderRowWithID" + orderedProducts[j].iD_Produkt,
                                            id: orderedProducts[j].id
                                        }).appendTo("#tbody" + i);
                                        $('<td/>', {
                                            html: orderedProducts[j].menge + "x",
                                            onclick: "Finished(this)",
                                            style: "cursor: pointer; border: 1px solid gray; background-color: black; width: 15%;"
                                        }).appendTo("#" + orderedProducts[j].id);
                                        $.ajax({
                                            url: "/Values/GetProductByID" + "?" + $.param({ "idProduct": orderedProducts[j].iD_Produkt }),
                                            async: false,
                                            success: function (productByID) {
                                                $('<td/>', {
                                                    html: productByID.produktName,
                                                    style: "width: 85%;"
                                                }).appendTo("#" + orderedProducts[j].id);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    setTimeout(init, 5000);
}

init();

function CreateTable(counter, tNumber) {
    let wholeNewDiv = document.createElement("div");
    wholeNewDiv.setAttribute("class", "newOrdersForTable");
    wholeNewDiv.setAttribute("id", "newOrder" + counter);
    document.getElementById("mainContainer").appendChild(wholeNewDiv);

    let table = document.createElement("table");
    table.setAttribute("class", "table table-dark table-hover");
    table.setAttribute("style", "word-wrap: break-word;");
    table.setAttribute("id", "table" + counter);
    document.getElementById("newOrder" + counter).appendChild(table);

    let thead = document.createElement("thead");
    thead.setAttribute("id", "thead" + counter);
    document.getElementById("table" + counter).appendChild(thead);

    let tr = document.createElement("tr");
    tr.setAttribute("id", "tr" + counter);
    tr.setAttribute("style", "background-color: #282828; border: 1px solid black;")
    document.getElementById("thead" + counter).appendChild(tr);

    let thName = document.createElement("th");
    thName.innerHTML = "Tisch Nr. " + tNumber;
    thName.setAttribute("colspan", "2");
    document.getElementById("tr" + counter).appendChild(thName);

    let tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody" + counter);
    document.getElementById("table" + counter).appendChild(tbody);
}

function Finished(row) {
}