window.onload = init;

function init() {
    let umsatzHeute = 0;
    let umsatzWoche = 0;
    let umsatzMonat = 0;
    let umsatzJahr = 0;
    let top1Produkt = "";
    let top2Produkt = "";
    let top3Produkt = "";
    let top4Produkt = "";
    let top5Produkt = "";
    
    $.ajax({
        url: "/Values/GetSales",
        async: false,
        success: function (sales) {
            umsatzHeute = sales[0].toFixed(2);
            umsatzWoche = sales[1].toFixed(2);
            umsatzMonat = sales[2].toFixed(2);
            umsatzJahr = sales[3].toFixed(2);
        }
    })
    $.ajax({
        url: "/Values/GetTop3OrderedProducts",
        async: false,
        success: function (top3Products) {
            top1Produkt = top3Products[0];
            top2Produkt = top3Products[1];
            top3Produkt = top3Products[2];
            top4Produkt = top3Products[3];
            top5Produkt = top3Products[4];
        }
    })
    $("#umsatzHeute").html("Umsatz heute:<b><span style='margin-left: 100px'>" + umsatzHeute + " €</span></b>");
    $("#umsatzWoche").html("Umsatz diese Woche:<b><span style='margin-left: 51px'>" + umsatzWoche + " €</span></b>");
    $("#umsatzMonat").html("Umsatz diesen Monat:<b><span style='margin-left: 44.5px'>" + umsatzMonat + " €</span></b>");
    $("#umsatzJahr").html("Umsatz dieses Jahr:<b><span style='margin-left: 65.2px'>" + umsatzJahr + " €</span></b>");
    $("#top1Produkt").html("Platz 1: <b><span style='margin-left: 5px'>" + top1Produkt + "</span></b>");
    $("#top2Produkt").html("Platz 2: <b><span style='margin-left: 5px'>" + top2Produkt + "</span></b>");
    $("#top3Produkt").html("Platz 3: <b><span style='margin-left: 5px'>" + top3Produkt + "</span></b>");
    $("#top4Produkt").html("Platz 4: <b><span style='margin-left: 5px'>" + top4Produkt + "</span></b>");
    $("#top5Produkt").html("Platz 5: <b><span style='margin-left: 5px'>" + top5Produkt + "</span></b>");
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
    let salesThisWeek = [];
    let salesLastWeek = [];
    $.ajax({
        url: "/Values/GetSalesEveryDayOfThisWeek",
        async: false,
        success: function (salesThisWeekBackend) {
            salesThisWeek = salesThisWeekBackend;
        }
    })
    $.ajax({
        url: "/Values/GetSalesEveryDayOfLastWeek",
        async: false,
        success: function (salesLastWeekBackend) {
            salesLastWeek = salesLastWeekBackend;
        }
    })
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Wochentag');
    data.addColumn('number', 'Umsatz letzte Woche');
    data.addColumn('number', 'Umsatz diese Woche');

    data.addRows([
        ["Mo", salesLastWeek[0], salesThisWeek[0]],
        ["Di", salesLastWeek[1], salesThisWeek[1]],
        ["Mi", salesLastWeek[2], salesThisWeek[2]],
        ["Do", salesLastWeek[3], salesThisWeek[3]],
        ["Fr", salesLastWeek[4], salesThisWeek[4]],
        ["Sa", salesLastWeek[5], salesThisWeek[5]],
        ["So", salesLastWeek[6], salesThisWeek[6]]
    ]);

    let options = {
        chart: {
            title: 'Wochenumsatz'
        },
        colors: ['#000000', '#044CAD'],
        width: 650,
        height: 430
    };
    let materialChart = new google.charts.Bar(document.getElementById("gChart"));
    materialChart.draw(data, options);
}