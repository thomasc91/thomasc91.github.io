async function drawBars() {
		
		// Access data
		dataset = await d3.csv("data.csv", d3.autoType)	//todo get total and sort by total
		console.log(dataset)
		
		//stack data to give ranges for stacked bars
		//todo UNDERSTAND HOW THIS WORKS
		const series = d3.stack()
			.keys(dataset.columns.slice(1))
			(dataset)
			.map(d => (d.forEach(v => v.key = d.key), d))		
		console.log(series)
		
		// Set color scale 
		const color = d3.scaleOrdinal()
			.domain(series.map(d => d.key))
			.range(d3.schemeSpectral[series.length])
			.unknown("#ccc")
		
		// Create chart dimensions
		const margin = ({top: 30, right: 10, bottom: 30, left: 30})
		const height = dataset.length * 25 + margin.top + margin.bottom
		const width = 600
				
  
		console.log(d3.max(series, d => d[1]))
		// Create axes
		const xScale = d3.scaleLinear()			
			.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]) //what is the arrow function doing
			.range([margin.left, width - margin.right])
			
		const yScale = d3.scaleBand()
			.domain(dataset.map(d => d.Name)) 
			.range([margin.top, height - margin.bottom])
			.padding(0.1)
		
		const xAxis = g => g
			
			.style("transform", `translateY(${height - margin.bottom}px)`)
			.call(d3.axisBottom(xScale).ticks(width / 100, "s"))
			
		
		const yAxis = g => g
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(yScale).tickSizeOuter(0))
			
		
		// Draw chart
		const barTransition = d3.transition().duration(2000)
		const svg = d3.select("body").append("svg")
			.attr("viewBox", [0, 0, width, height]);
			
		svg.append("g")
		.selectAll("g")
		.data(series)
		.join("g")
		  .attr("fill", d => color(d.key))
		.selectAll("rect")
		.data(d => d)
		
		.join("rect")
		
		  .attr("height", yScale.bandwidth())
		  .attr("y", (d, i) => yScale((d.data.Name)))		  	
		  .attr("x", margin.left)
		  .transition(barTransition).delay((d, i) => { return i * 150; })
		  .attr("x", d => xScale(d[0]))
		  .attr("width", d => xScale(d[1]) - xScale(d[0]))
		  
		  
		  
		svg.append("g")
		  .call(xAxis);

		svg.append("g")
		  .call(yAxis);
		  
		
	return svg.node()	

}
drawBars()