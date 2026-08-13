const width = 712;
const height = 400;

function fetchJSONData() {
  // Assuming the file is named "data.json" and is in the "levecq" folder
  // You can replace 'levecq/data.json' with the actual path if different
  return fetch('../API/levecq/PORTFOLIO_SUMMARY_ATTRIBUTION_REPORT_0.json')
      .then(response => response.json())
      .catch(error => console.error("Error fetching JSON:", error));
}

function disableAndShowLoading() {
  let button = $("#runPythonFunction");
  button.prop("disabled", true);
  button.find(".spinner-grow, .loading-text").show();
  button.find(".original-text").hide();
}

function enableAndHideLoading() {
  let button = $("#runPythonFunction");
  button.prop("disabled", false);
  button.find(".spinner-grow, .loading-text").hide();
  button.find(".original-text").show();
}

function fiaAPICall() {
   console.log('Running fiaAPICall start')  
   return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://127.0.0.1:5000/API/run_python_function",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(jsonSettings),
      success: function(data) {
          alert(data.message);
          resolve(data); // Resolve the promise with the data.
      },
      error: function(error) {
          console.error("Error in API call:", error);
          reject(error);
      }
    });
  });
}

async function updateChartFromJSON() {
  // Clear the existing contents of the SVG
  d3.select("#reportResultsWrapper").selectAll('*').remove();;

  disableAndShowLoading();

  // Start the timer
  const startTime = performance.now();

  try {
      await fiaAPICall();
      const jsonDataSummary = await fetchJSONData();
      drawSummaryAttributionBars(jsonDataSummary);

      // End the timer
      const endTime = performance.now();
      const calculationTime = ((endTime - startTime) / 1000).toFixed(1); // This will give time in seconds, rounded to one decimal place

      // Display the time
      $('#calculationTime').text(`File upload, attribution calculation and download took ${calculationTime}s`);

      enableAndHideLoading();
  } catch (error) {
      enableAndHideLoading();
      console.error("Error updating chart:", error);
  }
}

$(document).ready(function() {
  $("#runPythonFunction").off().click(updateChartFromJSON);  
});

// Set up the initial treeData
({treeData, jsonSettings} = constructJSON());
let linkLength = 60
function update(treeData) {  
  let svg = d3.select("#treeWrapper") // Replace with your SVG container's ID or another selector
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 2, width, height]);
    // Remove old links, nodes, and labels
    svg.selectAll("line").remove();
    svg.selectAll("circle").remove();
    svg.selectAll("text").remove();
  
    svg.append("text")
    .attr("x", -350)  // sets the x position of the text, adjust as necessary
    .attr("y", -155)  // sets the y position of the text, adjust as necessary
    .text("Attribution Tree")
    .attr("font-size", "24px")
    .attr("fill", "#ababab")
    
    

let root = d3.hierarchy(treeData);
let links = root.links();
let nodes = root.descendants();

let simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(d => { return d.source.children ? linkLength*3 : linkLength;
}).strength(1))
    .force("charge", d3.forceManyBody().strength(-700))
    .force("x", d3.forceX(300))
    .force("y", d3.forceY())
    .force("collide", d3.forceCollide(50)); // added collision force


// Set the "Total return" node to a fixed position
nodes.forEach((node) => {
  if (node.data.name === "Total return") {
      node.fx = -300; // center x (because of viewBox setup)
      node.fy = -100; // center y (because of viewBox setup)
  }
  if (node.data.name === "Residual return") {
    node.fx = -300; // center x (because of viewBox setup)
    node.fy = 100; // center y (because of viewBox setup)
}
if (node.data.name === "FX return") {
  node.fx = -10; // center x (because of viewBox setup)
  node.fy = -100; // center y (because of viewBox setup)
}
});



// Create or select the container SVG.

// Append links.
let link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line");

// Append nodes.
let node = svg.append("g")
    .attr("fill", "#0d6efd")
    .attr("stroke", "white")
    .attr("stroke-width", 1)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
    .attr("fill", d => d.children ? null : "#0d6efd")
    .attr("stroke", d => d.children ? null : "white")
    .attr("r", 9)
    .call(drag(simulation));

node.append("title")
    .text(d => d.data.name);

// Append node labels.
let label = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("font-size", "16px")
    .attr("fill", "white")
    .attr("dx", 16) // position text relative to the circle
    .attr("dy", ".35em") // vertically center the text
    .text(d => d.data.name);

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
    
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    
      // Update label positions
      label
          .attr("x", d => d.x)
          .attr("y", d => d.y);
    });
    
  }

function drag(simulation) {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.1).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (1==1) {
      if (!event.active) simulation.alphaTarget(0);
  } else if (d.data.name !== "Total return" && d.data.name !== "Residual return" && d.data.name !== "FX return") {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  }
}

  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

update(treeData)

function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

document
  .getElementById("carryReturnAnalysisDropdown")
  .addEventListener("change", function () {
    ({treeData, jsonSettings} = constructJSON());
    update(treeData); // Pass new treeData to update function
  });

  document
  .getElementById("riskFreeCurveAnalysisDropdown")
  .addEventListener("change", function () {
    ({treeData, jsonSettings} = constructJSON());
    update(treeData); // Pass new treeData to update function
  });
  
  document
  .getElementById("securityLevelSpreadAnalysisDropdown")
  .addEventListener("change", function () {
    ({treeData, jsonSettings} = constructJSON());
    update(treeData); // Pass new treeData to update function
  });

  const debouncedUpdateNumber = debounce(() => {
    ({treeData, jsonSettings} = constructJSON());
    update(treeData);
}, 250); // 250 milliseconds delay

const debouncedUpdatetext = debounce(() => {
  ({treeData, jsonSettings} = constructJSON());
  update(treeData);
}, 400); // 400 milliseconds delay


document.getElementById("keyRateInput").addEventListener("input", debouncedUpdateNumber);

document.getElementById("brinsonInput").addEventListener("input", debouncedUpdatetext);

  const checkboxes = [
    "convexityReturn", 
    "rollDownReturn", 
    "priceReturn", 
    "paydownReturn", 
    "dtsAttribution",
    "interaction"
];

checkboxes.forEach(checkboxId => {
    document.getElementById(checkboxId).addEventListener("change", function () {
      ({treeData, jsonSettings} = constructJSON());
        update(treeData);
    });
});



function constructJSON() {
  let carryReturnAnalysisValue = document.getElementById(
    "carryReturnAnalysisDropdown"
  ).value;

  let riskFreeAnalysisValue = document.getElementById(
    "riskFreeCurveAnalysisDropdown"
  ).value;
  let securityLevelSpreadAnalysisValue = document.getElementById(
    "securityLevelSpreadAnalysisDropdown"
  ).value;

  let brinsonAllocationSectorsValue = document.getElementById(
    "brinsonInput"
  ).value;

  
  let jsonSettings = {
    //Attribution model config
    FT_STRING_CARRY_DECOMPOSITION           : "NONE", //NONE AGGREGATED PULL_TO_PAR CREDIT_CARRY
    FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION : "NONE", //NONE AGGREGATED DURATION STB KRD CCB PCA         
    FT_BOOL_ROLLDOWN_ATTRIBUTION            : "false",//BOOLEAN    
    FT_BOOL_CONVEXITY_ATTRIBUTION           : "false",//BOOLEAN    
    FT_BOOL_INTERACTION_ATTRIBUTION         : "false",//BOOLEAN    
    FT_BOOL_PRICE_RETURN                    : "false",//BOOLEAN    
    FT_BOOL_PAYDOWN_ATTRIBUTION             : "false",//BOOLEAN    
    FT_BOOL_DTS                             : "false",//BOOLEAN    
    FT_STRING_BRINSON_ALLOCATION_SECTORS    : "strategic,sector,duration_bucket,bondtype", //comma separated string
    

    //Input files
    FT_MATRIX_PORTFOLIO                     : "levecq_p.csv",
    FT_MATRIX_BENCHMARK                     : "levecq_b.csv",
    FT_MATRIX_SECURITY                      : "levecq_s.csv",
    FT_MATRIX_YIELDCURVE                    :  "",


    //Report config
    FT_STRING_SECURITY_DATE_FORMAT          : "%d-%b-%y",
    FT_STRING_PORTFOLIO_DATE_FORMAT         : "%d-%b-%y",
    FT_STRING_BENCHMARK_DATE_FORMAT         : "%d-%b-%y",
    FT_STRING_ZIP_FILE			                : "levecq.zip",
    FT_BOOL_SUMMARY_ATTRIBUTION_REPORT      : "true",
    FT_BOOL_INTERACTIVE_ATTRIBUTION_REPORT  : "true",
    FT_BOOL_CSV_REPORT                      : "true",
    FT_BOOL_XLS_REPORT                      : "true",
    FT_BOOL_JSON_REPORT                     : "true",
    FT_BOOL_SQL_DATA_REPORT                 : "true",
    FT_STRING_RESIDUAL_RETURN_LABEL         : "Stock selection", 
    FT_STRING_SMOOTHING_MODEL               : "Carino",
    FT_STRING_SINGLE_EXCEL_REPORT_FILE      : "levecq",    
    FT_BOOL_FILE_HEADERS                    : "true",          
    FT_INT_NDP	                            : "4",        
    FT_STRING_REPORT_SECTORS                : ["strategic,sector", "duration_bucket,bondtype"],
    FT_STRING_ENCRYPTION_PASSWORD           : ""
  }

  // Update jsonSettings based on free text fields
  jsonSettings.FT_STRING_BRINSON_ALLOCATION_SECTORS = brinsonAllocationSectorsValue;


   // Update jsonSettings based on dropdown values
   switch (carryReturnAnalysisValue) {
    case "none":
        jsonSettings.FT_STRING_CARRY_DECOMPOSITION = "NONE";
        break;
    case "aggregatedCarry":
        jsonSettings.FT_STRING_CARRY_DECOMPOSITION = "AGGREGATED";
        break;
    case "runningYieldPullToPar":
        jsonSettings.FT_STRING_CARRY_DECOMPOSITION = "PULL_TO_PAR";
        break;
    case "riskFreeCreditCarry":
        jsonSettings.FT_STRING_CARRY_DECOMPOSITION = "CREDIT_CARRY";
        break;
}

switch (riskFreeAnalysisValue) {
    case "none":
        jsonSettings.FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION = "NONE";
        break;
    case "aggregatedRiskFree":
        jsonSettings.FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION = "AGGREGATED";
        break;
    case "parallelNonParallel":
        jsonSettings.FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION = "DURATION";
        break;
    case "shiftTwistCurvature":
        jsonSettings.FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION = "STB";
        break;
    case "keyRate":
        jsonSettings.FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION = "KRD";
        break;
    case "PCA":
        jsonSettings.FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION = "PCA";
        break;
    case "CCB":
          jsonSettings.FT_STRING_SOVEREIGN_CURVE_DECOMPOSITION = "CCB";
          break;
}

// Update jsonSettings based on checkboxes
const checkboxes = ["convexityReturn", "rollDownReturn", "priceReturn", "paydownReturn", "dtsAttribution", "interaction"];
checkboxes.forEach(checkboxId => {
    const checkboxElem = document.getElementById(checkboxId);
    switch (checkboxId) {
        case "convexityReturn":
            jsonSettings.FT_BOOL_CONVEXITY_ATTRIBUTION = checkboxElem.checked ? "true" : "false";
            break;
        case "rollDownReturn":
            jsonSettings.FT_BOOL_ROLLDOWN_ATTRIBUTION = checkboxElem.checked ? "true" : "false";
            break;
        case "interaction":
            jsonSettings.FT_BOOL_INTERACTION_ATTRIBUTION = checkboxElem.checked ? "true" : "false";
            break;
        case "priceReturn":
              jsonSettings.FT_BOOL_PRICE_RETURN = checkboxElem.checked ? "true" : "false";
              break;
        case "paydownReturn":
                jsonSettings.FT_BOOL_PAYDOWN_ATTRIBUTION = checkboxElem.checked ? "true" : "false";
                break;
        case "dtsAttribution":
                  jsonSettings.FT_BOOL_DTS = checkboxElem.checked ? "true" : "false";
                  break;
    }
});

  let jsonData = {
    name: "Total return",
    children: [],
  };

  if (carryReturnAnalysisValue === "none") {    
    jsonData.children.push({ name: "FX return" });
    jsonData.children.push({ name: "Residual return" });
  } else if (carryReturnAnalysisValue === "aggregatedCarry") {
    jsonData.children.push({ name: "FX return" });
    jsonData.children.push({ name: "Residual return" }); 
    jsonData.children.push({ name: "Carry return" }); 
  } else if (carryReturnAnalysisValue === "runningYieldPullToPar") {
    jsonData.children.push({
      name: "Carry return",
      children: [
        { name: "Running yield return" },
        { name: "Pull to par return" },
      ],
    });
    jsonData.children.push({ name: "FX return" });
    jsonData.children.push({ name: "Residual return" });
} else if (carryReturnAnalysisValue === "riskFreeCreditCarry") {
    jsonData.children.push({
      name: "Carry return",
      children: [
        { name: "Risk-free carry return" },
        { name: "Credit carry return" },
      ],
    });
    jsonData.children.push({ name: "FX return" });
    jsonData.children.push({ name: "Residual return" });
  }

  let brinsonNodeValues = document.getElementById('brinsonInput').value.split(/[\s,]+/).filter(Boolean);
  if (brinsonNodeValues.length > 0) {
    let currentLevel = jsonData;
    
    for (let value of brinsonNodeValues) {
        let newNode = { name: value, children: [] };
        currentLevel.children.push(newNode);
        currentLevel = newNode;
    }
}

  if (riskFreeAnalysisValue === "none") {
    
  }
 else if (riskFreeAnalysisValue === "aggregatedRiskFree") {
    jsonData.children.push({ name: "Risk-free curve return" });    
  }
  else if (riskFreeAnalysisValue === "parallelNonParallel") {
    jsonData.children.push({ name: "Risk-free curve return",
    children: [
        { name: "Duration return" },
        { name: "Non-parallel return" },
      ],
    });
  }
  else if (riskFreeAnalysisValue === "shiftTwistCurvature") {
    jsonData.children.push({ name: "Risk-free curve return",
    children: [
        { name: "Shift return" },
        { name: "3-10 year twist" },
        { name: "Curvature return" },
      ],
    });
  }
  else if (riskFreeAnalysisValue === "keyRate") {
    // Extract values from the input
    const inputValue = document.getElementById("keyRateInput").value;
    
    // Split the values by comma or space
    const durations = inputValue.split(/[\s,]+/).filter(Boolean); // filter(Boolean) removes any empty strings
    
    // Map the durations to your desired format
    const keyRateChildren = durations.map(duration => ({
        name: `${duration} year key rate duration`
    }));
    
    jsonData.children.push({
        name: "Risk-free curve return",
        children: keyRateChildren
    });
}

  if (securityLevelSpreadAnalysisValue === "none") {
    
  }
 else if (securityLevelSpreadAnalysisValue === "securitySpecific") {
    jsonData.children.push({ name: "Security-specific return" });    
  } 
  else if (securityLevelSpreadAnalysisValue === "zSpread") {
    jsonData.children.push({ name: "Z-spread return" });    
  } 

//Add checkbox attribution model nodes to tree

checkboxes.forEach(checkboxId => {
  const checkboxElem = document.getElementById(checkboxId);
  if (checkboxElem.checked) {
      jsonData.children.push({ name: checkboxElem.value });
  }
});

return { treeData: jsonData, jsonSettings: jsonSettings };
}


function drawSummaryAttributionBars(data) { 
  
      const totalData = data.Total;
      const entries = Object.entries(totalData);
  
      const margin = { top: 40, right: 80, bottom: 40, left: 20 },
            width = 400 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;
  
      // Define the bar transition duration
      const barTransitionDuration = 1000;
      d3.select("#reportResultsWrapper").append("text")
        .attr("x", 10)  // sets the x position of the text, adjust as necessary
        .attr("y", 25)  // sets the y position of the text, adjust as necessary
        .text("Total returns")
        .attr("font-size", "24px")
        .attr("fill", "#ababab")
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
    
  }


