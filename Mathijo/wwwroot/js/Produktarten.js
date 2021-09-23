window.onload = init;
var ecsDelete = {
    "displayableMessage": "Wollen Sie diese Produktart wirklich löschen?",
    "title": "Warnung",
    "code": 1,
    "displayType": 2
}

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
    let ecsInfo;
    for (var i = 1; i < rowInfo.length; i++) {
        $.ajax({
            url: "/Values/UpdateProductType" + "?" + $.param({ "productTypeName": rowInfo[i].firstChild.innerHTML, "idProductType": rowInfo[i].id }),
            async: false,
            success: function (ecs) {
                ecsInfo = ecs;
            }
        })
    }
    requestStatusModal(ecsInfo);
}

function AddNewProductType() {
    let newProductType = $("#newEnteredProductType").val();
    $.ajax({
        url: "/Values/CreateNewProductType" + "?" + $.param({ "productTypeName": newProductType }),
        async: false,
        success: function (guidAndECS) {
            if (guidAndECS.ecs.code === 0) {
                $('<tr/>', {
                    id: guidAndECS.newID
                }).appendTo('.tableProductTypes');
                let createdTD = document.createElement("td");
                createdTD.setAttribute("contenteditable", "true");
                createdTD.innerHTML = newProductType;
                document.getElementById(guidAndECS.newID).appendChild(createdTD);
                $('<td/>', {
                    html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowProductType(this)"><b>-</b></button>'
                }).appendTo('#' + guidAndECS.newID);
                $("#newEnteredProductType").val("");
            }
            requestStatusModal(guidAndECS.ecs);
        }
    })
}

function DeleteRowProductType(row) {
    let idOfProductType = row.parentElement.parentElement.id;
    requestYesNoModal(ecsDelete, function () {
        $.ajax({
            url: "/Values/DeleteProductType" + "?" + $.param({ "idProductType": idOfProductType }),
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