// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 90, left: 60},
    width = 1400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/madhusivaraj/nv/main/data/bottom6.csv", 

  function(data) {

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d){return(d.state)}).keys()

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d3.timeParse("%m/%d/%y")(d.date); }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    svg.append("text")
      .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 23) + ")")
    .style("text-anchor", "middle")
    .text("Timeframe (spanning March 2020 to June 2021)");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.cases_avg_per_100k; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));        
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average Cases per 100,000 Individuals");   
      
    // Initialize line with first group of the list
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.state==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d3.timeParse("%m/%d/%y")(d.date)) })
          .y(function(d) { return y(+d.cases_avg_per_100k) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 3)
        .style("fill", "none")

    function renderThirdChartAnnotations(d, margin) {
        d3.select(".annotation-group").remove();
        const annotations = [
            {
                note: {
                    label: "The average number of cases per 100K on 6/16 was " + d.cases_avg_per_100k + ", with total cases at " + d.cases +". "
                    + '**Not depicted on graph: The average number of deaths per 100K on this day was ' + d.deaths_avg_per_100k + ", with total cases at " + d.deaths +".",
                    bgPadding: {"top": 15, "left": 10, "right": 10, "bottom": 10},
                    title: d.state + " - " + d.date,
                    orientation: "topBottom",
                    align: "top",
                    wrap: 300
                },
                color: "#696969",
                type: d3.annotationCalloutCircle,
                subject: {radius: 20},
                x: 1300,
                y: 460,
                dy: -227,
                dx: -4
            },
        ];
        const makeAnnotations = d3.annotation().annotations(annotations);
        const chart = d3.select("svg")
        chart.transition()
            .duration(1000);
        chart.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "annotation-group")
            .call(makeAnnotations)
    }
    const first_data = data.filter(function (d) {
      return d.state === allGroup[0]
  });
  renderThirdChartAnnotations(first_data[first_data.length-1], margin);

    // A function that update the chart
    function update(selectedGroup) {
      // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.state==selectedGroup})
      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d3.timeParse("%m/%d/%y")(d.date)) })
            .y(function(d) { return y(+d.cases_avg_per_100k) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
      renderThirdChartAnnotations(dataFilter[dataFilter.length-1], margin)
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})