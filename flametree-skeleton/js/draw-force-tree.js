const width = 712;
const height = 1000;

// Set up the initial treeData
let treeData = constructJSON();
let linkLength = 40
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
    .attr("y", -470)  // sets the y position of the text, adjust as necessary
    .text("Click and drag the nodes to reposition")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#000")
    .attr("font-style", "italic");

let root = d3.hierarchy(treeData);
let links = root.links();
let nodes = root.descendants();

let simulation = d3.forceSimulation(nodes)
.force("link", d3.forceLink(links).id(d => d.id).distance(d => { return d.source.children ? linkLength*3 : linkLength;
}).strength(1))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("x", d3.forceX(300))
    .force("y", d3.forceY());

// Set the "Total return" node to a fixed position
nodes.forEach((node) => {
  if (node.data.name === "Total return") {
      node.fx = -300; // center x (because of viewBox setup)
      node.fy = -400; // center y (because of viewBox setup)
  }
  if (node.data.name === "Residual return") {
    node.fx = -300; // center x (because of viewBox setup)
    node.fy = -linkLength * 2; // center y (because of viewBox setup)
}
if (node.data.name === "FX return") {
  node.fx = -10; // center x (because of viewBox setup)
  node.fy = -400; // center y (because of viewBox setup)
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
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
    .attr("fill", d => d.children ? null : "#000")
    .attr("stroke", d => d.children ? null : "#fff")
    .attr("r", 9)
    .call(drag(simulation));

node.append("title")
    .text(d => d.data.name);

// Append node labels.
let label = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("dx", 10) // position text relative to the circle
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
    treeData = constructJSON(); // Update the treeData when dropdown changes    
    update(treeData); // Pass new treeData to update function
  });

  document
  .getElementById("riskFreeCurveAnalysisDropdown")
  .addEventListener("change", function () {
    treeData = constructJSON(); // Update the treeData when dropdown changes    
    update(treeData); // Pass new treeData to update function
  });
  
  document
  .getElementById("securityLevelSpreadAnalysisDropdown")
  .addEventListener("change", function () {
    treeData = constructJSON(); // Update the treeData when dropdown changes    
    update(treeData); // Pass new treeData to update function
  });

  const debouncedUpdateNumber = debounce(() => {
    treeData = constructJSON();
    update(treeData);
}, 250); // 250 milliseconds delay

const debouncedUpdatetext = debounce(() => {
  treeData = constructJSON();
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
        treeData = constructJSON();
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
// Add nodes based on checkbox values
const checkboxes = [
  "convexityReturn", 
  "rollDownReturn", 
  "priceReturn", 
  "paydownReturn", 
  "dtsAttribution",
  "interaction"
];

checkboxes.forEach(checkboxId => {
  const checkboxElem = document.getElementById(checkboxId);
  if (checkboxElem.checked) {
      jsonData.children.push({ name: checkboxElem.value });
  }
});

return jsonData;
}




