d3.csv('cyber_incidents.csv')
.then(function (data) {

	// Access the data
	var yAccessor = d => d.incident
	var xAccessor = d => +d.frequency

	// Create chart dimensions
	var width = 700
	
	let dimensions = {
		width: width,
		height: width * 0.4,
		margin: {
			top: 10,
			right: 30,
			bottom: 50,
			left: 250,
		},
	}	
	dimensions.boundedWidth = width
		 - dimensions.margin.left
		 - dimensions.margin.right
	dimensions.boundedHeight = dimensions.height
		 - dimensions.margin.top
		 - dimensions.margin.bottom

	// Draw canvas
	var barWrapper = d3.select("#barWrapper")
		.append("svg")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height)

	var bounds = barWrapper.append("g")
		.style("transform", `translate(${
		dimensions.margin.left
		}px, ${
		dimensions.margin.top
		}px)`)

	// Create axes
	var yScale = d3.scaleBand()
		.domain(data.map(yAccessor))
		.padding(0.1)
		.range([0, dimensions.boundedHeight])

	var xScale = d3.scaleLinear()
		.domain([0, d3.max(data.map(xAccessor))])
		.range([0, dimensions.boundedWidth])
		.nice()

	var yAxisGenerator = d3.axisLeft()
		.scale(yScale)

	var xAxisGenerator = d3.axisBottom()
		.scale(xScale)
		.ticks(10)

	// Draw data
	var barTransition = d3.transition().duration(750)

	var colour = d3.scaleSequential(d3.interpolateBlues)
		.domain([0, d3.max(data.map(xAccessor))])

	var barGroups = bounds.selectAll("g")
		.data(data)
		.enter().append("g")

	var barRects = barGroups.append("rect")
		.attr("y", d => yScale(yAccessor(d)))
		.attr("height", yScale.bandwidth())
		.transition(barTransition).delay((d, i) => {
			return i * 150;
		})
		.attr("width", d => xScale(xAccessor(d)))
		.attr("fill", function (d) {
			return colour(d.frequency)
		})

	var barText = barGroups.filter(xAccessor)
		.append("text")
		.attr("y", d => yScale(yAccessor(d)) + yScale.bandwidth() / 2 + 5)
		.style("text-anchor", "right")
		.transition(barTransition)
		.delay((d, i) => {
			return i * 150;
		})
		.text(xAccessor)
		.attr("x", d => xScale(xAccessor(d)) + 5)

	var xAxis = bounds.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)

	var yAxis = bounds.append("g")
		.call(yAxisGenerator)
		.style('transform', `translate(${dimensions.margin.left},0)`)

	var xAxisLabel = xAxis.append("text")
		.attr("x", dimensions.boundedWidth / 2)
		.attr("y", dimensions.margin.bottom - 10)
		.style("font-size", "16px")
		.text("Event Frequency")

})