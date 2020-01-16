let outerWidth = 600
let outerHeight = 400
let margins = { top: 30, bottom: 50, left: 50, right: 30 }
let innerWidth = outerWidth - margins.left - margins.right
let innerHeight = outerHeight - margins.top - margins.bottom

let scatterOuter = d3
  .select('svg#cars-scatter')
  .attr('width', outerWidth)
  .attr('height', outerHeight)

let scatterInner = scatterOuter
  .append('g')
  .attr('id', 'inner-cars')
  .attr('width', innerWidth)
  .attr('height', innerHeight)
  .attr('transform', 'translate(' + margins.left + ',' + margins.right + ')')

d3.csv('cars-data.csv').then(data => draw(data))

let url =
  'https://raw.githubusercontent.com/fivethirtyeight/data/master/us-weather-history/KCLT.csv'
console.log('Before reading data.')
d3.csv(url).then(d => console.log(d.slice(0, 3)))
console.log('After reading data.')

function draw(cars) {
  scatterOuter
    .append('rect')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .attr('fill', 'transparent')
    .attr('stroke', 'navy')
    .attr('stroke-width', 2)

  scatterInner.style('fill', 'skyblue').style('opacity', 0.8)

  scatterInner
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'skyblue')
    .attr('fill-opacity', 0.2)

  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(cars.map(d => d.mpg)))
    .range([20, innerWidth - 20])
  let xAxis = d3.axisBottom(xScale)

  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(cars.map(d => d.wt)))
    .range([20, innerHeight - 20].reverse())
  let yAxis = d3.axisLeft(yScale).tickSize(-innerWidth)

  let sizeScale = d3
    .scaleSqrt()
    .domain([0, Math.max(...cars.map(d => d.disp))])
    .range([5, 15])

  let colorScale = d3
    .scaleOrdinal()
    .domain([4, 6, 8])
    .range(['red', 'green', 'blue'])

  scatterInner
    .append('g')
    .attr('transform', 'translate(' + 0 + ', ' + innerHeight + ')')
    .attr('class', 'x-axis')
    .call(xAxis)

  scatterInner
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'transparent')
    .attr('stroke', 'black')

  scatterInner
    .append('g')
    .attr('class', 'y-axis')
    .call(yAxis)

  scatterInner
    .selectAll('circle')
    .data(cars)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.mpg))
    .attr('cy', d => yScale(d.wt))
    .style('fill', 'transparent')
    .style('stroke-width', 5)
    .transition()
    .duration(2000)
    .attr('r', d => sizeScale(d.disp))
    .style('stroke', d => colorScale(d.cyl))
    .style('opacity', 0.6)
}
