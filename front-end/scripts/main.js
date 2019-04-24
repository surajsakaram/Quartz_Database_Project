
const info_list = [
    {"name": "Larry Page", "type": "e"},
    {"name": "Sergey Brin", "type": "e"},
    {"name": "Paul Allen", "type": "e"},
    {"name": "Jeffrey Bezos", "type": "e"},
    {"name": "Tim Cook", "type": "e"},
    {"name": "Facebook", "type": "c"},
    {"name": "Amazon", "type": "c"},
    {"name": "Apple", "type": "c"},
    {"name": "Neflix", "type": "c"},
    {"name": "Google", "type": "c"},
];


const regexWhitespace = "^\\s+$";


function validateText(text) {

} 

function autocompleteAppend(results_arr) {
    for (var i = 0; i < results_arr.length; i++) {
        $('#autocomplete_suggestion').append(
            `<div class="autocomplete-result" data-id="">
               ${results_arr[i].name} 
               <span> ${results_arr[i].type} </span>
             </div>`
        );
    }
}

$(document).ready(function(){

    $('.search-btn').click(function(event){
        event.preventDefault();
    });

    $('#search_bar').on("change paste keyup", function(){
        $('#autocomplete_suggestion').html('');
        var text = $(this).val();

        if (text.trim() === '') return;
        //console.log(text);
        var lii = info_list.filter(function(item){
            return item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
        });
        //console.log(lii);
        
        autocompleteAppend(lii);
    });

});