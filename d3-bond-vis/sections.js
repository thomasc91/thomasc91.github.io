let dataset, svg
let simulation, nodes

const margin = {
  left: 170,
  top: 50,
  bottom: 50,
  right: 20
}
const width = 800
const height = 650

const topVehicles = [
  '1_1964 Aston Martin DB5',
  '2_Parachute',
  '3_Skis',
  '4_Train',
  '5_Horse',
  '0_Other'
]

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
  'air-based': [50, 200],
  'land-based': [400, 400], //big
  'water-based': [50, 500], //big
}

const landBasedXY = {
  'Car': [430, 470], //big
  'Truck': [50, 450],
  'Train': [150, 600],
  'Animal': [500, 250],
  'Sleigh': [170, 750],
  'Cable car': [700, 300],
  'Skis': [680, 630],
  'Hovercraft': [550, 600],
  'Motorcycle': [200, 300],
  'Bus': [700, 500],
  'Rickshaw': [300, 600],
  'Snowmobile': [50, 750],
  'Tram': [700, 400],
  'Cello case': [350, 790],
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
  'Car': [430, 570], //big
  'Truck': [50, 470],
  'Train': [150, 620],
  'Animal': [500, 270],
  'Sleigh': [170, 740],
  'Cable car': [690, 300],
  'Skis': [680, 630],
  'Hovercraft': [550, 600],
  'Motorcycle': [200, 310],
  'Bus': [690, 500],
  'Rickshaw': [300, 600],
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

  'Boat': [430, 350], //big
  'Submarine': [150, 400],
  'Life raft': [680, 400],
  'Wetbike': [550, 480],
  'Surfboard': [300, 480]
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

  'Boat': [430, 400], //big
  'Submarine': [150, 410],
  'Life raft': [680, 400],
  'Wetbike': [550, 470],
  'Surfboard': [300, 470]
}

const airBasedXY = {
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

  'Airplane': [430, 500],
  'Jetpack': [200, 450],
  'Helicopter': [650, 450],
  'Skyhook': [200, 550],
  'Parachute': [600, 620],
  'Paraglider': [200, 650],
  'Space shuttle': [400, 300],
  'Space station': [250, 300],
  'Balloon': [400, 650],

  'Boat': [2000, 500], //big
  'Submarine': [2000, 600],
  'Life raft': [2000, 500],
  'Wetbike': [2000, 680],
  'Surfboard': [2000, 700]
}

const airBasedLabelXY = {
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

  'Airplane': [430, 550],
  'Jetpack': [200, 450],
  'Helicopter': [650, 490],
  'Skyhook': [200, 550],
  'Parachute': [600, 620],
  'Paraglider': [200, 640],
  'Space shuttle': [400, 310],
  'Space station': [250, 310],
  'Balloon': [400, 640],

  'Boat': [2000, 600], //big
  'Submarine': [2000, 620],
  'Life raft': [2000, 500],
  'Wetbike': [2000, 660],
  'Surfboard': [2000, 690]
}

//Read Data, convert numerical categories into floats
//Create the initial visualisation

function downArrowShow() {
  $('.scroll-down').fadeIn(1000).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000);
}
d3.csv('data/james-bond-data.csv', function(d) {
  return {
    movieName: d.movieName,
    movieActor: d.movieActor,
    bondImg: d.bondImg,
    vehicleName: d.momentVehicle,
    momentVehicleTop: d.momentVehicleTop,
    momentIn: +d.momentIn,
    momentDuration: +d.momentDuration,
    movieDuration: +d.movieDuration,
    momentDurationStacked: +d.momentDurationStacked,
    momentVehicleClass: d.momentVehicleClass,
    momentType: d.momentType,
    movieYear: +d.movieYear

  };
}).then(data => {
  dataset = data

  createScales()
  setTimeout(drawInitial(), 100)
})


const colors = [
  '#968148',
  '#968148',
  '#968148',
  '#968148',
  '#968148',
  '#968148',
  '#968148',
  '#968148',
  '#968148',

  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',
  '#848484',

  '#5584AC',
  '#5584AC',
  '#5584AC',
  '#5584AC',
  '#5584AC',
]

const colorsTop = [
  '#848484',
  '#968148',
  '#848484',
  '#848484',
  '#848484',
  'black'
]

//Create all the scales and save to global variables

function createScales() {
  durationScale = d3.scaleLinear(d3.extent(dataset, d => d.momentDuration), [6, 18])
  durationStackedXScale = d3.scaleLinear(d3.extent(dataset, d => d.momentDurationStacked), [margin.left, width - margin.right - 80])
  movieYearXScale = d3.scaleLinear(d3.extent(dataset, d => d.movieYear), [margin.left, width - margin.right - 80]).nice()
  momentInXScale = d3.scaleLinear(d3.extent(dataset, d => d.momentIn), [margin.left, width - margin.right])
  movieNameYScale = d3.scalePoint().domain(dataset.map(d => d.movieName)).range([margin.top, height - margin.bottom]).padding(0.5)
  vehicleImgYScale = d3.scalePoint().domain(dataset.map(d => d.momentVehicleTop)).range([margin.top, height - margin.bottom]).padding(0.5)
  bondImgYScale = d3.scalePoint().domain(dataset.map(d => d.movieActor)).range([margin.top, height - margin.bottom]).padding(0.5)
  categoryColorScale = d3.scaleOrdinal(vehicleClasses, colors)
  categoryColorScaleTop = d3.scaleOrdinal(topVehicles, colorsTop)

}
var formatSeconds = d3.format(".1f")
var formatSeconds2 = d3.format(".0f")

function createSizeLegend2() {
  let svg = d3.select('#legend3')
  svg.append('g')
    .attr('class', 'sizeLegend2')
    .attr('transform', `translate(50,100)`)
    .attr('stroke', 'white')

  sizeLegend2 = d3.legendSize()
    .scale(durationScale)
    .shape('circle')
    .shapePadding(20)
    .orient('vertical')
    .title('Vehicle screen time')
    .labels(['2 seconds', '1 minute', '20 minutes'])
    .labelOffset(50)
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
  createSizeLegend2()

  let svg = d3.select("#vis")
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 1)

  let xAxisGeneratorYear = d3.axisBottom()
    .scale(movieYearXScale)
    .tickFormat(d3.format("d"))
    .tickSize(0)

  let xAxisYear = svg.append('g')
    .call(xAxisGeneratorYear.ticks(5))
    .style("font", "16px Domine")
    .attr('class', 'x-axis-movie-year')
    .attr('transform', `translate(0, ${height - margin.top})`)
    .call(g => g.select(".domain")
      .remove())
    .attr('opacity', 0)

  let xAxisYearLabel = svg.append("text")
    .attr("x", width / 2 - 20)
    .attr("y", height)
    .style("font", "16px Domine")
    .attr("class", "x-axis-movie-year-label")
    .style("fill", "white")
    .text('Film Release Year')
    .attr('opacity', 0)

  let yAxisGeneratorBondImg = d3.axisLeft()
    .scale(bondImgYScale)
    .tickSize(0)

  let yAxisBondImg = svg.append('g')
    .call(yAxisGeneratorBondImg)
    .attr('class', 'y-axis-bond-img')
    .attr('transform', `translate(${margin.left - 20}, 0)`)
    .call(g => g.select(".domain")
      .remove())
    .attr('opacity', 0)

  let yAxisGeneratorVehicleImg = d3.axisLeft()
    .scale(vehicleImgYScale)
    .tickSize(0)

  let yAxisVehicle = svg.append('g')
    .call(yAxisGeneratorVehicleImg)
    .attr('class', 'y-axis-vehicle-img')
    .attr('transform', `translate(${margin.left - 20}, 0)`)
    .call(g => g.select(".domain")
      .remove())

    .attr('opacity', 0)

  let barrelImg = svg.append('image')
    .attr('class', 'barrelImg')
    .attr('xlink:href', 'barrel.png')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 1)

  svg.select(".y-axis-bond-img").selectAll("text").remove();

  var ticks = svg.select(".y-axis-bond-img").selectAll(".tick")
    .append("svg:image")
    .attr("xlink:href", function(d, i) {
      return i + '.PNG'
    })
    .attr("width", 80)
    .attr("height", 80)
    .attr("x", -90)
    .attr("y", -50)

  svg.select(".y-axis-vehicle-img").selectAll("text").remove();

  var ticksVehicle = svg.select(".y-axis-vehicle-img").selectAll(".tick")
    .append("svg:image")
    .attr("xlink:href", function(d, i) {
      return i + '_vehicle' + '.PNG'
    })
    .attr("width", 120)
    .attr("height", 100)
    .attr("x", -150)
    .attr("y", -50)

  simulation = d3.forceSimulation(dataset)

  // Define each tick of simulation
  simulation.on('tick', () => {
    nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  })
  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(580))
    .force('forceY', d3.forceY(360))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alphaDecay([0.02])

  simulation.tick(50)

  // Stop the simulation until later
  simulation.stop()

  // Selection of all the circles
  nodes = svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('r', d => durationScale(d.momentDuration))
    .attr('cx', (d, i) => 580)
    .attr('cy', (d, i) => 480)
    .attr('opacity', 1)
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))


  simulation.alpha(0.2).restart()

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
      .attr('stroke', 'white')

    d3.select('#tooltip')
      .style('left', (d3.event.pageX + 10) + 'px')
      .style('top', (d3.event.pageY - 25) + 'px')
      .style('display', 'inline-block')
      .html(`<strong>Film:</strong> ${d.movieName}
        <br> <strong>Year:</strong> ${d.movieYear}
            <br> <strong>Vehicle:</strong> ${d.vehicleName}
            <br> <strong>Vehicle type:</strong> ${d.momentVehicleClass}
            <br> <strong>Actor: </strong> ${d.movieActor}
            <br> <strong>Time in vehicle: </strong> ${formatSeconds(d.momentDuration/60)} minutes
            <br> <strong>Film duration: </strong> ${formatSeconds2(d.movieDuration/60)} minutes
            `)
  }

  function mouseOut(d, i) {
    d3.select('#tooltip')
      .style('display', 'none')

    d3.select(this)
      .transition('mouseout').duration(100)
      .attr('opacity', 1)
      .attr('stroke-width', 0.5)
      .attr('stroke', 'black')

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
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .raise()

}

//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type

function clean(chartType) {
  let svg = d3.select('#vis').select('svg')
  if (chartType !== "isMultiples") {
    svg.selectAll('.lab-text').transition().attr('opacity', 0)
    svg.selectAll('.cat-rect').transition().attr('opacity', 0)
  }
  if (chartType !== "isFirst") {
    svg.select('.barrelImg').transition().attr('opacity', 0)
  }
  if (chartType !== "isBondImg") {
    svg.select('.y-axis-bond-img').transition().attr('opacity', 0)
  }
  if (chartType !== "isVehicleImg") {
    svg.select('.y-axis-vehicle-img').transition().attr('opacity', 0)
    svg.select('.x-axis-movie-year').transition().attr('opacity', 0)
    svg.select('.x-axis-movie-year-label').transition().attr('opacity', 0)
  }
}

//First draw function

function draw1() {

  let svg = d3.select("#vis")
    .select('svg')
    .attr('width', width)
    .attr('height', height)

  clean('isFirst')

  d3.select('.barrelImg')
    .transition()
    .attr('opacity', 1)

  d3.select('.categoryLegend').transition().remove()

  svg.selectAll('circle')
    .transition().duration(200).delay((d, i) => i * 2)
    .attr('r', d => durationScale(d.momentDuration))
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(580))
    .force('forceY', d3.forceY(360))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alphaDecay([0.02])

  //Reheat simulation and restart
  simulation.alpha(0.5).restart()

  //createLegend(20, 10)

  //  svg.selectAll('.small-text').transition()
  //    .attr('opacity', 1)
  //    .attr('x', margin.left)
  //    .attr('y', (d, i) => i * 5.2 + 30)
}


function draw2() {
  let svg = d3.select("#vis").select('svg')

  clean('none')

  svg.selectAll('circle')
    .transition().duration(200).delay((d, i) => i * 2)
    .attr('r', d => durationScale(d.momentDuration))
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(d => vehicleMomentsXY[d.momentType][0] + 200))
    .force('forceY', d3.forceY(d => vehicleMomentsXY[d.momentType][1] - 50))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alphaDecay([0.02])

  //Reheat simulation and restart
  simulation.alpha(0.5).restart()

  //createLegend(20, 50)
}

function draw3() {
  let svg = d3.select("#vis").select('svg')
  clean('isMultiples')

  svg.selectAll('circle')
    .transition().duration(400).delay((d, i) => i * 5)
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  svg.selectAll('.cat-rect').transition().duration(100)
    .attr('opacity', 0.2)
    .attr('x', d => landBasedLabelXY[d][0] - 45)
    .attr('y', d => landBasedLabelXY[d][1] - 20)


  svg.selectAll('.lab-text').transition().duration(100)
    .attr('x', d => landBasedLabelXY[d][0])
    .attr('y', d => landBasedLabelXY[d][1])
    .attr('opacity', 1)

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(d => landBasedXY[d.momentVehicleClass][0])) //+ filterCar(d))) //move non-cars off the screen
    .force('forceY', d3.forceY(d => landBasedXY[d.momentVehicleClass][1] - 50))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alpha(0.7).alphaDecay(0.02).restart()

}

function draw4() {
  let svg = d3.select("#vis").select('svg')
  clean('isMultiples')

  svg.selectAll('circle')
    .transition().duration(400).delay((d, i) => i * 5)
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  svg.selectAll('.cat-rect').transition().duration(100)
    .attr('opacity', 0.2)
    .attr('x', d => waterBasedLabelXY[d][0] - 45)
    .attr('y', d => waterBasedLabelXY[d][1] - 20)

  svg.selectAll('.lab-text').transition().duration(100)
    .attr('x', d => waterBasedLabelXY[d][0])
    .attr('y', d => waterBasedLabelXY[d][1])
    .attr('opacity', 1)

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(d => waterBasedXY[d.momentVehicleClass][0])) //+ filterCar(d))) //move non-cars off the screen
    .force('forceY', d3.forceY(d => waterBasedXY[d.momentVehicleClass][1] - 50))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alpha(0.7).alphaDecay(0.02).restart()
}

function draw5() {
  let svg = d3.select("#vis").select('svg')
  clean('isMultiples')

  svg.selectAll('circle')
    .transition() //.duration(400).delay((d, i) => i * 5)
    .attr('r', d => durationScale(d.momentDuration))
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  svg.selectAll('.cat-rect').transition().duration(100)
    .attr('opacity', 0.2)
    .attr('x', d => airBasedLabelXY[d][0] - 45)
    .attr('y', d => airBasedLabelXY[d][1] - 20)

  svg.selectAll('.lab-text').transition().duration(100)
    .attr('x', d => airBasedLabelXY[d][0])
    .attr('y', d => airBasedLabelXY[d][1])
    .attr('opacity', 1)

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(d => airBasedXY[d.momentVehicleClass][0])) //+ filterCar(d))) //move non-cars off the screen
    .force('forceY', d3.forceY(d => airBasedXY[d.momentVehicleClass][1] - 50))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alpha(0.7).alphaDecay(0.02).restart()
}

function draw6() {
  //Stop simulation
  simulation.stop()

  clean('isBondImg')
  let svg = d3.select("#vis").select('svg')
  svg.select('.y-axis-bond-img')
    .attr('opacity', 1)

  svg.selectAll('circle')
    .transition().duration(100).delay(50)
    .attr('r', d => durationScale(d.momentDuration))
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(d => durationStackedXScale(d.momentDurationStacked) + 20)) //+ filterCar(d))) //move non-cars off the screen
    .force('forceY', d3.forceY(d => bondImgYScale(d.movieActor)))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alpha(0.7).alphaDecay(0.02).restart()

}

function draw7() {
  //Stop simulation
  simulation.stop()

  clean('isVehicleImg')
  let svg = d3.select("#vis").select('svg')
  svg.select('.y-axis-vehicle-img')
    .attr('opacity', 1)
  svg.select('.x-axis-movie-year')
    .attr('opacity', 1)
  svg.select('.x-axis-movie-year-label')
    .attr('opacity', 1)

  svg.selectAll('circle')
    .transition()
    .attr('r', d => durationScale(d.momentDuration))
    .attr('fill', d => categoryColorScaleTop(d.momentVehicleTop))

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(d => movieYearXScale(d.movieYear)))
    .force('forceY', d3.forceY(d => vehicleImgYScale(d.momentVehicleTop)))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alpha(0.7).alphaDecay(0.02).restart()

}

function draw8() {

  let svg = d3.select("#vis")
    .select('svg')
    .attr('width', width)
    .attr('height', height)

  clean('isLast')


  svg.selectAll('circle')
    .transition().duration(200).delay((d, i) => i * 2)
    .attr('r', d => durationScale(d.momentDuration))
    .attr('fill', d => categoryColorScale(d.momentVehicleClass))

  simulation
    .force('charge', d3.forceManyBody().strength([0.01]))
    .force('forceX', d3.forceX(width / 2))
    .force('forceY', d3.forceY(height / 2))
    .force('collide', d3.forceCollide(d => durationScale(d.momentDuration)))
    .alphaDecay([0.02])

  //Reheat simulation and restart
  simulation.alpha(0.5).restart()

  //createLegend(20, 10)

  //  svg.selectAll('.small-text').transition()
  //    .attr('opacity', 1)
  //    .attr('x', margin.left)
  //    .attr('y', (d, i) => i * 5.2 + 30)
}

//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
  draw1,
  draw2,
  draw6,
  draw7,
  draw5,
  draw3,
  draw4,
  draw8

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