(function(){
    function UploadFiles(){
        
        this.headerListFiled    = document.getElementById('header_lists');
        this.modifiedHeaderList =  document.getElementsByClassName('m_header');
        this.uploadFile         =  document.getElementById('file');
        this.clearUpload        =  this.uploadFile.parentNode.children[1];        
        this.headerType         = document.getElementsByName('type');

        this.readUploadFile = this.readUploadFile.bind(this);
        this.clearUploadFile = this.clearUploadFile.bind(this)

        this.clearUpload.addEventListener("click",this.clearUploadFile)
        this.headerListFiled.addEventListener("click",this.removeHeader, true);
        this.headerListFiled.addEventListener("dragstart",this.drag, true);
        this.headerListFiled.addEventListener('drop', this.drop,true);
        this.headerListFiled.addEventListener('dragover', this.allowDrop);
        this.uploadFile.addEventListener('change',this.readUploadFile);

        for (var i = 0; i < this.modifiedHeaderList.length; i++) {
            this.modifiedHeaderList[i].addEventListener('click', this.removeHeader, true);
            this.modifiedHeaderList[i].addEventListener('dragover', this.allowDrop);
            this.modifiedHeaderList[i].addEventListener('drop', this.drop,true);
            this.modifiedHeaderList[i].addEventListener('dragstart', this.drag,true);
            
        }   
    }
    UploadFiles.prototype.removeHeader = function(e){
        if(e.target.className==='close' && e.target.innerText.toLowerCase()==='x'){
           var classNames =  e.target.parentNode.parentNode.className
           if(classNames==='m_header'){ // if it is in header

           }
        }
    }
    UploadFiles.prototype.allowDrop = function(e){
        e.preventDefault();
    }
    UploadFiles.prototype.drop =  function(e){
        e.preventDefault();         
        var element = e.dataTransfer.getData("id");
        var parentId = e.dataTransfer.getData("parentId");
        
        if( e.target.className==='m_header' && e.target.children.length===0){
            e.target.appendChild(document.getElementById(element));
        }
        else if(  e.target.id==='header_lists' && parentId !== 'header_lists' ){
            e.target.appendChild(document.getElementById(element));
        }
    }
   
    UploadFiles.prototype.drag = function(e){       
        if(e.target.className.split(' ')[0] === 'csv_headers'){
            e.dataTransfer.setData("id", e.target.id);
            e.dataTransfer.setData("parentId", e.target.parentNode.id);
        }
    }
    UploadFiles.prototype.clearUploadFile =  function(e){        
        e.target.parentNode.children[0].value = "";
        e.target.className = 'display_off';
        this.headerListFiled.innerHTML =  "";
        for (var i = 0; i < this.modifiedHeaderList.length; i++) {
            this.modifiedHeaderList[i].innerHTML = '';
        }
    }
  
    UploadFiles.prototype.readUploadFile = function(e){
        this.clearUpload.className = 'display_on';
        var file = e.target.files[0];
        var ths = this;

        for(var i=0; i < this.headerType.length; i++){
            if(this.headerType[i].checked){
                var headerType = this.headerType[i].defaultValue;
            }
        }
        if(file){
            var r = new FileReader();            
            r.onload = function(ev) { 
                var contents = ev.target.result.split('\r\n');
                var headers = [];
                var headerElements = '';
                if(headerType==='header'){
                    headers = contents[0].split(',');
                }
                else if(headerType==='withoutheader'){
                    for(var i=0; i < contents.length; i++){
                        var tempHeader = contents[i].split(',');
                        if(tempHeader.length > headers.length){
                            headers = [];
                            for(var j=1; j <= tempHeader.length; j++){
                                headers.push('column '+j)
                            }
                        }
                    }
                }
                for( var i=0; i < headers.length;i++){
                    headerElements +='<div class="csv_headers float_left" data-place="'+i+'" id="header'+i+'" draggable="true" ><span>'+headers[i]+'</span><span class="close">x</span></div>';
                }
                ths.headerListFiled.innerHTML =  headerElements;
            }
            r.readAsText(file);
        }
        

    }
    var uploadList = new UploadFiles();

})();