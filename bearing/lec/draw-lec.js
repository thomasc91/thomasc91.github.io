d3.csv('./lec.csv').then(function(data) {
  dataAll = data.filter(function(d){ return d.loss_event == 'Ransomware' })

  var likelihoodAccessor = d => +d.likelihood
  var lossAccessor = d => +d.loss
  var colorAccessor = d => d.color

  var formatPercentage = d3.format(",.0%")
  var formatAUD = d3.format("($,.0f")

  function getColor(d) {
      var p = d3.scaleOrdinal()
          .range(["#8dd3c7","#ffffb3","#bebada","#fb8072"])
          .domain(['Ransomware', 'Business Email Compromise', 'Data Exfiltration'])
        return p(d);
      }
  function getLoss(d) {
      var p = d3.scaleOrdinal()
          .range([315000, 80000, 15000])
          .domain([,'Ransomware', 'Business Email Compromise', 'Data Exfiltration'])
        return p(d);
          }
  function getChange(d) {
      var p = d3.scaleOrdinal()
          .range([-35000, 20000, -10000])
          .domain([,'Ransomware', 'Business Email Compromise', 'Data Exfiltration'])
        return p(d);
          }
  // Create chart dimensions
  var width = 640
  //d3.select('#exposure-over-time-line-chart').node().clientWidth;

  let dimensions = {
    width: width,
    height: 300,
    margin: {
      top: 10,
      right: 60,
      bottom: 80,
      left: 60,
    },
  }

  dimensions.boundedWidth = width
     - dimensions.margin.left
     - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
     - dimensions.margin.top
     - dimensions.margin.bottom

  // Call tooltips
  var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .html((event, d) =>
    "There is a <b>" + formatPercentage(likelihoodAccessor(d)) +
    "</b> chance of losing more than <b>"
    + formatAUD(lossAccessor(d)) + "</b> in the next year from <b>Ransomware</b>"
    )
    .direction('n');

  var svg = d3.select('#lecLineChart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
  .append("g")
    .style("transform", `translate(${
    dimensions.margin.left
    }px, ${
    dimensions.margin.top
    }px)`)
    .call(tooltip)

/////////////////////////////////////////
//Draw axes//
/////////////////////////////////////////
     var xScale = d3.scaleLinear()
       .domain([0, 600000])
       .range([0, dimensions.boundedWidth])
       .nice()

     var xAxisGenerator = d3.axisBottom()
       .scale(xScale)

   	var yScale = d3.scaleLinear()
   		.domain([1, 0])
      .range([0, dimensions.boundedHeight])
   		.nice()

     var yAxisGenerator = d3.axisLeft()
       .scale(yScale)
       .tickFormat(formatPercentage)
       .ticks(1)

     var xAxis = svg.append("g")
      .call(xAxisGenerator)
     	.attr("class", "x-axis")
     	.style("transform", `translateY(${dimensions.boundedHeight}px)`)

     var yAxis = svg.append("g")
     	.call(yAxisGenerator)
     	.attr("class", "y-axis")
     	.style('transform', `translate(${dimensions.margin.left},0)`)

     svg.select(".x-axis")
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", "rotate(-45)");

     var xAxisLabel = xAxis.append("text")
      .style("fill", "white")
       .attr("x", dimensions.boundedWidth / 2)
       .attr("y", dimensions.margin.bottom -15)
       .text("Loss amount ($)")

       var yAxisLabel = yAxis.append("text")
        .attr('class', 'y-axis-label')
        .style("fill", "white")
         .attr("y", dimensions.boundedHeight - 240)
         .attr("x", dimensions.margin.left - 140)
         .text("Probability")
         .attr("transform", "rotate(-90)");



       var circles = svg.selectAll(".circle")
         .data(dataAll)
         .enter()
         .append("circle")
         .attr("fill", 'white')
         .attr("cx", d => xScale(lossAccessor(d)))
         .attr("cy", d => yScale(likelihoodAccessor(d)))
         .attr("r", 20)
         .style("opacity", 0)
         .on('mouseover', tooltip.show)
         .on('mouseout', tooltip.hide)
  /////////////////////////////////////////
  // Draw lines
  /////////////////////////////////////////
  const selectedInput = d3.select("#selectbox").node().value;
  const lecLine = svg
    .append('g')
    .append('path')
      .datum(dataAll)
      .attr('d', d3.line()
      .x(d => xScale(0))
      .y(d => yScale(0))
    )
    .style("stroke-width", 2)
    .style("stroke", function(d) {return getColor(selectedInput)})
    .style("fill", "none")

    lecLine
      .transition()
      .duration(2000)
      .attr('d', d3.line()
        .x(d => xScale(lossAccessor(d)))
        .y(d => yScale(likelihoodAccessor(d)))
    )
  const lossKPI = d3.select('.current-total-exposure')
                    .data(dataAll)
                    .text(function(d) {return formatAUD(getLoss(selectedInput))})

  const lossKPIEvent = d3.selectAll('.drill-down-loss-event')
                    .data(dataAll)
                    .style("color", function(d) {return getColor(selectedInput)})
                    .text(selectedInput)

  const lossDiffKPI = d3.select('.exposure-change-value')
                    .data(dataAll)
                    .style("color", function(d, i) {
                      return getChange(selectedInput) > 10 ? "#c6f646" : "red";
                          })
                    .text(function(d, i){
                      for (i=0; i<dataAll.length; i++)
                      {
                        if(getChange(selectedInput) > 10)
                          {
                            result = "▼ " + formatAUD(getChange(selectedInput));
                           }
                           else
                           {
                            result = "▲ " + formatAUD(getChange(selectedInput));
                           }
                      }
                      return result;
                  });



function update(selectedInput) {
    dataFilter = data.filter(function(d){ return d.loss_event == selectedInput})
    console.log(dataFilter)
    lecLine
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr('d', d3.line()
        .x(d => xScale(lossAccessor(d)))
        .y(d => yScale(likelihoodAccessor(d)))
    )
      .style("stroke-width", 2)
      .style("stroke", function(d) {return getColor(selectedInput)})

    lossKPI
      .data(dataFilter)
      .text(function(d) {return formatAUD(getLoss(selectedInput))})

    lossKPIEvent
      .data(dataAll)
      .style("color", function(d) {return getColor(selectedInput)})
      .text(selectedInput)

    lossDiffKPI
      .data(dataFilter)
      .style("color", function(d, i) {
        return getChange(selectedInput) > 10 ? "#c6f646" : "red";
            })
      .text(function(d, i){
        for (i=0; i<dataAll.length; i++)
        {
          if(getChange(selectedInput) > 10)
            {
              result = "▼ " + formatAUD(getChange(selectedInput));
             }
             else
             {
              result = "▲ " + formatAUD(getChange(selectedInput));
             }
        }
        return result;
    });


    circles
        .data(dataFilter)
        .attr("cx", d => xScale(lossAccessor(d)))
        .attr("cy", d => yScale(likelihoodAccessor(d)))

    tooltip
        .html((event, d) =>
        "There is a <b>" + formatPercentage(likelihoodAccessor(d)) +
        "</b> chance of losing more than <b>"
        + formatAUD(lossAccessor(d)) + "</b> in the next year from " +
        "<b>" + selectedInput + "</b>"
        )
        .direction('n');

}

var selectbox = d3.select("#selectbox")
  .on("change", function() {
    const selectedInput = d3.select(this).property("value")
    console.log(selectedInput)
      update(selectedInput)
})

})
