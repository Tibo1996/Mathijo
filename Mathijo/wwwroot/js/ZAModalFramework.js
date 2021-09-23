var statusModalCounter = 0;
function requestStatusModal(exceptionCheckState, closeEvent, colorcode) {
    if (exceptionCheckState.displayType == 0) {
        return;
    }
    if (exceptionCheckState.displayType == 1 || exceptionCheckState.displayType == 3) {
        console.log(exceptionCheckState.consoleMessage);
    }
    if (exceptionCheckState.displayType == 2 || exceptionCheckState.displayType == 3) {
        // mit dialog
        createStatusModal(exceptionCheckState, closeEvent, colorcode);
    }
}
function requestYesNoModal(exceptionCheckState, yesEvent, noEvent, colorcode) {
    if (exceptionCheckState.displayType == 0) {
        return;
    }
    if (exceptionCheckState.displayType == 1 || exceptionCheckState.displayType == 3) {
        console.log(exceptionCheckState.consoleMessage);
    }
    if (exceptionCheckState.displayType == 2 || exceptionCheckState.displayType == 3) {
        // mit dialog
        createYesNoModal(exceptionCheckState, yesEvent, noEvent, colorcode);
    }
}
function createStatusModal(exceptionCheckState, closeEvent, hexColorCode) {
    let modal = this.createModal(hexColorCode, exceptionCheckState.code);
    //counter wird bei createModal um 1 erhöht
    let currentId = statusModalCounter - 1;
    let statusModalTitle = $('#statusModalTitle' + currentId + '');
    let statusModalBody = $('#statusModalBody' + currentId + '');
    let statusModalFooter = $('#statusModalFooter' + currentId + '');
    statusModalFooter.append('<button type="button" id="modalDisposeButton' + currentId + '" class="btn btn-secondary"></button>');
    let disposeButton = $('#modalDisposeButton' + currentId + '');
    disposeButton.html('<span class="material-icons">Ok</span>');
    assignCloseEventToButton(disposeButton, modal, closeEvent);
    statusModalTitle.text(exceptionCheckState.title);
    statusModalBody.text(exceptionCheckState.displayableMessage);
    modal.modal('show');
}





function createYesNoModal(exceptionCheckState, yesEvent, noEvent, hexColorCode) {
    let modal = this.createModal(hexColorCode, exceptionCheckState.code);
    //counter wird bei createModal um 1 erhöht
    let currentId = statusModalCounter - 1;
    let statusModalTitle = $('#statusModalTitle' + currentId + '');
    let statusModalBody = $('#statusModalBody' + currentId + '');
    let statusModalFooter = $('#statusModalFooter' + currentId + '');
    statusModalFooter.append('<button type="button" id="BtnYes' + currentId + '" class="btn btn-secondary" ></button> ' +
        '<button type="button" id="BtnNo' + currentId + '" class="btn btn-secondary" ></button>');
    let yesButton = $('#BtnYes' + currentId + '');
    let noButton = $('#BtnNo' + currentId + '');
    assignCloseEventToButton(yesButton, modal, yesEvent);
    assignCloseEventToButton(noButton, modal, noEvent);
    yesButton.html('<span class="material-icons" style="margin-top: 5px">Ja</span>');
    noButton.html('<span class="material-icons" style="margin-top: 5px">Nein</span>');
    statusModalTitle.text(exceptionCheckState.title);
    statusModalBody.text(exceptionCheckState.displayableMessage);
    modal.modal('show');
}
function assignCloseEventToButton(jqueryButton, modal, event) {
    //Bitte kein Else, da sonst beim Fall typeof closeEvent != function überhaupt keine Aktion gesetzt wird!
    if (event != null) {
        if (typeof event == 'function') {
            //Event für Nein :
            let closeAction = function CloseAction() {
                closeModal(modal);
                event();
            }
            jqueryButton.click(closeAction);
        } else {
            console.error("Error while creating modal!");
            console.error("Type of event is not a function!")
            console.error("event:");
            console.error(event);
            event = null;
        }
    }
    if (event == null) {
        let closeAction = function CloseAction() {
            closeModal(modal);
        }
        jqueryButton.click(closeAction);
    }
}
function createModal(hexColorCode, ecsCode) {



    //HexColor wird präferiert.
    let modal = $('<div class="modal fade" id="statusModal' + statusModalCounter + '" tabindex="-1" role="dialog" aria-hidden="true">' +
        '<div class= "modal-dialog modal-dialog-centered" role = "document">' +
        '<div class="modal-content">' +
        '<div class="modal-header" id="statusModalHeader' + statusModalCounter + '">' +
        '<h5 class="modal-title" id = "statusModalTitle' + statusModalCounter + '" style = "color:black"></h5>' +
        '</div>' +
        '<div class="modal-body" id="statusModalBody' + statusModalCounter + '" style="color:black">' +
        '</div>' +
        '<div class="modal-footer" id="statusModalFooter' + statusModalCounter + '">'
        + '</div>'
        + '</div> ' +
        '</div>');
    modal.appendTo(document.body);
    modal.on('hidden.bs.modal', function (e) {
        //Jquery so machen, weil man dann alle statusModals erwischt.
        //IDs sollten eigentlich einzigartig sein, aber wir vergeben die IDs ja nicht dynamisch
        $(this).detach();
    });
    //Wenn man keinen Hex Color Code angibt, wird die Farbe anhand der statusMessage.code (Werte von 0-2 festgelegt);
    if (hexColorCode == null) {
        hexColorCode = this.getColorFromEcsCode(ecsCode);
        //Ergebnis, wenn kein ecs Code vorhanden: Default-Wert ist rot!
    }
    let statusModalTitle = $('#statusModalTitle' + statusModalCounter + '');
    let statusModalBody = $('#statusModalBody' + statusModalCounter + '');
    let statusModalHeader = $('#statusModalHeader' + statusModalCounter + '');
    let statusModalFooter = $('#statusModalFooter' + statusModalCounter + '');
    statusModalHeader.css('background-color', hexColorCode);
    statusModalBody.css('background-color', hexColorCode);
    statusModalFooter.css('background-color', hexColorCode);
    let textColor = this.selectTextColor(hexColorCode);
    statusModalTitle.css('color', textColor);
    statusModalBody.css('color', textColor);
    statusModalCounter = statusModalCounter + 1;
    return modal;
}
function getColorFromEcsCode(ecsCode) {
    if (ecsCode == null || ecsCode >= 2) {
        //rot
        return '#f04747';
    }
    if (ecsCode <= 0) {
        //grün
        return '#43b581';
    }
    if (ecsCode == 1) {
        //gelb
        return '#f8c300';
    }
}
function selectTextColor(backgroundHex) {
    //Textfarbe anhand der Hintergrundfarbe anpassen
    let rgb = this.hexToRgb(backgroundHex)
    const brightness = Math.round(((parseInt(rgb.r) * 299) +
        (parseInt(rgb.g) * 587) +
        (parseInt(rgb.b) * 114)) / 1000);
    return (brightness > 125) ? 'black' : 'white';
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function getECS(consoleMessage, displayableMessage, title, statusCode, displayType, colorcode) {
    return getExceptionCheckState(consoleMessage, displayableMessage, title, statusCode, displayType, colorcode);
}
function getExceptionCheckState(consoleMessage, displayableMessage, title, statusCode, displayType, colorcode) {
    return { "consoleMessage": consoleMessage, "displayableMessage": displayableMessage, "title": title, "code": statusCode, "displayType": displayType, "color": colorcode }
}
function closeModal(modal) {
    modal.trigger('click.dismiss.bs.modal');
    modal.modal('hide');
}