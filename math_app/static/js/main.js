import './changeGraph.js';
import { createBarGraph } from "./barGraph.js";
import { createLineGraph } from "./lineGraph.js";
// import { createTable } from "./dataTable.js";

//May's branch
// import { barGraph } from "./testGraph.js";
// import { collapsible } from "./testGraph.js";
import autoForm from "./autoForm.js";

$(document).ready(() => {
    autoForm();
    var selection = "mp_search_grad"
    $("#graph").change(function() {
        if(this.value == "option1") {
            selection = "mp_search_grad"
        }
        if(this.value == "option2") {
            selection = "mp_search_classes"
        }
    })

    $('.input').keypress(function(e) {
        if(e.which == 13) {
            $("#button1").focus().click();
            return false;
        }
    });

    $("#button1").click(function(){
        // var search = $("#search").val().substring(-2);
        var search = $("#search").val().substring(0, ($("#search").val().length - 3));
        var encodedSearch = encodeURIComponent(search);
        fetch(`${window.urlKey}/base/${selection}?search=${encodedSearch}`)
        .then(response => response.json())
        .then(data => {
            const graph = document.getElementById("BarGraph");
            if (graph){
                graph.remove();
            }
            const dropdown = document.getElementById("DropdownDataTable");
            if (dropdown){
                dropdown.remove();
            }
            createBarGraph(data, decodeURIComponent(search).split(", "), 'Year', 'Number', [], selection + "_table");
            // createLineGraph(data, encodedSearch, 'Year', 'Number');
            // createTable(data, search, encodedSearch);
        });
    });
});
