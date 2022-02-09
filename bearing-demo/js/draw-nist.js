async function drawBeeswarm() {
  data = await d3.csv("../../data/nist.csv")

  var categoryAccessor = d => d.category
  var radiusAccessor = d => d.score * 5
  var gridXAccessor = d => d.grid_x
  var gridYAccessor = d => d.grid_y
  var nodeDefaultColour = '#FF8811'
  // Extend date range by 1 month

  var categoryColorRange = d3.scaleOrdinal()
    .domain(data.map(categoryAccessor))
    .range(['#5C95FF', '#17BEBB', '#EDB88B', '#FAD8D6', 'white']);

  d3.select("svg").remove();
  var width = d3.select("#beeswarm").node().clientWidth;
  var height = 400;
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
    "Category: <b>" + d.category + "</b><br>"
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
  var xScale = d3.scaleLinear()
    .domain([1, 3])
    .range([0, dimensions.boundedWidth])
    .nice()

  var yScale = d3.scaleLinear()
    .domain([0, 3])
    .range([0, dimensions.boundedHeight])
    .nice()

  var xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .ticks(3)

  var yAxisGenerator = d3.axisLeft()
    .scale(yScale)

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
    .attr("r", d => radiusAccessor(d))
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)

    simulation
      .alpha(0.3)
      .alphaTarget(0.3)
      .restart()
      .force("x", d3.forceX(d => xScale(gridXAccessor(d))).strength(0.1))
      .force("y", d3.forceY(d => yScale(gridYAccessor(d))).strength(0.1))
      .force("collide", d3.forceCollide().radius(d => radiusAccessor(d)).iterations(1))
      .on("tick", tick)

    bounds.selectAll(".node").transition()
      .duration(3000)
      .attr("fill", d => categoryColorRange(categoryAccessor(d)))
      .attr("r", radius_value)

    bounds.select(".y.axis")
      .call(yAxisGenerator)

    bounds.select(".x.axis")
      .call(xAxisGenerator)

    bounds.select('.x.axis.label')
      .text('Date')
      .attr("y", dimensions.boundedHeight + 40)

    simulation
      .alpha(0.3)
      .alphaTarget(0.3)
      .restart()
      .force("x", d3.forceX(d => xScale(gridXAccessor(d))).strength(0.1))
      .force("y", d3.forceY(d => yScale(gridYAccessor(d))).strength(0.1))
      .force("collide", d3.forceCollide().radius(d => radiusAccessor(d)).iterations(1))
      .on("tick", tick)

    bounds.selectAll(".node").transition()
      .duration(3000)
      .attr("fill", d => categoryColorRange(categoryAccessor(d)))
      .attr("r", d => radiusAccessor(d))

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
