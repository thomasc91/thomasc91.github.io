d3.csv("data.csv", d3.autoType).then(d => drawLineChart(d))

function drawLineChart(data) {	
	
	const yAccessor = d => d.coherence
	const xAccessor = d => d.topic_num
	
	// Set dimensions
	width = 400
	height = width * 1.6
	
	let dimensions = {
        width: width,
        height: width * 1.6,
        margin: {
            top: 10,
            right: 30,
            bottom: 50,
            left: 80,
        },
    }
    dimensions.boundedWidth = dimensions.width
         - dimensions.margin.left
         - dimensions.margin.right
        dimensions.boundedHeight = dimensions.height
         - dimensions.margin.top
         - dimensions.margin.bottom

	// Draw canvas
	const wrapper = d3.select("#wrapper")
	.append("svg")
	.attr("width", dimensions.width)
	.attr("height", dimensions.height)

	const bounds = wrapper.append("g")
	.style("transform", `translate(${
		dimensions.margin.left
	  }px, ${
		dimensions.margin.top
	  }px)`)
	  
	// Create axes
	const xScale = d3.scaleLinear()
		.domain(d3.extent(data, d => d.topic_num))        
        .range([0, dimensions.boundedWidth])
		
	const yScale = d3.scaleLinear()
		.domain([d3.max(data, d => d.coherence) *1.3,  0])        
        .range([0, dimensions.boundedHeight])
		.nice()
	const yAxisGenerator = d3.axisLeft()
        .scale(yScale)

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
		
	// Define line and tooltip
	
	const lineGenerator = d3.line()
		.curve(d3.curveBasis)
		.x(d => xScale(d.topic_num))
		.y(d => yScale(d.coherence));
	
	const line = bounds.append("path")
		.attr("class", "line")
		.attr("d", lineGenerator(data))
	
		
	
	// Draw lines and tooltip
	
	const listeningRect = bounds.append("rect")
    .attr("class", "listening-rect")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  const tooltipCircle = bounds.append("circle")
      .attr("class", "tooltip-circle")
      .attr("r", 4)
      .attr("stroke", "#af9358")
      .attr("fill", "white")
      .attr("stroke-width", 2)
      .style("opacity", 0)

 function onMouseMove() {
    const mousePosition = d3.pointer(event)
    const hoveredDate = xScale.invert(mousePosition[0])

    const getDistanceFromHoveredDate = d => Math.abs(xAccessor(d) - hoveredDate)
    const closestIndex = d3.scan(data, (a, b) => (
      getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b)
    ))
    const closestDataPoint = data[closestIndex]
	console.log(closestDataPoint)
    const closestXValue = xAccessor(closestDataPoint)
	console.log(closestXValue)
    const closestYValue = yAccessor(closestDataPoint)
    
	const formatNum = d => `<strong>${d3.format(".2")(d)}</strong>`
    tooltip.select("#topic")
        .html(formatNum(closestXValue))
	
	const formatDecimal = d => `<strong>${d3.format(".2f")(d)}</strong>`
    tooltip.select("#coherence")
        .html(formatDecimal(closestYValue))

    const x = xScale(closestXValue)
      + dimensions.margin.left
    const y = yScale(closestYValue)
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)

    tooltipCircle
        .attr("cx", xScale(closestXValue))
        .attr("cy", yScale(closestYValue))
        .style("opacity", 1)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)

    tooltipCircle.style("opacity", 0)
  }
// Draw axes
	
	 const xAxis = bounds.append("g")
		.call(xAxisGenerator)
		.attr("class", "x-axis")
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)		

	const yAxis = bounds.append("g")
		.call(yAxisGenerator)
		.attr("class", "y-axis")
		.style('transform', `translate(${dimensions.margin.left},0)`)

	 const yAxisLabel = yAxis.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 30)
      .html("Coherence score")
	  
	const xAxisLabel = xAxis.append("text")
       .attr("class", "x-axis-label")
	   .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
      .html("Topic count")



    		
}	