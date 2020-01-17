// how long transitions last (msec)
let transitionTime = 2000

// explanations of the variables that make good plot labels.
let longVars = {
  mpg: 'Miles per US gallon',
  cyl: 'Number of cylinders',
  disp: 'Displacement (cu.in.)',
  hp: 'Gross horsepower',
  drat: 'Rear axle ratio',
  wt: 'Weight (1000 lbs)',
  qsec: '1 / 4 mile time (sec)',
  vs: 'Engine(0 = V - shaped, 1 = straight)',
  am: 'Transmission (0 = automatic, 1 = manual)',
  gear: 'Number of forward gears',
  carb: 'Number of carburetors',
}

// use Margin Convention to layout the SVG with an inner plotting region
// and an outer region for axes, labels, etc.
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

// load data
let url =
  'https://raw.githubusercontent.com/rpruim/D3-examples/master/ReadingFiles/cars-data.csv'
d3.csv(url, cleanup_data)
  .then(d => {
    setup(d)
    update(d)
  })
  .catch(error => console.log(error))

// d3.csv() reads in everything as a string.  convert all but `model` to number.
function cleanup_data(d) {
  for (k of Object.keys(d)) {
    // NB: of, no in
    if (k != 'model') d[k] = +d[k]
  }
  return d
}

// declare some variables that will assigned in functions below
let cars_global = []
let xScale, yScale, colorScale, sizeScalele
let xAxis, yAxis

// setup() is for setting up plot elements once at the beginning
// update() will be used for the initial draw and for redrawing upon change
function setup(cars) {
  cars_global = cars

  // model is not quantitative, so it shouldn't be selected
  let variables = Object.keys(cars[0]).filter(d => d != 'model')

  // border around plotting region
  scatterInner
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'transparent')
    .attr('stroke', 'black')

  // populate selectors
  d3.select('select.xvar')
    .on('change', () => update(cars_global))
    .selectAll('option')
    .data(variables)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => longVars[d])

  d3.select('select.yvar')
    .on('change', () => update(cars_global)) // make sure .on() is above .selectAll()
    .selectAll('option')
    .data(variables)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => longVars[d])

  d3.select('select.sizevar')
    .on('change', () => update(cars_global))
    .selectAll('option')
    .data(variables)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => longVars[d])

  // initialize values of select elements. NB: property, not attr!
  d3.select('select.xvar').property('value', 'disp')
  d3.select('select.yvar').property('value', 'mpg')
  d3.select('select.sizevar').property('value', 'hp')

  // read current selections
  let xvar = d3.select('select.xvar').property('value')
  let yvar = d3.select('select.yvar').property('value')
  let sizevar = d3.select('select.sizevar').property('value')

  // create scales based on selections
  // the domain will be modified when selections change
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(cars.map(d => d[xvar]))) // get x variable from <select>
    .range([20, innerWidth - 20])
  xAxis = d3.axisBottom(xScale).tickSize(-innerHeight)

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(cars.map(d => d[yvar]))) // get y variable from <select>
    .range([20, innerHeight - 20].reverse())
  yAxis = d3.axisLeft(yScale).tickSize(-innerWidth)

  sizeScale = d3
    .scaleSqrt()
    .domain([0, d3.max(cars.map(d => d[sizevar]))]) // get size variable from <select>
    .range([5, 15])

  // this scale won't change
  colorScale = d3
    .scaleOrdinal()
    .domain(Object.keys(cars.map(d => d.cyl))) // 4, 6, and 8
    .range(['red', 'green', 'blue'])

  // create axes
  scatterInner
    .append('g')
    .attr('transform', 'translate(' + 0 + ', ' + innerHeight + ')')
    .attr('class', 'x axis') // note: two classes; handy!
    .call(xAxis)

  scatterInner
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  scatterOuter
    .append('text')
    .attr('class', 'x axis')
    .attr('x', margins.left + innerWidth / 2)
    .attr('y', outerHeight - margins.bottom / 2)
    .attr('text-anchor', 'middle')
    .text(longVars[xvar])

  scatterOuter
    .append('text')
    .attr('class', 'y axis')
    .attr('x', margins.left / 2)
    .attr('y', margins.bottom + innerHeight / 2)
    .attr('text-anchor', 'middle')
    .attr(
      'transform',
      `rotate(-90 ${margins.left / 2} ${margins.bottom + innerHeight / 2})`
    )
    .text(longVars[yvar])
}

// update elements that get modified when selections change

function update(cars) {
  let xvar = d3.select('select.xvar').property('value')
  let yvar = d3.select('select.yvar').property('value')
  let sizevar = d3.select('select.sizevar').property('value')

  // update scales
  xScale.domain([0, d3.max(cars.map(d => d[xvar]))])
  yScale.domain([0, d3.max(cars.map(d => d[yvar]))])
  sizeScale.domain([0, d3.max(cars.map(d => d[sizevar]))])

  // update axes
  scatterInner
    .select('.x.axis')
    .transition()
    .duration(transitionTime)
    .call(xAxis)
  scatterInner
    .select('.y.axis')
    .transition()
    .duration(transitionTime)
    .call(yAxis)

  // main plot
  scatterInner
    .selectAll('circle')
    .data(cars)
    .join(
      enter =>
        enter
          .append('circle')
          .attr('cx', d => xScale(d[xvar]))
          .attr('cy', d => yScale(d[yvar]))
          .style('fill', 'transparent')
          .style('stroke-width', 5)
          .attr('r', d => sizeScale(d[sizevar]))
          .style('stroke', d => colorScale(d.cyl))
          .style('opacity', 0.6),
      update =>
        update
          .transition()
          .duration(transitionTime)
          .attr('cx', d => xScale(d[xvar]))
          .attr('cy', d => yScale(d[yvar]))
          .attr('r', d => sizeScale(d[sizevar])),
      exit =>
        exit
          .transition()
          .duration(transitionTime)
          .remove()
    )

  // axis labels
  scatterOuter
    .selectAll('text.y.axis') // select text elements with two both classes
    .transition()
    .duration(transitionTime)
    .text(longVars[yvar])

  scatterOuter
    .selectAll('text.x.axis')
    .transition()
    .duration(transitionTime)
    .text(longVars[xvar])
}
