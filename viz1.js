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
    var stateName = d.State;
    var EstimatedHesitant = formatDecimal(d.EstimatedHesitant);
    var CVACLevelOfConcern = d.CVACLevelOfConcern;
    tooltip
        .html("State: " + stateName
        + "<br>" + "Vaccine-Hesitant Population Percentage: " + EstimatedHesitant + "%"
        + "<br>" + "CVAC Level Of Concern: " + CVACLevelOfConcern
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
d3.csv("https://raw.githubusercontent.com/madhusivaraj/nv/main/data/VaccinationData.csv", function(data) {

    data.sort(function(b, a) {
        return a.EstimatedHesitant - b.EstimatedHesitant;
      });

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.State; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 35])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.State); })
    .attr("width", x.bandwidth())
    .attr("fill", "#d93927")
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
      .text("Percentage of Population Hesitant about Vaccines");   

const annotations = [{
      note: {
        label: "The states to the left have a high level of concern in regards to vaccine hesitancy. These states are primarily in the South, Midwest, and Rocky Mountain regions, which are more conservative and rural.",
        title: "Top 10 Vaccine-Hesitant States",
        wrap: 300,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: "#606060",
     x: 364,
     y: 330,
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
        label: "The states to the right have low or moderate levels of concern in regards to vaccine hesitancy. All of the states, besides Hawaii, are located in the Northeast. It is important to note that the COVID-19 vaccines that have received EUA in the US were developed by Pfizer in New York, Moderna in Massachusetts, and Johnson & Johnson in New Jersey.",
        title: "Top 10 Vaccine-Receptive States",
        wrap: 300,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: "#606060",
     x: 1206,
     y: 490,
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
  .attr("y", function(d) { return y(d.EstimatedHesitant); })
  .attr("height", function(d) { return height - y(d.EstimatedHesitant); })
  .delay(function(d,i){console.log(i) ; return(i*100)})

})