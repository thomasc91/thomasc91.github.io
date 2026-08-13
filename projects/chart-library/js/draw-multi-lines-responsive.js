async function drawMultiLines(input) {

  data = await d3.csv('../../data/pageviews-2020.csv')
  if (input == 1) {
    keys = data.columns.slice(1)
  } else {
    keys = data.columns.slice(+input-1, +input)
  }

	var	formatDate = d3.timeFormat("%Y-%m-%d")
  var formatValue = d3.format(",.0f")
  var bisectDate = d3.bisector(d => d.date).left
  var dateParse = d3.timeParse("%d/%m/%Y")

  data.forEach(function(d) {
		d.date = dateParse(d.date);
		return d;
	})
  // Create chart dimensions
  var width = d3.select('#multiLineChart').node().clientWidth;

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

 var lineWrapper = d3.select("#multiLineChart")
   .append("svg")
   .attr("width", dimensions.width)
   .attr("height", dimensions.height)

 var bounds = lineWrapper.append("g")
   .style("transform", `translate(${
   dimensions.margin.left
   }px, ${
   dimensions.margin.top
   }px)`)


 var pageviews = keys.map(function(id) {
			return {
				id: id,
				values: data.map(d => {
          return {
            date: d.date,
            views: +d[id]
          }
        })
			};
		});

  var x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, dimensions.boundedWidth])

var y = d3.scaleLinear()
  .rangeRound([0, dimensions.boundedHeight])
  .domain([
      d3.max(pageviews, d => d3.max(d.values, c => c.views)),
      d3.min(pageviews, d => d3.min(d.values, c => c.views))
    ])
    .nice()

function getColor(d) {
    var p = d3.scaleOrdinal()
        .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"])
        .domain([2,3,4,5,6,7,8,9,10])
      return p(d);
  }

var z = d3.scaleOrdinal()
          .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"])

console.log(z)
var line = d3.line()
	.x(d => x(d.date))
	.y(d => y(d.views))

var lines = bounds.selectAll("lines")
    .data(pageviews)
    .enter()
    .append("g");

    lines.append("path")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) {
      if (input > 1) {return getColor(input)}
      else {return z(d.id)}
    });


  bounds.append("g")
		.attr("class", "x-axis")
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)
		.call(d3.axisBottom(x));

  bounds.select(".x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-40)");

	bounds.append("g")
		.attr("class", "y-axis")
		.style('transform', `translate(${dimensions.margin.left},0)`)
    .call(d3.axisLeft(y))

  var focus = bounds.append("g")
		.attr("class", "focus")
		.style("display", "none");

	focus.append("line").attr("class", "lineHover")
		.style("stroke", "white")
		.attr("stroke-width", 1)
		.style("shape-rendering", "crispEdges")
		.style("opacity", 0.5)
		.attr("y1", -dimensions.boundedHeight)
		.attr("y2",0);

  focus.append("text").attr("class", "lineHoverDate")
  		.attr("text-anchor", "middle")
  		.attr("font-size", 12);

  var overlay = bounds.append("rect")
  		.attr("class", "overlay")
  		.attr("width", dimensions.boundedWidth)
  		.attr("height", dimensions.boundedHeight)

  function tooltip(keys) {
      console.log(keys)
  		var labels = focus.selectAll(".lineHoverText")
  			.data(keys)

  		labels.enter().append("text")
  			.attr("class", "lineHoverText")
  			.attr("text-anchor", "start")
  			.attr("font-size", 12)
        .style("fill",function(d) {
          if (input > 1) {return getColor(input)}
          else {return z(d)};
        })
  			.attr("dy", (_, i) => 1 + i * 2 + "em")
  			.merge(labels);

  		var circles = focus.selectAll(".hoverCircle")
  			.data(keys)

  		circles.enter().append("circle")
  			.attr("class", "hoverCircle")
        .style("fill",function(d) {
          if (input > 1) {return getColor(input)}
          else {return z(d)};
        })
  			.attr("r", 2.5)
  			.merge(circles);

  		bounds.selectAll(".overlay")
  			.on("mouseover", function() { focus.style("display", null); })
  			.on("mouseout", function() { focus.style("display", "none"); })
  			.on("mousemove", mousemove);

  		function mousemove() {

  			var x0 = x.invert(d3.pointer(event)[0]),
  				i = bisectDate(data, x0, 1),
  				d0 = data[i - 1],
  				d1 = data[i]
  				d = x0 - d0.date > d1.date - x0 ? d1 : d0;

  			focus.select(".lineHover")
  					.attr("transform", "translate(" + x(d.date)  + "," + dimensions.boundedHeight + ")");

  			focus.select(".lineHoverDate")
  				.attr("transform",
  					"translate(" + x(d.date) + "," + (dimensions.boundedHeight + dimensions.margin.bottom) + ")")
  				.text(formatDate(d.date));

  			focus.selectAll(".hoverCircle")
  				.attr("cy", e => y(d[e]))
  				.attr("cx", x(d.date));

  			focus.selectAll(".lineHoverText")
  				.attr("transform",
  					"translate(" + x(d.date) + "," + dimensions.boundedHeight / 2.5 + ")")
  				.text(e => e + ": " + formatValue(d[e]));

  			x(d.date) > (dimensions.boundedWidth - dimensions.boundedWidth / 4)
  				? focus.selectAll("text.lineHoverText")
  					.attr("text-anchor", "end")
  					.attr("dx", -10)
  				: focus.selectAll("text.lineHoverText")
  					.attr("text-anchor", "start")
  					.attr("dx", 10)
  		}
  	}
tooltip(keys);

}

drawMultiLines(1)

var selectbox = d3.select("#selectbox")
  .on("change", function() {
    var selected = d3.select("#selectbox").node().value
    var s = d3.selectAll('svg');
    s = s.remove();
    drawMultiLines(selected)
  })

var resizeTimer;
window.onresize = function(event) {
 clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function()
  {
    var s = d3.selectAll('svg');
    s = s.remove();
    var selected = d3.select("#selectbox").node().value
    drawMultiLines(selected)
  }, 100);
}
