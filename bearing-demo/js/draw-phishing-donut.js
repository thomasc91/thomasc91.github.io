d3.csv('../../data/phishing-donuts.csv').then(function(data) {


   dataAll = data.filter(function(d){ return d.office == 'Brisbane' })

   var dataSent = dataAll.filter(function(d){ return d.type == 'sent' })
   var dataOpened = dataAll.filter(function(d){ return d.type == 'opened' })
   var dataClicked = dataAll.filter(function(d){ return d.type == 'clicked' })

   //Need a less stupid way to do this
   for (var i = 0; i < dataSent.length - 1; i++) {
       var totalSent = dataSent[i].count
   }
   for (var i = 0; i < dataSent.length - 1; i++) {
       var totalOpened = dataOpened[i].count
   }
   for (var i = 0; i < dataSent.length - 1; i++) {
       var totalClicked = dataClicked[i].count
   }

   var width = 120,
   height = 120,
   radius = 70;

   var arc = d3.arc()
     .outerRadius(radius - 10)
     .innerRadius(40);

   var pie = d3.pie()
     .sort(null)
     .value(function(d) {
         return d.count;
     });

  // Sent dounut
   var svg_sent = d3.select('#sent-donut-vis').append("svg")
     .attr("width", width)
     .attr("height", height)
     .append("g")
     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

   var g1 = svg_sent.selectAll(".arc")
     .data(pie(dataSent))
     .enter().append("g");

   g1.append("path")
   .transition().duration(1000)
     .attr("d", arc)
     .style("fill", function(d,i) {
       return d.data.color;
     });

   svg_sent.append("text")
    .attr("text-anchor", "middle")
    .attr('font-size', '1.5em')
    .attr('class', 'donut-text-g1')
    .attr('y', 8)
    .attr('fill', 'white')
    .text(totalSent);

    // Opened dounut
    var svg_opened = d3.select('#opened-donut-vis').append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g2 = svg_opened.selectAll(".arc")
      .data(pie(dataOpened))
      .enter().append("g");

    g2.append("path")
    .transition().duration(1000)
      .attr("d", arc)
      .style("fill", function(d,i) {
        return d.data.color;
      });

    svg_opened.append("text")
     .attr("text-anchor", "middle")
     .attr('font-size', '1.5em')
     .attr('class', 'donut-text-g2')
     .attr('y', 8)
     .attr('fill', 'white')
     .text(totalOpened);

     // Clicked dounut
     var svg_clicked = d3.select('#clicked-donut-vis').append("svg")
       .attr("width", width)
       .attr("height", height)
       .append("g")
       .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

     var g3 = svg_clicked.selectAll(".arc")
       .data(pie(dataClicked))
       .enter().append("g");

     g3.append("path")
     .transition().duration(1000)
       .attr("d", arc)
       .style("fill", function(d,i) {
         return d.data.color;
       });

     svg_clicked.append("text")
      .attr("text-anchor", "middle")
      .attr('font-size', '1.5em')
      .attr('class', 'donut-text-g3')
      .attr('y', 8)
      .attr('fill', 'white')
      .text(totalClicked);

      function update(selectedInput) {
          dataAll = data.filter(function(d){ return d.office == selectedInput })

          //Data updates
          var dataSent = dataAll.filter(function(d){ return d.type == 'sent' })
          var dataOpened = dataAll.filter(function(d){ return d.type == 'opened' })
          var dataClicked = dataAll.filter(function(d){ return d.type == 'clicked' })

          //Need a less stupid way to do this
          for (var i = 0; i < dataSent.length - 1; i++) {
              var totalSent = dataSent[i].count
          }
          for (var i = 0; i < dataSent.length - 1; i++) {
              var totalOpened = dataOpened[i].count
          }
          for (var i = 0; i < dataSent.length - 1; i++) {
              var totalClicked = dataClicked[i].count
          }

      //Text updates
      d3.select(".donut-text-g1")
          .text(totalSent)
      d3.select(".donut-text-g2")
          .text(totalOpened)
      d3.select(".donut-text-g3")
          .text(totalClicked)
      //Donut updates
      pathOpened = d3.select('#opened-donut-vis')
        .selectAll('path')
        .data(pie(dataOpened))
      pathOpened.attr("d", arc);

      pathClicked = d3.select('#clicked-donut-vis')
        .selectAll('path')
        .data(pie(dataClicked))
      pathClicked.attr("d", arc);



}

d3.select("#selectbox")
 .on("change", function() {
   var selectedInput = d3.select(this).property("value")
     update(selectedInput)

})

})
