//Home Page Graphic
//adapted from https://bl.ocks.org/mbostock/3231307

//const width = 400
//const height = 400
var width = d3.select("#background").node().clientWidth;
var height = d3.select("#background").node().clientHeight;

const n = 1000

const color = ['black', '#46c8b2', '#f5d800', '#ff8b22', '#ff6859', '#fc4d77'];

function genData() {
  const k = width / 200;
  const r = d3.randomUniform(k, k * 4);
  return Array.from({length: 300}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
}

function drawChart(data){

	var canvas = d3.select("#background").append("canvas")
    .attr("width", width)
    .attr("height", height);
  //var canvas = document.getElementById('canvas'); WORKS
  //var context = canvas.getContext("2d"); WORKS
  var context = canvas.node().getContext("2d");

const nodes = genData()
	console.log(nodes)
  const simulation = d3.forceSimulation(nodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
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
      
