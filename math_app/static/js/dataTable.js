const replaceTable = (data) => {
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

export const createTable = (data) => {
    var tableDiv = d3.select("#DataTable")
    var years = Object.keys(data)

    var table = tableDiv.append("div")
        .attr("id", "DropdownDataTable")

    var buttonBox = table.append("div").attr('id', "buttonBox")

    buttonBox.selectAll(".ddown")
        .data(years)
        .enter().append("button")
            .attr("class", "dropdown")
            .text(function(d) {return d})
            .on("click", () => {
                fetch(`${window.urlKey}/base/generate_table?search=${localStorage.getItem("encodedSearch")}&year=${event.target.innerText}`)
                .then(response => response.json())
                .then(data => {
                    replaceTable(data);
                });
            })
    
    table.append("table")
        .attr("id", "dataRaw")
        .attr("width", tableDiv.attr("width"))
}