$(document).ready(() => {
    fetch(`${window.urlKey}/base/graphs`)
        .then(response => response.json())
        .then(data => {
            autoForm(data);
    });
});

function split( val ) {
    return val.split(/,\s*/);
}

function extractLast( term ) {
    return split( term ).pop();
}

export default function autoForm (data) {
    $( "#search" ).autocomplete({
        minLength: 1,
        scroll: true,
        source: function( request, response ) {
            response( $.ui.autocomplete.filter(
                data, extractLast( request.term.slice(0, -1) )));
        },
        focus: function() {
            return false;
        },
        select: function( event, ui ) {
            var terms = split( this.value );
            terms.pop();
            terms.push( ui.item.value );
            terms.push( " " );
            console.log(terms.slice(0, -1))
            this.value = terms.join( ", " );
            return false;
        }
    });
};