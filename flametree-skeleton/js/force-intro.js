//Home Page Graphic
//adapted from https://bl.ocks.org/mbostock/3231307

const n = 400

const color = ['#fff1e5', '#e23130', '#e23130'];

function genData() {
  const k = width / 300;
  const r = d3.randomUniform(k, k * 3);
  return Array.from({length: n}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
}

function drawChart(data){
  width = d3.select("#background").node().clientWidth;
  height = d3.select("#background").node().clientHeight;
  var canvas = d3.select("#background").append("canvas")
    .attr("width", width)
    .attr("height", height);
  //var canvas = document.getElementById('canvas');
  //var context = canvas.getContext("2d");
  var context = canvas.node().getContext("2d");

const nodes = genData()
  const simulation = d3.forceSimulation(nodes)
      .alphaTarget(0.5) // stay hot
      .velocityDecay(0.4) // low friction
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
      .on("tick", ticked);

  d3.select(context.canvas)
      .on("touchmove", event => event.preventDefault())
      .on("pointermove", pointed);
  //invalidation.then(() => simulation.stop());

 function pointed(event) {
    const [x, y] = d3.pointer(event);
    nodes[0].fx = x - width / 2;
    nodes[0].fy = y - height / 2;
  }

function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    for (const d of nodes) {
      context.beginPath();
      context.moveTo(d.x + d.r, d.y);
      context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
    context.fillStyle = color[d.group];
    context.fill();
    }
    context.restore();
  }
return context.canvas
}

drawChart(genData)

// 3. bind data and draw nodes

$(window).on("resize", function () {
  width = d3.select("#background").node().clientWidth
  height = d3.select("#background").node().clientHeight
  d3.select(context.canvas)
    .attr("width", width)
    .attr("height", height);
  });
