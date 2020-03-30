import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
var Charts = /** @class */ (function () {
    function Charts() {
        am4core.useTheme(am4themes_dataviz);
        am4core.useTheme(am4themes_animated);
        this.createTotalChart();
        this.createDaysChart();
    }
    Charts.prototype.pushStep = function (s) {
        var illTotal = {
            step: s.step,
            ill: s.totalInfected
        };
        var deadTotal = {
            step: s.step,
            dead: s.totalDead
        };
        if (s.isQuarantineStep) {
            illTotal.label = "Qurantine";
            illTotal.color = am4core.color("#555");
            illTotal.opacity = 1;
        }
        this.chartTotal.addData([illTotal, deadTotal]);
        var illDay = {
            step: s.step,
            ill: s.dayInfected
        };
        var deadDay = {
            step: s.step,
            dead: s.dayDead
        };
        this.chartDays.addData([illDay, deadDay]);
    };
    Charts.prototype.clear = function () {
        this.chartDays.data = [];
        this.chartTotal.data = [];
    };
    Charts.prototype.createTotalChart = function () {
        this.chartTotal = am4core.create("chartdiv-total", am4charts.XYChart);
        // Create axes
        var stepAxis = this.chartTotal.xAxes.push(new am4charts.ValueAxis());
        var valueAxis = this.chartTotal.yAxes.push(new am4charts.ValueAxis());
        var totalIllSeries = this.chartTotal.series.push(new am4charts.LineSeries());
        totalIllSeries.dataFields.valueX = "step";
        totalIllSeries.dataFields.valueY = "ill";
        totalIllSeries.name = "Infected";
        totalIllSeries.tensionX = 0.8;
        // Set up bullets
        var bullet = totalIllSeries.bullets.push(new am4charts.Bullet());
        var triangle = bullet.createChild(am4core.Triangle);
        triangle.width = 15;
        triangle.height = 13;
        triangle.dy = -3;
        triangle.direction = "bottom";
        triangle.propertyFields.fill = "color";
        triangle.propertyFields.fillOpacity = "opacity";
        triangle.fillOpacity = 0;
        triangle.strokeWidth = 0;
        triangle.horizontalCenter = "middle";
        triangle.verticalCenter = "bottom";
        var label = bullet.createChild(am4core.Label);
        label.propertyFields.text = "label";
        label.propertyFields.fill = "color";
        label.strokeWidth = 0;
        label.horizontalCenter = "middle";
        label.verticalCenter = "bottom";
        label.dy = -20;
        var line = bullet.createChild(am4core.Line);
        line.x1 = 0;
        line.y1 = 0;
        line.x2 = 0;
        line.y2 = 1000;
        line.strokeOpacity = 0;
        line.strokeDasharray = "3,3";
        line.propertyFields.stroke = "color";
        line.propertyFields.strokeOpacity = "opacity";
        var deadSeries = this.chartTotal.series.push(new am4charts.LineSeries());
        deadSeries.dataFields.valueX = "step";
        deadSeries.dataFields.valueY = "dead";
        deadSeries.name = "Dead";
        deadSeries.tensionX = 0.8;
        this.chartTotal.cursor = new am4charts.XYCursor();
        this.chartTotal.legend = new am4charts.Legend();
        this.chartTotal.legend.position = "right";
    };
    Charts.prototype.createDaysChart = function () {
        this.chartDays = am4core.create("chartdiv-days", am4charts.XYChart);
        // Create axes
        var stepAxis = this.chartDays.xAxes.push(new am4charts.CategoryAxis());
        stepAxis.dataFields.category = "step";
        stepAxis.renderer.grid.template.location = 0;
        stepAxis.renderer.minGridDistance = 30;
        var valueAxis = this.chartDays.yAxes.push(new am4charts.ValueAxis());
        var illSeries = this.chartDays.series.push(new am4charts.ColumnSeries());
        illSeries.dataFields.categoryX = "step";
        illSeries.dataFields.valueY = "ill";
        illSeries.name = "Infected";
        var deadSeries = this.chartDays.series.push(new am4charts.ColumnSeries());
        deadSeries.dataFields.categoryX = "step";
        deadSeries.dataFields.valueY = "dead";
        deadSeries.name = "Dead";
        this.chartDays.cursor = new am4charts.XYCursor();
        this.chartDays.legend = new am4charts.Legend();
        this.chartDays.legend.position = "right";
    };
    return Charts;
}());
export { Charts };
//# sourceMappingURL=chart.js.map