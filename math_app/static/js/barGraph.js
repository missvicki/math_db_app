const createTable = (tableQuery, search, x_axis_time) => {
    const tbody = d3.select("#dataTableRows");
    if (tbody){
        tbody.remove();
    }

    var encodedSearch = encodeURIComponent(search);
    fetch(`${window.myURL}/base/${tableQuery}?search=${encodedSearch}&time=${x_axis_time}`)
    .then(response => response.json())
    .then(data => {
        var tableDiv = d3.select('#dataTableDiv');
        var tbody = tableDiv.append("table")
                        .attr("id", "dataTableRows")
                        .attr("width", tableDiv.attr('width'))

        var trs = tbody.selectAll("tr")
            .data(Object.keys(data))
            .enter().append("tr")

        trs.append("td").text((d, i) => {return Object.keys(data)[i]})
        trs.insert("td").text((d, i) => {return Object.values(data)[i]})
    });
}

const collapsible = (xAxisVars, tableQuery, search) => {
    var tableDiv = d3.select("#DataTable")
                        .append("div")
                        .attr("id", "dataTableDiv")

    var title = tableDiv.append("h4").attr("id", "title").text("Data Table")

    var selectDate = function(d) {
        var year = d3.select(this).property("value");
        createTable(tableQuery, search, year);
    }

    var selectBox = tableDiv.append("select")
                        .attr("id", "dropdownSelect")
                        .on("change", selectDate)

    selectBox.append("option")
        .text("Select a Year")
        .property("disabled", true)

    selectBox.selectAll('myOptions')
        .data(xAxisVars)
        .enter().append("option")
            .attr("class", "dropdown")
            .text((d) => { return d; })
            .attr("value", (d) => { return d; })
}

const getXandY = (data) => {
    var maxY = 0;
    var arr = [];
    data.forEach((d, i) => {
        arr.push(d.x_axis_time);
        if (d.sum > maxY) {
            maxY = d.sum;
        }
    });
    return [arr, maxY]
}

export const createBarGraph = (data, search, xAxisTitle, yAxisTitle, skip, tableQuery) => {
    var svg = d3.select("#BarGraphCanvas"),
    xTrans = 50,
    yTrans = 50,
    width = parseInt(svg.style('width'), 10) - xTrans,
    height = parseInt(svg.style('height'), 10) - (2 * yTrans)

    // Color scheme
    // Generated colors -> distinct-colors
    var colorScheme = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']

    var unskippedTags = search.filter(s => !skip.includes(s));
    var stackedData = d3.stack()
        .keys(unskippedTags)
        (data)

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(search)
        .range(colorScheme)

    var g = svg.append("g")
        .attr("transform", "translate(" + xTrans + "," + yTrans + ")")
        .attr("id", "BarGraph");

    // X and Y axis
    var [xAxisVars, maxY] = getXandY(data)
    var xAxis = d3.scaleBand().domain(xAxisVars).range ([0, width]).padding(0.4),
        yAxis = d3.scaleLinear().domain([0, maxY]).range ([height, 0]);

    // Adding x-axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis));

    // Adding y-axis
    g.append("g")
        .call(d3.axisLeft(yAxis).tickFormat((d) => {
            return d;
        }).ticks(10));

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

    // Horizontal and vertical grid lines
    var xAxisGrid = d3.axisBottom(xAxis).tickSize(height).tickFormat('').ticks(10);
    var yAxisGrid = d3.axisLeft(yAxis).tickSize(-width).tickFormat('').ticks(10);

    g.append("g")
        .style("stroke", "red")
        .call(xAxisGrid);

    g.append("g")
        .style("stroke", "red")
        .call(yAxisGrid);

    var Tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

    var mouseover = function(d) {
        Tooltip.style("opacity", 1);
        d3.select(this).attr('opacity', 0.3);
    }

    var mousemove = function(d) {
        var key = this.parentNode.id
        const [x, y] = d3.mouse(this)
        Tooltip.html(key + " in " + d.data.x_axis_time + ": " + d.data[key])
            .style("left", x + 80 + "px")
            .style("top", y + 200 + "px")
    }

    var mouseleave = function(d) {
        Tooltip.style("opacity", 0);
        d3.select(this).attr('opacity', 1);
    }

    var mouseclick = function(d) {
        var key = this.parentNode.id
        createTable(tableQuery, key, d.data.x_axis_time)
    }

    // Drawing data
    g.selectAll(".bar")
        .data(stackedData)
        .enter().append("g")
            .style('visibility', 'visible')
            .attr("fill", (d) => { return color(d.key); })
            .attr("data-legend", (d) => { return d.name; })
            .attr("id", (d) => { return d.key;} )
            .attr('class', (d) => {return d.key;} )
            .selectAll("rect")
            .data((d) => { return d; })
            .enter().append("rect")
                .attr("x", (d) => { return xAxis(d.data.x_axis_time); })
                .attr("y", (d) => { return yAxis(d[1]); })
                .attr("height", (d) => { return yAxis(d[0]) - yAxis(d[1]); })
                .attr("width", xAxis.bandwidth())
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("click", mouseclick)

    var mouseclick = (d) => {
        var line = d3.selectAll('.' + d)
        if (line.empty()){
            document.getElementById("BarGraph").remove();
            document.getElementById("dataTableDiv").remove();
            var newSkip = skip.filter(item => item !== d);
            createBarGraph(data, search, xAxisTitle, yAxisTitle, newSkip, tableQuery)
        } else {
            document.getElementById("BarGraph").remove();
            document.getElementById("dataTableDiv").remove();
            skip.push(d);
            createBarGraph(data, search, xAxisTitle, yAxisTitle, skip, tableQuery)
        }
    }

    var size = 20
    // Draw squares for legend
    g.selectAll("legendSquares")
        .data(search)
        .enter().append("rect")
            .attr("x", 20)
            .attr("y", (d,i) => { return i*(size+5) + 5})
            .attr("width", size)
            .attr("height", size)
            .style("fill", (d) => { return color(d)})
            .style('opacity', 1)
            .on('click', mouseclick)

    // Draw legend labels
    g.selectAll("legendLabels")
        .data(search)
        .enter().append("text")
            .attr("x", 20 + size*1.2)
            .attr("y", (d,i) => { return i*(size+5) + 20})
            .style("fill", (d) => { return color(d)})
            .text((d) => { return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    collapsible(xAxisVars, tableQuery, unskippedTags.join(", "));
}

