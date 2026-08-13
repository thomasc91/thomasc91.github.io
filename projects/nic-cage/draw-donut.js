d3.csv('nic_cage_data.csv').then(function(data) {

  var pad = 10;
  var h = 700
  var w = 600;
  var size = 800;
  var r = size / 10;
  var innerCircle = 110;
  var barWidth = w / data.length;

  var radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d) {
      return +d.rt_score
    })])
    .range([30, r * 2.5]);


  var svg = d3.select("body")
    .append("svg")
    .attr('class', 'donut')
    .attr("height", h)
    .attr("width", w)
    .style("margin", pad / 2 + "px 0 0 " + pad / 2 + "px");

  var pie = d3.pie()
    .value(function(d) {
      return +d.gross
    })
    .sort(null);

  var arc_zero = d3.arc()
    .outerRadius(r)
    .innerRadius(r);

  var arc = d3.arc()
    .outerRadius(function(d) {
      return r + radiusScale(+d.data.rt_score)
    })
    .innerRadius(innerCircle);

  var g = svg.append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  var colour = d3.scaleSequential(d3.interpolateRdBu)
    .domain([0, 100])

  var bars = g.selectAll("g")
    .data(pie(data)).enter()
    .append("g")
    .attr("class", "bar")
    .attr("id", function(d, i) {
      return i
    })
    .attr("fill", function(d) {
      return colour(+d.data.rt_score)
    });

  bars.append("path")
    .attr("stroke", "black")
    .attr("d", arc);

  var circle = g.append("circle")
    .attr("fill", "black")
    .attr("r", innerCircle - 10);

  var svg_box_w = w / 4
  var svg_box_h = h / 4
  var box_padding = 20

  var g2 = svg.append("g")
    .attr("transform", "translate(" + w * 0.05 + "," + h * 0.9 + ")")

  var title_default = "Nic Cage";
  var title = g2.append("text")
    .text(title_default)
    .attr('class', 'donut-title')
    .attr("xml:space", "preserve")
    .attr("text-anchor", "left")
    .attr("font-size", "20px")
    .attr("fill", "white");


  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  var year_default = "2022";
  var year = g2.append("text")
    .text(year_default)
    .attr('class', 'donut-year')
    .attr("xml:space", "preserve")
    .attr("text-anchor", "left")
    .attr("font-size", "15px")

    .attr("font-style", "italic")
    .attr("y", -30)
    .attr("fill", "grey");

  var coordinates = d3.pointer(this);
  var x = coordinates[0];
  var y = coordinates[1];

  bars.on('mousemove', (event, d) => {
    var coords = d3.pointer(event);
    var formatUSD = d3.format("($,.0f")
    div.html("<h3>" + d.data.film + "</h3>" + "" +
        "<span class='rt-score'>Rotten Tomatoes: <b>" + d.data.rt_score + "%" + "</b></span><br>" +
        "<span class='gross'>Worldwide Box Office (USD): <b>" + formatUSD(d.data.gross) + "</b></span><br>" +
        "Role: " + d.data.role)

      .style("opacity", 1)
      .style("left", (coords[0] + w / 2 + 30) + "px")
      .style("top", (coords[1] + h / 2) + "px");

  });

  bars.on("mouseover", function(event, d) {
    d3.select('.donut-title').text(d.data.film)
    d3.select('.donut-year').text(d.data.year)

    let expandArc = d3.arc()
      .outerRadius(function(d) {
        return r + radiusScale(+d.data.rt_score) * 1.2
      })
      .innerRadius(innerCircle);

    d3.select(this)
      .select("path")
      .attr("stroke", "white")
      .transition()
      .duration(1000)
      .attr('d', expandArc);
  });

  bars.on("mouseout", function(event, d) {
    div.style("opacity", 0)
    d3.select(this)
      .select("path")
      .attr("stroke", "black")
      .transition()
      .duration(1000)
      .attr('d', arc);

  });

  function legend({
    color,
    title,
    tickSize = 6,
    width = 120,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {}) {
    const svg_legend = d3.select("svg")


    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height).attr('fill', '');
    let x;

    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg_legend.append("image")
      .attr("x", 420)
      .attr("y", 620)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());

    svg_legend.append("g")
      .attr("transform", `translate(420,${630})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .style("color", "white")
      .call(g => g.select(".domain").remove())

    return svg_legend.node();
  }

  function ramp(color, n = 256) {
    var canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  legend({
    color: d3.scaleSequential([0, 100], d3.interpolateRdBu),
    title: "Rotten Tomatoes Score",
  })

  var angleLabel = svg.append("text")
    .attr("x", 420)
    .attr("y", 600)
    .attr("font-size", "10px")
    .attr("fill", "white")
    .text("Angle = Worldwide Box Office (USD)")

  var legendLabel = svg.append("text")
    .attr("x", 420)
    .attr("y", 612)
    .attr("font-size", "10px")
    .attr("fill", "white")
    .text("Rotten Tomatoes Score (%)")

  var title = svg.append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("font-size", "40px")
    .attr("fill", "white")
    .text("Nicolas Cage Film Career")

  var subTitle = svg.append("text")
    .attr("x", 10)
    .attr("y", 50)
    .attr("font-size", "20px")
    .attr("fill", "grey")
    .attr("font-style", "italic")
    .text("Hover for details")

})