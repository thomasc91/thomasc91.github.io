d3.csv('../../data/exposure-donut.csv').then(function(data) {

  var pad = 10;
  var h = 150;
  var w = 300;
  var size = 200;
  var r = size / 10;
  var innerCircle = 30;
  var outerCircle = 50;
  var barWidth = w / data.length;

  var radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d) {
      return +d.loss
    })])
    .range([30, r * 2.5]);


  var svg_donut = d3.select("#summary-donut-vis")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .style("margin", pad / 2 + "px 0 0 " + pad / 2 + "px");

  var pie = d3.pie()
    .value(function(d) {
      return +d.loss
    })
    .sort(null);

  var arc_zero = d3.arc()
    .outerRadius(r)
    .innerRadius(r);

  var arc = d3.arc()
    .outerRadius(outerCircle)
    .innerRadius(innerCircle);

  var g = svg_donut.append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  // set the color scale
  const color = d3.scaleOrdinal()
    .range(["#ffffb3", "#bebada", "#fb8072"])
    .domain(['Ransomware', 'Phishing', 'Data Exfiltration'])

  var bars = g.selectAll("g")
    .data(pie(data)).enter()
    .append("g")
    .attr("class", "bar")
    .style("fill", d => color(d.data.type))

  bars.append("path")
    .attr("stroke", "black")
    .attr("d", arc)



  bars.on("mouseover", function(event, d) {
    let expandArc = d3.arc()
      .outerRadius(function(d) {
        return outerCircle * 1.2
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

    d3.select(this)
      .select("path")
      .attr("stroke", "black")
      .transition()
      .duration(1000)
      .attr('d', arc);



  })

})