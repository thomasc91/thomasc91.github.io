async function drawBars(nist_category) {

  // 1. Access data
  dataset = await d3.csv("../../data/nist-bars.csv")
  dataFiltered = dataset.filter(function(d){ return d.category == nist_category })
  const yAccessor = d => d.category
  const xAccessor = d => +d.score
  // 2. Create chart dimensions
  const width = 450
  let dimensions = {
    width: width,
    height: 100,
    margin: {
      top: 10,
      right: 10,
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

  // 3. Draw canvas
  const barVisId = "#" + nist_category

  const wrapper = d3.select(barVisId)
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
		.domain(dataFiltered.map(yAccessor))
		//.padding(0.1)
		.range([0, dimensions.boundedHeight])

  const xScale = d3.scaleLinear()
		.domain([0, 4])
		.range([0, dimensions.boundedWidth])
		.nice()

   const yAxisGenerator = d3.axisLeft()
		.scale(yScale)
    .tickSizeOuter(0)

   var ticks = [1,2,3];
   var tickLabelPosition = [0.5, 1.5, 2.5, 3.5]
   var tickLabels = ['1: Partial','2: Risk Informed','3: Repeatable','4: Adaptive']

   const xAxisGenerator = d3.axisBottom()
		.scale(xScale)
    .tickValues(ticks)
    .tickFormat('')
    .tickSizeInner(10)
    .tickSizeOuter(0)

    const xAxisGenerator_labels = d3.axisBottom()
     .scale(xScale)
     .tickSizeInner(8)
     .tickSizeOuter(8)
     .tickValues(tickLabelPosition)
     .tickFormat(function(d,i){ return tickLabels[i] })


  // 5. Draw data
  const barTransition = d3.transition().duration(750)

  const colour = d3.scaleSequential(d3.interpolateBlues)
		 .domain([0, d3.max(dataFiltered.map(xAccessor))])

  const greyBar = bounds.append('rect')
    .attr("y", yScale(yAccessor.y0))
    .attr("x", yScale(xAccessor.x0))
    .attr("height", yScale.bandwidth())
    .attr("width", xScale(4))
    .attr("fill", 'grey')

  const barGroups = bounds.selectAll("g")
		.data(dataFiltered)
		.enter().append("g")

  const barPadding = 1

  const barRects = barGroups.append("rect")
		.attr("y", d => yScale(yAccessor(d)))
		.attr("x", yScale(xAccessor.x0))
		.attr("height",  yScale.bandwidth())
		.transition(barTransition).delay((d, i) => { return i * 150; })
		.attr("width", d => xScale(xAccessor(d)))
		.attr("fill", '#00abf4')

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
    .call(xAxisGenerator_labels)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .style("color", 'black')

  bounds.append("g")
   .call(xAxisGenerator)
   .style("transform", `translateY(${dimensions.boundedHeight}px)`)


	const yAxis = bounds.append("g")
		.call(yAxisGenerator)
    .style('font-size', '18px')
		.style('transform', `translate(${dimensions.margin.left},0)`)

}
drawBars('Identify')
drawBars('Detect')
drawBars('Protect')
drawBars('RespondRecover')
