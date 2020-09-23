// Set the width and height of the scalable vector graphic
var svgWidth = 1000;
var svgHeight = 750;

// Create a margin around the SVG
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

// Set the width and height for the chart (space where chart will be mapped)
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper and append the SVG group that will hold the chart
var svg = d3
  .select("scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.top}, ${margin.left})`);

// Initial chosen parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used to update x-scale variable when the user clicks on the axis label
function xScale(riskData, chosenXAxis) {

  // Use scaleLinear to create the scale since values are numerical
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, values => values[chosenXAxis]) /* some number to further pad*/, // CAN THIS BE CHANGED TO d3.extent? Check with console.log
    d3.max(riskData, values => values[chosenXAxis]) /* some number to further pad*/
    ])
    .range([0, width]);

  // Return the scale
  return xLinearScale
}

function yScale(riskData, chosenYAxis) {

  // Use scaleLinear to create the scale since values are numerical
}