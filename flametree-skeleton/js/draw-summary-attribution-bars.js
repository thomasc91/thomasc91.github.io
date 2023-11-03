
function drawSummaryAttributionBars(data) { 
d3.json(data).then(data => {
    const totalData = data.Total;
    const entries = Object.entries(totalData);

    const margin = { top: 20, right: 80, bottom: 40, left: 20 },
          width = 400 - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;

    // Define the bar transition duration
    const barTransitionDuration = 1000;
    
    const svg = d3.select("#reportResultsWrapper")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([-Math.max(...entries.map(d => Math.abs(d[1]))), Math.max(...entries.map(d => Math.abs(d[1])))])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(entries.map(d => d[0]))
        .range([height, 0])
        .padding(0.1);

      // Interpolation functions for gradient color
      const greenInterpolator = d3.interpolate("#d9fcd9", "#006400"); // from very light green to dark green
        const redInterpolator = d3.interpolate("#ffd9d9", "#8b0000"); // from very light red to dark red

       // Initial bar width set to 0
    const bars = svg.selectAll(".bar")
    .data(entries)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d[0]))
    .attr("height", y.bandwidth())
    .attr("x", d => x(0))
    .attr("width", 0)  
    .attr("fill", d => {
        const scaledValue = (d[1]) * 10; // this scales the value between 0 and 1
        if (d[1] > 0) {
            return greenInterpolator(scaledValue);
        } else {
            return redInterpolator(Math.abs(scaledValue));
        }
    })
    .transition()
    .duration(barTransitionDuration)
    .attr("x", d => x(Math.min(0, d[1])))
    .attr("width", d => Math.abs(x(d[1]) - x(0)))

    // Add the formatted values at the end of each bar, starting from 0 and counting up
    const labels = svg.selectAll(".label")
    .data(entries)
    .enter().append("text")
    .attr("class", "label")
    .attr("y", d => y(d[0]) + y.bandwidth() / 2)
    .attr("x", x(0))  // Start at the Y-axis
    .attr("dy", ".35em")
    .attr("text-anchor", d => d[1] > 0 ? "start" : "end")
    .attr("fill", "#ffffff")
    .text("0.00%");

labels.transition()
    .duration(barTransitionDuration)
    .attr("x", d => d[1] > 0 ? x(d[1]) + 5 : x(d[1]) - 5)
    .tween("text", function(d) {
        const i = d3.interpolateNumber(0, d[1] * 100);
        return function(t) {
            d3.select(this).text(`${i(t).toFixed(2)}%`);
        };
    });

    svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${x(0)},0)`)
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("fill", "#ffffff")
    .attr("font-size", "16px")  // Adjust font size as needed
    .attr("font-family", "Segoe UI");  // Set the font


    

});
}