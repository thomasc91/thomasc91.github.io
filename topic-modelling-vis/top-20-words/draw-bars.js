async function drawBars() {

  // 1. Access data
  dataset = await d3.csv("top_20_words.csv")   
  const yAccessor = d => d.word
  const xAccessor = d => +d.frequency
  // 2. Create chart dimensions
  const width = 400
  let dimensions = {
    width: width,
    height: width * 1.6,
    margin: {
      top: 10,
      right: 30,
      bottom: 50,
      left: 30,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas
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

  // 4. Create axes
  const yScale = d3.scaleBand()  		
		.domain(dataset.map(yAccessor))
		.padding(0.1)
		.range([0, dimensions.boundedHeight])
		
  const xScale = d3.scaleLinear()
		.domain([0, d3.max(dataset.map(xAccessor))])
		.range([0, dimensions.boundedWidth])
		.nice()
      
   const yAxisGenerator = d3.axisLeft()
		.scale(yScale)
		
   const xAxisGenerator = d3.axisBottom()
		.scale(xScale)
		.ticks(10)
				
  // 5. Draw data
  const barTransition = d3.transition().duration(750)
  
  const colour = d3.scaleSequential(d3.interpolateBlues)		 
		 .domain([0, d3.max(dataset.map(xAccessor))])
  
  const barGroups = bounds.selectAll("g")
		.data(dataset)
		.enter().append("g")
		
  const barPadding = 1
  
  const barRects = barGroups.append("rect")				
		.attr("y", d => yScale(yAccessor(d)))
		.attr("x", yScale(xAccessor.x0))
		.attr("height",  yScale.bandwidth())
		.transition(barTransition).delay((d, i) => { return i * 150; })
		.attr("width", d => xScale(xAccessor(d)))		
		.attr("fill", function(d) {
        	return colour(d.frequency)
      	})
		
  const barText = barGroups.filter(xAccessor)
    .append("text")	
      .attr("x", d => yScale(d.x0))  
	  .attr("y", d => yScale(yAccessor(d)) + yScale.bandwidth()/ 2 + 5)
	  .style("text-anchor", "right")
      .transition(barTransition)
	  .delay((d, i) => { return i * 150; })
      .text(xAccessor)
	  .attr("x",  d => xScale(xAccessor(d)) + 5)  

  // 6. Draw peripherals (must be done after the bars otherwise they are overwritten)
   const xAxis = bounds.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)		

	const yAxis = bounds.append("g")
		.call(yAxisGenerator)
		.style('transform', `translate(${dimensions.margin.left},0)`)
		
	const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
	  .style("font-size", "16px")
      .text("Word frequency")
	  
}
drawBars()