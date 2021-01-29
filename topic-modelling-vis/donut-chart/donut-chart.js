d3.csv("topic_count.csv", d3.autoType).then(d => drawDounutChart(d, '#wrapper'));

function drawDounutChart(dataset ,dom_element_to_append_to){
			
		var width = 400 
		height = width,
		radius = Math.min(width, height) / 4;
		var donutWidth = 30;
		
		var colorScale = d3.scaleOrdinal()
			.domain(dataset.map(d => d.topic))
			.range(d3.quantize(t => d3.interpolateViridis(t * 0.8 + 0.1), dataset.length))
		
		var svg = d3.select(dom_element_to_append_to)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
		var arcPath = d3.arc()  
			 .outerRadius(radius)
			 .innerRadius(radius - donutWidth);
			 
		var pie = d3.pie()
			.value(dataset => dataset.headline_count)
			.sort(null);
		
			 
		// define the tooltip 
		var tool_tip = d3.tip()
		  .attr("class", "d3-tip")		  
		  .html(function(d){return "Topic: " + "<b>" + d.data.topic + "</b>" + "<br>" +
								   "Headline count: " + "<b>" + d.data.headline_count + "</b>" + "<br>" }); 
		
		svg.call(tool_tip);
				
		var path = svg.selectAll('path')
		.data(pie(dataset))
		.enter()
		.append('path')
		.attr('d', arcPath)
		.style("fill", function(d) { return colorScale(d.data.topic);})
		.on("mouseover",  function(d) {tool_tip.show(d);})
	
				
		
	}

