// Set the width and height of the scalable vector graphic
var svgWidth = 1200;
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
    .domain([d3.min(riskData, values => values[chosenXAxis]) * 0.95,
    d3.max(riskData, values => values[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;
}

// Function used to update the y-scale variable when the user clicks on the axis label
function yScale(riskData, chosenYAxis) {

  // Use scaleLinear to create the scale since values are numerical
  // Set the min and max values so we can transition the scale later
  // height first because the chart is created top down (0,0 is at the top left)
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, values => values[chosenYAxis]) * 0.8,
    d3.max(riskData, values => values[chosenYAxis])
    ])
    .range([height, 0]);

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

  return yAxis;
}

// Function used to update the circle group when the user changes the x-axis
function renderXCircles(circlesXGroup, newLinearXScale, chosenXAxis, circleText) {

  // Transition the circle group to the newly chosen x-axis
  circlesXGroup.transition()
    .duration(1000)
    .attr("cx", values => newLinearXScale(values[chosenXAxis]));

  circleText.transition()
    .duration(1000)
    .attr("x", values => newLinearXScale(values[chosenXAxis]));

  return circlesXGroup;
}

// Function used to update the circle group when the user changes the y-axis
function renderYCircles(circlesYGroup, newLinearYScale, chosenYAxis, circleText) {

  // Transition the circle group to the newly chosen y-axis
  circlesYGroup.transition()
    .duration(1000)
    .attr("cy", values => newLinearYScale(values[chosenYAxis]));

  circleText.transition()
    .duration(1000)
    .attr("y", values => newLinearYScale(values[chosenYAxis]));

  return circlesYGroup;
}

// Function used to update the tooltip for different sets of circle groups
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // Create labels to hold the text to output based on selections
  var labelX;
  var labelY;

  // Check to see which selections have been made by the user and adjust the labels
  if (chosenXAxis === "poverty") {
    if (chosenYAxis === "healthcare") {
      labelX = "Poverty:"
      labelY = "Healthcare"
    }
    else if (chosenYAxis === "smokes") {
      labelX = "Poverty:"
      labelY = "Smokes:"
    }
    else if (chosenYAxis === "obesity") {
      labelX = "Poverty:"
      labelY = "Obesity:"
    }
  }
  if (chosenXAxis === "age") {
    if (chosenYAxis === "healthcare") {
      labelX = "Age:"
      labelY = "Healthcare"
    }
    else if (chosenYAxis === "smokes") {
      labelX = "Age:"
      labelY = "Smokes:"
    }
    else if (chosenYAxis === "obesity") {
      labelX = "Age:"
      labelY = "Obesity:"
    }
  }
  if (chosenXAxis === "income") {
    if (chosenYAxis === "healthcare") {
      labelX = "Income:"
      labelY = "Healthcare"
    }
    else if (chosenYAxis === "smokes") {
      labelX = "Income:"
      labelY = "Smokes:"
    }
    else if (chosenYAxis === "obesity") {
      labelX = "Income:"
      labelY = "Obesity:"
    }
  }

  // Create the toolTip with the relevant information
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([10, -85])
    .html(function (values) {
      if (chosenXAxis === "age") {
        return (`${values.state}<hr>${labelX} ${values[chosenXAxis]}<br>${labelY} ${values[chosenYAxis]}%`)
      }
      else if (chosenXAxis === "income") {
        return (`${values.state}<hr>${labelX} $${values[chosenXAxis]}<br>${labelY} ${values[chosenYAxis]}%`)
      }
      else {
        return (`${values.state}<hr>${labelX} ${values[chosenXAxis]}%<br>${labelY} ${values[chosenYAxis]}%`)
      }
    });

  // Call the toolTip
  circlesGroup.call(toolTip);

  // When user hovers over circleGroup object, display the data, change stroke color of circle
  circlesGroup.on("mouseover", function (data) {
    d3.select(this).style("stroke", "#222831");
    toolTip.show(data);
  })
    // When user is no longer over the circleGroup object, hide the data, return to original stroke color
    .on("mouseout", function (data, index) {
      d3.select(this).style("stroke", "#f2a365");
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve the data from the CSV file and create the chart
d3.csv("../assets/data/data.csv").then(function (riskData, err) {

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

  // Append the y-axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(axisLeft);

  // Append the initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", val => xLinearScale(val[chosenXAxis]))
    .attr("cy", val => yLinearScale(val[chosenYAxis]))
    .attr("r", 20);

  // Append the state abbreviations over the circles
  var circleText = chartGroup.selectAll()
    .data(riskData)
    .enter()
    .append("text")
    .text(val => val.abbr)
    .attr("dominant-baseline", "central")
    .attr("class", "stateText")
    .attr("x", val => xLinearScale(val[chosenXAxis]))
    .attr("y", val => yLinearScale(val[chosenYAxis]));

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
    .attr("y", 0 - margin.left + 60)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var obeseLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 20)
    .attr("value", "obesity") // value to grab for event listener
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
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis, circleText);

        // Update the toolTip
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Change the active status of the x-axis selection
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
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis, circleText);

        // Update the toolTip
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Change the active status of the y-axis selection
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
        else if (chosenYAxis === "smokes") {
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
        else if (chosenYAxis === "obesity") {
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
