		var w = 600;
		var h = 600;
		var padding = 40;
		
		var dataset, xScale, yScale, xAxis, yAxis;  //Empty, for now

		//For converting strings to Dates
		var parseTime = d3.timeParse("%m/%d/%y");

		//For converting Dates to strings
		var formatTime = d3.timeFormat("%b %e");

		//Function for converting CSV values from strings to Dates and numbers
		var rowConverter = function(d) {
			return {
				Date_announced: parseTime(d.Date_announced),
				In_effect_from: parseTime(d.In_effect_from),
				Num_on_day: parseInt(d.Num_on_day),
				School: d.School,
				Effective_until: d.Effective_until,
				Precautions: d.Precautions
				// Amount: parseInt(d.Amount)
			};
		}

		var v1 = "covid_college_closure_final.csv";

		//Load in the data
		d3.csv("covid_closure_combined.csv", rowConverter, function(data) {

			//Copy data into global dataset
			dataset = data;

			//Discover start and end dates in dataset
			var startDate = d3.min(dataset, function(d) { return d.Date_announced; });
			var endDate = d3.max(dataset, function(d) { return d.Date_announced; });
			var maxnum = d3.max(dataset, function(d) { return d.Num_on_day; });
			console.log(dataset)
			// collegesByDay = Array.from(d3.group(data, d => d.Date_announced), ([key, value]) => ({key, value}));
			// console.log(data)
			// console.log(collegesByDay)
			num_cols = 5

			//Create scale functions
			xScale = d3.scaleTime()
						   .domain([
								d3.timeDay.offset(startDate, -1),  //startDate minus one day, for padding
								d3.timeDay.offset(endDate, 1)	  //endDate plus one day, for padding
							])
						   .range([padding, w - padding]);
			console.log(xScale.bandwidth)			   
			yScale = d3.scaleLinear()
						   .domain([
								0,  //Because I want a zero baseline
								d3.max(dataset, function(d) { return d.Num_on_day/num_cols; })
							])
						   .range([h - padding, padding]);
			console.log(yScale)
			console.log(xScale)
			//Define X axis
			xAxis = d3.axisBottom()
							  .scale(xScale)
							  .ticks(13)
							  .tickSize(0)
							  .tickFormat(formatTime);


			//Define Y axis
			yAxis = d3.axisLeft()
							  .scale(yScale)
							  // .ticks(10);

			//Create SVG element
			var svg = d3.select("#timeline")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			var tooltip = function(d) {
			  return "Closure announced on " + formatTime(d.Date_announced) + "; in effect from " +  formatTime(d.In_effect_from) +".";
			}
			temp = xScale(endDate)-xScale(startDate);
			scale_factor = w/xScale.domain;
			console.log(xScale(endDate)-xScale(startDate))
			simple = d3.timeFormat("%e")
			console.log(simple(endDate)- simple(startDate))
			var num_days = simple(endDate)- simple(startDate)
			var w_axis = xScale(endDate)-xScale(startDate)
			scale_factor_2 = (w_axis - padding)/num_days/num_cols
			console.log(scale_factor_2)
			//Legend
			var y_leg_scale = 0.05
			var x_leg_scale = 0.65
			var c = 0.025;
			svg.append("text")
			  .text("Legend")
			  .attr("x", x_leg_scale*w)
			  .attr("y", (y_leg_scale-c)*h + 4)
			  .attr("font-size", "14px")
			  .attr("font-weight", "bold")
			  .attr("font-family", "Arial")
			svg.append("rect")
			    .attr("x", x_leg_scale*w)
			    .attr("y", (y_leg_scale)*h)
			    .attr("width", "8")
			    .attr("height", "8")
			    .attr("transform", "translate(0, -2.5)")
			    .style("fill", "#EBAA57")
			svg.append("text")
			  .text("Students required to vacate dorms")
			  .attr("x", (x_leg_scale + 0.03)*w)
			  .attr("y", (y_leg_scale)*h+ 4)
			  .attr("font-size", "12px")
			  .attr("font-family", "Arial")
			//Plot data
			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d) {
			   		return xScale(d.Date_announced);
			   })
			   //translate and center squares around tick
			   .attr("transform", function(d) {
			   		return "translate(" + scale_factor_2*((d.Num_on_day - 1) % num_cols - num_cols/2) + ",0)";
			   })
			   .attr("y", function(d, i) {
			   		return yScale(Math.floor((d.Num_on_day - 1)/num_cols) + 1);
			   })
			   .attr("width", 5.3)
			   .attr("height", 5.3)
			   .style("fill", function(d) {
			   		if(d.Precautions == "Vacate dorms") {return "#EBAA57";}
			   		// else if (d.Precautions == "Extended") {return "#F9EF73"}
			   		else {return "#79ACB2";}
			   })
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
   			var c = 15;
   			svg.append("line")
   			    .attr("x1", xScale(parseTime('3/11/20')) - 20)
   			    .attr("y1", yScale(80))
   			    .attr("x2", xScale(parseTime('3/11/20')) - 20)
   			    .attr("y2", yScale(40))
   			    .attr("stroke", "grey")
   			svg.append("line")
   			    .attr("x1", xScale(parseTime('3/11/20')) - 20)
   			    .attr("y1", yScale(60)+5)
   			    .attr("x2", xScale(parseTime('3/11/20')) - 80)
   			    .attr("y2", yScale(60)+5)
   			    .attr("stroke", "grey")
   			svg.append("text")
   				.text("WHO declares that the")
			 	.attr("x", xScale(parseTime('3/11/20')) - 180)
			 	.attr("y", yScale(60)-c)
			 	.attr("font-size", "14px")
			 	.attr("font-weight", "bold")
			 	.attr("fill", "grey")
			 	.attr("font-family", "Arial")
			 svg.append("text")
   				.text("COVID-19 outbreak is a")
			 	.attr("x", xScale(parseTime('3/11/20')) - 180)
			 	.attr("y", yScale(60))
			 	.attr("font-size", "14px")
			 	.attr("font-weight", "bold")
			 	.attr("fill", "grey")
			 	.attr("font-family", "Arial")
			 svg.append("text")
   				.text("pandemic.")
			 	.attr("x", xScale(parseTime('3/11/20')) - 180)
			 	.attr("y", yScale(60)+c)
			 	.attr("font-size", "14px")
			 	.attr("font-weight", "bold")
			 	.attr("fill", "grey")
			 	.attr("font-family", "Arial")



   			//Create X axis
   			svg.append("g")
   				.attr("class", "axis")
   				.attr("transform", "translate(2.5," + (h - padding) + ")")
   				.call(xAxis)
   				.selectAll("text")
   				.attr("transform", "rotate(-45 5 30)");
   			
   			//Create Y axis
   			// svg.append("g")
   			// 	.attr("class", "axis")
   			// 	.attr("transform", "translate(" + padding + ",0)")
   			// 	.call(yAxis);

		});