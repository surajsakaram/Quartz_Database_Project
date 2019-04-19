// dhtmlx object initilization 
// author: UJWAL RAI

var Ucr_dhx = function(){
		'use strict';
		
		// dhtmlx object array/variable	
		this.comb   = [];
		this.chrt   = [];
		this.grid   = [];			
		this.ppup   = [];
		this.tool   = [];
		this.form   = [];
		this.tree   = [];
		this.wind   = null;
		this.tabb   = []; 
		this.ribb	= [];
		this.schd   = null;
		this.clan   = [];
		this.popu	= [];
		this.data	= [];
		// dhtmlx object skin variable
		
		this.g_skin = 'dhx_web'; // grid skin
		this.w_skin = 'dhx_skyblue'; // window sking
		this.t_skin = 'dhx_skyblue'; // tab skin
		this.r_skin = 'dhx_skyblue'; // ribbon skin
		this.tol_skin = 'dhx_skyblue'; // toolbar skin
		
		// grid data
		this.g_data = null;
		
		// operation configuration variable
		this.l_loc = 'login?s=logout'; // after logout location
		this.r_loc = 'login'; // after logout location
		this.l_time = 6000;   // Session expire time out Alert display time
		this.m_time = 7000;   // Message display time
		this.m_font = 'Tahoma'; // Message font
		this.m_size = 12; // Message font size
		this.w_imgP = ''; // window image path		
		this.g_imgP = 'resources/images/imgs/'; // grid image path
		this.t_imgP = 'resources/images/imgs/dhxtree_skyblue/'; // tree image path
		this.l_imgP = new Image(); // loading image 
		this.l_imgP.src = 'resources/images/squares.gif'; 
		this.g_limg = new Image();
		this.g_limg.src = 'resources/images/loading.gif';
		//array of ids of toolbar items
		this.toolbarIdList = [];
		// initilization of loadxml error handler	
	//	dhtmlxError.catchError("LoadXML",this.ucr_error_handler); 
		this.winToogle=false;
		// initilization of ajax error handler on connection fail
		$( document ).ajaxError(this.ucr_error_handler);
		
	};
	
	/*********************************** ERROR HANDLING ********************************/
	Ucr_dhx.prototype.ucr_error_handler = function (){
		'use strict';
		dhtmlx.message({ type:'error', text:"Please Check your Connection If problem persist contact Admin", expire:5000});
		setTimeout(function(){ window.location= 'login'; }, 4000);
	}
	
	/************DHTMLX OBJECT DESTROY *****************************************/
	Ucr_dhx.prototype.destroy_dhx_object = function( type, obj_id){
		switch (type) {
			case 'table':
				this.grid[obj_id].destructor(); 
				break;
			case 'window':
				if(this.wind != null)this.wind.unload(); 
				this.wind =null;
				break;
			case 'tabbar':
				this.tabb[obj_id].unload();
				break;
			case 'ribbon':
				this.ribb[obj_id].unload();
				break;
			case 'toolbar':
				this.tool[obj_id].unload();
				break;
			case 'calander':
				this.clan[obj_id].unload();
				break;
			case 'tree':
				this.tree[obj_id].destructor();
				break;
			case 'combo':
				this.comb[obj_id].unload();
				break;
			case 'chart':
				this.chrt[obj_id].destructor();
			case 'data_view':
				this.data[obj_id].destructor();
				break;
		} 
	}
	
	/*********************************** DHTMLX GRID INITIALIZATION ********************************/	
	Ucr_dhx.prototype.create_dhx_grid = function ( var_obj ){	
		'use strict';	
		this.g_data = null;
		if( typeof(var_obj) !== 'object') return;
		if( typeof(var_obj.p_id) == 'undefined' ) return;
		
		var tId  = var_obj.p_id+'_t',
			pId  = var_obj.p_id+'_p',
			paId = var_obj.p_id+'_pa',
			iaId = var_obj.p_id+'_ia',
			olId = var_obj.p_id+'_ol';
			
		var ths= this;
		
		var_obj = {
			p_id					: var_obj.p_id,
			grid_id					: var_obj.grid_id 			   		|| tId,
			setHeader				: var_obj.setHeader,
			attachHeader			: var_obj.attachHeader				|| null,
			setInitWidths			: var_obj.setInitWidths,
			enableAutoHeight		: var_obj.enableAutoHeight 			|| true,
			enableMultiline			: var_obj.enableMultiline  			|| true,
			enableRowsHover			: var_obj.enableRowsHover  			|| true,
			setColAlign				: var_obj.setColAlign,
			setColTypes				: var_obj.setColTypes,
			enable_Paging			: (var_obj.enable_Paging && (var_obj.enable_Paging===false))?false:true,
			pageSize				: var_obj.pageSize         			|| 5,
			pagesInGrp				: var_obj.pagesInGrp  	   			|| 2,
			pagingControlsContainer	: var_obj.pagingControlsContainer  	|| paId,
			showRecInfo				: var_obj.showRecInfo  				|| true,
			pagingStateContainer	: var_obj.pagingStateContainer  	|| iaId,
			setColumnIds			: var_obj.setColumnIds ,
			//enableAutoHeight		: var_obj.enableAutoHeight  		|| true ,
			onxl_id					: var_obj.onxl_id  					|| olId,
			paging_skin				: var_obj.paging_skin  				|| 'bricks',
			enableEditEvents		: var_obj.enableEditEvents			|| 'false,false,false',
			xml_link				: var_obj.xml_link					|| null,
			multi_select			: var_obj.multi_select				|| false,
			smart_render			: var_obj.smart_render				|| false,
			multiple			    : var_obj.multiple				    || 'single',
			skin					: var_obj.skin						|| ths.g_skin,
			footer					: var_obj.footer					|| false
		}; 
		
		if(var_obj.multiple == 'single'){
			if( Object.keys(this.grid).length!= 0) { 					
				for(var i=0; i<Object.keys(this.grid).length; i++){	
					this.destroy_dhx_object('table',(Object.keys(this.grid))[i]);	
				}	
				this.grid = [];			
			}
		}		
		var tb_el = '<div id="'+tId+'" style="width:100% !important; " ></div><div id="'+pId+'" ><span id="'+paId+'"></span>&nbsp;<span id="'+iaId+'"></span></div>'+
					'<div id="'+olId+'" style="font-size:12px;">Please wait,&nbsp;<img style=" height:13px;" src="'+ths.g_limg.src+'"/></div>';		
		$('#'+var_obj.p_id).empty().append(tb_el);
		document.getElementById(var_obj.onxl_id).style.display="none";
		
		this.grid[var_obj.grid_id] = new dhtmlXGridObject(var_obj.grid_id);
			
		this.grid[var_obj.grid_id].setImagePath(this.g_imgP);
		this.grid[var_obj.grid_id].setHeader(var_obj.setHeader);
		if( var_obj.attachHeader!== null)		
			this.grid[var_obj.grid_id].attachHeader(var_obj.attachHeader);	
		if(var_obj.footer==true)
			this.grid[var_obj.grid_id].attachFooter(var_obj.setHeader);  
		this.grid[var_obj.grid_id].setInitWidths(var_obj.setInitWidths);
		this.grid[var_obj.grid_id].enableAutoHeight(var_obj.enableAutoHeight);    
		this.grid[var_obj.grid_id].enableMultiline(var_obj.enableMultiline); 
		
		this.grid[var_obj.grid_id].enableRowsHover(var_obj.enableRowsHover,'grid_hover');
		this.grid[var_obj.grid_id].enableEditEvents( (var_obj.enableEditEvents).toString() );
		this.grid[var_obj.grid_id].setColAlign(var_obj.setColAlign);
		this.grid[var_obj.grid_id].setColTypes(var_obj.setColTypes);		
		this.grid[var_obj.grid_id].enablePaging(var_obj.enable_Paging,var_obj.pageSize,var_obj.pagesInGrp,
							var_obj.pagingControlsContainer,var_obj.showRecInfo, var_obj.pagingStateContainer);		
		this.grid[var_obj.grid_id].setColumnIds(var_obj.setColumnIds);				
		this.grid[var_obj.grid_id].enableAutoHeight(var_obj.enableAutoHeight);
			
		this.grid[var_obj.grid_id].setSkin(var_obj.skin);
		if(var_obj.paging_skin == 'toolbar') this.grid[var_obj.grid_id].setPagingSkin('toolbar',paging_skin);
		else this.grid[var_obj.grid_id].setPagingSkin(var_obj.paging_skin);
		
		this.grid[var_obj.grid_id].enableMultiselect(var_obj.multi_select);
		this.grid[var_obj.grid_id].init(); 
		this.grid[var_obj.grid_id].enableSmartRendering(var_obj.smart_render);		
		if( var_obj.xml_link != null){ 			
			(this.grid[var_obj.grid_id]).load(var_obj.xml_link+'?object=grid',function(e){ 
			//console.log();
				var session_data = ths.grid[var_obj.grid_id].getUserData( "","session");
				if(session_data==="expire" || session_data =="disable") ths.session_expire(session_data);
			});			
		}
		this.grid[var_obj.grid_id].attachEvent("onXLS",function(){
			document.getElementById(var_obj.onxl_id).style.display="block";
			//ths.cur_g = var_obj.grid_id ; // setting current grid id
		});
		
		this.grid[var_obj.grid_id].attachEvent("onXLE",function(){
			document.getElementById(var_obj.onxl_id).style.display="none";
			if((ths.grid[var_obj.grid_id]).getUserData( "","data") !== ''){
				var session_data = ths.grid[var_obj.grid_id].getUserData( "","session");
				if(session_data==="expire" || session_data ==="disable") ths.session_expire(session_data);
			}
		});			
	};
	/*********************************** DHTMLX GRID FUNCTIONS ********************************/
	Ucr_dhx.prototype.gridLoad = function(grid_id ,query,param){
		//console.log(grid_id);
		param = param || '';
		var ths = this;
		if(this.g_data != null){ param = (param!='') ? param+'&'+this.g_data : this.g_data ;}
		(this.grid[grid_id]).clearAndLoad(query+'?object=grid&'+param,function(e){ 
				var query_data = ths.grid[grid_id].getUserData( "","query");
				if(query_data !='') ths.g_data = query_data.replace(/_/g , "&");
			});	
	}
	/*********************************** DHTMLX WINDOW INITIALIZATION ********************************/
	
	Ucr_dhx.prototype.create_dhx_window = function ( var_obj ){	
		'use strict';		
		if( typeof(var_obj) !== 'object') return 0;	
				
		var_obj = {
			winId: 			var_obj.winId,
			left:			var_obj.left   			|| 0,
			top:			var_obj.top    			|| 0,
			width:			var_obj.width  			|| 0,
			height:			var_obj.height 			|| 0,
			headerText:		var_obj.headerText 		|| '',
			modal:			(var_obj.modal===false)?false: true,
			multiple: 		var_obj.multiple 		|| 'single',
			initialize:		var_obj.initialize 		|| true,
			center:     	(var_obj.center==false && var_obj.center!=undefined)?false: true,
			clear_load: 	var_obj.clear_load 		|| null,
			load_file:      var_obj.load_file		|| null,
			gridId:			var_obj.gridId			|| null,
			attachUrl:		var_obj.attachUrl		|| null,
		}
		
		if( var_obj.multiple == 'single'){
			// destroying main window object and releasing memory
			if(this.wind!=null){
				this.wind.unload(); 
				this.wind= null;  
			}
			this.wind = new dhtmlXWindows({
				image_path	:this.g_imgP,
			});	
			this.wind.setSkin(this.w_skin);	
			
		}
		if(	this.wind== null){ obj.message_show('Windows Object undefined'); return;}			
		this.wind.createWindow({
											id: 	var_obj.winId,
											left: 	var_obj.left,
											top: 	var_obj.top,
											width: 	var_obj.width,
											height: var_obj.height,
											modal:  var_obj.modal,
										 });
		
		var ths = this;
		this.wind.window( var_obj.winId ).setText( var_obj.headerText );
		this.wind.window( var_obj.winId ).button('minmax').hide();
		this.wind.window( var_obj.winId ).centerOnScreen();
		this.wind.window( var_obj.winId ).denyResize();
		if( var_obj.load_file !== null){
			this.wind.window( var_obj.winId ).attachHTMLString('<div style="height:100%; position:relative;" id="inner_'+var_obj.winId+'"></div>');
			this.load_ext_file( '#inner_'+var_obj.winId,var_obj.load_file );	
		}
		else if(var_obj.attachUrl!==null){
			this.wind.window( var_obj.winId ).attachURL(var_obj.attachUrl+'?object=iframe');
		}	
		if( var_obj.clear_load != null){
			this.wind.window( var_obj.winId ).attachEvent('onClose',function(){
														if(ths.easy_pop != null) ths.easy_pop.hide();
														if(var_obj.clear_load!= null && var_obj.gridId != null && ths.winToogle == true){
															ths.gridLoad(var_obj.gridId,var_obj.clear_load)
															
															//ths.grid[var_obj.gridId].clearAndLoad( var_obj.clear_load );
															ths.winToogle =false;
														}
														return true;
													});
		}	
		this.wind.window( var_obj.winId ).attachEvent('onContentLoaded',function(){
			setTimeout(function(){$('.dhxwins_vp_dhx_skyblue div.dhxwin_active div.dhx_cell_wins div.dhx_cell_cont_wins, .dhxwins_vp_dhx_skyblue div.dhxwin_inactive div.dhx_cell_wins div.dhx_cell_cont_wins').css('background','none');
													});	}, 1000);
														
	}	
	/*********************************** DHTMLX TAB BAR INITIALIZATION ********************************/
	Ucr_dhx.prototype.create_dhx_tabar = function( var_obj ){
		'use strict';	
		if( typeof(var_obj) !== 'object') return 0;
		var par_id = var_obj.id;
		var var_obj = {
						id:			var_obj.id+'_tb',
						tab_text:	var_obj.tab_text,
						multi: 		var_obj.multi     || 'single',
						skin:		var_obj.skin      || this.t_skin,    
					  };
		var tab_ids = [];	
		if(var_obj.multi == 'single'){
			if((Object.keys(this.tabb)).length != 0){
				for(var j = 0; j < (Object.keys(this.tabb)).length; j++){
					this.destroy_dhx_object('tabbar',(Object.keys(this.tabb))[j]);
				}
				this.tabb = [];
			}
		}
		var tab_el = '<div style="height:100%;" id="'+var_obj.id+'" ></div>';
		for( var j=0; j< (var_obj.tab_text).length; j++){
			tab_el = tab_el + '<div style="height:100%; padding:10px; overflow:auto; -webkit-box-sizing: border-box;-moz-box-sizing: border-box; box-sizing: border-box; " id="'+var_obj.id+'_'+var_obj.tab_text[j]+'" ></div>';
			tab_ids.push( var_obj.id+'_'+var_obj.tab_text[j] );
		}
		$('#'+par_id).empty().append(tab_el);
		this.tabb[var_obj.id]  = new dhtmlXTabBar(var_obj.id);
		
		this.tabb[var_obj.id] .setSkin(var_obj.skin);
		for( var j=0; j< (var_obj.tab_text).length; j++){
			if( j == 0 ) (this.tabb[var_obj.id]).addTab(var_obj.id+'_'+var_obj.tab_text[j], var_obj.tab_text[j], null, null, true);
			else (this.tabb[var_obj.id]).addTab(var_obj.id+'_'+var_obj.tab_text[j], var_obj.tab_text[j], null, null, false);
			(this.tabb[var_obj.id]).tabs(var_obj.id+'_'+var_obj.tab_text[j]).attachObject(var_obj.id+'_'+var_obj.tab_text[j]);
		}
		return tab_ids;
	}
	/*********************************** DHTMLX RIBBON INITIALIZATION ********************************/
	Ucr_dhx.prototype.create_dhx_ribbon = function( var_obj ){
		if( typeof(var_obj) !== 'object') return 0;
		if(var_obj.multi == 'single'){
			if((Object.keys(this.ribb)).length != 0){
				for(var j = 0; j < (Object.keys(this.ribb)).length; j++){
					this.destroy_dhx_object('ribbon',(Object.keys(this.ribb))[j]);
				}
				this.ribb = [];
			}
		}
		var var_obj = {
						parent:		var_obj.parent,
						icons_path:	var_obj.icon_p,
						tabs: 		var_obj.tabs 
					  };
		this.ribb[var_obj.parent] = new dhtmlXRibbon(var_obj);
		if(this.r_skin!=null) this.ribb[var_obj.parent].setSkin(this.r_skin);
	}
	/*********************************** DHTMLX TOOLBAR INITIALIZATION ********************************/
	Ucr_dhx.prototype.create_dhx_toolbar = function( var_obj ){
		if( typeof(var_obj) !== 'object') return 0;
		if(var_obj.multi == 'single'){
			if((Object.keys(this.tool)).length != 0){
				for(var j = 0; j < (Object.keys(this.tool)).length; j++){
					this.destroy_dhx_object('toolbar',(Object.keys(this.tool))[j]);
				}
				this.tool = [];
			}
		}
		var var_obj = {
						parent:		var_obj.parent,
						icons_path:	var_obj.icon_p,
						xml: 		var_obj.xml,
						skin:		var_obj.hasOwnProperty("skin") || this.tol_skin
					  };
		this.tool[var_obj.parent] = new dhtmlXToolbarObject({
										parent: var_obj.parent,
										icons_path : var_obj.icons_path,
										xml: var_obj.xml
									});	
		this.tool[var_obj.parent].setSkin(var_obj.skin);			
		
	}
/*********************************** DHTMLX CALANDER INITIALIZATION ********************************/
	Ucr_dhx.prototype.create_dhx_calander = function( var_obj ){
		if( typeof(var_obj) !== 'object') return 0;
		var ths = this;
		
		if(var_obj.multi == 'single'){
			
			if((Object.keys(this.clan)).length != 0){
				for(var j = 0; j < (Object.keys(this.clan)).length; j++){
					
					this.destroy_dhx_object('calander',(Object.keys(this.clan))[j]);
				}
				this.clan = [];
			}
		}
		var var_obj = {
						id:			var_obj.id,
						param:	var_obj.param,
						clickEvFunction:var_obj.clickEvFunction,
						time : var_obj.time || 'hide',
						today:var_obj.today || 'show',
						dateformat : var_obj.dateformat	|| "%Y-%m-%d %H:%i:%s"
					  };
		this.clan[var_obj.id] = new dhtmlXCalendarObject(var_obj.param);
		this.clan[var_obj.id].setDateFormat(var_obj.dateformat);
		
		if(var_obj.time=='hide') this.clan[var_obj.id].hideTime();
		if(var_obj.today=='show') this.clan[var_obj.id].showToday();
		if(var_obj.clickEvFunction!=undefined){
			(ths.clan[var_obj.id]).attachEvent("onClick", function(date){
				var_obj.clickEvFunction(var_obj.id,date);
			});
		}
	}
	
	/*********************************** DHTMLX SESSION END ALERT FUNCTION  ********************************/
	Ucr_dhx.prototype.session_expire =  function(type,parent){
		'use strict';	
		var ths = this;
		dhtmlx.alert({
			title : (type=='expire')?"Session Expire !!!":'Account Diable !!!',
			text  : (type=='expire')?"Sorry !!! your session has expired.":'Your Account has been disabled Temporarly',
			callback :function(){
				window.location= ths.l_loc;
			}
		});
		//setTimeout(function(){window.location=ths.l_loc;}, ths.l_time);
	}
	
	/*********************************** DHTMLX SHOWING MESSAGE FUNCTION ********************************/
	Ucr_dhx.prototype.message_show = function( message, type ,cb){
		'use strict';	
		//var type = type || 'error';
		var ths  = this;
		var cb = cb || null;
		if(cb == null)
			dhtmlx.message({ type:type, text:'<p style="font-family:'+ths.m_font+'; font-size:'+ths.m_size+'px;">'+message+'</p>', expire: ths.m_time});
		else
			dhtmlx.message({ type:type,text:'<p style="font-family:'+ths.m_font+'; font-size:'+ths.m_size+'px;">'+message+'</p>',callback:cb});
	};
	/**********************************LOADING EXTERNAL FILE *********************************************/
	Ucr_dhx.prototype.load_ext_file = function( id, file_url ){
		'use strict';	
		var ths = this;
		id = $.trim(id);
		file_url = $.trim(file_url);
		$(id).css('position','relative').empty().append('<div id ="load" style="position:absolute; top:0; z-index:2; left:0; height:100%; width:100%;  background-color:rgba(31,31,31,0.1); "><p style="text-align:center; background-color:white; width:200px; margin:15% auto; padding:3px 10px 3px 10px;" ><img src = "'+ths.l_imgP.src+'" style="height:40px; vertical-align:middle;" />Loading...</p></div><div id="in_cons'+id.substring(1)+'" style="height:100%; width:100%;"></div>');

		$(id+' div#in_cons'+id.substring(1)).css('background-color','transparent').load(file_url+"?object=load",function(e){
			setTimeout(function(){  $(id+' div#load').hide(); }, 500);
		});
		/*$(id+' div#in_cons'+id.substring(1)).css('background-color','white').load(file_url+"?object=load",function(e){
			setTimeout(function(){  $(id+' div#load').hide(); }, 500);
		});*/
		
	};
	/*********************************** DHTMLX AJAX FUNCTION ********************************/
	Ucr_dhx.prototype.dhx_ajax = function(type, url, param ){
		'use strict';	
		var r = null;
		var param = param || null;
		var ths = this;
		window.dhx4.ajax.cache = true;
		if(type=='post'){
			r = (param!=null)?window.dhx4.ajax.postSync(url,param+"&object=ajax&csrf_char_ucr="+this.csrf_tokens):window.dhx4.ajax.postSync(url,"?object=ajax&csrf_char_ucr="+this.csrf_tokens);
		}
		else if(type=='get'){
			r = (param!=null)?window.dhx4.ajax.getSync(url+'?'+param+"&object=ajax"):window.dhx4.ajax.getSync(url+'?'+"object=ajax");
		}
		console.log(r);
		if(r.xmlDoc.responseText==='expire'){
			this.session_expire('expire');
		}
		else if(r.xmlDoc.responseText==='disable'){
			this.session_expire('disable');
		}
		else{
			if(type=='post'){
				if(r.xmlDoc.status == 403){ 
					ths.message_show('** ERROR FOUND : request problem','error');
					//setTimeout(function(){ window.location= ths.r_loc; }, 2000);
					
				}
				try{
					r = JSON.parse(r.xmlDoc.responseText);
				}catch(e){
					ths.message_show('** ERROR FOUND : request problem','error');
					//setTimeout(function(){ window.location= ths.r_loc; }, 2000);
				}
				
				ths.csrf_tokens = r.csrf;
				return r.response;
			}
			else  return r.xmlDoc.responseText;
		}
	};
	/*********************************** DHTMLX TOOLBAR BUTTON VISIBILITY STATE FUNCTION ********************************/
	Ucr_dhx.prototype.showItem_toolBar = function( id,items ){
		'use strict';	
		if(items!==undefined && items.constructor === Array){
			if(!$('#'+id).hasClass('displayOn')){
				$('#'+id).removeClass('displayOff').addClass('displayOn');
			}
			var checkAny = false;
			for( var i=0;i<this.toolbarIdList.length; i++){
				if($.inArray(this.toolbarIdList[i],items)!==-1){
					if(checkAny===false) checkAny= true;
					if(!this.tool[id].isVisible(this.toolbarIdList[i])) this.tool[id].showItem(this.toolbarIdList[i]);
				}
				else{
					if(this.tool[id].isVisible(this.toolbarIdList[i])) this.tool[id].hideItem(this.toolbarIdList[i]);
				}
			}
			if(checkAny === false){
				if(!$('#'+id).hasClass('displayOff')){
					$('#'+id).removeClass('displayOn').addClass('displayOff');
				}
			}
		}
		else{
			if(!$('#'+id).hasClass('displayOff')){
				$('#'+id).removeClass('displayOn').addClass('displayOff');
			}
		}
	};
	/*********************************** DHTMLX TREE INITILIZATION ********************************/
	Ucr_dhx.prototype.dhx_tree = function( var_obj ){
		'use strict';
		if( typeof(var_obj) !== 'object') return 0;
		var ths = this;
		var var_obj = {
						parent:			var_obj.parent 		|| null,
						userDataId:		var_obj.userDataId 	|| null,
						userDataName:	var_obj.userDataName|| null,
						multi:			var_obj.multi 		|| 'single'
					  };
		if(var_obj.multi == 'single'){
			if((Object.keys(this.tree)).length != 0){
				for(var j = 0; j < (Object.keys(this.tree)).length; j++){
					this.destroy_dhx_object('tree',(Object.keys(this.tree))[j]);
				}
				this.tree = [];
			}
		}
	
		if(var_obj.parent==null){
			this.message_show('Error : No Element found for Object initilization','error');
			return;
		}	
		
		this.tree[var_obj.parent] = new dhtmlXTreeObject(var_obj.parent,"100%","100%",0);
		if(this.t_imgP!=='') this.tree[var_obj.parent].setImagePath(this.t_imgP);
		this.tree[var_obj.parent].enableHighlighting(true);	
		this.tree[var_obj.parent].enableSmartXMLParsing(true);
		this.tree[var_obj.parent].setSkin(this.r_skin)
		
	};
	/*********************************** DHTMLX DATA VIEW INITILIZATION ********************************/
	Ucr_dhx.prototype.create_data_view = function( var_obj ){
		'use strict';	
		
		if( typeof(var_obj) !== 'object') return;	
		if(var_obj.container ==undefined) return;
		var main_container = var_obj.container
		var container = var_obj.container+'_view';
		var paging = var_obj.container+'_paging';
		var var_obj = {
				container	: container,
				drag		: (var_obj.drag==undefined)?false:var_obj.drag, 
				select		: (var_obj.select==undefined)?true:var_obj.select,
				type:{
						template:var_obj.template || '',
						height: var_obj.height || '',
					},
				pager:{
						container:paging,
						size:10,
        				group:30
					},
				xml_link:var_obj.xml_link||null
			}
		var multiple =var_obj.multiple || 'single';
		if(multiple == 'single'){
			if( Object.keys(this.data).length!= 0) { 					
				for(var i=0; i<Object.keys(this.data).length; i++){	
					this.destroy_dhx_object('data_view',(Object.keys(this.data))[i]);	
				}	
				this.data = [];			
			}
		}		
		
		var view_el = '<div id="'+container+'" style="width:100% !important; " ></div><div id="'+paging+'" ></div><div class="clear"></div>';
		
		$('#'+main_container).empty().append(view_el);
		this.data[container] = new dhtmlXDataView(var_obj);
		if(var_obj.xml_link!=null){
			this.data[container].load(var_obj.xml_link);
		}
		
	};
	/*********************************** DHTMLX COMBO BUTTON VISIBILITY STATE FUNCTION ********************************/
	Ucr_dhx.prototype.dhx_combo = function( var_obj ){
		'use strict';
		
		if( typeof(var_obj) !== 'object') return 0;
		var ths = this;
		var var_obj = {
						parent: var_obj.parent ,
						width: 	var_obj.width ,
						name: 	var_obj.name ,
						items: 	var_obj.items, 
						multi:	var_obj.multi || 'single',
						html : var_obj.html || false
					  };
		
		if(var_obj.multi == 'single'){
			if((Object.keys(this.comb)).length != 0){
				for(var j = 0; j < (Object.keys(this.comb)).length; j++){
					this.destroy_dhx_object('combo',(Object.keys(this.comb))[j]);
				}
				this.comb = [];
			}
		}
	
		if(var_obj.parent==null){
			this.message_show('Error : No Element found for Object initilization','error');
			return;
		}	
		if(var_obj.html == true ){
			this.comb[var_obj.parent] = dhtmlXComboFromSelect(var_obj.parent);
		}else{
			this.comb[var_obj.parent] =  new dhtmlXCombo({
												parent: var_obj.parent ,
												width: 	var_obj.width ,
												name: 	var_obj.name ,
												items: 	var_obj.items 
											});
										
		}
	};
	/************************** dhtmlx chart initilize****************************/
	
	Ucr_dhx.prototype.dhx_chart = function( var_obj ,multi){
		'use strict';
		if( typeof(var_obj) !== 'object') return 0;
		var ths = this;
		var container= var_obj.container || null;
		var multiple =	multi || 'single'
		if(multiple == 'single'){
			if((Object.keys(this.chrt)).length != 0){
				for(var j = 0; j < (Object.keys(this.chrt)).length; j++){
					this.destroy_dhx_object('chart',(Object.keys(this.chrt))[j]);
				}
				this.chrt = [];
			}
		}
	
		if(container==null){
			this.message_show('Error : No Element found for Object initilization','error');
			return;
		}	
		this.chrt[container]  =  new dhtmlXChart(var_obj);								
		
	};
	Ucr_dhx.prototype.verify_date = function(date){
		if(date.indexOf('-') == -1 ){
			return false;
		}
		var n1 = date.split('-');
		var v = [4,2,2];
		for(i=0; i < 3; i++){
			if(n1[i].length != v[i]){
				return false;
			}
		}
		return true;
	}
	Ucr_dhx.prototype.emiCalculation = function(amount, interest,payemntType,tenure){
		
		if( amount.match(/^[0-9]+$/) == null ){
			obj.message_show('Invalid Loan Amount','error');
			return false;
		}
		if( tenure.match(/^[0-9]+$/) == null ){
			obj.message_show('Invalid tenure','error');
			return false;
		}
		if( interest.match(/^[0-9]+$/) == null ){
			obj.message_show('Invalid Loan Interest','error');
			return false;
		}
		
		var t = payemntType.toLowerCase();
		var n = 0;
		var r = 0;
		if(t=='monthly'){
			n = tenure;
			r = (  parseInt((interest.replace(/%/g, '')).replace(/ /g,''))/ 12 ) * 0.01;
		}
		else if(t=='daily'){
			n = Math.floor(tenure*(280/12));
			r = (  parseInt((interest.replace(/%/g, '')).replace(/ /g,''))/ 280 ) * 0.01;
		}
		else if(t=='weekly'){
			n = Math.floor(tenure*(52/12));
			r = (  parseInt((interest.replace(/%/g, '')).replace(/ /g,''))/ 52 ) * 0.01;
		}
		else{
			obj.message_show('Invalid Repayment Type','error');
			return false;
		}
		return { 
			   		i : Math.ceil( amount * ( ( r *Math.pow(1+r,n))/ (Math.pow(1+r,n)-1  )  )),
					n : n
			   };		
	}
	
	
//	console.log(Ucr_dhx);








	