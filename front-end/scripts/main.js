
(function(){

    var AutoComplete = function() {
        this.info_list = [];
        this.startChar = '';
        this.selectionID = '';

        this.searchBar = document.getElementById('search_bar');
        this.searchSubmit = document.getElementById('search_btn');
        this.suggestionList = document.getElementById('autocomplete_suggestion');
    
        this.openSuggestion = this.openSuggestion.bind(this);
        this.fetchDataList = this.fetchDataList.bind(this);
        this.clickOnSuggestion = this.clickOnSuggestion.bind(this);
        this.closeSuggestion = this.closeSuggestion.bind(this);

        
        this.searchBar.addEventListener('keyup', this.openSuggestion);
        
        this.suggestionList.addEventListener('click', this.clickOnSuggestion, true);
        //this.searchBar.addEventListener('blur', this.closeSuggestion);

    };

    AutoComplete.prototype.closeSuggestion = function () {
        //this.suggestionList.innerHTML = "";
        this.suggestionList.className = this.suggestionList.className.replace(' active', '');
    };


    AutoComplete.prototype.openSuggestion = function (event) {

        var text = event.target.value;
        console.log(text);
        if(text.replace(/\s/g,'') === ''){
            this.startChar = '';
            this.closeSuggestion();
        }
        else if (text.length === 1 && text !== this.startChar) {
            this.startChar = text;
            this.closeSuggestion();
            this.info_list = [];
            var promiseData = this.fetchDataList(text);
            var thisOne = this;
            promiseData.then(function(data){
                thisOne.info_list = data;
                var resultList = thisOne.filterText(text);
                console.log(resultList);
                thisOne.appendSuggestion(resultList);
            }); 
        } else {
            this.closeSuggestion();
            var resultList = this.filterText(text);
            console.log(resultList);
            this.appendSuggestion(resultList);
        }       
    };

    AutoComplete.prototype.appendSuggestion = function (resultList) {
        if (resultList.length === 0) {
            this.suggestionList.innerHTML = "<div class=\"autocomplete-not-found\"> Result Not Found </div>";
            this.suggestionList.className += " active";
            return;
        }
        var appendHTMLStr = "";
        for (var i = 0; i < resultList.length; i++) {
            var name = resultList[i].name, type = resultList[i].type;
            appendHTMLStr += '<div class="autocomplete-item" data-id="'+i+'" data-name="'+name+'">'+name+'\t'+type+'</div>\n';
        }
        this.suggestionList.innerHTML = '';
        this.suggestionList.innerHTML = appendHTMLStr;
        this.suggestionList.className += " active";
    };

    AutoComplete.prototype.clickOnSuggestion = function (event) {
        console.log(event.target);
        
        this.selectionID = event.target.dataset.id;
        this.searchBar.value = event.target.dataset.name;
        this.closeSuggestion();
        console.log(this.selectionID);
    };

    AutoComplete.prototype.fetchDataList = function (text) {
        
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                resolve([
                    {"name": "Larry Page", "type": "e"},
                    {"name": "Sergey Brin", "type": "e"},
                    {"name": "Paul Allen", "type": "e"},
                    {"name": "Jeffrey Bezos", "type": "e"},
                    {"name": "Tim Cook", "type": "e"},
                    {"name": "Facebook", "type": "c"},
                    {"name": "Amazon", "type": "c"},
                    {"name": "Apple", "type": "c"},
                    {"name": "Neflix", "type": "c"},
                    {"name": "Google", "type": "c"}
                ]);
            },3000);
        });
    };

    AutoComplete.prototype.filterText = function (text) {
        return this.info_list.filter(function(item){
            return item.name.toLowerCase().indexOf(text.replace(/ +(?= )/g, '').toLowerCase()) !== -1;
        });
    };

    
    document.addEventListener("DOMContentLoaded", function(){
        new AutoComplete();
    });

})();
