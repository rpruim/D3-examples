let scatterPlot = d3
  .select('svg#cars-scatter')
  .attr('width', 600)
  .attr('height', 400)

let xScale = d3
  .scaleLinear()
  .domain(d3.extent(cars.map(d => d.mpg)))
  .range([20, 580])

let yScale = d3
  .scaleLinear()
  .domain(d3.extent(cars.map(d => d.wt)))
  .range([20, 380].reverse())

let sizeScale = d3
  .scaleSqrt()
  .domain([0, Math.max(...cars.map(d => d.disp))])
  .range([5, 15])

let colorScale = d3
  .scaleOrdinal()
  .domain([4, 6, 8])
  .range(['red', 'green', 'blue'])

scatterPlot
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
