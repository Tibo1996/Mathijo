window.onload = init;

function init() {
    $.ajax({
        url: "/Values/GetAllProductTypes",
        success: function (allProductTypes) {
            for (var i = 0; i < allProductTypes.length; i++) {
                $('<tr/>', {
                    id: allProductTypes[i].id
                }).appendTo('.tableProductTypes');
                let createdTD = document.createElement("td");
                createdTD.setAttribute("contenteditable", "true");
                createdTD.innerHTML = allProductTypes[i].produkt_Art;
                document.getElementById(allProductTypes[i].id).appendChild(createdTD);
                $('<td/>', {
                    html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowProductType(this)"><b>-</b></button>'
                }).appendTo('#' + allProductTypes[i].id);
            }
        }
    })
}

function SaveChangesProductType() {
    let rowInfo = $("#productTypesTable tr");
    for (var i = 1; i < rowInfo.length; i++) {
        $.ajax({
            url: "/Values/UpdateProductType" + "?" + $.param({ "productTypeName": rowInfo[i].firstChild.innerHTML, "idProductType": rowInfo[i].id }),
            async: false,
            success: function () { 
            }
        })
    }
    location.reload();
}

function AddNewProductType() {
    let newProductType = $("#newEnteredProductType").val();
    $.ajax({
        url: "/Values/CreateNewProductType" + "?" + $.param({ "productTypeName": newProductType }),
        async: false,
        success: function (newID) {
            $('<tr/>', {
                id: newID
            }).appendTo('.tableProductTypes');
            let createdTD = document.createElement("td");
            createdTD.setAttribute("contenteditable", "true");
            createdTD.innerHTML = newProductType;
            document.getElementById(newID).appendChild(createdTD);
            $('<td/>', {
                html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowProductType(this)"><b>-</b></button>'
            }).appendTo('#' + newID);
            location.reload();
        }
    })
}

function DeleteRowProductType(row) {
    let idOfProductType = row.parentElement.parentElement.id;
    $.ajax({
        url: "/Values/DeleteProductType" + "?" + $.param({ "idProductType": idOfProductType }),
        async: false,
        success: function () {
            $("#" + row.parentElement.parentElement.id).remove();
        }
    })
}