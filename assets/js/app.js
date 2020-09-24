// Set the width and height of the scalable vector graphic
var svgWidth = 1000;
var svgHeight = 750;

// Create a margin around the SVG
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 160
};

// Set the width and height for the chart (space where chart will be mapped)
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper and append the SVG group that will hold the chart
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
// Only create tooltip on the circlesXGroup, would be redundent to create it on the circlesYGroup as well
function updateToolTip(chosenXAxis, chosenYAxis, circlesXGroup) {

  // Create labels to hold the text to output based on selections
  var labelX;
  var labelY;

  // Check to see which selections have been made by the user and adjust the labels
  if (chosenXAxis === "poverty") {
    if (chosenYAxis === "healthcare") {
      labelX = "Poverty:";
      labelY = "Healthcare";
    }
    else if (chosenYAxis === "smokes") {
      labelX = "Poverty:";
      labelY = "Smokes:";
    }
    else if (chosenYAxis === "obesity") {
      labelX = "Poverty:";
      labelY = "Obesity:";
    }
  }
  if (chosenXAxis === "age") {
    if (chosenYAxis === "healthcare") {
      labelX = "Age:";
      labelY = "Healthcare";
    }
    else if (chosenYAxis === "smokes") {
      labelX = "Age:";
      labelY = "Smokes:";
    }
    else if (chosenYAxis === "obesity") {
      labelX = "Age:";
      labelY = "Obesity:";
    }
  }
  if (chosenXAxis === "income") {
    if (chosenYAxis === "healthcare") {
      labelX = "Income:";
      labelY = "Healthcare";
    }
    else if (chosenYAxis === "smokes") {
      labelX = "Income:";
      labelY = "Smokes:";
    }
    else if (chosenYAxis === "obesity") {
      labelX = "Income:";
      labelY = "Obesity:";
    }
  }

  // Create the toolTip with the relevant information
  var toolTip = d3.tip()
    .attr("class", ".d3-tip")
    .offset([80, -60])
    .html(function (values) {
      return (`${d.state}<hr>${labelX} ${values[chosenXAxis]}<br>${labelY} ${values[chosenYAxis]}`)
    });

  // Call the toolTip
  circlesXGroup.call(toolTip);

  // When user hovers over circleGroup object, display the data
  circlesXGroup.on("mouseover", function (data) {
    toolTip.show(data);
    // TODO : Create outline around the circle
  })
    // When user is no longer over the circleGroup object, hide the data
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesXGroup;
}

// Retrieve the data from the CSV file and create the chart
d3.csv("../../assets/data/data.csv").then(function (riskData, err) {

  // Throw an error if there is a problem loading the data
  if (err) throw err;

  // Parse the data, convert to numeric values using "+"
  riskData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // Create X and Y scales with functions defined above
  var xLinearScale = xScale(riskData, chosenXAxis);
  var yLinearScale = yScale(riskData, chosenYAxis);

  // Create initial axis functions
  var axisBottom = d3.axisBottom(xLinearScale);
  var axisLeft = d3.axisLeft(yLinearScale);

  // Append the x-axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(axisBottom);

  // Apped the y-axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(axisLeft);

  // Append the initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", val => xLinearScale(val[chosenXAxis]))
    .attr("cy", val => yLinearScale(val[chosenYAxis]))
    .attr("r", 20)
    // .attr("fill", "blue")
    // .attr("opacity", 0.5);

  // Create group for x-axis labels and append the 3 labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create the group for y-axis labels and append the 3 labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 20)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var obeseLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  // Update the tooltip data
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // X-axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function () {

      var value = d3.select(this).attr("value");

      if (value !== chosenXAxis) {

        // Replace chosen with current selection
        chosenXAxis = value;

        // Update X scale with new data
        xLinearScale = xScale(riskData, chosenXAxis);

        // Update the x-axis transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // Update the circles with new X values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  // Y-axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function () {

      var value = d3.select(this).attr("value");

      if (value !== chosenYAxis) {

        // Replace chosen with current selection
        chosenYAxis = value;

        // Update X scale with new data
        yLinearScale = yScale(riskData, chosenYAxis);

        // Update the x-axis transition
        yAxis = renderYAxis(yLinearScale, yAxis);

        // Update the circles with new X values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "age") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "income") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function (error) {
  console.log(error);
});
