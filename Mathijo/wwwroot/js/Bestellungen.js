window.onload = init;

function init() {
    $.ajax({
        url: "/Values/IsLoggedIn",
        async: false,
        success: function (worked) {
            if (worked === false) {
                location.href = "/Home/Error";
            }
        }
    })
}

function GetOrdersBetweenDates() {
    $("#ordersTable").find("tr:gt(0)").remove();
    let dateFrom = $("#dateFrom").val();
    let dateUntil = $("#dateUntil").val();
    $.ajax({
        url: "/Values/GetOrdersAndOrderedProducts" + "?" + $.param({ "dateFrom": dateFrom, "dateUntil": dateUntil }),
        async: false,
        success: function (allOrdersAndOrderedProducts) {
            allOrdersAndOrderedProducts.orderList.sort(custom_sort);
            for (var i = 0; i < allOrdersAndOrderedProducts.orderList.length; i++) {
                $('<tr/>', {
                    id: allOrdersAndOrderedProducts.orderList[i].iD_Order
                }).appendTo('.tableOrders');
                let createdTD1 = document.createElement("td");
                createdTD1.innerHTML = "Tisch " + allOrdersAndOrderedProducts.orderList[i].tableNumber;
                document.getElementById(allOrdersAndOrderedProducts.orderList[i].iD_Order).appendChild(createdTD1);
                let createdTD2 = document.createElement("td");
                createdTD2.innerHTML = new Date(allOrdersAndOrderedProducts.orderList[i].date).toLocaleString();
                document.getElementById(allOrdersAndOrderedProducts.orderList[i].iD_Order).appendChild(createdTD2);
                let createdTD3 = document.createElement("td");
                var wholeProductString = "";
                for (var j = 0; j < allOrdersAndOrderedProducts.orderList[i].orderedProducts.length; j++) {
                    let totalPrize = allOrdersAndOrderedProducts.orderList[i].orderedProducts[j].amount * allOrdersAndOrderedProducts.orderList[i].orderedProducts[j].prize;
                    wholeProductString += allOrdersAndOrderedProducts.orderList[i].orderedProducts[j].amount + "x " + allOrdersAndOrderedProducts.orderList[i].orderedProducts[j].productName +
                        "  " + totalPrize.toFixed(2) + " €" + "<br>";
                }
                createdTD3.innerHTML = wholeProductString;
                document.getElementById(allOrdersAndOrderedProducts.orderList[i].iD_Order).appendChild(createdTD3);
                let createdTD4 = document.createElement("td");
                createdTD4.innerHTML = allOrdersAndOrderedProducts.orderList[i].totalPrize.toFixed(2) + " €";
                document.getElementById(allOrdersAndOrderedProducts.orderList[i].iD_Order).appendChild(createdTD4);
            }
            $("#totalSalesInThatTime").html("Gesamtumsatz in dieser Zeit: <b>" + allOrdersAndOrderedProducts.totalSales.toFixed(2) + " €</b>");
        }
    })
}

function custom_sort(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}