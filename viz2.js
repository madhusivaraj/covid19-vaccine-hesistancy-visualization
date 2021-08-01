// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 90, left: 60},
    width = 1600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#f8f8ff")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "auto")
    .style("position", "absolute")
    .style("font-size", "13px")

 var mouseover = function(d) {
    var formatDecimal = d3.format(",.3f");
    var stateName = d.state;
    var percentageVaccinated = formatDecimal(d.PercentageVaccinated);
    var rank = d.Rank;
    tooltip
        .html("State: " + stateName
        + "<br>" + "Vaccination Rank: " + rank
        + "<br>" + "Percentage Vaccinated: " + percentageVaccinated + "%"
        )
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/madhusivaraj/nv/main/data/us-states-overall.csv", function(data) {

    data.sort(function(b, a) {
        return a.PercentageVaccinated - b.PercentageVaccinated;
      });

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.state; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 100])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.state); })
    .attr("width", x.bandwidth())
    .attr("fill", "#FFC875")
    // no bar at the beginning thus:
    .attr("height", function(d) { return height - y(0); }) // always equal to 0
    .attr("y", function(d) { return y(0); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 80) + ")")
    .style("text-anchor", "middle")
    .text("States");
  
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percentage of Population Vaccinated");   

const annotations = [{
      note: {
        label: "All states to the left are located in the Northeast region, where the primary COVID-19 vaccines in the US were developed. Among these 10, we can identify 6 states (CT, MA, NJ, NY, RI, VT) that were also among the top 10 vaccine-receptive states in Scene 1.",
        title: "Top 10 States with Highest Vaccinated Populations (>51%)",
        wrap: 280,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: "#606060",
     x: 305,
     y: 370,
     dy: -180,
     dx: -1,
     subject: { radius: 150 },
    //  connector: { end: "arrow" },
    //  subject: {
    //   radius: 50,
    //   radiusPadding: 5
    // },
    // type: d3.annotationCalloutCircle
    },
    {
      note: {
        label: "The states to the right, besides Hawaii, are located in the South and Mountain regions. When compared to the top 10 vaccine-hesitant states identified in Scene 1, six common states are Alabama, Arkansas, Idaho, Louisiana, Mississippi, and Wyoming.",
        title: "Top 10 States with Lowest Vaccinated Populations (<36%)",
        wrap: 270,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: "#606060",
     x: 1206,
     y: 470,
     dy: -180,
     dx: 0,
    }]

  const makeAnnotations = d3.annotation()
  .annotations(annotations)
svg.append("g")
  .call(makeAnnotations)
    

// Animation
svg.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", function(d) { return y(d.PercentageVaccinated); })
  .attr("height", function(d) { return height - y(d.PercentageVaccinated); })
  .delay(function(d,i){console.log(i) ; return(i*100)})

})