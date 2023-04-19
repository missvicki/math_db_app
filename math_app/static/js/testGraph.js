const total = (data, keys) => {
    var sum = 0;
    for (let i = 0; i < keys.length; i++){
        sum += data[keys[i]]
    }
    return sum
}

const createTable = (data) => {
    const tbody = d3.select("#dataRaw tbody");
    if (tbody){
        tbody.remove();
    }

    var body = d3.select('#dataRaw').append("tbody")

    var tr = d3.select("#dataRaw tbody")
        .selectAll("tr")
        .data(Object.keys(data))
        .enter().append("tr");

    tr.append("td").text(function(d, i) {return Object.keys(data)[i]})
    tr.insert("td").text(function(d, i) {return Object.values(data)[i]})
}

export const collapsible = (data) => {
    var tableDiv = d3.select("#DataTable")
    var years = Object.keys(data)

    var table = tableDiv.append("div")
        .attr("id", "DropdownDataTable")
    
    var title = table.append("h4").attr("id", "title").text("Data Table")
    var selectBox = table.append("select").attr('id', "selectBox")

    d3.select("#selectBox")
        .append("option")
        .text("Select a Year")
        .property("disabled", true)
    
    d3.select("#selectBox")
        .selectAll('myOptions')
        .data(years)
        .enter().append("option")
            .attr("class", "dropdown")
            .text(function (d) { return d; })
            .attr("value", function (d) { return d; })
    d3.select("#selectBox").on("change", function(d) {
            fetch(`${window.myURL}base/generate_table?search=${localStorage.getItem("encodedSearch")}&year=${d3.select(this).property("value")}`)
            .then(response => response.json())
            .then(data => {
                createTable(data);
            });
        })
    
    table.append("table")
        .attr("id", "dataRaw")
        .attr("width", tableDiv.attr("width"))
}

export const barGraph = (data, search) => {
    var svg = d3.select("#BarGraphCanvas"),
    xTrans = 50,
    yTrans = 50,
    width = parseInt(svg.style('width'), 10) - xTrans,
    height = parseInt(svg.style('height'), 10) - (2 * yTrans)

    var dukeBrandColors = ['#ff934f', '#cc2d35', '#058ed9', '#848fa2', '#2d3142', '#e1daae']

    // Creating the X and Y axis
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    // Drawing the a component within the svg where we will draw the graph
    // var g = svg.append("g")
    //     .attr("id", "BarGraph");

    var g = svg.append("g")
            .attr("transform", "translate(" + xTrans + "," + yTrans + ")")
            .attr("id", "BarGraph");

    // subgroups = categories that we are searching in each year (ie. Engineering, Environment)
    var years = Object.keys(data)
    var subgroups = Object.keys(data[years[0]])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(dukeBrandColors)

    // Creating an array of just the values, without the year keys
    var amountsWithoutYears = Object.values(data)
    
    // Creating the stacked bars
    var stackedData = d3.stack()
        .keys(subgroups)
        (amountsWithoutYears)

    // Creating X and Y axis
    var yLabel = "Number of Students"
    var xLabel = "Year"
    xScale.domain(years);
    yScale.domain([0, d3.max(amountsWithoutYears, (d) => { return total(d, subgroups); })]);

    // Adding x-axis title
    g.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .text(xLabel);

    // Adding x-axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "x label")
        .attr("dx", 350 - height)
        .attr("dy", -35)
        .style("text-anchor", "middle")
        .text(yLabel);

    // Adding y-axis
    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;
        }).ticks(10));

    // Drawing data
    var trackYear = -1
    g.selectAll(".bar")
        .data(stackedData)
        .enter().append("g")
            .attr("fill", (d) => { return color(d.key); })
            .attr("data-legend", (d) => { return d.name; })
            .selectAll("rect")
            .data((d) => { return d; })
            .enter().append("rect")
                .attr("x", (d) => { return xScale(years[((trackYear += 1) % years.length)]); })
                .attr("y", (d) => { return yScale(d[1]); })
                .attr("height", (d) => { return yScale(d[0]) - yScale(d[1]); })
                .attr("width", xScale.bandwidth())
    
    var size = 20
    // Draw squares for legend
    g.selectAll("legendSquares")
        .data(stackedData)
        .enter().append("rect")
            .attr("x", 20)
            .attr("y", (d,i) => { return i*(size+5)})
            .attr("width", size)
            .attr("height", size)
            .style("fill", (d) => { return color(d.key)})

    // Draw legend labels
    g.selectAll("legendLabels")
        .data(stackedData)
        .enter().append("text")
            .attr("x", 20 + size*1.2)
            .attr("y", (d,i) => { return i*(size+5) + (size/2)})
            .style("fill", (d) => { return color(d.key)})
            .text((d) => { return d.key})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
}