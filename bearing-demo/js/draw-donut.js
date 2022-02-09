// set the dimensions and margins of the graph
var formatPercentage = d3.format(".0%")
var width = 350,
    height = 150,
    margin = 20;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'

var svg = d3.select("#lecDonut")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

// Create dummy data
const data = {a: 0.7, b: 0.18, c:0.12}

// set the color scale
const color = d3.scaleOrdinal()
  .range(["#ffffb3","#bebada","#fb8072"])
  .domain(['Ransomware', 'Business Email Compromise', 'Data Exfiltration'])

// Compute the position of each group on the pie:
const pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(d => d[1])
const data_ready = pie(Object.entries(data))

// The arc generator
const arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
const outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)


// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .join('path')
  .attr('d', arc)
  .attr('fill', d => color(d.data[1]))
  .attr("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", 1)

  // Add the polylines between chart and labels:
  svg
    .selectAll('allPolylines')
    .data(data_ready)
    .enter()
    .append('polyline')
      .attr("stroke", "white")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function(d) {
        var posA = arc.centroid(d) // line insertion in the slice
        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      })

  // Add the polylines between chart and labels:
  svg
    .selectAll('allLabels')
    .data(data_ready)
    .enter()
    .append('text')
      .text( function(d) {return formatPercentage(d.data[1]) } )
      .attr('transform', function(d) {
          var pos = outerArc.centroid(d);
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
      })
      .style('text-anchor', function(d) {
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          return (midangle < Math.PI ? 'start' : 'end')
      })
       .attr("fill",'white')
