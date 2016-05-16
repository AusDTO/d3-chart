import d3 from 'd3';
import Chart from './Chart';
import isActive from '../Helpers/isActive';

/**
 * Class representing a line chart.
 * @extends Chart
 */
class LineChart extends Chart {
  constructor(options) {
    super(options);
    /**
     * If interpolate is specified, sets the interpolation mode to the specified string or function
     * available interpolation:
     *linear - piecewise linear segments, as in a polyline.
     *linear-closed - close the linear segments to form a polygon.
     *step - alternate between horizontal and vertical segments, as in a step function.
     *step-before - alternate between vertical and horizontal segments, as in a step function.
     *step-after - alternate between horizontal and vertical segments, as in a step function.
     *basis - a B-spline, with control point duplication on the ends.
     *basis-open - an open B-spline; may not intersect the start or end.
     *basis-closed - a closed B-spline, as in a loop.
     *bundle - equivalent to basis, except the tension parameter is used to straighten the spline.
     *cardinal - a Cardinal spline, with control point duplication on the ends.
     *cardinal-open - an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
     *cardinal-closed - a closed Cardinal spline, as in a loop.
     *monotone - cubic interpolation that preserves monotonicity in y.
     * @type {String}
     */
    this.interpolate = options.interpolate || null;
  }

  calculateYMin() {
    let min = d3.min(this.transformedData, (c)=> d3.min(c, v=> v.y)) - this.padding.bottom;
    return Math.floor(min / 5) * 5;
  }

  calculateYMax() {
    let max = d3.max(this.transformedData, (c)=> d3.max(c, v=> v.y)) + this.padding.top;
    return Math.ceil(max / 5) * 5;
  }

  getXScale() {
    let sampleData = this.transformedData[0];
    let paddingLeft = (sampleData[sampleData.length - 1 ].x.getTime() - sampleData[0].x.getTime()) * this.padding.left / this.width;
    let paddingRight = (sampleData[sampleData.length - 1 ].x.getTime() - sampleData[0].x.getTime()) * this.padding.right / this.width;
    return d3.time.scale().range([0, this.width])
             .domain([sampleData[0].x.getTime() - paddingLeft, sampleData[sampleData.length - 1 ].x.getTime() + paddingRight]);
  }

  getYScale() {
    return d3.scale.linear().range([this.height, 0])
             .domain([this.yMin, this.yMax]);
  }

  computeRenderProperty() {
    super.computeRenderProperty();
    this.line = d3.svg.line().defined(d=>d.y !== null).x(d=>this.xScale(d.x)).y(d=>this.yScale(d.y)).interpolate(this.interpolate);
  }

  render() {
    super.render();

    this.svg.selectAll('.line')
        .attr('d', this.line);

    this.svg.selectAll('.ruler')
            .attr('y1', 0)
            .attr('y2', this.height)
            .attr('x1', d=>this.xScale(d.x))
            .attr('x2', d=>this.xScale(d.x));

    this.svg.selectAll('.circle')
        .attr('cx', d=>this.xScale(d.x))
        .attr('cy', d=>this.yScale(d.y));
  }

  hover(j) {
    this.svg.selectAll('.line-group')
        .each(function() {
          d3.select(this).selectAll('.circle')
            .attr('stroke-width', (d, i)=> isActive(d, i, j) ? 1 : 0)
            .attr('r', (d, i)=> isActive(d, i, j) ? 3 : 0)
            .attr('fill', (d, i)=> isActive(d, i, j) ? '#ffffff' : d.color);
        });
    this.svg.selectAll('.ruler')
            .attr('stroke-width', (d, i)=> i === j ?  1 : 0);
  }

  init() {
    super.init();
    this.svg
        .select('g.chart__wrapper')
        .each(function(_data) {

          // add rulers
          d3.select(this).selectAll('line')
                .data(d=>d[0])
                .enter()
                .append('line')
                .attr('stroke-width', 0)
                .attr('stroke', '#dddddd')
                .attr('class', 'ruler');

          let group = d3.select(this)
                        .selectAll('g')
                        .data(_data)
                        .enter()
                        .append('g')
                        .attr('class', 'line-group');

          group.append('path')
               .attr('class', d=>`line line-${d[0].id}`)
               .attr('stroke', d=> d[0].color);

          // add circles
          group.each(function() {
            d3.select(this)
            .selectAll('circle')
            .data(d=>d)
            .enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('r', d => 0)
            .attr('stroke-width', 0)
            .attr('stroke', d=> d.color);
          });
        });
    this.render();
  }
}

module.exports = LineChart;