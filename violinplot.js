
  var parseTime = d3.timeParse("%m/%d/%y");

  //For converting Dates to strings
  var formatTime = d3.timeFormat("%b %e");

  var rowConverter = function(d) {
        return {
          Date_announced: parseTime(d.Date_announced),
          In_effect_from: parseTime(d.In_effect_from),
          // Num_on_day: parseInt(d.Num_on_day),
          School: d.School,
          Effective_until: d.Effective_until,
          Precautions: d.Precautions,
          Endowment_18: parseInt(d.Endowment_18),
          Diff: parseInt(d.Diff)
          // Amount: parseInt(d.Amount)
        };
      }
// set the dimensions and margins of the graph


// append the svg object to the body of the page

var v1 = "covid_college_closure - vacate.csv";

// Parse the Data
d3.csv("covid_ipeds.csv", rowConverter, function(data) {

  var dataset = data;
  dataset.sort(function(b, a) {
  // temp = a.Date_announced;
  // temp_b = b.Date_announced
  temp = a.Endowment_18;
  temp_b = b.Endowment_18;
  // temp = Math.max(a.Final_leave, a.In_effect_from);
  // temp_b = Math.max(b.Final_leave, b.In_effect_from);
  return temp_b - temp;
})

var margin = {top: 50, right: 30, bottom: 50, left: 90},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#violinplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// create dummy data
// var data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9]
var endowments = [],
    schools = [];

data.map(function(d) {
    endowments.push(d.Endowment_18);
    // prevalence.push(d.prevalence);
    // disability.push(d.disability);
})
// console.log(endowments)
function bouncer(arr) {
  return arr.filter(Boolean);
}
endowments = bouncer(endowments);
// Compute summary statistics used for the box:
var data_sorted = endowments.sort(d3.ascending)
var q1 = d3.quantile(data_sorted, .25)
var median = d3.quantile(data_sorted, .5)
var q3 = d3.quantile(data_sorted, .75)
var interQuantileRange = q3 - q1
var min = q1 - 1.5 * interQuantileRange
var max = q1 + 1.5 * interQuantileRange


console.log(q1)
console.log(median)
console.log(q3)
console.log(min)
console.log(max)
// console.log(data_sorted)

// Show the Y scale
var y = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) {return d.Endowment_18; })])
  // .domain([0, 10000000])
  .range([height, 0]);
svg.call(d3.axisLeft(y))


// a few features for the box
var center = 200
var boxwidth = 350

// Show the main vertical line
// svg
// .append("line")
//   .attr("x1", center)
//   .attr("x2", center)
//   .attr("y1", y(min) )
//   .attr("y2", y(max) )
//   .attr("stroke", "black")

// Show the box
// svg
// .append("rect")
//   .attr("x", center - boxwidth/2)
//   .attr("y", y(q3) )
//   .attr("height", (y(q1)-y(q3)) )
//   .attr("width", boxwidth )
//   .attr("stroke", "black")
//   .style("fill", "#DDE8F8")

// // show median, min and max horizontal lines
// svg
// .selectAll("toto")
// .data([min, median, max])
// .enter()
// .append("line")
//   .attr("x1", center-boxwidth/2)
//   .attr("x2", center+boxwidth/2)
//   .attr("y1", function(d){ return(y(d))} )
//   .attr("y2", function(d){ return(y(d))} )
//   .attr("stroke", "black")

// var jitterWidth = boxwidth - 140
// svg
//   .selectAll("indPoints")
//   .data(data)
//   .enter()
//   .append("circle")
//     .attr("cx", center)
//     .attr("cx", function(d){
//       if (d.Endowment_18 > max) {return center;}
//       else {return(center - jitterWidth/2 + Math.random()*jitterWidth )}})
//     .attr("cy", function(d){return(y(d.Endowment_18))})
//     .attr("r", 4)
    // .attr("r", function(d) {
    //           if(d.Endowment_18 > 0) {return "4";}
    //           // else if (d.Precautions == "Extended") {return "#F9EF73"}
    //           else {return "0";}
    //        })

//     .style("fill", function(d) {
//               if(d.Precautions == "Vacate dorms") {return "#EBAA57";}
//               // else if (d.Precautions == "Extended") {return "#F9EF73"}
//               else {return "#79ACB2";}
//            })
//     .attr("stroke", "black")
    // .attr("fill-opacity", 0.85)
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)


    // svg.selectAll("text")
    //      .data(dataset)
    //      .enter()
    //      .append("text")
    //      .text(function(d) {
    //       if(d.Endowment_18 > max) {
    //          return d.School;
    //       } else {return ''}
    //      })
    //      .attr("x", width)
    //      .attr("y", function(d) {
    //          return y(d.Endowment_18);
    //      })
    //      .attr("font-family", "sans-serif")
    //      .attr("font-size", "11px")
    //      .style('fill',  function(d) {
    //          if(d.Diff > 7){
    //              return '#133519';
    //          } else if(d.Diff < 7){
    //              return '#BD401E';
    //          } else {
    //              return '#DFAB3B';
    //          }
    //      })

var tooltip = function(d) {
  if (d.Precautions == "Vacate dorms") {return d.School + " has an endowment of roughly $" + d3.format(",")(d.Endowment_18) + ", and required students to vacate dorms.";}
  else {return d.School + " has an endowment of roughly $" + d3.format(",")(d.Endowment_18) + ", and did not require students to vacate dorms."}
      }

var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["College"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

  // Compute the binning for each group of the dataset
  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return "College";})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g.Endowment_18;})    // Keep the variable called Sepal_Length
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)

  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = 0
  for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longuest = d3.max(lengths)
    if (longuest > maxNum) { maxNum = longuest }
  }
console.log(sumstat)
  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

  // Color scale for dots
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0, d3.max(dataset, function(d) {return d.Endowment_18; })])

  // Add the shape to this svg!
  svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","grey")
        .attr("d", d3.area()
            .x0( xNum(0) )
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )

  // Add individual points with jitter
  var jitterWidth = 450
  var viocenter = center + 70
  var viocenter = width/2
  console.log(max)
  svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d){return(x("College") + x.bandwidth()/2 - Math.random()*jitterWidth )})
      .attr("cx", function(d){
      if (d.Endowment_18 > 10000000) {return viocenter;}
      // else if (d.Precautions == "Vacate dorms") {return viocenter - jitterWidth/8 + Math.random()*jitterWidth/4;}
      else if (d.Endowment_18 > 5000000) {return viocenter - jitterWidth/16 + Math.random()*jitterWidth/8}
      else if (d.Precautions != "Vacate dorms") {return(viocenter - jitterWidth/2 + Math.random()*jitterWidth )}
      else {return viocenter - jitterWidth/8 + Math.random()*jitterWidth/4}
    })
      .attr("cy", function(d){return(y(d.Endowment_18))})
      .attr("r", 4)
      .attr("r", function(d) {
              if(d.Endowment_18 > 0) {return "4";}
              else {return "0";}
           })
      .style("fill", function(d){ return(myColor(d.Endowment_18))})
      .style("fill", function(d) {
              if(d.Precautions == "Vacate dorms") {return "#EBAA57";}
              // else if (d.Precautions == "Extended") {return "#F9EF73"}
              else {return "#79ACB2";}
           })

      .attr("stroke", "white")
      .on("mouseover", function(d) {
               d3.select(this).raise();
               //Get this bar's x/y values, then augment for the tooltip
               // var xPosition = parseFloat(d3.select(this).attr("x")) + 15;
               
               // var xPosition = parseFloat(d3.mouse(this)[0] + 570)
               // var transform = d3.select(this).attr("transform")
               // var yPosition = parseFloat(d3.select(this).attr("y")) + 375;
               var xPosition = parseFloat(d3.event.pageX) +  10;
               var yPosition = parseFloat(d3.event.pageY)-10;
               console.log(d3.select(this).attr("x"))
               console.log(d3.mouse(this))
               console.log(xPosition)
               //Update the tooltip position and value
               d3.select("#tooltip")
                 .style("left", xPosition + "px")
                 .style("top", yPosition + "px") 
                 // .style("translate", transform)          
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
               d3.select(this).raise();
               d3.select("#tooltip").classed("hidden", true);
               
              });
})

// 2 functions needed for kernel density estimate
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

//Create labels
// d3.csv("vacate_ipeds.csv", rowConverter, function(data) {
//       dataset = data;
//       var y = d3.scaleLinear()
//         .domain([0, d3.max(dataset, function(d) {return d.Endowment_18; })])
//         // .domain([0, 10000000])
//         .range([height, 0]);
//       console.log(dataset)
//       svg.selectAll("text")
//          .data(dataset)
//          .enter()
//          .append("text")
//          .text(function(d) {
//              return d.School;
//          })
//          .attr("x", width)
//          .attr("y", function(d) {
//              return y(d.Endowment_18);
//          })
//          .attr("font-family", "sans-serif")
//          .attr("font-size", "11px")
//          .style('fill',  function(d) {
//              console.log(d)
//              if(d.Diff > 7){
//                  return '#133519';
//              } else if(d.Diff < 7){
//                  return '#BD401E';
//              } else {
//                  return '#DFAB3B';
//              }
//          });
// });

