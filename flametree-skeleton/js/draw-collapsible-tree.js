// Specify the charts’ dimensions.
const width = 600;
const height = 1000;
const marginTop = 40;
const marginRight = 150;
const marginBottom = 40;
const marginLeft = 100;

let svg, gLink, gNode;

// Set up the initial treeData
let treeData = constructJSON();

document
  .getElementById("carryReturnAnalysisDropdown")
  .addEventListener("change", function () {
    treeData = constructJSON(); // Update the treeData when dropdown changes    
    update(null, treeData); // Pass new treeData to update function
  });

  document
  .getElementById("riskFreeCurveAnalysisDropdown")
  .addEventListener("change", function () {
    treeData = constructJSON(); // Update the treeData when dropdown changes    
    update(null, treeData); // Pass new treeData to update function
  });

function constructJSON() {
  let carryReturnAnalysisValue = document.getElementById(
    "carryReturnAnalysisDropdown"
  ).value;

  let riskFreeAnalysisValue = document.getElementById(
    "riskFreeCurveAnalysisDropdown"
  ).value;

  let jsonData = {
    name: "Total return",
    children: [],
  };
  if (carryReturnAnalysisValue === "none") {
    jsonData.children.push({ name: "FX return" });
    jsonData.children.push({ name: "Residual return" });
  } else if (carryReturnAnalysisValue === "aggregatedCarry") {
    jsonData.children.push({ name: "Carry return" });
    jsonData.children.push({ name: "FX return" });
    jsonData.children.push({ name: "Residual return" });
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
    jsonData.children.push({ name: "Risk-free curve return",
    children: [
        { name: "0.25 year key rate duration" },
        { name: "0.5 year key rate duration" },
        { name: "1 year key rate duration" },
        { name: "2 year key rate duration" },
        { name: "3 year key rate duration" },
        { name: "4 year key rate duration" },
        { name: "5 year key rate duration" },
        { name: "6 year key rate duration" },
        { name: "7 year key rate duration" },
        { name: "8 year key rate duration" },
        { name: "9 year key rate duration" },
        { name: "10 year key rate duration" },
        { name: "15 year key rate duration" },
        { name: "20 year key rate duration" },
        { name: "25 year key rate duration" },
        { name: "30 year key rate duration" },
      ],
    });
  }



  return jsonData;
}

// The code for the tree visualization follows

const root = d3.hierarchy(treeData);
const dx = 60;
const dy = 200;
const tree = d3.tree().nodeSize([dx, dy]);
const diagonal = d3
  .linkHorizontal()
  .x((d) => d.y)
  .y((d) => d.x);

svg = d3
  .select("#treeWrapper")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

gLink = svg
  .append("g")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5);

gNode = svg.append("g").attr("cursor", "pointer").attr("pointer-events", "all");

function update(event, source) {
  let root = d3.hierarchy(source);
  root.x0 = dy / 2;
  root.y0 = 0;

  let nodeId = 0;
  root.descendants().forEach((d) => {
    d.id = nodeId++;
    d._children = d.children;
  });

  const duration = event?.altKey ? 2500 : 250;
  const nodes = root.descendants().reverse();
  const links = root.links();

  tree(root);

  let left = root;
  let right = root;
  root.eachBefore((node) => {
    if (node.x < left.x) left = node;
    if (node.x > right.x) right = node;
  });

  const transition = svg
    .transition()
    .duration(duration)
    .attr("height", height)
    .attr("width", width)
    .attr(
      "viewBox",
      `${-marginLeft} ${left.x} ${width + marginRight} ${height}`
    );

  const node = gNode.selectAll("g").data(nodes, (d) => d.data.name); // Using name as key. Ensure it's unique.

  const nodeEnter = node
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.y0},${d.x0})`)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0);

  nodeEnter
    .append("circle")
    .attr("r", 5.5)
    .attr("fill", (d) => (d._children ? "#555" : "#999"))
    .attr("stroke-width", 10);

  nodeEnter
    .append("text")
    .attr("dy", "0.31em")
    .attr("x", (d) => (d._children ? -6 : 6))
    .attr("text-anchor", (d) => (d._children ? "end" : "start"))
    .text((d) => d.data.name);

  const nodeUpdate = node
    .merge(nodeEnter)
    .transition(transition)
    .attr("transform", (d) => `translate(${d.y},${d.x})`)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);

  const nodeExit = node
    .exit()
    .transition(transition)
    .remove()
    .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0);

  const link = gLink
    .selectAll("path")
    .data(links, (d) => d.target.id + "-" + d.source.id); // Using a combined key for links.

  const linkEnter = link
    .enter()
    .append("path")
    .attr("d", (d) => {
      const o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    });

  link.merge(linkEnter).transition(transition).attr("d", diagonal);

  link
    .exit()
    .transition(transition)
    .remove()
    .attr("d", (d) => {
      const o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    });

  root.eachBefore((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

root.x0 = dy / 2;
root.y0 = 0;
root.descendants().forEach((d, i) => {
  d.id = i;
  if (d.children) d._children = d.children.slice(); // clone the children array
});

// Initialize the tree visualization with the starting data.
update(null, treeData);
