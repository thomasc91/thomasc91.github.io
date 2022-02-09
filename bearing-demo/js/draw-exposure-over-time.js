async function drawLines() {

  data = await d3.csv('../../data/exposure_over_time.csv')

  //Line and axis accessors
  var dateParse = d3.timeParse("%d/%m/%Y")
  var formatDate = d3.timeFormat("%d %B %Y")
  var formatAUD = d3.format("($,");
  var yAccessor = d => +d.exposure
  var xAccessor = d => dateParse(d.date)

  //Axis bounds
  var yAxisMax = d3.extent(data, yAccessor)[1] * 1.1 //add 10% to highest exposure data point
  var xAxisMin = d3.timeMonth.offset(d3.min(data, d =>  dateParse(d.date)), -2)// subtract 2 months
  var xAxisMax = d3.timeMonth.offset(d3.max(data, d =>  dateParse(d.date)), 2)// add 2 months

  //Tooltip accessors
  var reportDateAccessor = d => dateParse(d.report_date)
  var reportDescriptionAccessor = d => d.tooltip
  var reportExposureAccessor = d => +d.report_exposure

  // Create chart dimensions
  var width = 640
  //d3.select('#exposure-over-time-line-chart').node().clientWidth;

  let dimensions = {
    width: width,
    height: 300,
    margin: {
      top: 10,
      right: 60,
      bottom: 20,
      left: 60,
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
     "Aggregate loss exposure: <b>" + formatAUD(yAccessor(d)) + "</b><br>"
   )
     .direction('n');
  console.log(tooltip)
  // Draw canvas
  var lineWrapper = d3.select("#exposure-over-time-line-chart")
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
    .domain([xAxisMin, xAxisMax])
    .range([0, dimensions.boundedWidth])
    .nice()

  var xAxisGenerator = d3.axisBottom()
    .scale(xScale)

	var yScale = d3.scaleLinear()
		.domain([yAxisMax, 0])
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
    .style("fill","none")
    .style('stroke', '#039be5')
    .attr("d", lineGenerator(data))
    

  var totalLength = line.node().getTotalLength();
  line.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(3500)
        .attr("stroke-dashoffset", 0);

  var circles = bounds.selectAll(".circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", d => xScale(xAccessor(d)))
     .attr("cy", d => yScale(yAccessor(d)))
     .attr("r", 7)
     .style("opacity", 0)
     .on('mouseover', tooltip.show)
     .on('mouseout', tooltip.hide)

  var xAxis = bounds.append("g")
    .call(xAxisGenerator)
  	.attr("class", "x-axis")
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
    .attr("transform", "rotate(-45)");


}

drawLines()
