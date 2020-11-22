// @TODO: YOUR CODE HERE!
var svgWidth = 700;
var svgHeight = 550;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svgWrapper = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Append svg
var chartGroup = svgWrapper.append("g")
    .attr("transform", 'translate(${margin.left}, ${margin.top})');

d3.csv("data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);

//Scale
var xlScale = d3.scaleLinear()
    .domain([8, d3.max(data,function(d){
    return +d.poverty;
    })])
    .range([0, width]);

var ylScale = d3.scaleLinear()
    .domain([2, d3.max(data,function(d){
    return +d.healthcare;
    })])
    .range([height, 0]);

//Create axises
var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

chartGroup.append("g")
    .attr("transform", 'translate(0, ${height}')
    .call(bottomAxis);
chartGroup.append("g")
    .call(leftAxis);

//Data points for scatter plot
var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d,i) => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .classed("stateCircle", true)

//State text
chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d,i) => xScale(d.poverty))
    .attr("y", d => (yScale(d.healthcare-0.28)))
    .classed("stateText", true)
    .text(d => d.abbr)
    .on("mouseover", function(d) {
        ToolTip.show(d);
    })
    .on("mouseout", function(d,i) {
        ToolTip.hide(d);
    });

//X labels
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .attr("data-axis-name", "poverty")
    .text("In Poverty (%)");

//Y labels
chartGroup.append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
    .attr("data-axis-name", "healthcare")
    .classed("aText", true)
    .text("Lacks Healthcare(%)");

//Tool tip
var ToolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 30])
    .html(function(d) {
        return ('${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>Poverty: ${d.poverty}');
    });

chartGroup.call(ToolTip);

//Event listener 
circlesGroup.on("mouseover", function(d) {
    ToolTip.show(d);
})
    .on("mouseout", function(d, i){
        ToolTip.hide(d);
    });

});