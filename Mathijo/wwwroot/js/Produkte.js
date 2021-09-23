window.onload = init;
var idOfProductType;
var ecsDelete = {
    "displayableMessage": "Wollen Sie dieses Produkt wirklich löschen?",
    "title": "Warnung",
    "code": 1,
    "displayType": 2
}
var ecsProdukt = {
    "displayableMessage": "Geben Sie einen Produktname an",
    "title": "Fehler",
    "code": 2,
    "displayType": 2
}
var ecsPreis = {
    "displayableMessage": "Geben Sie einen Preis an",
    "title": "Fehler",
    "code": 2,
    "displayType": 2
}

function init() {
    CreateSelectBox();
    idOfProductType = $("#my_select option:selected").attr("id");
    $.ajax({
        type: "Post",
        url: "/Values/GetProductsOfProductType" + "?" + $.param({ "idProductType": idOfProductType }),
        success: function (allProducts) {
            for (var i = 0; i < allProducts.length; i++) {
                $('<tr/>', {
                    id: allProducts[i].id
                }).appendTo('.tableProducts');
                let createdTD = document.createElement("td");
                createdTD.setAttribute("contenteditable", "true");
                createdTD.innerHTML = allProducts[i].produktName;
                document.getElementById(allProducts[i].id).appendChild(createdTD);
                let createdTD2 = document.createElement("td");
                createdTD2.setAttribute("contenteditable", "true");
                createdTD2.innerHTML = allProducts[i].preis.toFixed(2);
                document.getElementById(allProducts[i].id).appendChild(createdTD2);
                $('<td/>', {
                    html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowProduct(this)"><b>-</b></button>'
                }).appendTo('#' + allProducts[i].id);
            }
        }
    })
}

function SaveChangesProduct() {
    let rowInfo = $("#productTable tr");
    let ecsInfo;
    for (var i = 1; i < rowInfo.length; i++) {
        let productData = {
            "IDProduct": rowInfo[i].id, "ProductName": rowInfo[i].firstChild.innerHTML, "Prize": rowInfo[i].cells[1].innerHTML
        }
        $.ajax({
            type: "Post",
            url: "/Values/UpdateProduct",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(productData),
            async: false,
            success: function (ecs) {
                ecsInfo = ecs;
            }
        })
    }
    requestStatusModal(ecsInfo);
}

function AddNewProduct() {
    let newProduct = $("#newEnteredProduct").val();
    let newPrize = $("#newEnteredPrize").val();
    if (newProduct === "") {
        requestStatusModal(ecsProdukt);
        return;
    }
    if (newPrize === "") {
        requestStatusModal(ecsPreis);
        return;
    }
    let productData = {
        "IDProductType": $("#my_select option:selected").attr("id"), "ProductName": newProduct, "Prize": newPrize
    }
    $.ajax({
        type: "Post",
        url: "/Values/CreateNewProduct",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(productData),
        async: false,
        success: function (guidAndECS) {
            if (guidAndECS.ecs.code === 0) {
                $('<tr/>', {
                    id: guidAndECS.newID
                }).appendTo('.tableProducts');
                let createdTD = document.createElement("td");
                createdTD.setAttribute("contenteditable", "true");
                createdTD.innerHTML = newProduct;
                document.getElementById(guidAndECS.newID).appendChild(createdTD);
                let createdTD2 = document.createElement("td");
                createdTD2.setAttribute("contenteditable", "true");
                createdTD2.innerHTML = parseFloat(newPrize).toFixed(2);
                document.getElementById(guidAndECS.newID).appendChild(createdTD2);
                $('<td/>', {
                    html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowProduct(this)"><b>-</b></button>'
                }).appendTo('#' + guidAndECS.newID);
                $("#newEnteredProduct").val("");
                $("#newEnteredPrize").val("");
            }
            requestStatusModal(guidAndECS.ecs)
        }
    })
}

function DeleteRowProduct(row) {
    let idOfProduct = row.parentElement.parentElement.id;
    requestYesNoModal(ecsDelete, function () {
        $.ajax({
            url: "/Values/DeleteProduct" + "?" + $.param({ "idProduct": idOfProduct }),
            async: false,
            success: function (ecs) {
                if (ecs.code === 0) {
                    $("#" + row.parentElement.parentElement.id).remove();
                }
                requestStatusModal(ecs);
            }
        })
    })

}

function CreateSelectBox() {
    $.ajax({
        url: "/Values/GetAllProductTypes",
        async: false,
        success: function (allProductTypes) {
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

$("#my_select").change(function () {
    $("#productTable").find("tr:gt(0)").remove();
    idOfProductType = $(this).children(":selected").attr("id");
    $.ajax({
        type: "Post",
        url: "/Values/GetProductsOfProductType" + "?" + $.param({ "idProductType": idOfProductType }),
        success: function (allProducts) {
            for (var i = 0; i < allProducts.length; i++) {
                $('<tr/>', {
                    id: allProducts[i].id
                }).appendTo('.tableProducts');
                let createdTD = document.createElement("td");
                createdTD.setAttribute("contenteditable", "true");
                createdTD.innerHTML = allProducts[i].produktName;
                document.getElementById(allProducts[i].id).appendChild(createdTD);
                let createdTD2 = document.createElement("td");
                createdTD2.setAttribute("contenteditable", "true");
                createdTD2.innerHTML = allProducts[i].preis.toFixed(2);
                document.getElementById(allProducts[i].id).appendChild(createdTD2);
                $('<td/>', {
                    html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowProduct(this)"><b>-</b></button>'
                }).appendTo('#' + allProducts[i].id);
            }
        }
    })
});