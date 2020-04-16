 var parseTime = d3.timeParse("%m/%d/%y");

  //For converting Dates to strings
  var formatTime = d3.timeFormat("%b %e");

  //Function for converting CSV values from strings to Dates and numbers
  var rowConverter = function(d) {
    return {
      Date_announced: parseTime(d.Date_announced),
      In_effect_from: parseTime(d.In_effect_from),
      Expected_leave: parseTime(d.Expected_leave),
      Final_leave: parseTime(d.Final_leave),
      Num_on_day: parseInt(d.Num_on_day),
      School: d.School,
      Effective_until: d.Effective_until,
      Precautions: d.Precautions,
      Diff: d.Diff
      // Amount: parseInt(d.Amount)
    };
  }
// set the dimensions and margins of the graph


// append the svg object to the body of the page

var v1 = "covid_college_closure - vacate.csv";

// Parse the Data
d3.csv("covid_vacate.csv", rowConverter, function(data) {

  var dataset = data;
  dataset.sort(function(b, a) {
  // temp = a.Date_announced;
  // temp_b = b.Date_announced
  temp = a.Final_leave - a.Date_announced;
  temp_b = b.Final_leave - b.Date_announced;
  // temp = Math.max(a.Final_leave, a.In_effect_from);
  // temp_b = Math.max(b.Final_leave, b.In_effect_from);
  return temp_b - temp;
})

  var margin = {top: 0, right: 30, bottom: 30, left: 220},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  var svg = d3.select("#dotplot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var startDate = d3.min(dataset, function(d) { return d.Date_announced; });
  var endDate = d3.max(dataset, function(d) { return d.Final_leave; });
  var x = d3.scaleTime()
    .domain([
                      d3.timeDay.offset(startDate, -1),  //startDate minus one day, for padding
                      d3.timeDay.offset(endDate, 1)   //endDate plus one day, for padding
                    ])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(formatTime));

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.School; }))
    .padding(1);
  svg.append("g")
    .call(d3.axisLeft(y))
    // .append("circle")
    .selectAll("text")
    .data(dataset)
    // .style('font-weight', 'bold')
    // .style('font-variant', 'titling-caps')
    .style('fill',  function(d) {
        console.log(d)
        if(d.Diff > 7){
            return '#133519';
        } else if(d.Diff < 7){
            return '#BD401E';
        } else {
            return '#DFAB3B';
        }
    })
//     .style("fill", "red")
    // .attr("r", function(d) { (d.Bush > 0) ? "1" : "7"; })
    // var noZeroes = data.filter(function(d) { return d.Obama !== 0; });

//Legend
  var y_leg_scale = 0.05
  var x_leg_scale = 0.65
  var c = 0.02;
  svg.append("text")
    .text("Legend")
    .attr("x", x_leg_scale*width)
    .attr("y", (y_leg_scale-c)*height + 4)
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("font-family", "Arial")
  svg.append("rect")
      .attr("x", x_leg_scale*width)
      .attr("y", (y_leg_scale+c)*height)
      .attr("width", "5")
      .attr("height", "5")
      .attr("transform", "translate(0, -2.5)")
      .style("fill", "purple")
      .style("stroke", "purple")
  svg.append("text")
    .text("Move-out period begins")
    .attr("x", (x_leg_scale + 0.03)*width)
    .attr("y", (y_leg_scale +c)*height + 4)
    .attr("font-size", "12px")
    .attr("font-family", "Arial")
  svg.append("rect")
      .attr("x", x_leg_scale*width)
      .attr("y", (y_leg_scale +c*2)*height)
      .attr("width", "3")
      .attr("height", "3")
      .attr("transform", "translate(0, -1.5)")
      .style("fill", "#E1B33D")
      .style("stroke", "#E1B33D")
  svg.append("text")
    .text("Online/cancelled classes begin")
    .attr("x", (x_leg_scale + 0.03)*width)
    .attr("y", (y_leg_scale+c*2)*height + 4)
    .attr("font-size", "12px")
    .attr("font-family", "Arial")
  svg.append("rect")
      .attr("x", x_leg_scale*width)
      .attr("y", (y_leg_scale+c*3)*height)
      // .attr("r", function(d) { (d.Bush > 0) ? "1" : "7"; })
      .attr("width", "5")
      .attr("height", "5")
      .style("fill", "red")
      .attr("transform", "translate(0, -2.5)")
      .style("stroke", "red")
  svg.append("text")
    .text("Residence halls close")
    .attr("x", (x_leg_scale + 0.03)*width)
    .attr("y", (y_leg_scale+c*3)*height + 4)
    .attr("font-size", "12px")
    .attr("font-family", "Arial")
  svg.append("rect")
      .attr("x", x_leg_scale*width)
      .attr("y", (y_leg_scale)*height)
      // .attr("r", function(d) { (d.Bush > 0) ? "1" : "7"; })
      .attr("width", "1")
      .attr("height", "8")
      .attr("transform", "translate(0, -4)")
      .style("fill", "grey")
  svg.append("line")
      .attr("x1", x_leg_scale*width)
      .attr("y1", (y_leg_scale)*height)
      .attr("x2", (x_leg_scale + 0.015)*width)
      .attr("y2", (y_leg_scale)*height)
      // .attr("r", function(d) { (d.Bush > 0) ? "1" : "7"; })
      .attr("stroke", "grey")

      // .style("stroke", "blue")
  svg.append("text")
    .text("Closure is announced")
    .attr("x", (x_leg_scale + 0.03)*width)
    .attr("y", (y_leg_scale)*height + 4)
    .attr("font-size", "12px")
    .attr("font-family", "Arial")
  svg.append("line")
      .attr("x1", x_leg_scale*width)
      .attr("y1", (y_leg_scale+c*4)*height)
      .attr("x2", (x_leg_scale + 0.02)*width)
      .attr("y2", (y_leg_scale +c*4)*height)
      .style("stroke-dasharray", ("5, 3"))
      .attr("stroke", "grey")

      // .style("stroke", "blue")
  svg.append("text")
    .text("Move-out period (if given to students)")
    .attr("x", (x_leg_scale + 0.03)*width)
    .attr("y", (y_leg_scale+c*4)*height + 4)
    .attr("font-size", "12px")
    .attr("font-family", "Arial")

  //Tooltip
  var tooltip = function(d) {
    var temp = d3.timeFormat("%j")(d.Final_leave) - d3.timeFormat("%j")(d.Date_announced);
    // var temp = d3.timeFormat("%e")(d.Final_leave - d.Date_announced)
    return "Students were given "  + temp + " days after the initial announcement to depart campus.";
  }

  var tooltip_move = function(d) {
    var temp = d3.timeFormat("%j")(d.Final_leave) - d3.timeFormat("%j")(d.Expected_leave);
    var temp2 = d3.timeFormat("%j")(d.Expected_leave) - d3.timeFormat("%j")(d.Date_announced);
    return "Students were given a move-out period of "  + temp + " days, which started " + temp2 + " days after the initial announcement.";
  }

  var tooltip_class = function(d) {
    var temp = d3.timeFormat("%j")(d.In_effect_from) - d3.timeFormat("%j")(d.Date_announced);
    return "In-person classes ceased "  + temp + " days after the initial announcement.";
  }


  // svg.selectAll("myline")
  //   .data(data)
  //   .enter()
  //   .append("line")
  //     .attr("x1", function(d) { return x(d.Expected_leave); })
  //     .attr("x2", function(d) { return x(d.In_effect_from); })
  //     .attr("y1", function(d) { return y(d.School); })
  //     .attr("y2", function(d) { return y(d.School); })
  //     .attr("stroke", "grey")
  //     .style("stroke-dasharray", ("5, 3"))
  //     .attr("stroke-width", "0px")
  //     .attr("stroke-width", function(d) { return d.In_effect_from < d.Expected_leave ? 0 : 1; })
  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.Date_announced); })
      .attr("x2", function(d) { return x(d.Final_leave); })
      .attr("y1", function(d) { return y(d.School); })
      .attr("y2", function(d) { return y(d.School); })
      .attr("stroke", "grey")
      // .style("stroke-dasharray", ("5, 3"))   
      .attr("stroke-width", "1px")
      .attr("stroke-width", function(d) { return d.Expected_leave == null ? 1 : 0; })
      .on("mouseover", function(d) {

          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.event.pageX) +  10;
          var yPosition = parseFloat(d3.event.pageY)-10;
          d3.select(this).raise();
          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#school")
            .text(d.School)           
            .attr("font-weight", "bold")
          d3.select("#tooltip")
            .select("#date")
            .text(tooltip(d))

            // .select("#date")
            // .text(d.Trump_Date);
         
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

         })
    .on("mouseout", function() {  
          //Hide the tooltip
          // d3.select(this).lower();
          d3.select("#tooltip").classed("hidden", true);
          
         });


  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.Expected_leave) + 4; })
      .attr("x2", function(d) { return x(d.Final_leave); })
      .attr("y1", function(d) { return y(d.School); })
      .attr("y2", function(d) { return y(d.School); })
      .attr("stroke", "grey")
      .style("stroke-dasharray", ("5, 3"))
      .attr("stroke-width", "0px")
      .attr("stroke-width", function(d) { return d.Expected_leave == null ? 0 : 1; })
      .on("mouseover", function(d) {

          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.event.pageX) +  10;
          var yPosition = parseFloat(d3.event.pageY)-10;
          d3.select(this).raise();
          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#school")
            .text(d.School)           
            .attr("font-weight", "bold")
          d3.select("#tooltip")
            .select("#date")
            .text(tooltip(d))

            // .select("#date")
            // .text(d.Trump_Date);
         
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

         })
    .on("mouseout", function() {  
          //Hide the tooltip
          // d3.select(this).lower();
          d3.select("#tooltip").classed("hidden", true);
          
         });
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.Date_announced); })
      .attr("x2", function(d) { return x(d.Expected_leave); })
      .attr("y1", function(d) { return y(d.School); })
      .attr("y2", function(d) { return y(d.School); })
      .attr("stroke", "grey")
      // .style("stroke-dasharray", ("5, 3"))
      .attr("stroke-width", "0px")
      .attr("stroke-width", function(d) { return d.Expected_leave == null ? 0 : 1; })
      .on("mouseover", function(d) {

          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.event.pageX) +  10;
          var yPosition = parseFloat(d3.event.pageY)-10;
          d3.select(this).raise();
          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#school")
            .text(d.School)           
            .attr("font-weight", "bold")
          d3.select("#tooltip")
            .select("#date")
            .text(tooltip(d))

            // .select("#date")
            // .text(d.Trump_Date);
         
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

         })
    .on("mouseout", function() {  
          //Hide the tooltip
          // d3.select(this).lower();
          d3.select("#tooltip").classed("hidden", true);
          
         });
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.Final_leave); })
      .attr("x2", function(d) { return x(d.In_effect_from); })
      .attr("y1", function(d) { return y(d.School); })
      .attr("y2", function(d) { return y(d.School); })
      .attr("stroke", "grey")
      // .style("stroke-dasharray", ("5, 3"))
      .attr("stroke-width", "0px")
      .attr("stroke-width", function(d) { return d.Final_leave > d.In_effect_from ? 0 : 1; })
      .on("mouseover", function(d) {

          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.event.pageX) +  10;
          var yPosition = parseFloat(d3.event.pageY)-10;
          d3.select(this).raise();
          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#school")
            .text(d.School)           
            .attr("font-weight", "bold")
          d3.select("#tooltip")
            .select("#date")
            .text(tooltip(d))

            // .select("#date")
            // .text(d.Trump_Date);
         
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

         })
    .on("mouseout", function() {  
          //Hide the tooltip
          // d3.select(this).lower();
          d3.select("#tooltip").classed("hidden", true);
          
         });


  // Plot Data
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Date_announced); })
      .attr("y", function(d) { return y(d.School); })
      .attr("transform", "translate(0,-4)" )
      .attr("height", "8")
      .attr("width", "1")
      // .attr("r", function(d) { return d.Clinton == 0 ? 0 : 5; })
      .style("fill", "grey")

    


  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Expected_leave); })
      .attr("y", function(d) { return y(d.School); })
      .attr("width", "5")
      .attr("height", "5")
      .attr("transform", "translate(-2,-2.5)")
      // .attr("r", function(d) { return d.Clinton == 0 ? 0 : 5; })
      .style("fill", "purple")
      .style("fill-opacity", 0.75)
      .style("stroke", "purple")
  .on("mouseover", function(d) {

          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.event.pageX) +  10;
          var yPosition = parseFloat(d3.event.pageY)-10;
          d3.select(this).raise();
          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#school")
            .text(d.School)           
            .attr("font-weight", "bold")
          d3.select("#tooltip")
            .select("#date")
            .text(tooltip_move(d))

            // .select("#date")
            // .text(d.Trump_Date);
         
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

         })
    .on("mouseout", function() {  
          //Hide the tooltip
          // d3.select(this).lower();
          d3.select("#tooltip").classed("hidden", true);
          
         });

  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Final_leave); })
      .attr("y", function(d) { return y(d.School); })
      .attr("height", "5")
      .attr("width", "5")
      .attr("transform", "translate(0,-2.5)")
      // .attr("r", function(d) { return d.Clinton == 0 ? 0 : 5; })
      .style("fill", "red")
      .style("fill-opacity", 0.75)
      .style("stroke", "red")
    .on("mouseover", function(d) {

          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.event.pageX) +  10;
          var yPosition = parseFloat(d3.event.pageY)-10;
          d3.select(this).raise();
          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#school")
            .text(d.School)           
            .attr("font-weight", "bold")
          d3.select("#tooltip")
            .select("#date")
            .text(tooltip(d))

            // .select("#date")
            // .text(d.Trump_Date);
         
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

         })
    .on("mouseout", function() {  
          //Hide the tooltip
          // d3.select(this).lower();
          d3.select("#tooltip").classed("hidden", true);
          
         });


  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.In_effect_from); })
      .attr("y", function(d) { return y(d.School); })
      .attr("width", "3")
      .attr("height", "3")
      .attr("transform", "translate(0,-1.5)")
      // .attr("r", function(d) { return d.Clinton == 0 ? 0 : 5; })
      .style("fill", "#E1B33D")
      .style("fill-opacity", 0.75)
      .style("stroke", "#E1B33D")
  .on("mouseover", function(d) {

          //Get this bar's x/y values, then augment for the tooltip
          var xPosition = parseFloat(d3.event.pageX) +  10;
          var yPosition = parseFloat(d3.event.pageY)-10;
          d3.select(this).raise();
          //Update the tooltip position and value
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")           
            .select("#school")
            .text(d.School)           
            .attr("font-weight", "bold")
          d3.select("#tooltip")
            .select("#date")
            .text(tooltip_class(d))

            // .select("#date")
            // .text(d.Trump_Date);
         
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

         })
    .on("mouseout", function() {  
          //Hide the tooltip
          // d3.select(this).lower();
          d3.select("#tooltip").classed("hidden", true);
          
         });


  

  var div = d3.select("#dotplot").append("div")
      .attr("class", "tooltip")
      .style("display", "none");

  function mouseover() {
    div.style("display", "inline");
  }

  function mousemove() {
    div
        .text(tooltip)
        .style("left", (d3.event.pageX - 34) + "px")
        .style("top", (d3.event.pageY - 12) + "px");
  }

  function mouseout() {
    div.style("display", "none");
  }
})

