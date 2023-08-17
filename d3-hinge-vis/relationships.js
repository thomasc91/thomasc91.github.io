const people = {};
let time_so_far = 0;
let speed = 300;
const radius = 3,
  padding = 1,
  cluster_padding = 5;

const margin = { top: 0, right: 20, bottom: 20, left: 20 },
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
const rowWidth = 8;
const columnWidth = 2;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.select("#chart").style("width", width + margin.left + margin.right + "px");

svg
  .append("text")
  .attr("x", (width + margin.left + margin.right) / 2)
  .attr("y", 30)
  .attr("text-anchor", "middle")
  .style("font-size", "29px")
  .text("TIME AFTER SWIPING ON HINGE");

const iconOffset = 191;
svg
  .append("circle")
  .attr("cx", width / 2 - iconOffset)
  .attr("cy", 55)
  .attr("r", 3)
  .style("fill", "#8d5e86");

svg
  .append("text")
  .attr("x", width / 2 + 20)
  .attr("y", 60)
  .attr("text-anchor", "middle")
  .style("font-size", "13px")
  .text(
    "Every\u00A0\u00A0 represents one of the 1,036 women I had an interaction with on the app"
  );

  const arrowStartY = (2 * height) / rowWidth;
  const arrowEndY = height;
  
  svg.append("line")
     .attr("x1", width)  
     .attr("y1", arrowStartY)
     .attr("x2", width)
     .attr("y2", arrowEndY)
     .attr("stroke", "black")
     .attr("stroke-width", 2)
     .attr("marker-end", "url(#arrow)");

     svg.append("defs")
     .append("marker")
     .attr("id", "arrow")
     .attr("viewBox", "0 -5 10 10")
     .attr("refX", 5)
     .attr("refY", 0)
     .attr("markerWidth", 6)
     .attr("markerHeight", 6)
     .attr("orient", "auto")
     .append("path")
     .attr("d", "M0,-5L10,0L0,5")
     .attr("class", "arrowHead")
     .style("stroke", "black")
     .style("fill", "black");
    
     svg.append("text")
     .attr("x", width+10)  // adjust positioning as needed
     .attr("y", (arrowStartY + arrowEndY) / 2)
     .style("fill", "black")
     .style("font-size", "14px")
     .style("text-anchor", "middle")
     .style("dominant-baseline", "middle")
     .style("writing-mode", "tb")  // This makes the text vertical
     .text("How far each interaction progressed");
  


const monthsField = svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 95)
  .attr("text-anchor", "middle")
  .style("font-size", "30px");

const groups = {
  "Pre-like status": {
    x: width / 2,
    y: -400,
    color: "grey",
    cnt: 0,
    fullname: "Pre-like status",
  },
  "Pre-liked me status": {
    x: (width / 2) ,
    y: -400,
    color: "grey",
    cnt: 0,
    fullname: "Pre-liked me status",
  },
  "Sent like": {
    x: width / 3 - 30,
    y: (2 * height) / rowWidth,
    color: "grey",
    cnt: 0,
    fullname: "Sent like",
  },
  "Liked me": {
    x: (width / 3) * 2 + 30,
    y: (2 * height) / rowWidth,
    color: "grey",
    cnt: 0,
    fullname: "Liked me",
  },
  Match: {
    x: width / 2,
    y: (3 * height) / rowWidth,
    color: "#8d5e86",
    cnt: 0,
    fullname: "Match",
  },
  "Conversation in app": {
    x: width / 2,
    y: (4 * height) / rowWidth,
    color: "#8d5e86",
    cnt: 0,
    fullname: "Conversation in app",
  },
  "First date": {
    x: width / 2,
    y: (5.0 * height) / rowWidth,
    color: "#FFA4B6", 
    cnt: 0,
    fullname: "First date",
  },
  "Second date": {
    x: width / 2,
    y: (6 * height) / rowWidth,
    color: "#FFA4B6",
    cnt: 0,
    fullname: "Second date",
  },
  Dating: {
    x: width / 2 - 80,
    y: (7 * height) / rowWidth,
    color: "#FFA4B6",
    cnt: 0,
    fullname: "Dating",
  },
  Ended: {
    x: (width / 2) + 80,
    y: (7 * height) / rowWidth,
    color: "black",
    cnt: 0,
    fullname: "Ended",
  },
  "Deleted the app": {
    x: (width / 2) ,
    y: (8 * height) / rowWidth,
    color: "red",
    cnt: 0,
    fullname: "Deleted the app",
  },
};
let cumulativeMatches = 0;
let cumulativeFirstDates = 0;

function initializeSimulation() {
  const stages = d3.csv("stages_all.csv", d3.autoType);

  stages.then(function (data) {
    let startdate = new Date("2022-08-28");    
      lineWidth = width;
      lineHeight = 200;
      lineRightMargin = 110
      lineTopMargin = 20
      lineBottomMargin = 20

    const lineSvg = d3
      .select("#chart")
      .append("svg")
      .attr("class", "line-chart")
      .attr("width", lineWidth)
      .attr("height", lineHeight)
      .append("g")       

    const xScale = d3
      .scaleTime()
      .domain([startdate, startdate])
      .range([0, width-lineRightMargin]);

    const yScale = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([lineHeight-lineBottomMargin, lineTopMargin]);

    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.cumulativeCount))
      .curve(d3.curveMonotoneX);

    const xAxis = d3.axisBottom(xScale)
    .ticks(4)
    

    lineSvg
    .append("g")
    .attr("class", "x-axis")  // Add this line
    .attr("transform", "translate(0," + (lineHeight - lineBottomMargin) + ")")
    .call(xAxis);

    yAxis = d3.axisLeft(yScale).ticks(5);

    //lineSvg.append("g").attr("class", "y-axis").call(yAxis);

    const lineDataMatches = [];
    const lineDataFirstDates = [];

    data.forEach((d) => {
      if (d3.keys(people).includes(d.pid + "")) {
        people[d.pid + ""].push(d);
      } else {
        people[d.pid + ""] = [d];
      }
    });

    var nodes = d3.keys(people).map(function (d) {
      groups[people[d][0].grp].cnt += 1;

      return {
        id: "node" + d,
        x: groups[people[d][0].grp].x + Math.random(),
        y: groups[people[d][0].grp].y + Math.random(),
        r: radius,

        group: people[d][0].grp,
        prevGroup: people[d][0].grp,
        timeleft: people[d][0].duration,
        istage: 0,
        stages: people[d],
      };
    });
    function mouseover(d) {
      d3.select("#tooltip")
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY - 28 + "px")
        .style("opacity", 1);

      d3.select("#value").text(d.id.replace("node", ""));
    }

    function mouseout(d) {
      d3.select("#tooltip").style("opacity", 0);
    }

    const circle = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", (d) => d.color)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    circle
      .transition()
      .delay((d, i) => i * 5)
      .duration(800)
      .attrTween("r", (d) => {
        const i = d3.interpolate(0, d.r);
        return (t) => (d.r = i(t));
      });

      svg
      .selectAll(".grp")
      .data(d3.keys(groups))
      .join("text")
      .attr("class", "grp")
      .attr("text-anchor", (d) => (d === "Liked me" || d === "Ended" ? "end" : "left"))
      .attr("x", (d) => (d === "Liked me" || d === "Ended" ? width - 50 : 0))
      .attr("y", (d) => groups[d].y)
      .text((d) => groups[d].fullname.toUpperCase());

    const simulation = d3
      .forceSimulation(nodes)
      .force("x", (d) => d3.forceX(d.x))
      .force("y", (d) => d3.forceY(d.y))
      .force("cluster", forceCluster())
      .force("collide", forceCollide())
      .alpha(0.09)
      .alphaDecay(0);

    simulation.on("tick", () => {
      circle
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", (d) => groups[d.group].color);

        if (simulation.alpha() < 0.01) {
            simulation.stop();
        }
    });

    function timer() {
      nodes.forEach(function (o, i) {
        o.timeleft -= 1;
        if (o.timeleft == 0 && o.istage < o.stages.length - 1) {
          groups[o.group].cnt -= 1;

          o.istage += 1;
          o.group = o.stages[o.istage].grp;
          o.timeleft = o.stages[o.istage].duration;

          groups[o.group].cnt += 1;
        }
      });
      nodes.forEach(function (node, i) {
        if (
          node.group === "Match" &&
          (node.prevGroup === "Sent like" || node.prevGroup === "Liked me")
        ) {
          cumulativeMatches++;
        }
        if (
          node.group === "First date" &&
          node.prevGroup === "Conversation in app"
        ) {
          cumulativeFirstDates++;
        }
        node.prevGroup = node.group;
      });

      time_so_far += 1;
      var currdate = new Date(startdate.getTime() + time_so_far * 86400000);
      xScale.domain([startdate, currdate]);
      lineSvg.select("g")
      .transition()
      .duration(300)  // You can adjust this duration as needed
      .call(xAxis);


      d3.select("#timecount .cnt").text(time_so_far);

      svg.selectAll(".grpcnt").text((d) => groups[d].cnt);
      document
        .getElementById("slow-button")
        .addEventListener("click", function () {
          speed = 600;
        });      
      document
        .getElementById("fast-button")
        .addEventListener("click", function () {
          speed = 50;
        });

      if (currdate < new Date("2023-08-29")) {
        d3.timeout(timer, speed);
      }

      lineDataMatches.push({
        date: currdate,
        cumulativeCount: cumulativeMatches,
      });

      yScale.domain([0, d3.max(lineDataMatches, (d) => cumulativeMatches)]);
      
      lineSvg.select(".y-axis").call(yAxis);

      xScale.domain(d3.extent(lineDataMatches, (d) => d.date));

      const pathMatches = lineSvg
        .selectAll(".line-path-matches")
        .data([lineDataMatches]);
      
      pathMatches
        .enter()
        .append("path")
        .attr("class", "line-path-matches")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#8d5e86")
        .attr("stroke-width", 2)
        .merge(pathMatches)
        .attr("d", line);

      pathMatches.exit().remove();

      const lastMatchData = lineDataMatches[lineDataMatches.length - 1];

    const matchLabel = lineSvg.selectAll(".line-label-matches")
        .data([lastMatchData]);

        matchLabel.enter()
        .append("text")
        .attr("class", "line-label-matches")
        .merge(matchLabel)
        .attr("x", d => lineWidth - lineRightMargin + 10) // +5 for a small right offset
        .attr("y", d => lineTopMargin)        
        .text(d => `💜${d.cumulativeCount} matches`);

        matchLabel.exit().remove();
      
        lineDataFirstDates.push({
        date: currdate,
        cumulativeCount: cumulativeFirstDates,
      });

      const pathFirstDates = lineSvg
        .selectAll(".line-path-first-dates")
        .data([lineDataFirstDates]);

      pathFirstDates
        .enter()
        .append("path")
        .attr("class", "line-path-first-dates")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#FFA4B6")
        .attr("stroke-width", 2)
        .merge(pathFirstDates)
        .attr("d", line);

      pathFirstDates.exit().remove();
      const lastFirstDateData = lineDataFirstDates[lineDataFirstDates.length - 1];

      const firstDateLabel = lineSvg.selectAll(".line-label-first-dates")
        .data([lastFirstDateData]);
      
      firstDateLabel.enter()
        .append("text")
        .attr("class", "line-label-first-dates")
        .merge(firstDateLabel)
        .attr("x", d => lineWidth - lineRightMargin + 10) // +5 for a small right offset
        .attr("y", d => yScale(d.cumulativeCount))
        //.attr("dy", "-0.15em") // slight upwards offset        
        .text(d => `🍸${d.cumulativeCount} first dates`);
      
      firstDateLabel.exit().remove();
      const monthsElapsed = Math.floor(time_so_far / 30.44);
      function daysToMonthsAndDays(days) {
        const averageMonthLength = 30.44;
        let months = Math.floor(days / averageMonthLength);
        let remainingDays = Math.round(days % averageMonthLength);
        return { months, days: remainingDays };
      }

      let elapsedDays = time_so_far;
      let result = daysToMonthsAndDays(elapsedDays);

      monthsField.text(`${result.months} months, ${result.days} days`);
    }

    d3.timeout(timer, 500);
  });
}

function forceCluster() {
  const strength = 0.04;
  let nodes;

  function force(alpha) {
    const l = alpha * strength;
    for (const d of nodes) {
      d.vx -= (d.x - groups[d.group].x) * l;
      d.vy -= (d.y - groups[d.group].y) * l * 5;
    }
  }
  force.initialize = (_) => (nodes = _);

  return force;
}

function forceCollide() {
  const alpha = 0.1;
  const padding1 = padding;
  const padding2 = cluster_padding;
  let nodes;
  let maxRadius;

  function force() {
    const quadtree = d3.quadtree(
      nodes,
      (d) => d.x,
      (d) => d.y
    );
    for (const d of nodes) {
      const r = d.r + maxRadius;
      const nx1 = d.x - r,
        ny1 = d.y - r;
      const nx2 = d.x + r,
        ny2 = d.y + r;
      quadtree.visit((q, x1, y1, x2, y2) => {
        if (!q.length)
          do {
            if (q.data !== d) {
              const r =
                d.r +
                q.data.r +
                (d.group === q.data.group ? padding1 : padding2);
              let x = d.x - q.data.x,
                y = d.y - q.data.y,
                l = Math.hypot(x, y);
              if (l < r) {
                l = ((l - r) / l) * alpha;
                (d.x -= x *= l), (d.y -= y *= l);
                (q.data.x += x), (q.data.y += y);
              }
            }
          } while ((q = q.next));
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    }
  }

  force.initialize = (_) =>
    (maxRadius =
      d3.max((nodes = _), (d) => d.r) + Math.max(padding1, padding2));

  return force;
}
initializeSimulation();
