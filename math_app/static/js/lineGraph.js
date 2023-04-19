const getXandY = (data) => {
    var maxY = 0;
    var arr = new Set();
    data.forEach((d, i) => {
        arr.add(d.x_axis_time);
        if (d.y_axis_value > maxY) {
            maxY = d.y_axis_value;
        }
    });
    console.log(arr)
    return [arr, maxY]
}

export const createLineGraph = (data, search, xAxisTitle, yAxisTitle) => {
    // set the dimensions and margins of the graph
    var svg = d3.select("#BarGraphCanvas"),
    xTrans = 50,
    yTrans = 50,
    width = parseInt(svg.style('width'), 10) - xTrans,
    height = parseInt(svg.style('height'), 10) - (2 * yTrans)

    // Color scheme
    var colorScheme = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']

    // barCategories = Categories corresponding to each bar color
    var lineCategories = decodeURIComponent(search).split(", ")

    var sumstat = d3.nest()
        .key((d) => { return d.name;})
        .entries(data);

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(lineCategories)
        .range(colorScheme)

    // append the svg object to the body of the page
    var g = svg.append("g")
        .attr("transform", "translate(" + xTrans + "," + yTrans + ")")
        .attr("id", "BarGraph");

    // Add X axis
    var [xAxisVars, maxY] = getXandY(data)
    console.log(Array.from(xAxisVars))
    var xAxis = d3.scaleBand().domain(Array.from(xAxisVars)).range([ 0, width ]).padding(1),
        yAxis = d3.scaleLinear().domain([0, maxY]).range([ height, 0 ]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis).ticks(5));

    g.append("g")
        .call(d3.axisLeft(yAxis));

    // color palette
    var color = d3.scaleOrdinal()
        .domain(lineCategories)
        .range(colorScheme)

    // // Horizontal and vertical grid lines
    var xAxisGrid = d3.axisBottom(xAxis).tickSize(height).tickFormat('').ticks(10);
    var yAxisGrid = d3.axisLeft(yAxis).tickSize(-width).tickFormat('').ticks(10);

    g.append("g")
        .call(xAxisGrid);

    g.append("g")
        .call(yAxisGrid);

    // Adding x-axis label
    g.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .text(xAxisTitle);

    // Adding y-axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "x label")
        .attr("dx", 350 - height)
        .attr("dy", -35)
        .style("text-anchor", "middle")
        .text(yAxisTitle);

    var Tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

    var mouseover = function(d) {
        Tooltip.style("opacity", 1);
        d3.select(this).attr('opacity', 0.3);
    }

    var mousemove = function(d) {
        const [x, y] = d3.mouse(this)
        Tooltip.html(d.name + " in " + d.x_axis_time + ": " + d.y_axis_value)
            .style("left", x + 80 + "px")
            .style("top", y + 200 + "px")
    }

    var mouseleave = function(d) {
        Tooltip.style("opacity", 0);
        d3.select(this).attr('opacity', 1);
    }

    // Draw the line
    g.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
        .style("visibility", 'visible')
        .attr("fill", "none")
        .attr("stroke", (d) => { return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("class", (d) => { return d.key })
        .attr("d", (d) => {
        return d3.line()
            .x((d) => { return xAxis(d.x_axis_time); })
            .y((d) => { return yAxis(+d.y_axis_value); })
            (d.values)
        })

    g.selectAll(".circles")
        .data(sumstat)
        .enter().append("g")
            .style("visibility", 'visible')
            .attr("fill", (d) => { return color(d.key) })
            .attr("stroke", "none")
            .attr("class", (d) => { return d.key })
            .selectAll("circle")
            .data((d) => {return d.values;})
            .enter().append("circle")
                .attr("cx", (d) => { return xAxis(d.x_axis_time) })
                .attr("cy", (d) => { return yAxis(+d.y_axis_value) })
                .attr("r", 5)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

    var mouseclick = (d) => {
        var line = d3.selectAll('.' + d.key)
        if (line.style('visibility') == 'visible'){
            d3.select(this).attr('opacity', 0.3)
            line.style('visibility', 'hidden')
        } else {
            d3.select(this).attr('oppacity', 1)
            line.style('visibility', 'visible')
        }
    }

    var size = 20
    // Draw squares for legend
    g.selectAll("legendSquares")
        .data(sumstat)
        .enter().append("rect")
            .attr("x", 20)
            .attr("y", (d, i) => { return i*(size+5) + 5})
            .attr("width", size)
            .attr("height", size)
            .style("fill", (d) => { return color(d.key)})
            .style("opacity", 1)
            .on('click', mouseclick)

    // Draw legend labels
    g.selectAll("legendLabels")
        .data(sumstat)
        .enter().append("text")
            .attr("x", 20 + size*1.2)
            .attr("y", (d,i) => { return i*(size+5) + 20})
            .style("fill", (d) => { return color(d.key)})
            .text((d) => { return d.key})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
}