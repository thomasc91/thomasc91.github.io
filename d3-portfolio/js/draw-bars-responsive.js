async function drawBars() {

  data = await d3.csv('/data/cyber_incidents.csv')
  // Access the data
  var yAccessor = d => d.incident
  var xAccessor = d => +d.frequency

  // Create chart dimensions
  var width = d3.select('#barWrapper').node().clientWidth;

  let dimensions = {
    width: width,
    height: 500,
    margin: {
      top: 10,
      right: 30,
      bottom: 50,
      left: 300,
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
    .padding(0.3)
    .range([0, dimensions.boundedHeight])

  var xScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(xAccessor))])
    .range([0, dimensions.boundedWidth])
    .nice()

  var yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  var xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .ticks(2)

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
    .text("Event Frequency")

return barWrapper.node()

}

async function drawStackedBars() {

		// Access data
		dataset = await d3.csv("/data/cyber-stacked.csv", d3.autoType)	//todo get total and sort by total

		var series = d3.stack()
			.keys(dataset.columns.slice(1))
			(dataset)
			.map(d => (d.forEach(v => v.key = d.key), d))

		// Set color scale
		var color = d3.scaleOrdinal()
			.domain(series.map(d => d.key))
			.range([ '#ffbaba', '#ff7b7b', '#ff5252','#ff0000', '#a70000'])
			.unknown("#ccc")

		// Create chart dimensions
    var width = d3.select('#stackedBarsWrapper').node().clientWidth;
		var margin = ({top: 30, right: 10, bottom: 30, left: 350})
		var height = dataset.length * 70 + margin.top + margin.bottom

		// Create axes
		var xScale = d3.scaleLinear()
			.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]) //what is the arrow function doing
			.range([margin.left, width - margin.right])

		var yScale = d3.scaleBand()
			.domain(dataset.map(d => d.Target))
			.range([margin.top, height - margin.bottom])
			.padding(0.3)

		var xAxis = g => g
			.style("transform", `translateY(${height - margin.bottom}px)`)
			.call(d3.axisBottom(xScale).ticks(2, "s"))


		var yAxis = g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(yScale).tickSizeOuter(0));

      // Call tooltips
    var tooltip = d3.tip()
      .attr("class", "d3-tip")
      .html((event, d) =>
      "Target: <b>" + d.data.Target + "</b><br>" +
      "Categorisation: <b>" + d.key + "</b><br>" +
      "Incident count: <b>" + (d[1] - d[0]) + "</b><br>"
    )
      .direction('w');

		// Draw chart
		var barTransition = d3.transition().duration(2000)
		var svg = d3.select("#stackedBarsWrapper")
					.append("svg")
					.attr("width", width)
					.attr("height", height);

		svg.append("g")
		.selectAll("g")
		.data(series)
		.join("g")
		  .attr("fill", d => color(d.key))
      .call(tooltip)
		.selectAll("rect")
		.data(d => d)
		.join("rect")
      .attr("x", d => xScale(d[0]))
      .attr("y", (d, i) => yScale((d.data.Target)))
      .attr("width", d => xScale(d[1]) - xScale(d[0]))
      .attr("height", yScale.bandwidth())
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide)

		svg.append("g")
		  .call(xAxis);

		svg.append("g")
		  .call(yAxis)

    svg.selectAll('text')
    .call(wrap, 300)

	return svg.node()

}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", -10).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", -10).attr("y", y).attr("dy", ++lineNumber + dy + "em").text(word);
      }
    }
  });
}


drawStackedBars()
drawBars()

var resizeTimer;
window.onresize = function(event) {
 clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function()
  {
    var s = d3.selectAll('svg');
    s = s.remove();
    drawStackedBars()
    drawBars()
  }, 100);
}
