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

// Function used to update the x-scale variable when the user clicks on the axis label
function xScale(riskData, chosenXAxis) {

  // Use scaleLinear to create the scale since values are numerical
  // Set the min and max values so we can transition the scale later
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, values => values[chosenXAxis]) /* some number to further pad*/, // CAN THIS BE CHANGED TO d3.extent? Check with console.log
    d3.max(riskData, values => values[chosenXAxis]) /* some number to further pad*/
    ])
    .range([0, width]);

  // Return the scale
  return xLinearScale;
}

// Function used to update the y-scale variable when the user clicks on the axis label
function yScale(riskData, chosenYAxis) {

  // Use scaleLinear to create the scale since values are numerical
  // Set the min and max values so we can transition the scale later
  // height first because the chart is created top down (0,0 is at the top left)
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, values => values[chosenYAxis]) /* some number to further pad*/, 
    d3.max(riskData, values => values[chosenYAxis]) /* some number to further pad*/
  ])
    .range([height, 0]);

  // Return the scale
  return yLinearScale;
}

// Function used to update the x-axis variable when the user clicks the axis label
function renderXAxis(newLinearXScale, xAxis) {

  // Call the axisBottom function to update the axis values
  var bottomAxis = d3.axisBottom(newLinearXScale);

  // Transisition to the newly chosen x-axis
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  // Return the new x-axis
  return xAxis;
}

// Function used to update the y-axis variable when the user clicks the axis label
function renderYAxis(newLinearYScale, yAxis) {

  // Call the axisLeft function to update the axis values
  var leftAxis = d3.axisLeft(newLinearYScale);

  // Transition to the newly chosen y-axis
  yAxis.transition()
  .duration(1000)
  .call(leftAxis);

  // Return the new y-axis
  return yAxis;
}

// Function used to update the circle group when the user changes the x-axis
function renderXCircles(circlesXGroup, newLinearXScale, chosenXAxis) {
  
  // Transition the circle group to the newly chosen x-axis
  circlesXGroup.transition()
    .duration(1000)
    .attr("cx", values => newLinearXScale(values[chosenXAxis]));

  return circlesXGroup;
}

// Function used to update the circle group when the user changes the y-axis
function renderYCircles(circlesYGroup, newLinearYScale, chosenYAxis) {
  
  // Transition the circle group to the newly chosen y-axis
  circlesYGroup.transition()
    .duration(1000)
    .attr("cy", values => newLinearYScale(values[chosenYAxis]));

  return circlesYGroup;
}

// Function used to update the tooltip for different sets of circle groups