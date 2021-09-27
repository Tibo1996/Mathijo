window.onload = init;

function init() {
    let umsatzHeute = 0;
    let umsatzWoche = 0;
    let umsatzMonat = 0;
    let umsatzJahr = 0;
    let top1Produkt = "";
    let top2Produkt = "";
    let top3Produkt = "";
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
        }
    })
    $("#umsatzHeute").html("Umsatz heute:<b><span style='margin-left: 100px'>" + umsatzHeute + " €</span></b>");
    $("#umsatzWoche").html("Umsatz diese Woche:<b><span style='margin-left: 51px'>" + umsatzWoche + " €</span></b>");
    $("#umsatzMonat").html("Umsatz diesen Monat:<b><span style='margin-left: 44.5px'>" + umsatzMonat + " €</span></b>");
    $("#umsatzJahr").html("Umsatz dieses Jahr:<b><span style='margin-left: 65.2px'>" + umsatzJahr + " €</span></b>");
    $("#top1Produkt").html("Platz 1: <b><span style='margin-left: 5px'>" + top1Produkt + "</span></b>");
    $("#top2Produkt").html("Platz 2: <b><span style='margin-left: 5px'>" + top2Produkt + "</span></b>");
    $("#top3Produkt").html("Platz 3: <b><span style='margin-left: 5px'>" + top3Produkt + "</span></b>");
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
    let salesThisWeek = [];
    let salesLastWeek = [];
    $.ajax({
        url: "/Values/GetSalesOfEveryDayThisWeek",
        async: false,
        success: function (salesThisWeekBackend) {
            salesThisWeek = salesThisWeekBackend;
        }
    })
    $.ajax({
        url: "/Values/GetSalesOfEveryDayLastWeek",
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
        ["Mo", salesThisWeek[0], salesLastWeek[0]],
        ["Di", salesThisWeek[1], salesLastWeek[1]],
        ["Mi", salesThisWeek[2], salesLastWeek[2]],
        ["Do", salesThisWeek[3], salesLastWeek[3]],
        ["Fr", salesThisWeek[4], salesLastWeek[4]],
        ["Sa", salesThisWeek[5], salesLastWeek[5]],
        ["So", salesThisWeek[6], salesLastWeek[6]]
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