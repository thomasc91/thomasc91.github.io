async function drawBars() {

  // 1. Access data
  const dataset = await d3.csv("word_count.csv")
  console.log(dataset)
  const metricAccessor = d => +d.word_count //the + converts to numeric from string
  const yAccessor = d => d.length
	
  // 2. Create chart dimensions

  const width = 1200
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // 4. Create scales

  const xScale = d3.scaleLinear()	
    .domain(d3.extent(dataset, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()
  console.log(d3.extent(dataset, metricAccessor))
  const binsGenerator = d3.histogram()
    .domain(xScale.domain())
    .value(metricAccessor)
    .thresholds(26)
  
  const bins = binsGenerator(dataset)
  console.log(bins)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  // 5. Draw data
  // Define transition chains
  const barTransition = d3.transition().duration(750)
  const meanTransition = barTransition.transition().duration(750)
  
  const binGroups = bounds.selectAll("g")
    .data(bins)
    .enter().append("g")

  const barPadding = 1
  
  const barRects = binGroups.append("rect")	  
      .attr("x", d => xScale(d.x0) + barPadding)
      .attr("y", d => dimensions.boundedHeight)
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
	  .attr("height", 0)
      .transition(barTransition)
	   .delay((d, i) => { return i * 150; })
	  .attr("y", d => yScale(yAccessor(d)))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
	  
      .attr("fill", "cornflowerblue")

  const barText = binGroups.filter(yAccessor)
    .append("text")
	//starting position of labels
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
	  .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "16px")
      .style("font-family", "sans-serif")
      .attr("y", d => dimensions.boundedHeight)
	  .transition(barTransition)
	  .delay((d, i) => { return i * 150; })
	  .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      
  const mean = d3.mean(dataset, metricAccessor)
  const meanLine = bounds.append("line")      
      //starting position of mean line	  	  
	  .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
	  .attr("y2", -15)
	  .transition(meanTransition)
	  .delay((d, i) => { return i * 500; })
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px")
	  
  const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
	  .style("font-family", "sans-serif")
      .text("mean")
      .attr("fill", "maroon")
      .style("font-size", "16px")
      .style("text-anchor", "middle")
	  

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
	.ticks(30)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
	  .style("font-size", "16px")

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "16px")
      .text("Word count")
      .style("text-transform", "capitalize")
}
drawBars()