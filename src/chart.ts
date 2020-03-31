import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

export interface ChartStepData {
    step: number
    isQuarantineStep: boolean
    hospitalCapacityExhausted: boolean
    totalInfected: number
    totalDead: number
    dayInfected: number
    dayDead: number
}

export class Charts {
    constructor() {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_dataviz);

        this.chartTotal = am4core.create("chartdiv-total", am4charts.XYChart);
        this.chartDays = am4core.create("chartdiv-days", am4charts.XYChart);

        this.initTotalChart()
        this.initDaysChart()
    }

    pushStep(s: ChartStepData) {
        let illTotal: any = {
            step: s.step,
            ill: s.totalInfected
        }

        let deadTotal = {
            step: s.step,
            dead: s.totalDead
        }

        let illDay: any = {
            step: s.step,
            ill: s.dayInfected
        }

        let deadDay = {
            step: s.step,
            dead: s.dayDead
        }

        if (s.isQuarantineStep) {
            illTotal.label = "Qurantine";
            illTotal.color = am4core.color("#555");
            illTotal.opacity = 1

            illDay.label = "Qurantine";
            illDay.color = am4core.color("#555");
            illDay.opacity = 1
        }

        if (s.hospitalCapacityExhausted) {
            illTotal.label = "Hospitals";
            illTotal.color = am4core.color("#f11e41");
            illTotal.opacity = 1

            illDay.label = "Hospitals";
            illDay.color = am4core.color("#f11e41");
            illDay.opacity = 1
        }

        this.chartTotal.addData([illTotal, deadTotal])
        this.chartDays.addData([illDay, deadDay])
    }

    clear() {
        this.chartDays.data = []
        this.chartTotal.data = []
    }

    private initTotalChart() {
        // Create axes
        let stepAxis = this.chartTotal.xAxes.push(new am4charts.ValueAxis());
        stepAxis.renderer.minGridDistance = 10;

        this.chartTotal.yAxes.push(new am4charts.ValueAxis());

        let totalIllSeries = this.chartTotal.series.push(new am4charts.LineSeries());
        totalIllSeries.dataFields.valueX = "step";
        totalIllSeries.dataFields.valueY = "ill";
        totalIllSeries.name = "Infected"

        // Set up bullets
        let bullet = totalIllSeries.bullets.push(new am4charts.Bullet());

        let triangle = bullet.createChild(am4core.Triangle);
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

        let label = bullet.createChild(am4core.Label);
        label.propertyFields.text = "label";
        label.propertyFields.fill = "color";
        label.strokeWidth = 0;
        label.horizontalCenter = "middle";
        label.verticalCenter = "bottom";
        label.dy = -20;

        let line = bullet.createChild(am4core.Line);
        line.x1 = 0;
        line.y1 = 0;
        line.x2 = 0;
        line.y2 = 1000;
        line.strokeOpacity = 0;
        line.strokeDasharray = "3,3";
        line.propertyFields.stroke = "color";
        line.propertyFields.strokeOpacity = "opacity";

        let deadSeries = this.chartTotal.series.push(new am4charts.LineSeries());
        deadSeries.dataFields.valueX = "step";
        deadSeries.dataFields.valueY = "dead";
        deadSeries.name = "Dead"
        //deadSeries.tensionX = 0.8

        this.chartTotal.cursor = new am4charts.XYCursor();
        this.chartTotal.exporting.menu = new am4core.ExportMenu();

        this.chartTotal.legend = new am4charts.Legend();
        this.chartTotal.legend.position = "right";
    }

    private initDaysChart() {
        // Create axes
        let stepAxis = this.chartDays.xAxes.push(new am4charts.CategoryAxis());
        stepAxis.dataFields.category = "step";
        //stepAxis.renderer.grid.template.location = 0;
        stepAxis.renderer.minGridDistance = 40;

        this.chartDays.yAxes.push(new am4charts.ValueAxis());

        let illSeries = this.chartDays.series.push(new am4charts.ColumnSeries());
        illSeries.dataFields.categoryX = "step"
        illSeries.dataFields.valueY = "ill";
        illSeries.name = "Infected"

        // Set up bullets
        let bullet = illSeries.bullets.push(new am4charts.Bullet());

        let triangle = bullet.createChild(am4core.Triangle);
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

        let label = bullet.createChild(am4core.Label);
        label.propertyFields.text = "label";
        label.propertyFields.fill = "color";
        label.strokeWidth = 0;
        label.horizontalCenter = "middle";
        label.verticalCenter = "bottom";
        label.dy = -20;

        let line = bullet.createChild(am4core.Line);
        line.x1 = 0;
        line.y1 = 0;
        line.x2 = 0;
        line.y2 = 1000;
        line.strokeOpacity = 0;
        line.strokeDasharray = "3,3";
        line.propertyFields.stroke = "color";
        line.propertyFields.strokeOpacity = "opacity";

        let deadSeries = this.chartDays.series.push(new am4charts.ColumnSeries());
        deadSeries.dataFields.categoryX  = "step";
        deadSeries.dataFields.valueY = "dead";
        deadSeries.name = "Dead"

        this.chartDays.cursor = new am4charts.XYCursor();
        this.chartDays.exporting.menu = new am4core.ExportMenu();

        this.chartDays.legend = new am4charts.Legend();
        this.chartDays.legend.position = "right";
    }

    private chartTotal: am4charts.XYChart
    private chartDays: am4charts.XYChart
}