
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

function closeAutocomplete() {
    $('#autocomplete_suggestion').removeClass('active');
    $('#autocomplete_suggestion').html('');
}

function autocompleteAppend(resultArr) {
    if (resultArr.length === 0) {
        $('#autocomplete_suggestion').append(`<div class="autocomplete-not-found"> Result Not Found </div>`);
        return;
    }
    for (var i = 0; i < resultArr.length; i++) {
        const name = resultArr[i].name, type = resultArr[i].type;
        const item = `<div class="autocomplete-item" data-id="${i}" data-name="${name}">${name+"\t"+type}</div>`
        $('#autocomplete_suggestion').append(item);
    }
}

function openAutocomplete(target) {
    target.on("change paste keyup click", function(){
        
        closeAutocomplete();
        
        var text = $(this).val();
        if (text.trim() === '') return;
        var resultList = info_list.filter(function(item){
            return item.name.toLowerCase().indexOf(text.trim().toLowerCase()) !== -1;
        });

        if (resultList.length > 0) {
            $('#autocomplete_suggestion').addClass('active');
        }
        autocompleteAppend(resultList);
    });

    ///*
    $(document).click(function(event){
        if (event.target.nodeName === "INPUT") return;
        if ($('#autocomplete_suggestion').attr('class') === 'active') {
            closeAutocomplete();
        } 
    });
    //*/

    autocompleteFilled();
}


function autocompleteFilled() {
    $('#autocomplete_suggestion').on('click', '.autocomplete-item', function(event){
        console.log(event.target);
        var name = event.target.dataset.name.trim();
        $('#search_bar').val(name);
        closeAutocomplete();
    });
}


function toggleDropdown() {
    $('.dropdown-btn').click(function(){
        $(this).toggleClass('active');
        $('.dropdown-content').toggle();
    });
}


$(document).ready(function(){

    openAutocomplete($('#search_bar'));

    toggleDropdown(); 

    $('.info-icon').click(function(event){
        event.preventDefault();
    });

    $(document).on('click', function(event){
        console.log(event.target);
    })

    $('.search-btn').click(function(event){
        event.preventDefault();
    });

});