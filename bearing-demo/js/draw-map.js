var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
  .center([ 132, -28 ])
  .scale(600)     // This is like the zoom
  .translate([ width/2, height/2 ])

  // Create data for circles:
var markers = [
    {long: 153.021072, lat: -27.470125, office: "Brisbane", open_rate: 8}, // corsica
    {long: 151.209900, lat: -33.865143, office: "Sydney", open_rate: 10}, // nice
    {long: 144.946457, lat: 	-37.840935, office: "Melbourne", open_rate: 12}, // Paris
    {long: 145.754120, lat: 	-16.925491, office: "Cairns", open_rate: 3}, // Hossegor

  ];


// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data){

    // Filter data
    data.features = data.features.filter(d => { return d.properties.name=="Australia"})

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
          .attr("fill", "grey")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
          .style("stroke", "black")
          .style("opacity", .5)

          // create a tooltip
          const Tooltip = d3.select("#my_dataviz")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 1)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

          // Three function that change the tooltip when user hover / move / leave a cell
          const mouseover = function(event, d) {
            Tooltip.style("opacity", 1)
          }
          var mousemove = function(event, d) {
            Tooltip
              .html(d.name + "<br>" + "long: " + d.long + "<br>" + "lat: " + d.lat)
              .style("left", (event.x)/2 + "px")
              .style("top", (event.y)/2 - 30 + "px")
          }
          var mouseleave = function(event, d) {
            Tooltip.style("opacity", 1)
          }

          // Add circles:

          svg
            .selectAll("myCircles")
            .data(markers)
            .join("circle")
              .attr("cx", d => projection([d.long, d.lat])[0])
              .attr("cy", d => projection([d.long, d.lat])[1])
              .attr("r", 0)
              .transition().duration(2000)
              .attr("r", d => d.open_rate*4 + 3)
              .attr("class", "circle")
              .style("fill", "red")
              .attr("stroke", "green")
              .attr("stroke-width", 3)
              .attr("fill-opacity", .4)

              svg
              .selectAll("text")
              .data(markers)
              .join("text")
              .attr("class", "phish-label")
              .attr("text-anchor", "middle")
              .attr('stroke', 'white')
              .attr("x", d => projection([d.long, d.lat])[0])
              .attr("y", d => projection([d.long, d.lat])[1] +5)
              .text(d =>  d.open_rate);



})
