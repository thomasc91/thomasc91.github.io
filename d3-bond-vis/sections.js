let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend


const margin = {
  left: 170,
  top: 50,
  bottom: 50,
  right: 20
}
const width = 800
const height = 900

const vehicleClasses = [
  'Airplane',
  'Jetpack',
  'Helicopter',
  'Skyhook',
  'Parachute',
  'Paraglider',
  'Space shuttle',
  'Space station',
  'Balloon',

  'Car',
  'Truck',
  'Train',
  'Animal',
  'Sleigh',
  'Cable car',
  'Skis',
  'Hovercraft',
  'Motorcycle',
  'Bus',
  'Rickshaw',
  'Snowmobile',
  'Tram',
  'Cello case',
  'Ferris wheel',
  'Tank',

  'Boat',
  'Submarine',
  'Life raft',
  'Wetbike',
  'Surfboard'
]

//5 along the top row, 6 down
const vehicleMomentsXY = {
  'air-based': [50, 300],
  'land-based': [400, 500], //big
  'water-based': [50, 700], //big
}

const landBasedXY = {
  'Car': [430, 500], //big
  'Truck': [50, 450],
  'Train': [150, 600],
  'Animal': [500, 250],
  'Sleigh': [170, 750],
  'Cable car': [700, 300],
  'Skis': [700, 700],
  'Hovercraft': [550, 680],
  'Motorcycle': [200, 300],
  'Bus': [700, 500],
  'Rickshaw': [300, 700],
  'Snowmobile': [50, 750],
  'Tram': [700, 400],
  'Cello case': [350, 800],
  'Ferris wheel': [560, 800],
  'Tank': [430, 750],

  'Airplane': [2000, 450],
  'Jetpack': [2000, 450],
  'Helicopter': [2000, 450],
  'Skyhook': [2000, 450],
  'Parachute': [2000, 450],
  'Paraglider': [2000, 450],
  'Space shuttle': [2000, 450],
  'Space station': [2000, 450],
  'Balloon': [2000, 450],
  'Boat': [2000, 700], //big
  'Submarine': [2000, 700],
  'Life raft': [2000, 700],
  'Wetbike': [2000, 700],
  'Surfboard': [2000, 700]
}

const landBasedLabelXY = {
  'Car': [430, 630], //big
  'Truck': [50, 470],
  'Train': [150, 620],
  'Animal': [500, 270],
  'Sleigh': [170, 740],
  'Cable car': [690, 300],
  'Skis': [690, 700],
  'Hovercraft': [550, 640],
  'Motorcycle': [200, 310],
  'Bus': [690, 500],
  'Rickshaw': [300, 680],
  'Snowmobile': [50, 740],
  'Tram': [690, 400],
  'Cello case': [350, 770],
  'Ferris wheel': [560, 780],
  'Tank': [430, 730],

  'Airplane': [2000, 450],
  'Jetpack': [2000, 450],
  'Helicopter': [2000, 450],
  'Skyhook': [2000, 450],
  'Parachute': [2000, 450],
  'Paraglider': [2000, 450],
  'Space shuttle': [2000, 450],
  'Space station': [2000, 450],
  'Balloon': [2000, 450],

  'Boat': [2000, 700], //big
  'Submarine': [2000, 700],
  'Life raft': [2000, 700],
  'Wetbike': [2000, 700],
  'Surfboard': [2000, 700]
}

const waterBasedXY = {
  'Car': [2000, 500], //big
  'Truck': [2000, 450],
  'Train': [2000, 600],
  'Animal': [2000, 250],
  'Sleigh': [2000, 750],
  'Cable car': [2000, 300],
  'Skis': [2000, 700],
  'Hovercraft': [2000, 680],
  'Motorcycle': [2000, 300],
  'Bus': [2000, 500],
  'Rickshaw': [2000, 700],
  'Snowmobile': [2000, 750],
  'Tram': [2000, 400],
  'Cello case': [2000, 800],
  'Ferris wheel': [2000, 800],
  'Tank': [2000, 750],

  'Airplane': [2000, 450],
  'Jetpack': [2000, 450],
  'Helicopter': [2000, 450],
  'Skyhook': [2000, 450],
  'Parachute': [2000, 450],
  'Paraglider': [2000, 450],
  'Space shuttle': [2000, 450],
  'Space station': [2000, 450],
  'Balloon': [2000, 450],

  'Boat': [430, 500], //big
  'Submarine': [150, 600],
  'Life raft': [700, 500],
  'Wetbike': [550, 680],
  'Surfboard': [300, 700]
}

const waterBasedLabelXY = {
  'Car': [2000, 500], //big
  'Truck': [2000, 450],
  'Train': [2000, 600],
  'Animal': [2000, 250],
  'Sleigh': [2000, 750],
  'Cable car': [2000, 300],
  'Skis': [2000, 700],
  'Hovercraft': [2000, 680],
  'Motorcycle': [2000, 300],
  'Bus': [2000, 500],
  'Rickshaw': [2000, 700],
  'Snowmobile': [2000, 750],
  'Tram': [2000, 400],
  'Cello case': [2000, 800],
  'Ferris wheel': [2000, 800],
  'Tank': [2000, 750],

  'Airplane': [2000, 450],
  'Jetpack': [2000, 450],
  'Helicopter': [2000, 450],
  'Skyhook': [2000, 450],
  'Parachute': [2000, 450],
  'Paraglider': [2000, 450],
  'Space shuttle': [2000, 450],
  'Space station': [2000, 450],
  'Balloon': [2000, 450],

  'Boat': [430, 600], //big
  'Submarine': [150, 620],
  'Life raft': [700, 500],
  'Wetbike': [550, 660],
  'Surfboard': [300, 690]
}

//Read Data, convert numerical categories into floats
//Create the initial visualisation


d3.csv('data/james-bond-data.csv', function(d) {
  return {
    movieName: d.movieName,
    vehicleName: d.momentVehicle,
    momentIn: +d.momentIn,
    momentDuration: +d.momentDuration,
    momentVehicleClass: d.momentVehicleClass,
    momentType: d.momentType
  };
}).then(data => {
  dataset = data

  createScales()
  setTimeout(drawInitial(), 100)
})

const colors = [
  '#800832',
  '#8b253f',
  '#96394d',
  '#a14b5b',
  '#ab5d6a',
  '#b56e79',
  '#be7f88',
  '#c79198',
  '#d0a2a8',

  '#193d70',
  '#193d70',
  '#28497f',
  '#28497f',
  '#36568f',
  '#36568f',
  '#44639f',
  '#44639f',
  '#5270af',
  '#5270af',
  '#5f7ebf',
  '#5f7ebf',
  '#6d8cd0',
  '#6d8cd0',
  '#7b9ae1',
  '#7b9ae1',

  '#707070',
  '#838383',
  '#969696',
  '#bebebe',
  '#aaaaaa'
]

//Create all the scales and save to global variables

function createScales() {
  durationScale = d3.scaleLinear(d3.extent(dataset, d => d.momentDuration), [5, 20])
  momentInXScale = d3.scaleLinear(d3.extent(dataset, d => d.momentIn), [margin.left, width - margin.right])
  movieNameYScale = d3.scalePoint().domain(dataset.map(d => d.movieName)).range([margin.top, height - margin.bottom]).padding(0.5)
  //salaryYScale = d3.scaleLinear([20000, 110000], [margin.top + height, margin.top])
  categoryColorScale = d3.scaleOrdinal(vehicleClasses, colors)
  //shareWomenXScale = d3.scaleLinear(d3.extent(dataset, d => d.ShareWomen), [margin.left, margin.left + width])
  //enrollmentScale = d3.scaleLinear(d3.extent(dataset, d => d.Total), [margin.left + 120, margin.left + width - 50])
  //enrollmentSizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Total), [10, 60])
  //histXScale = d3.scaleLinear(d3.extent(dataset, d => d.Midpoint), [margin.left, margin.left + width])
  //histYScale = d3.scaleLinear(d3.extent(dataset, d => d.HistCol), [margin.top + height, margin.top])
}

function createLegend(x, y) {
  let svg = d3.select('#legend')

  svg.append('g')
    .attr('class', 'categoryLegend')
    .attr('transform', `translate(${x},${y})`)

  categoryLegend = d3.legendColor()
    .shape('path', d3.symbol().type(d3.symbolCircle).size(100)())
    .shapePadding(10)
    .scale(categoryColorScale)

  d3.select('.categoryLegend')
    .call(categoryLegend)
}

function createSizeLegend() {
  let svg = d3.select('#legend2')
  svg.append('g')
    .attr('class', 'sizeLegend')
    .attr('transform', `translate(100,50)`)

  sizeLegend2 = d3.legendSize()
    .scale(durationScale)
    .shape('circle')
    .shapePadding(15)
    .title('Duration Scale')
    .labelFormat(d3.format("$,.2r"))
    .cells(7)

  d3.select('.sizeLegend')
    .call(sizeLegend2)
}

function createSizeLegend2() {
  let svg = d3.select('#legend3')
  svg.append('g')
    .attr('class', 'sizeLegend2')
    .attr('transform', `translate(50,100)`)

  sizeLegend2 = d3.legendSize()
    .scale(enrollmentSizeScale)
    .shape('circle')
    .shapePadding(55)
    .orient('horizontal')
    .title('Enrolment Scale')
    .labels(['1000', '200000', '400000'])
    .labelOffset(30)
    .cells(3)

  d3.select('.sizeLegend2')
    .call(sizeLegend2)
}

// All the initial elements should be create in the drawInitial function
// As they are required, their attributes can be modified
// They can be shown or hidden using their 'opacity' attribute
// Each element should also have an associated class name for easy reference

function drawInitial() {
  //createSizeLegend()
  //createSizeLegend2()

  let svg = d3.select("#vis")
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 1)

  let xAxisGenerator = d3.axisBottom()
    .scale(momentInXScale)

  let yAxisGenerator = d3.axisLeft()
    .scale(movieNameYScale)

  let yAxis = svg.append('g')
    .call(yAxisGenerator)
    .attr('class', 'y-axis-film-name')
    .attr('transform', `translate(${margin.left}, 0)`)

  let xAxis = svg.append('g')
    .call(xAxisGenerator)
    .attr('class', 'x-axis-moment-in')
    .attr('transform', `translate(0, ${height - margin.bottom})`)

  // Instantiates the force simulation
  // Has no forces. Actual forces are added and removed as required

  simulation = d3.forceSimulation(dataset)

  // Define each tick of simulation
  simulation.on('tick', () => {
    nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  })

  // Stop the simulation until later
  simulation.stop()

  // Selection of all the circles
  nodes = svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('fill', 'black')
    .attr('r', 3)
    .attr('cx', (d, i) => momentInXScale(d.momentIn) + 5)
    .attr('cy', (d, i) => movieNameYScale(d.movieName))
    .attr('opacity', 0.8)

  // Add mouseover and mouseout events for all circles
  // Changes opacity and adds border
  svg.selectAll('circle')
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut)

  function mouseOver(d, i) {


    d3.select(this)
      .transition('mouseover').duration(100)
      .attr('opacity', 1)
      .attr('stroke-width', 5)
      .attr('stroke', 'black')

    d3.select('#tooltip')
      .style('left', (d3.event.pageX + 10) + 'px')
      .style('top', (d3.event.pageY - 25) + 'px')
      .style('display', 'inline-block')
      .html(`<strong>Film:</strong> ${d.movieName}
            <br> <strong>Vehicle:</strong> ${d.vehicleName}
            <br> <strong>Vehicle type:</strong> ${d.momentVehicleClass}
                `)
  }

  function mouseOut(d, i) {
    d3.select('#tooltip')
      .style('display', 'none')

    d3.select(this)
      .transition('mouseout').duration(100)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0)
  }

  //All the required components for the small multiples charts
  //Initialises the text and rectangles, and sets opacity to 0
  svg.selectAll('.cat-rect')
    .data(vehicleClasses).enter()
    .append('rect')
    .attr('class', 'cat-rect')
    .attr('x', d => landBasedLabelXY[d][0])
    .attr('y', d => landBasedLabelXY[d][1])
    .attr('width', 100)
    .attr('height', 30)
    .attr('opacity', 0)
    .attr('fill', 'grey')


  svg.selectAll('.lab-text')
    .data(vehicleClasses).enter()
    .append('text')
    .attr('class', 'lab-text')
    .text(d => d)
    .attr('opacity', 0)
    .attr('font-family', 'Domine')
    .attr('font-size', '12px')
    .attr('font-weight', 700)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .raise()

}

//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type

function clean(chartType) {
  let svg = d3.select('#vis').select('svg')
  if (chartType !== "isScatter") {
    svg.select('.scatter-x').transition().attr('opacity', 0)
    svg.select('.scatter-y').transition().attr('opacity', 0)
    svg.select('.best-fit').transition().duration(200).attr('opacity', 0)
  }
  if (chartType !== "isMultiples") {
    svg.selectAll('.lab-text').transition().attr('opacity', 0)
      .attr('x', 1800)
    svg.selectAll('.cat-rect').transition().attr('opacity', 0)
      .attr('x', 1800)
  }
  if (chartType !== "isFirst") {
    svg.select('.y-axis-film-name').transition().attr('opacity', 0)
    svg.select('.x-axis-moment-in').transition().attr('opacity', 0)
    svg.selectAll('.small-text').transition().attr('opacity', 0)
      .attr('x', -200)
  }
  if (chartType !== "isHist") {
    svg.selectAll('.hist-axis').transition().attr('opacity', 0)
  }
  if (chartType !== "isBubble") {
    svg.select('.enrolment-axis').transition().attr('opacity', 0)
  }
}

//First draw function

function draw1() {
  //Stop simulation
  simulation.stop()

  let svg = d3.select("#vis")
    .select('svg')
    .attr('width', width)
    .attr('height', height)

  clean('isFirst')

  d3.select('.categoryLegend').transition().remove()

  svg.select('.y-axis-film-name')
    .attr('opacity', 1)
  svg.select('.x-axis-moment-in')
    .attr('opacity', 1)

  svg.selectAll('circle')
    .transition().duration(500).delay(100)
    .attr('fill', 'black')
    .attr('r', 3)
    .attr('cx', (d, i) => momentInXScale(d.momentIn) + 5)
    .attr('cy', (d, i) => movieNameYScale(d.movieName))

  svg.selectAll('.small-text').transition()
    .attr('opacity', 1)
    .attr('x', margin.left)
    .attr('y', (d, i) => i * 5.2 + 30)
}


function draw2() {
  let svg = d3.select("#vis").select('svg')

  clean('none')

  svg.selectAll('circle')
    .transition().duration(300).delay((d, i) => i * 5)
    .attr('r', d => durationScale(d.momentDuration) * 1.1)
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  simulation
    .force('charge', d3.forceManyBody().strength([2]))
    .force('forceX', d3.forceX(d => vehicleMomentsXY[d.momentType][0] + 200))
    .force('forceY', d3.forceY(d => vehicleMomentsXY[d.momentType][1] - 50))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration) + 4))
    .alphaDecay([0.02])

  //Reheat simulation and restart
  simulation.alpha(0.9).restart()

  createLegend(20, 10)
}

function draw3() {
  let svg = d3.select("#vis").select('svg')
  clean('isMultiples')

  svg.selectAll('circle')
    .transition().duration(400).delay((d, i) => i * 5)
    //.attr('r', d => filterCar)
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
    .attr('opacity', 0.2)
    .attr('x', d => landBasedLabelXY[d][0] - 45)
    .attr('y', d => landBasedLabelXY[d][1] - 20)

  svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
    .attr('x', d => landBasedLabelXY[d][0])
    .attr('y', d => landBasedLabelXY[d][1])
    .attr('opacity', 1)

  simulation
    .force('charge', d3.forceManyBody().strength([2]))
    .force('forceX', d3.forceX(d => landBasedXY[d.momentVehicleClass][0])) //+ filterCar(d))) //move non-cars off the screen
    .force('forceY', d3.forceY(d => landBasedXY[d.momentVehicleClass][1] - 50))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration) + 4))
    .alpha(0.7).alphaDecay(0.02).restart()

}

function draw4() {
  let svg = d3.select("#vis").select('svg')
  clean('isMultiples')

  svg.selectAll('circle')
    .transition().duration(400).delay((d, i) => i * 5)
    //.attr('r', d => filterCar)
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
    .attr('opacity', 0.2)
    .attr('x', d => waterBasedLabelXY[d][0] - 45)
    .attr('y', d => waterBasedLabelXY[d][1] - 20)

  svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
    .attr('x', d => waterBasedLabelXY[d][0])
    .attr('y', d => waterBasedLabelXY[d][1])
    .attr('opacity', 1)

  simulation
    .force('charge', d3.forceManyBody().strength([2]))
    .force('forceX', d3.forceX(d => waterBasedXY[d.momentVehicleClass][0])) //+ filterCar(d))) //move non-cars off the screen
    .force('forceY', d3.forceY(d => waterBasedXY[d.momentVehicleClass][1] - 50))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration) + 4))
    .alpha(0.7).alphaDecay(0.02).restart()
}


//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
  draw1,
  draw2,
  draw3,
  draw4

]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
  .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index) {
  d3.selectAll('.step')
    .transition().duration(500)
    .style('opacity', function(d, i) {
      return i === index ? 1 : 0.1;
    });

  activeIndex = index
  let sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
  let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
  scrolledSections.forEach(i => {
    activationFunctions[i]();
  })
  lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress) {
  if (index == 2 & progress > 0.7) {

  }
})