async function drawMultiLines(input) {

  data = await d3.csv('../../data/benchmark.csv')

  keys = data.columns.slice(+input, +input + 2)

  var formatDate = d3.timeFormat("%d-%m-%Y")
  var formatValue = d3.format("$,.0f")
  var bisectDate = d3.bisector(d => d.date).left
  var dateParse = d3.timeParse("%d/%m/%Y")

  data.forEach(function(d) {
    d.date = dateParse(d.date);
    return d;
  })
  // Create chart dimensions
  var width = d3.select('#multiLineChart').node().clientWidth;
  var yTicks = 3

  let dimensions = {
    width: width,
    height: 400,
    margin: {
      top: 10,
      right: 60,
      bottom: 90,
      left: 100,
    },
  }
  dimensions.boundedWidth = width -
    dimensions.margin.left -
    dimensions.margin.right
  dimensions.boundedHeight = dimensions.height -
    dimensions.margin.top -
    dimensions.margin.bottom

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(y)
      .ticks(yTicks)
  }

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

  const createGradient = select => {
    const gradient = select
      .select('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color:#ffffff;stop-opacity:0.01');

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color:#ffffff;stop-opacity:.3');
  }

  bounds.append('defs');
  bounds.call(createGradient);

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

  //Get most recent exposure and benchmark values

  //Exposure
  var valueArray = pageviews[0].values
  var maxDate = d3.max(valueArray, d => d.date)
  var kpi1 = valueArray.filter(function(d) {
    return d.date === maxDate
  })[0].views

  //Benchmark
  var benchmarkArray = pageviews[1].values
  var maxDate = d3.max(benchmarkArray, d => d.date)
  var kpi2 = benchmarkArray.filter(function(d) {
    return d.date === maxDate
  })[0].views

  var x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, dimensions.boundedWidth])

  var y = d3.scaleLinear()
    .rangeRound([0, dimensions.boundedHeight])
    .domain([
      d3.max(pageviews, d => d3.max(d.values, c => c.views)),
      0
    ])
    .nice()

  function getColor(d) {
    var p = d3.scaleOrdinal()
      .range(["#d53e4f", "#ffffb3", "#bebada", "#fb8072"])
      .domain(["Total Exposure", "Ransomware", "Phishing", "Data Exfiltration"])
    return p(d);
  }

  var z = d3.scaleOrdinal()
    .range(["#d53e4f", "#bebada", "#80b1d3", "#b3de69", "#d9d9d9", "#ccebc5"])

  var lossKPI1title = d3.select('.summary-kpi-1-title')
    .data(pageviews)
    .style("color", function(d) {
      return getColor(d.id)
    })

  var lossKPI1value = d3.select('.summary-kpi-1-value')
    .data(pageviews)
    .style("color", function(d) {
      return getColor(d.id)
    })
    .text(formatValue(kpi1))

  var lossKPI2value = d3.select('.summary-kpi-2-value')
    .data(pageviews)
    .style("color", "white")
    .text(formatValue(kpi2))

  // add the Y gridlines
  bounds.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
      .tickSize(-dimensions.boundedWidth, 0, 0)
      .tickFormat("")
    )

  //define line
  var line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.views))
    .curve(d3.curveCatmullRom.alpha(0.5));

  var lines = bounds.selectAll("lines")
    .data(pageviews)
    .enter()
    .append("g");

  lines.append("path")
    .attr("id", function(d, i) {
      return "line" + i;
    })
    .attr("d", function(d) {
      return line(d.values);
    })
    .style("stroke", function(d) {
      if (d.id.includes("Benchmark")) {
        return "#ffffff"
      } else {
        return getColor(d.id)
      }
    })
    .attr("fill", "none")
    .attr("stroke-width", 2)

  var area = d3.area()
    .x(function(d) {
      return x(d.date);
    })
    .y0(dimensions.boundedHeight)
    .y1(function(d) {
      return y(d.views);
    });

  lines.append("path")
    .attr("d", function(d) {
      if (d.id.includes("Benchmark")) {
        return area(d.values)
      }
    })
    .attr("fill", "url(#gradient)")

  //Initially set the benchmark line to not show
  d3.select("#line0").style("opacity", "0");
  // Then highlight the main line to be fully visable and give it a thicker stroke
  d3.select("#line0").style("opacity", "1") //.style("stroke-width", 4);

  // First work our the total length of the line
  var totalLength = d3.select("#line0").node().getTotalLength();

  d3.selectAll("#line0")
    // Set the line pattern to be an long line followed by an equally long gap
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    // Set the intial starting position so that only the gap is shown by offesetting by the total length of the line
    .attr("stroke-dashoffset", totalLength)
    // Then the following lines transition the line so that the gap is hidden...
    .transition()
    .duration(2500)
    .attr("stroke-dashoffset", 0);

  bounds.append("g")
    .attr("class", "x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .style("font-size", "14px")
    .call(d3.axisBottom(x).ticks(6));

  bounds.select(".x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-40)");

  bounds.append("g")
    .attr("class", "y-axis")
    .style('transform', `translate(${dimensions.margin.left},0)`)
    .style("font-size", "14px")
    .call(d3.axisLeft(y).ticks(yTicks).tickFormat(formatValue))

  var focus = bounds.append("g")
    .attr("class", "focus")
    .style("display", "none");

  var textBoxWidth = 280;
  var textBoxHeight = 80;

  focus.append('rect')
    .attr("width", textBoxWidth)
    .attr("height", textBoxHeight)
    .attr("class", 'text-box')

  focus.append("text").attr("class", "lineHoverDate")
    .attr("font-size", 12);

  focus.append("line").attr("class", "lineHover")
    .style("stroke", "#ff007a")
    .attr("stroke-width", 1)
    .style("shape-rendering", "crispEdges")
    .style("opacity", 0.5)
    .attr("y1", -dimensions.boundedHeight)
    .attr("y2", 0);

  var overlay = bounds.append("rect")
    .attr("class", "overlay")
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight)

  function tooltip(keys) {
    var labels = focus.selectAll(".lineHoverText")
      .data(keys)

    labels.enter().append("text")
      .attr("class", "lineHoverText")
      .attr("text-anchor", "start")
      .attr("font-size", 14)
      .style("fill", "#ffffff")
      .attr("dy", (_, i) => 1 + i * 2 + "em")
      .merge(labels);

    var circles = focus.selectAll(".hoverCircle")
      .data(keys)

    circles.enter().append("circle")
      .attr("class", "hoverCircle")
      .style("fill", "#ff007a")
      .attr("r", 5)
      .merge(circles);

    bounds.selectAll(".overlay")
      .on("mouseover", function() {
        focus.style("display", null);
      })
      .on("mouseout", function() {
        focus.style("display", "none");
      })
      .on("mousemove", mousemove);

    function mousemove() {

      var x0 = x.invert(d3.pointer(event)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i]
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      focus.select(".lineHover")
        .attr("transform", "translate(" + x(d.date) + "," + dimensions.boundedHeight + ")");

      focus.selectAll(".hoverCircle")
        .attr("cy", e => y(d[e]))
        .attr("cx", x(d.date));

      focus.selectAll(".lineHoverDate")
        .attr("transform",
          "translate(" + x(d.date) + "," + (dimensions.boundedHeight - 5) + ")")
        .text(formatDate(d.date));

      focus.selectAll(".lineHoverText")
        .attr("transform",
          "translate(" + x(d.date) + "," + dimensions.boundedHeight / 4 + ")")
        .text(e => e + ": " + formatValue(d[e]));

      x(d.date) > (dimensions.boundedWidth - dimensions.boundedWidth / 4) ? //if at the last quarter
        focus.selectAll("text.lineHoverText")
        .attr("text-anchor", "end")
        .attr("dx", -10) :
        focus.selectAll("text.lineHoverText")
        .attr("text-anchor", "start")
        .attr("dx", 10)

      x(d.date) > (dimensions.boundedWidth - dimensions.boundedWidth / 4) ? //if at the last quarter
        focus.selectAll(".text-box")
        .attr("transform",
          "translate(" + (x(d.date) - textBoxWidth) + "," + (dimensions.boundedHeight / 4 - (textBoxHeight / 5)) + ")") :
        focus.selectAll(".text-box")
        .attr("transform",
          "translate(" + x(d.date) + "," + (dimensions.boundedHeight / 4 - (textBoxHeight / 5)) + ")")

      x(d.date) > (dimensions.boundedWidth - dimensions.boundedWidth / 4) ? //if at the last quarter
        focus.selectAll("text.lineHoverDate")
        .attr("text-anchor", "end")
        .attr("dx", -10) :
        focus.selectAll("text.lineHoverDate")
        .attr("text-anchor", "start")
        .attr("dx", 10)
    }
  }
  tooltip(keys);



}

drawMultiLines(1)


d3.selectAll(("input")).on("change", function() {
  var s = d3.selectAll('svg');
  s = s.remove();
  drawMultiLines(this.value)
});


var resizeTimer;
window.onresize = function(event) {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    var s = d3.selectAll('svg');
    s = s.remove();
    //var selected = d3.select("#selectbox").node().value
    //drawMultiLines(selected)
    drawMultiLines(1)
  }, 100);
}