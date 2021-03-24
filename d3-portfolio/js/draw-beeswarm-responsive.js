async function drawBeeswarm() {
  data = await d3.csv("../../data/fatal-police-shootings-data.csv")
  var dateParse = d3.timeParse("%d/%m/%Y");
  var formatDate = d3.timeFormat("%d %B %Y")

  var xAccessor = d => dateParse(d.date)
  var yAccessor = d => d.race
  var genderAccessor = d => d.gender
  var radiusAccessor = d => d.age * 0.1
  var ageGroupAccessor = d => d.age_group
  var ageGroupCountAccessor = d => +d.age_group_count

  var nodeDefaultColour = '#FF8811'
  // Extend date range by 1 month
  var dateRange = d3.extent(data, xAccessor)
  var dateRangeExtended = [d3.timeMonth.offset(dateRange[0], - 2), dateRange[1]]

  var AgeColorRange = d3.scaleOrdinal()
    .domain(data.map(ageGroupAccessor))
    .range(['orange', 'gray']);

  var genderColorRange = d3.scaleOrdinal()
    .domain(data.map(genderAccessor))
    .range(['#9DD9D2', '#F4D06F']);

  var raceColorRange = d3.scaleOrdinal()
    .domain(data.map(yAccessor))
    .range(['#5C95FF', '#17BEBB', '#EDB88B', '#FAD8D6', 'white', '#2E282A', '#B9E6FF']);


  d3.select("svg").remove();
  var width = d3.select("#beeswarm").node().clientWidth;
  var height = 700;
  var dimensions = {
    width: width,
    height: height,
    margin: {
      top: 40,
      right: 40,
      bottom: 90,
      left: 130
    },
  }

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .html((EVENT, d) =>
    "Name: <b>" + d.name + "</b><br>" +
    "Date: <b>" + formatDate(xAccessor(d)) + "</b><br>" +
    "Race: <b>" + d.race + "</b><br>" +
    "Armed: <b>" + d.armed + "</b><br>" +
    "Age: <b>" + d.age + "</b><br>" +
    "Gender: <b>" + d.gender + "</b><br>" +
    "Fleeing from police: <b>" + d.flee + "</b><br>"

  )
  .direction('s');

  var wrapper = d3.select("#beeswarm")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  var bounds = wrapper.append("g")
    .style("transform", `translate(${
      dimensions.margin.left
    }px, ${
      dimensions.margin.top
    }px)`)
    .call(tooltip)


  // x-axis Scales and Generators
  var xScale = d3.scaleTime()
    .domain(dateRangeExtended)
    .range([0, dimensions.boundedWidth])
    .nice()

  var xAxisGeneratorBlank = d3.axisBottom()
        .tickValues([])
        .scale(xScale)

  var xScaleAge = d3.scalePoint()
      .domain(["0-4","5-9", "10-14", "15-19",	"20-24",	"25-29",	"30-24",	"35-39",	"40-44",	"45-49",	"50-54",	"55-59",	"60-64",	"65-69",	"70-74",	"75-79",	"80-84",	"85+", "Unknown"])
      .range([0, dimensions.boundedWidth])

  var xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .ticks(3)

  var xAxisGeneratorAge = d3.axisBottom()
    .scale(xScaleAge)

  // y-axis Scales and Generators
  var yScale = d3.scalePoint()
    .domain(data.map(yAccessor))
    .padding(0.5)
    .range([0, dimensions.boundedHeight])

  var yScaleGender = d3.scalePoint()
    .domain(data.map(genderAccessor))
    .padding(0.5)
    .range([0, dimensions.boundedHeight])

  var yScaleAgeCount = d3.scaleLinear()
    .domain([210, -5])
    .range([0, dimensions.boundedHeight])

  var yAxisGeneratorBlank = d3.axisLeft()
      .tickValues([])
      .scale(yScale)

  var yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  var yAxisGeneratorGender = d3.axisLeft()
    .scale(yScaleGender)

  var yAxisGeneratorAgeCount = d3.axisLeft()
      .scale(yScaleAgeCount)

  var radius_value = 5

  var simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(dimensions.boundedWidth/2).strength(0.04))
    .force("y", d3.forceY(dimensions.boundedHeight/2).strength(0.04))
    .force("collide", d3.forceCollide().radius(radius_value*1.4).iterations(1))
    .on("tick", tick)

  function tick() {
    d3.selectAll(".node")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
    }

  var node = bounds.selectAll(".node")
    .data(data).enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", d => radius_value)
    .attr("fill", nodeDefaultColour)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)

  var xAxis = bounds.append("g")
    .call(xAxisGeneratorBlank)
    .attr("class", "x axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .call(g => g.select(".domain").remove())

  var yAxis = bounds.append("g")
    .call(yAxisGeneratorBlank)
    .attr("class", "y axis")
    .style("transform", `translate(${dimensions.margin.left},0)`)
    .call(g => g.select(".domain").remove())

  bounds.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.boundedHeight + 40)
    .attr("class", "x axis label")
    .style("fill", "white")

  d3.select("#header_text")
    .text("978 people have been shot and killed by police in the past year. Each circle represents a victim.")

  var button_race = d3.select("#race_button");
  var button_gender = d3.select("#gender_button");
  var age_button = d3.select("#age_button");

  button_race.on("click", function(d) {
    d3.select("#header_text")
      .text("Despite only representing 13% of the U.S. population, Black Americans are shot by police at a disproportionately high rate relative to White Americans.")


    simulation
      .alpha(0.3)
      .alphaTarget(0.3)
      .restart()
      .force("x", d3.forceX(d => xScale(xAccessor(d))).strength(0.1))
      .force("y", d3.forceY(d => yScale(yAccessor(d))).strength(0.1))
      .force("collide", d3.forceCollide().radius(radius_value).iterations(1))
      .on("tick", tick)

    bounds.selectAll(".node").transition()
      .duration(3000)
      .attr("fill", d => raceColorRange(yAccessor(d)))
      .attr("r", radius_value)

    bounds.select(".y.axis")
      .call(yAxisGenerator)

    bounds.select(".x.axis")
      .call(xAxisGenerator)

    bounds.select('.x.axis.label')
      .text('Date')
      .attr("y", dimensions.boundedHeight + 40)


  })

  button_gender.on("click", function(d) {
  d3.select("#header_text")
    .text("Over 95% of of people shot and killed by police are male.")

    simulation
      .alpha(0.3)
      .alphaTarget(0.3)
      .restart()
      .force("x", d3.forceX(d => xScale(xAccessor(d))).strength(0.1))
      .force("y", d3.forceY(d => yScaleGender(genderAccessor(d))).strength(0.1))
      .force("collide", d3.forceCollide().radius(radius_value).iterations(1))
      .on("tick", tick)

    bounds.selectAll(".node").transition()
      .duration(3000)
      .attr("fill", d => genderColorRange(genderAccessor(d)))

    bounds.select(".y.axis")
      .call(yAxisGeneratorGender)

    bounds.select(".x.axis")
      .call(xAxisGenerator)
    bounds.select('.x.axis.label')
      .text('Date')
      .attr("y", dimensions.boundedHeight + 40)


  })
    //Age button
    age_button.on("click", function(d) {
    d3.select("#header_text")
      .text("More than half of the victims are aged between 20 and 40.")

      simulation
        .alpha(0.3)
        .alphaTarget(0.3)
        .restart()
        .force("x", d3.forceX(d => xScaleAge(ageGroupAccessor(d))).strength(0.1))
        .force("y", d3.forceY(d => yScaleAgeCount(ageGroupCountAccessor(d))).strength(0.1))
        .force("collide", d3.forceCollide().radius(radius_value).iterations(1))
        .on("tick", tick)

      bounds.selectAll(".node").transition()
        .duration(1000)
        .attr("fill", nodeDefaultColour)
        .attr("r", radius_value)

      bounds.select(".x.axis")
        .call(xAxisGeneratorAge)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
      bounds.select('.x.axis.label')
        .text('Age group')
        .attr("y", dimensions.boundedHeight + 80)

      bounds.select(".y.axis")
        .call(yAxisGeneratorAgeCount)
  })






};
drawBeeswarm();

var resizeTimer;
window.onresize = function(event) {
 clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function()
  {
    var s = d3.selectAll('svg');
    s = s.remove();
    drawBeeswarm();
  }, 100);
}
