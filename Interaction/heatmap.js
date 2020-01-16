// set the dimensions and margins of the graph
let margin = { top: 20, right: 25, bottom: 30, left: 40 },
  width = 450 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom

// append the svg object to the body of the page
let svg = d3
  .select('#div_template')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

//Read the data
d3.csv(
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv'
).then(draw)

function draw(data) {
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, d => d.group).keys()
  var myVars = d3.map(data, d => d.variable).keys()

  // Build X scales and axis:
  var xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(0.05)

  svg
    .append('g')
    .style('font-size', 15)
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale).tickSize(0))
    .select('.domain')
    .remove()

  // Build Y scales and axis:
  var yScale = d3
    .scaleBand()
    .range([height, 0])
    .domain(myVars)
    .padding(0.05)

  svg
    .append('g')
    .style('font-size', 15)
    .call(d3.axisLeft(yScale).tickSize(0))
    .select('.domain')
    .remove()

  // Build color scale
  let myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1, 100])

  // create a tooltip
  let Tooltip = d3
    .select('#info')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px')

  // add the squares
  svg
    .selectAll()
    .data(data) // , function(d) {return d.group+':'+d.variable;})
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.group))
    .attr('y', d => yScale(d.variable))
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', function(d) {
      return myColor(d.value)
    })
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .style('stroke-opacity', 0)
    .style('fill-opacity', 0.7)
    .on('mouseover', darken_square)
    .on('mousemove', show_info)
    .on('mouseleave', lighten_square)
    .on('click', make_border_red)

  // Three functions that change the tooltip when user hover / move / leave a cell
  // Because we use the function key word to declare them, we can put them down
  // here and they will be hoisted.

  function darken_square(d) {
    d3.select(this)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
  }

  function show_info(d) {
    Tooltip.html('The exact value of this cell is: ' + d.value)
      .style('opacity', 1)
      .style('left', d3.mouse(this)[0] + 70 + 'px')
      .style('top', d3.mouse(this)[1] + 'px')
  }

  function hide_info(d) {
    Tooltip.style('opacity', 0)
  }

  function lighten_square(d) {
    Tooltip.style('opacity', 0)
    d3.select(this)
      .style('stroke-opacity', 0.5)
      .style('fill-opacity', 0.7)
  }

  function make_border_red(d) {
    d3.select(this).style('stroke', 'red')
  }
}
