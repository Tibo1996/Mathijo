window.onload = Init;
var tableOrderNumber;
var productsInSubTotal = [];
var ecsNoTable = {
    "displayableMessage": "Wählen Sie zuerst einen Tisch aus!",
    "title": "Fehler",
    "code": 2,
    "displayType": 2
}

function Init() {
    $.ajax({
        url: "/Values/GetAllProductTypes",
        async: false,
        success: function (productTypes) {
            for (let i = 0; i < productTypes.length; i++) {
                $('<button/>', {
                    type: 'button',
                    text: productTypes[i].produkt_Art,
                    class: 'btn btn-primary btnDishes',
                    id: productTypes[i].id,
                    onclick: 'GetProducts(this)'
                }).appendTo('.allButtonsForDishes');
            }
            $('<button/>', {
                id: 'adminButton',
                type: 'button',
                text: 'Admin',
                class: 'btn btn-danger btnDishes'
            }).appendTo('.allButtonsForDishes');
            document.getElementById("adminButton").setAttribute("data-toggle", "modal");
            document.getElementById("adminButton").setAttribute("data-target", "#myModal");
        }
    });
    $.ajax({
        url: "/Values/GetTables",
        async: false,
        success: function (tables) {
            for (let i = 0; i < tables.length; i++) {
                $('<button/>', {
                    type: 'button',
                    text: tables[i].tischnummer,
                    class: 'btn btn-dark btnTables',
                    id: tables[i].id,
                    onclick: "SetOrderHeader(this)"
                }).appendTo('.chooseTable');
            }
        }
    });
    $.ajax({
        url: "/Values/GetOrderForTable",
        async: false,
        success: function (orders) {
            for (let i = 0; i < orders.length; i++) {
                $("#" + orders[i].iD_Tisch).addClass(orders[i].id);
            }
        }
    });
}

function GetProducts(button) {
    $(".allDishes").find("tr:gt(0)").remove();
    $.ajax({
        type: "Post",
        url: "/Values/GetProductsOfProductType" + "?" + $.param({ "idProductType": button.id }),
        async: false,
        success: function (products) {
            $(".allButtonsForDishes").css("display", "none");
            $(".allDishes").css("display", "block");
            $(".backButton").css("display", "inline");
            for (var i = 0; i < products.length; i++) {
                $('<tr/>', {
                    id: products[i].id
                }).appendTo('.tableBodyProducts');
                $('<td/>', {
                    html: products[i].produktName
                }).appendTo('#' + products[i].id);
                $('<td/>', {
                    html: products[i].preis.toFixed(2) + " €"
                }).appendTo('#' + products[i].id);
                $('<td/>', {
                    html: '<button class="btn btn-success" style="padding-top: 5px; padding-bottom: 8px;" onclick="AddToOrder(this)"><b>+</b></button>'
                }).appendTo('#' + products[i].id);
            }
        }
    });
}

function AddToOrder(button) {
    if ($("#idOfOrder").attr("id") === "idOfOrder") {
        requestStatusModal(ecsNoTable);
    }
    else {
        let alreadyExists = false;
        let tableInfo = $("#rightSideTable tr");
        for (var i = 0; i < tableInfo.length; i++) {
            if (tableInfo[i].classList[0] === 'orderRowWithID' + button.parentElement.parentElement.id) {
                $.ajax({
                    url: "/Values/UpdateOrderedProductPlus" + "?" + $.param({ "idOrderedProduct": tableInfo[i].id }),
                    async: false,
                    success: function () {
                        alreadyExists = true;
                        let count = tableInfo[i].cells[0].innerHTML.replace('x', '');
                        let prize = tableInfo[i].cells[2].innerHTML.replace(' €', '');
                        let initialPrize = parseFloat(prize) / count;
                        count++;
                        let newPrize = parseFloat(prize) + initialPrize;
                        tableInfo[i].cells[2].innerHTML = newPrize.toFixed(2) + " €";
                        tableInfo[i].cells[0].innerHTML = count + "x";
                    }
                });
            }
        }
        if (alreadyExists !== true) {
            let orderData = {
                "ID_Produkt": button.parentElement.parentElement.id, "ID_Bestellung": $(".chooseTable").children(".btn.btn-warning.btnTables")[0].classList[3]
            }
            $.ajax({
                type: "Post",
                url: "/Values/CreateOrderedProduct",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(orderData),
                async: false,
                success: function (orderProductID) {
                    $('<tr/>', {
                        class: "orderRowWithID" + button.parentElement.parentElement.id,
                        id: orderProductID
                    }).appendTo('.tableBodyOrderedProducts');
                    $('<td/>', {
                        html: "1x",
                        onclick: "AddToSubTotal(this)",
                        style: "cursor: pointer; border: 1px solid gray; background-color: black;"
                    }).appendTo('.' + "orderRowWithID" + button.parentElement.parentElement.id);
                    $('<td/>', {
                        html: button.parentElement.parentElement.cells[0].innerHTML
                    }).appendTo('.' + "orderRowWithID" + button.parentElement.parentElement.id);
                    $('<td/>', {
                        html: button.parentElement.parentElement.cells[1].innerHTML
                    }).appendTo('.' + "orderRowWithID" + button.parentElement.parentElement.id);
                    $('<td/>', {
                        html: '<button class="btn btn-success" style="padding-top: 5px; padding-bottom: 8px;" onclick="AddOneMore(this)"><b>+</b></button>'
                    }).appendTo('.' + "orderRowWithID" + button.parentElement.parentElement.id);
                    $('<td/>', {
                        html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px; padding-left: 14px; padding-right: 14px;" onclick="DeleteOne(this)"><b>-</b></button>'
                    }).appendTo('.' + "orderRowWithID" + button.parentElement.parentElement.id);
                },
                failure: function (r) {
                    console.log(r);
                },
                error: function (r) {
                    console.log(r);
                }
            });
        }
        CalculateSum();
    }

}

function ResetPage() {
    $(".allButtonsForDishes").css("display", "inline-block");
    $(".allDishes").css("display", "none");
    $(".backButton").css("display", "none");
}

function SetOrderHeader(button) {
    $(".tableOrder").find("tr:gt(0)").remove();
    if (button.classList[3] === undefined) {
        $.ajax({
            type: "Post",
            url: "/Values/CreateNewOrder" + "?" + $.param({ "idTisch": button.id }),
            async: false,
            success: function (idOrder) {
                $("#" + button.id).addClass(idOrder);
            }
        });
    }
    else {
        $.ajax({
            url: "/Values/GetOrderedProducts" + "?" + $.param({ "idOrder": button.classList[3] }),
            async: false,
            success: function (orderedProducts) {
                for (let i = 0; i < orderedProducts.length; i++) {
                    $('<tr/>', {
                        class: "orderRowWithID" + orderedProducts[i].iD_Produkt,
                        id: orderedProducts[i].id
                    }).appendTo('.tableBodyOrderedProducts');
                    $('<td/>', {
                        html: orderedProducts[i].menge + "x",
                        onclick: "AddToSubTotal(this)",
                        style: "cursor: pointer; border: 1px solid gray; background-color: black;"
                    }).appendTo('.' + "orderRowWithID" + orderedProducts[i].iD_Produkt);
                    $.ajax({
                        url: "/Values/GetProductByID" + "?" + $.param({ "idProduct": orderedProducts[i].iD_Produkt }),
                        async: false,
                        success: function (productByID) {
                            $('<td/>', {
                                html: productByID.produktName
                            }).appendTo('.' + "orderRowWithID" + orderedProducts[i].iD_Produkt);
                            let totalPrize = orderedProducts[i].menge * productByID.preis;
                            $('<td/>', {
                                html: totalPrize.toFixed(2) + " €"
                            }).appendTo('.' + "orderRowWithID" + orderedProducts[i].iD_Produkt);
                        }
                    });
                    $('<td/>', {
                        html: '<button class="btn btn-success" style="padding-top: 5px; padding-bottom: 8px;" onclick="AddOneMore(this)"><b>+</b></button>'
                    }).appendTo('.' + "orderRowWithID" + orderedProducts[i].iD_Produkt);
                    $('<td/>', {
                        html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px; padding-left: 14px; padding-right: 14px;" onclick="DeleteOne(this)"><b>-</b></button>'
                    }).appendTo('.' + "orderRowWithID" + orderedProducts[i].iD_Produkt);
                }
            }
        });
    }

    let allButtonsInfo = $(".btnTables")
    for (var i = 0; i < allButtonsInfo.length; i++) {
        if (allButtonsInfo[i].classList[3] === undefined) {
            $("#" + allButtonsInfo[i].id).attr("class", "btn btn-dark btnTables");
        }
        else {
            $("#" + allButtonsInfo[i].id).attr("class", "btn btn-dark btnTables " + allButtonsInfo[i].classList[3]);
        }

    }
    $("#" + button.id).attr("class", "btn btn-warning btnTables " + button.classList[3]);

    $(".orderHeader").attr("id", button.id);
    tableOrderNumber = button.innerHTML;
    $(".orderHeader").html("<center><span><b>Bestellung Tisch-Nr. " + tableOrderNumber + "</b></span></center>");
    CalculateSum();
    SetSubTotalToZero();
    productsInSubTotal = [];
}

function AddOneMore(button) {
    $.ajax({
        url: "/Values/UpdateOrderedProductPlus" + "?" + $.param({ "idOrderedProduct": button.parentElement.parentElement.id }),
        async: false,
        success: function () {
            let count = button.parentElement.parentElement.firstChild.innerHTML.replace('x', '');
            let prize = button.parentElement.parentElement.cells[2].innerHTML.replace(' €', '');
            let initialPrize = parseFloat(prize) / count;
            count++;
            let newPrize = parseFloat(prize) + initialPrize;
            button.parentElement.parentElement.cells[2].innerHTML = newPrize.toFixed(2) + " €";
            button.parentElement.parentElement.firstChild.innerHTML = count + "x";
            CalculateSum();
        }
    });
}

function DeleteOne(button) {
    let count = button.parentElement.parentElement.firstChild.innerHTML.replace('x', '');
    if (count === "1") {
        $.ajax({
            url: "/Values/DeleteOrderedProduct" + "?" + $.param({ "idOrderedProduct": button.parentElement.parentElement.id }),
            async: false,
            success: function () {
                $("." + button.parentElement.parentElement.classList[0]).remove();
            }
        });

    }
    else {
        $.ajax({
            url: "/Values/UpdateOrderedProductMinus" + "?" + $.param({ "idOrderedProduct": button.parentElement.parentElement.id }),
            async: false,
            success: function () {
                button.parentElement.parentElement.firstChild.innerHTML = count + "x";
                let prize = button.parentElement.parentElement.cells[2].innerHTML.replace(' €', '');
                let initialPrize = parseFloat(prize) / count;
                count--;
                let newPrize = parseFloat(prize) - initialPrize;
                button.parentElement.parentElement.cells[2].innerHTML = newPrize.toFixed(2) + " €";
                button.parentElement.parentElement.firstChild.innerHTML = count + "x";
            }
        });
    }
    CalculateSum();
}

function FinishOrder() {
    let allButtonsInfo = $(".btnTables");
    for (var i = 0; i < allButtonsInfo.length; i++) {
        if ($("#" + allButtonsInfo[i].id).hasClass("btn-warning")) {
            $.ajax({
                url: "/Values/FinishOrder" + "?" + $.param({ "idOrder": allButtonsInfo[i].classList[3] }),
                async: false,
                success: function () {
                    $("#" + allButtonsInfo[i].id).attr("class", "btn btn-outline-dark btnTables");
                    location.reload();
                }
            });
        }
    }

}

function CalculateSum() {
    let totalAmount = 0;
    let tableInfo = $("#rightSideTable tr");
    for (var i = 1; i < tableInfo.length; i++) {
        let prizeOfSingleRow = tableInfo[i].cells[2].innerHTML.replace(' €', '');
        totalAmount += parseFloat(prizeOfSingleRow);
    }
    $("#totalAmount").html(totalAmount.toFixed(2) + " €");
}

function AddToSubTotal(tableCell) {
    let count = tableCell.innerHTML.replace('x', '');
    if (count === "1") {
        let subTotal = document.getElementById("subtotalAmount").innerText.replace(' €', '');
        let addedAmount = tableCell.parentElement.cells[2].innerHTML.replace(' €', '');
        let totalSubTotal = parseFloat(subTotal) + parseFloat(addedAmount);
        document.getElementById("subtotalAmount").innerText = totalSubTotal.toFixed(2) + " €";
        $("." + tableCell.parentElement.classList[0]).remove();
    }
    else {
        let prize = tableCell.parentElement.cells[2].innerHTML.replace(' €', '');
        let initialPrize = parseFloat(prize) / count;
        count--;
        let newPrize = parseFloat(prize) - initialPrize;
        tableCell.parentElement.cells[2].innerHTML = newPrize.toFixed(2) + " €";
        tableCell.innerHTML = count + "x";
        let subTotal = document.getElementById("subtotalAmount").innerText.replace(' €', '');
        let totalSubTotal = parseFloat(subTotal) + initialPrize;
        document.getElementById("subtotalAmount").innerText = totalSubTotal.toFixed(2) + " €";
    }
    productsInSubTotal.push(tableCell.parentElement.id);
    CalculateSum();
}

function ClearSubTotal() {
    for (var i = 0; i < productsInSubTotal.length; i++) {
        $.ajax({
            type: "Get",
            url: "/Values/UpdateOrderedProductPaid" + "?" + $.param({ "idOrderedProduct": productsInSubTotal[i] }),
            async: false,
            success: function () {
            }
        });
    }
    SetSubTotalToZero();
    productsInSubTotal = [];

    if ($("#totalAmount").html() === "0.00 €") {
        FinishOrder();
    }
}

function SetSubTotalToZero() {
    $("#subtotalAmount").html("0.00 €");
}

function CheckPassword() {
    let passwordInput = $("#passwordInput").val();
    $.ajax({
        type: "Post",
        url: "/Values/CheckPassword" + "?" + $.param({ "passwordInput": passwordInput }),
        async: false,
        success: function (ecs) {
            if (ecs.code === 2) {
                requestStatusModal(ecs);
            }
            else {
                location.href = "/Home/Produktarten";
            }
        }
    })
}