window.onload = init;
var ecsDelete = {
    "displayableMessage": "Wollen Sie diesen Tisch wirklich löschen?",
    "title": "Warnung",
    "code": 1,
    "displayType": 2
}

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
    $.ajax({
        url: "/Values/GetTables",
        success: function (tables) {
            for (var i = 0; i < tables.length; i++) {
                $('<tr/>', {
                    id: tables[i].id
                }).appendTo('.tableTables');
                let createdTD = document.createElement("td");
                createdTD.innerHTML = "Tischnummer " + tables[i].tischnummer;
                document.getElementById(tables[i].id).appendChild(createdTD);
                $('<td/>', {
                    html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowTable(this)"><b>-</b></button>'
                }).appendTo('#' + tables[i].id);
            }
        }
    })
}

function AddNewTable() {
    let newTable = $("#newEnteredTable").val();
    $.ajax({
        url: "/Values/CreateNewTable" + "?" + $.param({ "tableNumber": newTable }),
        async: false,
        success: function (guidAndECS) {
            if (guidAndECS.ecs.code === 0) {
                $('<tr/>', {
                    id: guidAndECS.newID
                }).appendTo('.tableTables');
                let createdTD = document.createElement("td");
                createdTD.innerHTML = "Tischnummer " + newTable;
                document.getElementById(guidAndECS.newID).appendChild(createdTD);
                $('<td/>', {
                    html: '<button class="btn btn-danger" style="padding-top: 5px; padding-bottom: 8px;" onclick="DeleteRowTable(this)"><b>-</b></button>'
                }).appendTo('#' + guidAndECS.newID);
                $("#newEnteredTable").val("");
            }
            requestStatusModal(guidAndECS.ecs);
        }
    })
}

function DeleteRowTable(row) {
    let idOfTable = row.parentElement.parentElement.id;
    requestYesNoModal(ecsDelete, function () {
        $.ajax({
            url: "/Values/DeleteTable" + "?" + $.param({ "idTable": idOfTable }),
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