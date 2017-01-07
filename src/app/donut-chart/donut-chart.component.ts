import {Component, OnInit, Input} from '@angular/core';
import * as D3 from 'd3';


@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

  private svg;
  private margin;
  private width : number;
  private height : number;
  private radius : number;
  private chart_r : number;
  private color;
  private arc: any;
  private pie;
  private container;

  @Input() title: string;
  @Input() dataset: any;

  constructor() { }

  ngOnInit() {
    this.setup();
    this.createDonut();
  }

  private setup(): void {
    this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;

    this.arc = D3.arc().outerRadius(this.radius - 10).innerRadius(this.radius - 70);

    this.pie = D3.pie().sort(null).value((d: any) => d.count);
    this.color =  D3.scaleOrdinal().range(["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB", "#63FF9B",
      "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63", "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"]);

    this.container = D3.select("#donut-chart");
    this.chart_r = this.width / this.dataset.length / 2 * 0.85;

  }

  private createLegend(): void {

    let containerLegend = D3.selectAll("#donut-chart").append('svg')
      .attr('class', 'legend')
      .attr('width', '100%')
      .attr('height', 50)
      .attr('transform', 'translate(50, 50)');

    let legends = containerLegend.selectAll(".legend")
      .data(this.pie(this.dataset))
      .enter().append("g")
      .attr("transform", (d, i) => "translate("+  (i * 150 + 200) + ", 20)");

    legends.append('circle')
      .attr('class', 'legend-icon')
      .attr('r', 6)
      .style('fill', (d, i) => this.color(i));

    legends.append('text')
      .attr('dx', '1em')
      .attr('dy', '.3em')
      .text((d:any) => d.data.label);
  }

  private createCenter(): void {

    let donuts = D3.selectAll('.donut');

    // The circle displaying total data.
    donuts.append("svg:circle")
      .attr("r", this.chart_r * 0.6)
      .style("fill", "#E7E7E7");

    donuts.append('text')
      .attr('class', 'center-txt type')
      .attr('y', this.chart_r * -0.16)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(this.title);
  }

  private createArcLabel(): void {

    let label = D3.arc()
      .innerRadius(this.chart_r * 0.8)
      .outerRadius(this.chart_r);

    let g = this.container.select('.donut')
      .selectAll('g')
      .data(this.pie(this.dataset));

    g.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr('fill', "black")
      .text(function(d:any) { return d.data.count });
  }

  private animateDonut(): void {

    this.arc = D3.arc()
      .innerRadius(this.chart_r * 0.7)
      .outerRadius(this.chart_r * 1.08);

    // Start joining data with paths
    let paths = this.container.select('.donut')
      .selectAll('path')
      .data(this.pie(this.dataset));

    paths
      .enter()
      .append("g")
      .append('path')
      .attr('fill', (d, i) => {
        return this.color(i)
      })
      .attr('stroke', '#FFFFFF')
      .transition()
      .delay((d, i) => {
        return i * 90
      })
      .attrTween('d', (d) => {
        let i = D3.interpolate(d.startAngle + 0.1, d.endAngle);
        return (t) => {
          d.endAngle = i(t);
          return this.arc(d);
        }
      });
  }

  private createDonut(): void {
    let chart_m = this.width / this.dataset.length / 2 * 0.14;

    let donut = this.container
      .append('svg')
      .attr('width', '100%')
      .attr('height', (this.chart_r + chart_m) * 2)
      .append('g')
      .attr('class', (d, i) => { return 'donut type' + i})
      .attr('transform', 'translate(' + (350 + this.chart_r + chart_m) + ',' + (this.chart_r + chart_m) + ')');

    this.createLegend();
    this.createCenter();

    this.animateDonut();
    this.createArcLabel();
  }


}
