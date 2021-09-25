function GetOrdersBetweenDates() {
    let dateFrom = $("#dateFrom").val();
    let dateUntil = $("#dateUntil").val();
    $.ajax({
        url: "/Values/GetOrdersAndOrderedProducts" + "?" + $.param({ "dateFrom": dateFrom, "dateUntil": dateUntil }),
        async: false,
        success: function (allOrdersAndOrderedProducts) {
            allOrdersAndOrderedProducts.sort(custom_sort);
            for (var i = 0; i < allOrdersAndOrderedProducts.length; i++) {
                $('<tr/>', {
                    id: allOrdersAndOrderedProducts[i].iD_Order
                }).appendTo('.tableOrders');
                let createdTD1 = document.createElement("td");
                createdTD1.innerHTML = "Tisch " + allOrdersAndOrderedProducts[i].tableNumber;
                document.getElementById(allOrdersAndOrderedProducts[i].iD_Order).appendChild(createdTD1);
                let createdTD2 = document.createElement("td");
                createdTD2.innerHTML = new Date(allOrdersAndOrderedProducts[i].date).toLocaleString();
                document.getElementById(allOrdersAndOrderedProducts[i].iD_Order).appendChild(createdTD2);
                let createdTD3 = document.createElement("td");
                var wholeProductString = "";
                for (var j = 0; j < allOrdersAndOrderedProducts[i].orderedProducts.length; j++) {
                    let totalPrize = allOrdersAndOrderedProducts[i].orderedProducts[j].amount * allOrdersAndOrderedProducts[i].orderedProducts[j].prize;
                    wholeProductString += allOrdersAndOrderedProducts[i].orderedProducts[j].amount + "x " + allOrdersAndOrderedProducts[i].orderedProducts[j].productName +
                        "  " + totalPrize.toFixed(2) + " €" + "<br>";
                }
                createdTD3.innerHTML = wholeProductString;
                document.getElementById(allOrdersAndOrderedProducts[i].iD_Order).appendChild(createdTD3);
                let createdTD4 = document.createElement("td");
                createdTD4.innerHTML = allOrdersAndOrderedProducts[i].totalPrize.toFixed(2) + " €";
                document.getElementById(allOrdersAndOrderedProducts[i].iD_Order).appendChild(createdTD4);
            }
        }
    })
}

function custom_sort(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}