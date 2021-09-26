window.onload = init;
let prizeOrderedAsc = false;
let amountOrderedAsc = false;

function init() {
    $.ajax({
        url: "/Values/GetAllProductTypes",
        async: false,
        success: function (allProductTypes) {
            let optionAll = document.createElement("option");
            optionAll.id = "00000000-0000-0000-0000-000000000000";
            optionAll.value = "Alle";
            optionAll.text = "Alle";
            document.getElementById("my_select").appendChild(optionAll);
            for (let i = 0; i < allProductTypes.length; i++) {
                let option = document.createElement("option");
                option.id = allProductTypes[i].id;
                option.value = allProductTypes[i].produkt_Art;
                option.text = allProductTypes[i].produkt_Art;
                document.getElementById("my_select").appendChild(option);
            }
        }
    });
}

function GetOrdersBetweenDates(orderFunction) {
    if (orderFunction === undefined) {
        orderFunction = (a, b) => (a.amount < b.amount) ? 1 : -1;
        amountOrderedAsc = true;
    }
    $("#orderedProductsTable").find("tr:gt(0)").remove();
    let idOfProductType = $("#my_select option:selected").attr("id");
    let dateFrom = $("#dateFrom").val();
    let dateUntil = $("#dateUntil").val();
    $.ajax({
        url: "/Values/GetOrderedProductsAdmin" + "?" + $.param({ "dateFrom": dateFrom, "dateUntil": dateUntil, "idProductType": idOfProductType }),
        async: false,
        success: function (allOrderedProducts) {
            allOrderedProducts.sort(orderFunction);
            for (var i = 0; i < allOrderedProducts.length; i++) {
                $('<tr/>', {
                    id: allOrderedProducts[i].iD_Product
                }).appendTo('.tableOrderedProducts');
                $('<td/>', {
                    html: allOrderedProducts[i].productName
                }).appendTo("#" + allOrderedProducts[i].iD_Product);
                $('<td/>', {
                    html: allOrderedProducts[i].amount + "x"
                }).appendTo("#" + allOrderedProducts[i].iD_Product);
                $('<td/>', {
                    html: allOrderedProducts[i].prize.toFixed(2) + " €"
                }).appendTo("#" + allOrderedProducts[i].iD_Product);
            }
        }
    })
}

function OrderTableByAmount() {
    if (!amountOrderedAsc) {
        GetOrdersBetweenDates((a, b) => (a.amount < b.amount) ? 1 : -1);
        amountOrderedAsc = true;
    }
    else {
        GetOrdersBetweenDates((a, b) => (a.amount > b.amount) ? 1 : -1);
        amountOrderedAsc = false;
    }
}

function OrderTableByPrize() {
    if (!prizeOrderedAsc) {
        GetOrdersBetweenDates((a, b) => (a.prize < b.prize) ? 1 : -1);
        prizeOrderedAsc = true;
    }
    else {
        GetOrdersBetweenDates((a, b) => (a.prize > b.prize) ? 1 : -1);
        prizeOrderedAsc = false;
    } 
}