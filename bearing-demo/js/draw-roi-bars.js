async function drawBars() {

  dataset = await d3.csv('../../data/roi.csv')

  data1 = dataset.filter(function(d){ return d.strategy == 'Security training' })
  data2 = dataset.filter(function(d){ return d.strategy == 'Implement application whitelisting' })
  data3 = dataset.filter(function(d){ return d.strategy == 'Review backup policies and data storage permissions' })
  // Access the data
  console.log(data1)
  var yAccessor = d => +d.cost
  var xAccessor = d => d.cost_category
  var roiAccessor = d => d.roi

  var button_1 = d3.select("#button_1")
  var button_2 = d3.select("#button_2")
  var button_3 = d3.select("#button_3")


  var formatAUD = d3.format("($,.0f")

  // Create chart dimensions
  var width = d3.select('#roi-vis').node().clientWidth;

  let dimensions = {
    width: width,
    height: 500,
    margin: {
      top: 10,
      right: 50,
      bottom: 50,
      left: 80,
    },
  }
  dimensions.boundedWidth = width
     - dimensions.margin.left
     - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
     - dimensions.margin.top
     - dimensions.margin.bottom

  // Draw canvas
  var barWrapper = d3.select("#roi-vis")
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
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data1.map(yAccessor))*1.2])
    .range([dimensions.boundedHeight, 0])

  var xScale = d3.scaleBand()
    .domain(data1.map(xAccessor))
    .range([0, dimensions.boundedWidth])
    .padding(0.3)

  var yAxisGenerator = d3.axisLeft()
    .tickFormat(formatAUD)
    .scale(yScale)

  var xAxisGenerator = d3.axisBottom()
    .scale(xScale)


  // Draw data
  var barTransition = d3.transition().duration(1000)

  function getColor(d) {
      var p = d3.scaleOrdinal()
          .range([ 'grey', '#d64550', '#2c8505','#d2ea9e'])
          .domain(['Mitigation strategy cost','Current aggregate exposure', 'Residual risk'])
        return p(d);
      }

  var barGroups = bounds.selectAll("g")
    .data(data3)
    .enter().append("g")

  var barRects = barGroups.append("rect")
    .attr("fill", function(d) {return getColor(xAccessor(d))})
    .attr("x", d => xScale(xAccessor(d)))
    .attr('y', d => dimensions.boundedHeight)
    .attr("width", xScale.bandwidth())
    .attr('height', 0)
    .transition(barTransition)
    .attr("y", d => yScale(yAccessor(d)))
    .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))

    var reducedRisk = barGroups.append("rect")
      .attr("fill", '#d2ea9e')
      .attr("x", d => xScale('Residual risk'))
      .attr('y', d => dimensions.boundedHeight)
      .attr("width", xScale.bandwidth())
      .attr('height', 0)
      .transition(barTransition)
      .attr("y", d => yScale(d3.max(data1.map(yAccessor))))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))


  const barText = barGroups.filter(yAccessor)
    .append("text")
    .attr("x", d => xScale(xAccessor(d)) + xScale.bandwidth() / 2)
	  .style("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "20px")
    .style("font-family", "Open Sans")
    .attr("y", d => dimensions.boundedHeight)
	  .transition(barTransition)
	  .delay((d, i) => { return i * 150; })
	  .attr("y", d => yScale(yAccessor(d)) - 5)
    .text(d => formatAUD(yAccessor(d)))

      var xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

      var yAxis = bounds.append("g")
        .call(yAxisGenerator)
        .style('transform', `translate(${dimensions.margin.left},0)`)


    var button_1 = d3.select("#button_1")
    var button_2 = d3.select("#button_2")
    var button_3 = d3.select("#button_3")


}
drawBars()
