window.onload = init;

function init() {
    let umsatzHeute = "";
    let umsatzWoche = "";
    let umsatzMonat = "";
    let umsatzJahr = "";
    let top1ProduktArt = "";
    let top2ProduktArt = "";
    let top3ProduktArt = "";
    let top1Produkt = "";
    let top2Produkt = "";
    let top3Produkt = "";
    $("#umsatzHeute").html("Umsatz heute:<b><span style='margin-left: 100px'>" + umsatzHeute + " €</span></b>");
    $("#umsatzWoche").html("Umsatz diese Woche:<b><span style='margin-left: 51px'>" + umsatzWoche + " €</span></b>");
    $("#umsatzMonat").html("Umsatz diesen Monat:<b><span style='margin-left: 44.5px'>" + umsatzMonat + " €</span></b>");
    $("#umsatzJahr").html("Umsatz dieses Jahr:<b><span style='margin-left: 65.2px'>" + umsatzJahr + " €</span></b>");
    $("#top1ProduktArt").html("Platz 1: <b><span style='margin-left: 5px'>" + top1ProduktArt + "</span></b>");
    $("#top2ProduktArt").html("Platz 2: <b><span style='margin-left: 5px'>" + top2ProduktArt + "</span></b>");
    $("#top3ProduktArt").html("Platz 3: <b><span style='margin-left: 5px'>" + top3ProduktArt + "</span></b>");
    $("#top1Produkt").html("Platz 1: <b><span style='margin-left: 5px'>" + top1Produkt + "</span></b>");
    $("#top2Produkt").html("Platz 2: <b><span style='margin-left: 5px'>" + top2Produkt + "</span></b>");
    $("#top3Produkt").html("Platz 3: <b><span style='margin-left: 5px'>" + top3Produkt + "</span></b>");
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Wochentag');
    data.addColumn('number', 'Umsatz letzte Woche');
    data.addColumn('number', 'Umsatz diese Woche');

    data.addRows([
        ["Mo", 0, 0],
        ["Di", 0, 0],
        ["Mi", 500, 600],
        ["Do", 700, 900],
        ["Fr", 800, 400],
        ["Sa", 500, 300],
        ["So", 0, 0]
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