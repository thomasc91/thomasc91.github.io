var totals = [{
        title: "Soft-serve",
        value: 286,
        all: 1098
    },
    {
        title: "Scooped",
        value: 472,
        all: 1098
    },
    {
        title: "No Preference",
        value: 318,
        all: 1098
    }
];

//female
var femaleData = [{
        title: "Soft-serve",
        value: 25,
        all: 100
    },
    {
        title: "Scooped",
        value: 44,
        all: 100
    },
    {
        title: "No Preference",
        value: 28,
        all: 100
    },

];

//male
var maleData = [{
        title: "Soft-serve",
        value: 27,
        all: 100
    },
    {
        title: "Scooped",
        value: 42,
        all: 100
    },
    {
        title: "No Preference",
        value: 30,
        all: 100
    },
    {
        title: "Not Sure",
        value: 2,
        all: 100
    }
];

var width = 100;
var height = 100;
var radius = Math.min(width, height) / 2;
var donutWidth = 15;
var color = d3.scaleOrdinal()
    .range(["#5A39AC", "#DD98D6", "#E7C820", "#08B2B2"]);

var svg = d3.select('#donut')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

var pie = d3.pie()
    .value(function (d) {
        return d.value;
    })
    .sort(null);

var donutTip = d3.select("body").append("div")
    .attr("class", "donut-tip")
    .style("opacity", 0);

var path = svg.selectAll('path')
    .data(pie(totals))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d, i) {
        return color(d.data.title);
    })
    .attr('transform', 'translate(0, 0)')
    .on('mouseover', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85');
        donutTip.transition()
            .duration(50)
            .style("opacity", 1);
        let num = (Math.round((d.value / d.data.all) * 100)).toString() + '%';
        donutTip.html(num)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");

    })
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        donutTip.transition()
            .duration('50')
            .style("opacity", 0);
    });

function change(data) {
    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        }).sort(null)(data);

      var width = 100;
      var height = 100;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 15;
    path = d3.select("#donut")
        .selectAll("path")
        .data(pie); // Compute the new angles
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
    path.transition().duration(500).attr("d", arc); // redrawing the path with a smooth transition
}


    d3.select("#selectbox")
     .on("change", function() {
       const selectedInput = d3.select(this).property("value")
       console.log(selectedInput)
       if (selectedInput == 'All') {
         change(totals)
       } else if (selectedInput == 'Sydney') {
         change(femaleData)
       }
       })
