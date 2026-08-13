async function drawLines() {

  data = await d3.csv('../../data/bitcoin_price.csv')
  // Access the data
  var dateParse = d3.timeParse("%d/%m/%Y")
  var formatDate = d3.timeFormat("%d %B %Y")
  var formatUSD = d3.format("($,.2f");
  var yAccessor = d => +d.price
  var xAccessor = d => dateParse(d.date)

  // Create chart dimensions
  var width = d3.select('#lineChart').node().clientWidth;

  let dimensions = {
    width: width,
    height: 800,
    margin: {
      top: 10,
      right: 60,
      bottom: 90,
      left: 100,
    },
  }
  dimensions.boundedWidth = width
     - dimensions.margin.left
     - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
     - dimensions.margin.top
     - dimensions.margin.bottom

   // Call tooltips
   var tooltip = d3.tip()
     .attr("class", "d3-tip")
     .html((event, d) =>
     "Date: <b>" + formatDate(xAccessor(d)) + "</b><br>" +
     "Price (USD): <b>" + formatUSD(yAccessor(d)) + "</b><br>"
   )
     .direction('n');

  // Draw canvas
  var lineWrapper = d3.select("#lineChart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  var bounds = lineWrapper.append("g")
    .style("transform", `translate(${
    dimensions.margin.left
    }px, ${
    dimensions.margin.top
    }px)`)
    .call(tooltip)

  // Create axes
  var xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  var xAxisGenerator = d3.axisBottom()
    .scale(xScale)

	var yScale = d3.scaleLinear()
		.domain([d3.extent(data, yAccessor)[1], d3.extent(data, yAccessor)[0]])
    .range([0, dimensions.boundedHeight])
		.nice()

  var yAxisGenerator = d3.axisLeft()
    .ticks(5, "$,.0f")
    .scale(yScale)

  // Define line
	var lineGenerator = d3.line()
		.curve(d3.curveBasis)
		.x(d => xScale(xAccessor(d)))
		.y(d => yScale(yAccessor(d)))

	var line = bounds.append("path")
		.attr("class", "line")
    .attr("d", lineGenerator(data))

  var totalLength = line.node().getTotalLength();
  line.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(5000)
        .attr("stroke-dashoffset", 0);

  var circles = bounds.selectAll(".circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("fill", 'white')
     .attr("cx", d => xScale(xAccessor(d)))
     .attr("cy", d => yScale(yAccessor(d)))
     .attr("r", 6)
     .style("opacity", 0)
     .on('mouseover', tooltip.show)
     .on('mouseout', tooltip.hide)

  var xAxis = bounds.append("g")
    .call(xAxisGenerator)
  	.attr("class", "x axis")
  	.style("transform", `translateY(${dimensions.boundedHeight}px)`)

  var yAxis = bounds.append("g")
  	.call(yAxisGenerator)
  	.attr("class", "y-axis")
  	.style('transform', `translate(${dimensions.margin.left},0)`)

  bounds.select(".x.axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  var xAxisLabel = xAxis.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom -20)
    .text("Date")

}

drawLines()

var resizeTimer;
window.onresize = function(event) {
 clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function()
  {
    var s = d3.selectAll('svg');
    s = s.remove();
    drawLines()
  }, 100);
}
