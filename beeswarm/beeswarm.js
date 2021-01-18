//todo 
//set duration based on data size
// mouseover tooltips x
// format date in tooltip

// color legend 



async function drawBeeswarm() {
    
	// 1. Access data
    dataset = await d3.csv("shootings.csv")	
	const dateParser = d3.timeParse("%Y-%m-%d")	
	
	const xAccessor = d => dateParser(d.date)	
    const yAccessor = d => d.race
	const radiusAccessor = d => d.age * 0.2
	const colorAccessor = d => d.signs_of_mental_illness
	
	// Set time scale offset so points don't get drawn directly onto the y axis
	//specify d3.timeMonth, d3.timeYear depending on dataset
	const percent_offset = 0.05
	const start_end_dates = d3.extent(dataset, xAccessor)
	const increase_left = d3.timeMonth.count(start_end_dates[0], start_end_dates[1]) * percent_offset 
	const start_end_dates_extended = [d3.timeMonth.offset(start_end_dates[0], - increase_left), start_end_dates[1]]
		
	// Colors used for circles depending on specified variable
	const colors = d3.scaleOrdinal()
		.domain(dataset.map(colorAccessor))
		.range(['#D81B60','#1976D2','#388E3C','#FBC02D','#E64A19','#455A64']);
	
	
	
	// 2. Create chart dimensions 
	const radius = 5
	const padding = 0.1
        const width = 1200

        let dimensions = {
        width: width,
        height: width * 0.8,
        margin: {
            top: 10,
            right: 30,
            bottom: 50,
            left: 60,
        },
    }
    dimensions.boundedWidth = dimensions.width
         - dimensions.margin.left
         - dimensions.margin.right
        dimensions.boundedHeight = dimensions.height
         - dimensions.margin.top
         - dimensions.margin.bottom

    // 3. Draw canvas
        const wrapper = d3.select("#wrapper")
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
  const yScale = d3.scalePoint()  		
		.domain(dataset.map(yAccessor))		
		.padding(0.5)
		.range([0, dimensions.boundedHeight])
		
					
   const xScale = d3.scaleTime()	
	.domain(start_end_dates_extended)		
	.range([0, dimensions.boundedWidth])
    .nice()
   
   const yAxisGenerator = d3.axisLeft()
		.scale(yScale)
		
		
   const xAxisGenerator = d3.axisBottom()
		.scale(xScale)
	
	// Create line that connects circle and X axis
	let xLine = bounds.append("line")
		.attr("stroke", "rgb(96,125,139)")
		.attr("stroke-dasharray", "1,2");

	// Create tooltip div and make it invisible
	let tooltip = d3.select("#wrapper").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	function charge(d) {
		return -Math.pow(d => radiusAccessor(d), 2.0) * 1;
		}
	 
    const simulation = d3.forceSimulation(dataset)
	.velocityDecay(0.2)	
    .force("x", d3.forceX(d => xScale(xAccessor(d))).strength(1))
    .force("y", d3.forceY(d => yScale(yAccessor(d))).strength(1))
    .force("collide", d3.forceCollide(d => radiusAccessor(d)))		
	.on('tick', ticked)
	
	
	simulation.stop();
	
	for(let i = 0; i < dataset.length; i++) {
		simulation.tick(3);
	}
		
	const dots = bounds.selectAll(".dots")
    .data(dataset);
	
		
	dots.enter()
      .append("circle")
	  .attr("class", "dots")
	  .attr("cx", 0)
	  .attr("cy", d => yScale(yAccessor(d)))
	  .attr("r", d => radiusAccessor(d))	  
	  .attr("fill", d => colors(colorAccessor(d)))
	  
	  .merge(dots)
	  .transition()
	  .duration(4000) 
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
      		
	  // Show tooltip when hovering over circle (data for respective person)
        d3.selectAll(".dots").on("mousemove", function(d) {
            tooltip.html(`Name: <strong>${d.name}</strong><br>
						  Age: <strong>${+d.age}</strong><br>
						  Race: <strong>${d.race}</strong><br>
						  Date: <strong>${d.date}</strong><br>
						  Manner of death: <strong>${d.manner_of_death}</strong><br>
						  Armed: <strong>${d.armed}</strong><br>
						  Signs of mental illness: <strong>${d.signs_of_mental_illness}</strong><br>`)
                .style('top', d3.event.pageY - 12 + 'px')
                .style('left', d3.event.pageX + 25 + 'px')
                .style("opacity", 0.9);

            xLine.attr("x1", d3.select(this).attr("cx"))
                .attr("y1", d3.select(this).attr("cy"))
                .attr("y2", dimensions.boundedHeight)
                .attr("x2",  d3.select(this).attr("cx"))
                .attr("opacity", 1);

        }).on("mouseout", function(_) {
            tooltip.style("opacity", 0);
            xLine.attr("opacity", 0);
        });
	 
	function ticked() {
     dots
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }

	
   // Draw axes
   
   const xAxis = bounds.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)		

	const yAxis = bounds.append("g")
		.call(yAxisGenerator)
		.style('transform', `translate(${dimensions.margin.left},0)`)
		
	const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
	  .style("font-size", "16px")
      .text("Date")
   
}
drawBeeswarm()