/*!
 * Damo JavaScript Library v0.0.1
 * http://www.oceanvirtuel.com/damo
 * Author Herve Le Cornec, hcl@oceanvirtuel.com
 * Copyright 2016 Herve Le Cornec
 * Released under the GPL license
 * http://www.gnu.org/licenses/gpl.html
 *
 * Requires jquery.js
 * Copyright 2005, 2016 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Sat, 01 May 2017 01:11:54 +0200
 */


//Damo's structure _____________________________________________________
/** 
 *
 * This is the global Damo's namespace. Each property/method that has to
 * be created in Damo must be a property/method of the object <span class="mycode">damo</span>.
 * 
 *
 * @namespace damo
 * 
 **/
 var damo = {
	/**
	 * @memberOf damo
     * @namespace dm
	 * @description
	 * This member of damo is intended to host the datamodel of the
	 * application. 
	 * 
	 */
	dm 			: {},
	/**
	 * @memberOf damo
     * @namespace fn
	 * @description
	 * This member of damo is intended to host the functions that will
	 * be used in the application.
	 * 
	 */
	fn 			: {},
	/**
	 * @memberOf damo
     * @namespace routing
	 * @description
	 * This member of damo describes the routing of the application :
	 * each page has its own url description, template, controller and
	 * login obligation.
	 * 
	 */
	routing		: {},
	/**
	 * @memberOf damo
     * @namespace directive
	 * @description
	 * This member of damo describes the directives used in the
	 * application : each directive has a name and a template.
	 * 
	 */
	directive 	: {},
	/**
	 * @memberOf damo
     * @namespace filter
	 * @description
	 * This member of damo contains the filter functions that can be
	 * used by the application, for instance in the HTML tags.
	 * 
	 */
	filter 		: {},
	/**
	 * @memberOf damo
     * @namespace method
	 * @description
	 * This member of damo contains the fundamental functions of damo.
	 * It should not be modified by the developper, unless Damo could
	 * break.
	 * 
	 */
	method		: {},
	/**
	 * @memberOf damo
     * @namespace config
     * @type object
	 * @description
	 * This member of damo sets some useful configuration parameters
	 * used by Damo.
	 * 
	 */
	config		: {
		/**
		 * @property {integer} securityBreak
		 * @type integer
		 * @memberOf damo.config
 		 * @description
		 * Damo uses some "while true" loops. This property ensures that
		 * these loops can not get out of control. All these kind of
		 * loops will break after securityBreak iteretions, if not
		 * broken before.
		 * 
		 */
		securityBreak 	: 10,
		/**
		 * @property {integer} switchPageDelay
		 * @type milliseconds
		 * @memberOf damo.config
		 * @description
		 * This parameter set the delay that damo will apply to animate
		 * a page change.
		 * 
		 */
		switchPageDelay : 300,
		/**
		 * @property {integer} showHideDelay
		 * @type milliseconds
		 * @memberOf damo.config
		 * @description
		 * This parameter set the delay that damo will apply to animate
		 * the show/hide of an HTML element.
		 * 
		 */
		showHideDelay 	: 200
	}
};

//Two-way data binding _________________________________________________
/**
 * @memberOf damo.method
 * @method twoWayDataBinding
 * @description
 * This method implements the two-way data binding of Damo. Any HTML
 * change is encapsulated inside a code that will simultaneously modify
 * the corresponding branch of the datamodel. 
 * 
 */
damo.method.twoWayDataBinding = function() {

	jQuery.each(['change'], function( i, name ) {
		jQuery.fn[ name ] = function( data, fn ) {
			var param, str, func;		
			if(data) {
				str 	= data.toString().replace(/\n/g, '###kk###');
				param 	= str.replace(/^function *\(([^\)]+)\) *\{.*$/i,'$1');
				if(param==str) {
					param = false;
				}
				else {
					param = param.replace(/###kk###/g, "\n");
				}				
				func 	= str	.replace(/^function[^\{]+\{/i,'')
								.replace(/\} *$/g, '')
								.replace(/###kk###/g, "\n");
				/**
				 * @comment
				 * Here is the order to modify simultaneously the
				 * datamodel
				 */
				str = "\ndamo.method.setSingleValue($(this));\n"+func+";\ndamoRefresh();";				
				if(param) {
					data = new Function (param , 'e', str);
				}
				else {
					data = new Function ('e',str);
				}
			}
			return arguments.length > 0 ?
				this.on( name, null, data, fn) :
				this.trigger( name );
		};
	});	
	/**
	 * @comment
	 * We start by giving an empty change function to the input,
	 * textarea and select. This empty change function will then be
	 * encapsulated by the above code
	 */
	$('input').change(function() { });
	$('textarea').change(function() { });
	$('select').change(function() {});
};

/**
 * @method trySearch
 * @memberOf damo.method
 * @param {string} expr The datamodel element as a string.
 * @description
 * This method enables to find the value of an element of the datamodel,
 * given the path of this element as a string.
 * 
 * @example
 * The search for the string "user.info.userName" will return the value
 * of damo.dm.user.info.userName
 * 
 */
damo.method.trySearch = function(expr) {
	var res;
	if(!expr) {
		return;
	}
	try {
		res = eval('damo.dm.'+expr);
		isNaN(res);
	}
	catch(err) {
	}
	/**
	 * @comment
	 * if 'damo.dm.'+expr has not been found, a serach is performed for
	 * expr alone.
	 */
	if(!res) {
		try {
			if(res!==0) {
				res = eval(expr);
			}
		}
		catch(err) {
		}	
	}
	return res;
}

//Set dm value from a given damo-id ___________________________________
/**
 * @method setSingleValue
 * @memberOf damo.method
 * @param {jqueryElement} el 	The jquery element which value has to be
 * 								set accordingly to its 'damo-id' attribute.
 * @description
 * This method enables to set the value of a DOM element accordingly to
 * its damo-id attribute, which shall correspond to a branch of the
 * datamodel.
 * 
 * @example
 * The DOM element <input damo-id="user.info.userName"> will take the
 * value damo.dm.user.info.userName.
 * 
 */
damo.method.setSingleValue = function(el) {
	var type, id, list, val,i, res;
	type 	= el.prop('type');
	id 		= el.attr('damo-id');
	if(!id) {
		return;
	}
	/**
	 * @comment
	 * The inputs checkbox and radio must be treated as particular cases.
	 */
	if(type=='checkbox') {
		val = el.attr('damo-id').replace(/^(.*)\.[^\.]+$/, '$1.checked');
		try {
			eval('damo.dm.'+val+' = el.is(":checked")');
			damo.method.SetDomValues();
		}
		catch(err) {
			try {
				eval(val+' = el.is(":checked")');
				damo.method.SetDomValues();
			}
			catch(err) {
			}
		}	
	}
	else if(type=='radio') {
		val 	= el.attr('damo-id').replace(/^(.*)\.[^\.]+$/, '$1.checked');
		list = damo.method.trySearch(el.attr('name'));
		if(list) {
			for(i=0;i<list.length;i++) {
				list[i].checked = false;
			}
			damo.method.trySearch(val+'=true');
		}
	}
	/**
	 * @comment
	 * All other inputs, text area and select are treated identically.
	 */
	else {
		try {
			eval('damo.dm.'+id+' = el.val()');
			damo.method.SetDomValues();
		}
		catch(err) {
			try {
				eval(id+' = el.val()');
				damo.method.SetDomValues();
			}
			catch(err) {
			}
		}
	}
};

//get value in datamodel _______________________________________________
/**
 * @method getValue
 * @memberOf damo.method
 * @param {string} item 	a string describing the path of the element
 * to retrieve from the datamodel
 * 
 * @description
 * This method retrieve the value of an element of the datamodel, given its path
 * 
 * @example
 * firstname = damo.method.getValue('user.info.firstName');
 * 
 */
damo.method.getValue = function(item) {

	var type, val;
	type 	= $('[damo-id="'+item+'"]').prop('type');
	if(type=='checkbox') {
		val = item.replace(/^(.*)\.[^\.]+$/, '$1')+'.checked';
		return damo.method.trySearch(val);		
	}
	else if(type=='radio') {		
		val = item.replace(/^(.*)\.[^\.]+$/, '$1')+'.checked';
		return damo.method.trySearch(val);		
	}
	else {
		return damo.method.trySearch(item);		
	}
};

//antislash string _____________________________________________________
/**
 * @method addSlashes
 * @memberOf damo.method
 * @param {string} str 	a string that has to be slashed
 * 
 * @description
 * This method returns a given string with appropriate slashes to be used in the regular expressions
 *
 * @return a string with special characters slashed
 */
damo.method.addSlashes = function(str) {
	return str	.replace(/\[/g, '\\[')
				.replace(/\]/g, '\\]')
				.replace(/\-/g, '\\-')
				.replace(/\./g, '\\.')
};

//build routing ________________________________________________________
damo.method.buildRouting = function() {
	var key, home, homeKey;
	for(key in damo.routing) {
		if(damo.routing[key].template=='index.html') {
			home 	= damo.routing[key].url;
			homeKey = key;
			window.location.href = window.location.href.replace(/#.*$/, '')+'#!'+key;
			damo.routing.current = {
				name 	: key,
				url 	: home,
				oldUrl 	: home
			}
			break;
		}	
	}
	for(key in damo.routing) {
		if(damo.routing[key].template=='index.html') {
			continue;
		}
		$('body').append('<damo-page url="'+damo.routing[key].url+'" style="width:100%;padding:0;margin:0"></damo-page>');
	}
	return true;
};


/**
 * @function damoGo
 * @param {string} page 	a string containing the url to reach
 * 
 * @description
 * This function redirects the user to the corresponding page, as described in damo.routing.
 */
damoGo = function(page) {
	var key, el, params=null, arr2, arr3, obj = {}, i;

	var newHref = window.location.href.replace(/#.*$/, '')+'#!'+page;
		
	var arr = page.split('?');
	var url = arr[0];
	if(url!=page) {
		params 	= arr[1];
		arr2 = params.split('&');
		for(i=0;i<arr2.length;i++) {
			arr3 = arr2[i].split('=');
			obj[arr3[0]] = arr3[1];
		}
	}
	page = url;

	damo.routing.current = {
		name 	: page,
		url 	: damo.routing[page].url,
		param	: obj,
		oldUrl 	: damo.routing.current.url
	}

	//avoid flashy reload
	if(damo.routing.current.url==damo.routing.current.oldUrl) {
		return;
	}

	$.when(
		$('damo-page').slideUp(damo.config.switchPageDelay, function() {})
	).then(function() {
		if(!$('damo-page[url="'+page+'"]').html()) {

			$.get(damo.routing[page].template,function(data) {
				damo.routing[page].template = data;
				el = $('damo-page[url="'+page+'"]');
				el.html(data);
				damo.method.build(el);
				damo.routing.current = { name : key, url : damo.routing[page].url , params : obj}
				try {
					eval(damo.routing[page].controller)
				}
				catch(err) {
				}
		
				damo.method.setLang($('damo-page[url="'+page+'"]'));
				if(window.location.href!==newHref) {
					window.location.href = newHref;
				}

			});
		}
		else {			
			if(damo.routing[page].needLogin && !damo.dm.logged) {
				setTimeout(function(){
					damoGo('home');
				},200);
				return false;
			}
			
			if(window.location.href!=newHref) {
				window.location.href = newHref;
			}
		}
		$('damo-page[url="'+page+'"]').slideDown(damo.config.switchPageDelay, function() {});
		damoRefresh();
	});

};


//Build directives _____________________________________________________
/**
 * @method feedDirectives
 * @memberOf damo.method
 * 
 * @description
 * This method builds the object damo.routing from the file js/routing.js.
 *
 */
damo.method.feedDirectives = function() {
	var def = {}, key;
	for(key in damo.directive) {
		def[key] = new $.Deferred();
		if(damo.directive[key].html && damo.directive[key].html!='') {
			continue;
		}
		if(damo.directive[key].templateUrl && damo.directive[key].templateUrl!='') {
			$.ajax({
				type: "GET",
				async: false,
				url: damo.directive[key].templateUrl ,
				success: function(data) {
					damo.directive[key].html = data
					def[key].resolve();
				},
				error: function() {
					console.log('error, "'+key+'" directive template not found'); 
				}
			});
		}
	}
	return def[key].promise();
};

/**
 * @method BuildDirectives
 * @memberOf damo.method
 * 
 * @description
 * This method replaces in the DOM the tag with attribute "damo-seed" by the template of the directive.
 *
 */
damo.method.BuildDirectives = function(scope) {
	if(!$('[damo-seed]').length) {
		return;
	}

	var scope = $('body');
	damo.method.feedDirectives().done(function() {
		var N=0, el, seed, ref, str, elems, reg,fn;

		while(true) {
			N++;
			if(N>damo.config.securityBreak) {
				break;
			}
			elems = scope.find('[damo-seed]');
			if(!elems.length) {
				break;
			}
			for(i=0;i<elems.length;i++) {				
				el = $(elems[i]);
				seed = damo.directive[el.attr('damo-seed')];
				if(!seed || !seed.html) {
					continue;
				}
				ref = el.attr('damo-ref');
				str = seed.html;
				if(ref) {
					reg = new RegExp('damo\-ref','g');
					str = seed.html.replace(reg, ref);
				}					
				el.replaceWith(
					'<damo-seeding="'+el.attr('damo-seed')+'">'+
					str+
					'</damo-seeding>'
				);					
				if(seed.controller) {
					fn = window[seed.controller];
					if (typeof fn === "function") {
						fn();
						damo.method.setTriggers();
					}
					
				}
			}	
		}	
		damo.method.SetDomValues(scope);
	});
};

//Build loops __________________________________________________________
/**
 * @method BuildSingleLoop
 * @memberOf damo.method
 * 
 * @description
 * This method replaces in the DOM the tag with attribute "damo-loop" by the corresponding list of the datamodel.
 *
 * @param {jqueryElement} elem the JQuery element with attribute "damo-loop"
 */
damo.method.BuildSingleLoop = function(elem) {
	var reg, item, listName, str, list, el, looping, newEl, arr;
	//get the var name and the list name
	str = elem.attr('damo-loop');
	if(str) {
		item = str.replace(/^ *([^ ]+) .*$/,'$1');
		listName = str.replace(/^.* ([^ ]+) *$/,'$1');
	}
	else { return; }
	list = damo.method.trySearch(listName);

	if(list && (list.length || list.length===0) ) {

		//set the data
		el 	= elem[0].outerHTML;					
		str	='';
		var N = list.length===0 ? 1 : list.length;
		for(j=0;j<N;j++) {

			looping = $(el).attr('damo-loop');
			newEl 	= $(el).removeAttr('damo-loop');
			tagName = newEl.prop('tagName').toLowerCase();
			if(j==0) {
				newEl.attr('damo-looping-start',looping);
			}
			if(j==N-1) {
				newEl.attr('damo-looping-end',looping);
			}
			if(tagName=='option') {
				reg = new RegExp(damo.method.addSlashes(item)+'(\.?)','g');					
				newEl.attr(
					'damo-opt-text',
					newEl.html().replace(reg, listName+'['+j+']$1')
				);
				newEl.attr(
					'damo-opt-val',
					newEl.val().replace(reg, listName+'['+j+']$1')
				);
			}
			//find and impact child ids ------------------------
			newEl.find('[damo-id^="'+item+'."]').each(function() {
				var reg;
				reg = new RegExp('^'+damo.method.addSlashes(item)+'\.','g');						
				$(this).attr(
					'damo-id',
					$(this)	.attr('damo-id')
							.replace(reg, listName+'['+j+'].')
				);
				
			});
			newEl.find('[damo-if*="'+item+'."]').each(function() {
				var reg;
				reg = new RegExp(damo.method.addSlashes(item)+'\.','g');						
				$(this).attr(
					'damo-if',
					$(this)	.attr('damo-if')
							.replace(reg, listName+'['+j+'].')
				);
				
			});
			//impact value -------------------------------------
			if(newEl.attr('value')) {
				arr = 	newEl.attr('value').split('.');
				if(arr[0]==item) {
					newEl.attr(
						'value',
						newEl	.attr('value')
								.replace(reg, listName+'['+j+'].')
					);
					
				}
			}	
			//impact displays {{}} -----------------------------
			reg = new RegExp('\{\{'+item+'(\.[^\}]+)?\}\}','g');
			newEl.html(
				newEl.html().replace(reg, '\{\{'+listName+'['+j+']$1\}\}')
			);
			//find and impact child loops ----------------------
			newEl.find('[damo-loop*=" '+item+'"]').each(function() {
				$(this).attr(
					'damo-loop',
					$(this)	.attr('damo-loop')
							.replace(' '+item, ' '+listName+'['+j+']')
				);
			});
											
			str += newEl[0].outerHTML.replace(/\$index/ig, j)+'\n';

			
		}
		elem.replaceWith(str);

	}
};
/**
 * @method BuildLoops
 * @memberOf damo.method
 * 
 * @description
 * This method builds all the loops of a scope
 *
 * @param {jqueryElement} scope the JQuery scope element
 */
damo.method.BuildLoops = function(scope) {
	if(!$('[damo-loop]').length) {
		return;
	}
	var N=0, reg, elem;
	if(!scope) {
		var scope = $('body');
	}
	while(true) {
		//security break;
		N++;
		if(N>damo.config.securityBreak) {
			break;
		}
		scope.find('[damo-loop]').each(function() {
			damo.method.BuildSingleLoop($(this));
		});
	}
	
};
/**
 * @method renewLoop
 * @memberOf damo.method
 * 
 * @description
 * This method updates a loop. It is useful for damoRefresh().
 *
 * @param {string} str The value of the attribute "damo-loop"
 */
damo.method.renewLoop = function(str) {
	var item, listName, list;
	if(str) {
		item 		= str.replace(/^ *([^ ]+) .*$/,'$1');
		listName 	= str.replace(/^.* ([^ ]+) *$/,'$1');
	}
	else {
		return '';
	}
	
	try {
		list = eval('damo.dm.'+listName);
	}
	catch(err) {
		return '';
	}

	$('[damo-looping-start="'+str+'"]').each(function() {

		var el = $(this);
		var N = 0;
		while(!el.attr('damo-looping-end')) {
			el = el.next();			
			N++;
		}		
		if(list.length==N+1) {
			if(el.css('display')=='none') {
				el.css('display', 'block');
			}
			return;
		}	
		if(list.length==0){			

			if(el.css('display')=='none') {
				return;
			}
			while(N>0) {
				prev = el.prev();
				prev.attr('damo-looping-end', el.attr('damo-looping-end'));
				el.remove();
				el = prev;
				N--;
			}
			el.hide();
		}
		else if(list.length<N+1){			

			while(list.length!=N+1) {
				prev = el.prev();
				prev.attr('damo-looping-end', el.attr('damo-looping-end'));
				el.remove();
				el = prev;
				N--;
			}
		}
 		else if(list.length>N+1){
			while(list.length!=N+1) {
				var clone 	= el.clone(true,true);
				var str 	= 	clone[0].outerHTML;		
				str = str	.replace(/\\n/g, '')
							.replace(/_([0-9]+)\"/g, '_'+(N+1)+'"')
							.replace(/\[([0-9]+)\]/g, '['+(N+1)+']')
							.replace(/\(([0-9]+)\)/g, '('+(N+1)+')')
							+'\n';
				clone = $(str);
				/*
				clone.find('[damo-id]').each(function() {
					var oldid = $(this).attr('damo-id');
					var reg = new RegExp(damo.method.addSlashes(listName)+'\[[0-9]+\]','g');
					var newid = oldid.replace(reg, listName+'['+(N+1)+']');
					$(this).attr('damo-id',newid);
				});*/		
				el.after(clone);
				newEl = el.next();
				newEl.attr('damo-looping-end',el.attr('damo-looping-end'));
				el.removeAttr('damo-looping-end');
				if(newEl.attr('damo-looping-start')) {
					newEl.removeAttr('damo-looping-start');
				}
				newEl.show();
				el=el.next();
				N++;
			}
		}
		
	});
	
	damo.method.setTriggers();
	damo.method.SetDomValues();
	
};

//fill the dom with the values _________________________________________
/**
 * @method SetDomValues
 * @memberOf damo.method
 * 
 * @description
 * This method sets all the tags with an attribute "damo-id", with the corresponding value of the datamodel
 *
 * @param {jqueryElement} scope The JQuery scope element
 */
damo.method.SetDomValues = function(scope) {
	var item, tagName, type, value, scope, filter, fn;
	if(!scope) {
		scope = $('body');
	}

	scope.find('[value*="{{"]').each(function() {
		var value = damo.method.trySearch($(this).val().replace(/\{/g, '').replace(/\}/g, ''));
		if(value) {
			$(this).val(value);
		}
	});
	
	scope.find('[damo-trigger*="{{"]').each(function() {
		var reg = new RegExp('^.*\{\{([^\}]+)\}\}.*$', 'g');
		var arr = $(this).attr('damo-trigger').match(reg);
		
		var item = $(this).attr('damo-trigger').replace(/^.*\{\{([^\}]+)\}\}.*$/, '$1');
		var value 	= damo.method.getValue(item);

		if(value) {
			reg = new RegExp('\{\{'+damo.method.addSlashes(item)+'\}\}');
			var newval = $(this).attr('damo-trigger').replace(reg, value);
			$(this).attr('damo-trigger',newval );
		}
	});
	
	scope.find('[damo-id]').each(function() {
		item 	= $(this).attr('damo-id');
		tagName = $(this).prop("tagName").toLowerCase();
		value 	= damo.method.getValue(item);
		//apply filters to the value
		filter = $(this).attr('damo-filter');
		if(filter) {
			fn = damo.filter[filter];
			if (typeof fn === "function") {
				value = fn(value);
			}
		}
		try {
			switch(tagName) {
				case 'input' :
					type = $(this).attr('type').toLowerCase();
					switch(type) {
						case 'checkbox' :
							$(this).prop('checked', value);	
						break;
						case 'radio' :
							$(this).prop('checked', value);
						break;
						default : 
							$(this).val(value);
						break;
					}
				break;
				case 'select' :
					$(this).val(String(value));
				break;
				case 'textarea' :
					$(this).val(value);
				break;
				default :
					$(this).html(value);					
				break;
			}
		}
		catch(err) {
		}
	});
	
	scope.find('[damo-data]').each(function() {
		item 	= $(this).attr('damo-data').replace(/\{/g, '').replace(/\}/g, '');
		var value = damo.method.trySearch(item);
		if(value) {
			$(this).attr('damo-data', value)
		}
	});
	

		
	//special case for options that can't include a span with damo-id
	$('option').each(function() {
		var N, value, reg, reg2, item, txt;
		txt = $(this).attr('damo-opt-text');
		value = damo.method.getValue($(this).attr('damo-opt-val'));		
		if(value) {
			$(this).attr('value', value);
			$(this).html(txt);
			reg = new RegExp('.*\{\{([^\}]+)\}\}.*');
			N	= 0;
			while(true) {
				N++;
				//security break
				if(N>damo.config.securityBreak) {
					break;
				}
				item = $(this).html().replace(reg, '$1');
				if($(this).html()==item) {
					break;
				}
				reg2 = new RegExp('\{\{'+damo.method.addSlashes(item)+'\}\}','g');
				value = damo.method.getValue(item);
				$(this).html(
					$(this).html().replace(reg2, value)
				);
			}			
		}
	});
};

/**
 * @method setConditions
 * @memberOf damo.method
 * 
 * @description
 * This method parses the DOM to setup the "damo-if" conditions
 *
 */
damo.method.setConditions = function() {
	$('[damo-if]').each(function() {
		var item, res, reg, a, op, b,not='';
		item = $(this).attr('damo-if');

		if(item.match(/^!/)) {
			item =item.replace(/!/, '');
			not = '!';
		}
		
		try {
			res = eval(not+item);
		}
		catch(err) {
			try {
				res = eval(not+'damo.dm.'+item);
			}
			catch(err) {
				reg = new RegExp(/^([^=!<>]+) *([=!<>]+) *([^=!<>]+)$/);
				a 	= item.replace(reg, '$1');
				op 	= item.replace(reg, '$2');
				b 	= item.replace(reg, '$2');					
				try {
					res = eval('damo.dm.'+a+op+'damo.dm.'+b);
				}
				catch(err) {
					try {
						res = eval('damo.dm.'+a+op+b);
					}
					catch(err) {
						try {
							res = eval(a+op+'damo.dm.'+b);
						}
						catch(err) {
						}
					}						
				}
			}
		}		

		if($(this).attr('display') && $(this).attr('display')!='none') {
			$(this).data('initDisplay',$(this).attr('display') );
		}
		
		if(res) {			
			$(this).show(damo.config.showHideDelay);
			if($(this).data('initDisplay')) {
				$(this).css('display', $(this).data('initDisplay'));
			}
		}
		else {			
			$(this).hide(damo.config.showHideDelay);
		}	
	});
};

//Set triggers _________________________________________________________
/**
 * @method setTriggers
 * @memberOf damo.method
 * 
 * @description
 * This method sets all the triggers associated with the tags with an attribute "damo-triger"
 *
 */
damo.method.setTriggers = function() {
	$('[damo-trigger]').each(function() {
		var fn;
		fn = $(this).attr('damo-trigger');

		$(this).off('mousedown');
		$(this).off('click');

		$(this).mousedown(function() {
			try {
				eval('damo.fn.'+fn+'()');		
			}
			catch(err) {
				try {
					eval(fn+'()');
				}
				catch(err) {
					try {
						eval('damo.'+fn+'()');	
					}
					catch(err) {
					}
				}
			}
		});
		
	});
}

//Set the language______________________________________________________
/**
 * @method getLang
 * @memberOf damo.method
 * 
 * @description
 * This method feeds the object "damo.dm.lang" with content of the file "js/myLang.json".
 *
 * @param {jqueryElement} scope The concerned JQuery scope element
 */
damo.method.getLang = function(scope) {
	if(!scope) {
		scope = $('body');
	}
	var ul = navigator.language;
	$.get('lang/'+ul+'.json', function(data) {
		damo.dm.lang = data;
	}).done(function() {//success
		damo.method.setLang(scope);
	}).fail(function() {//fail
		console.log('Language is "'+ul+'". Corresponding JSON was not found in /lang directory.');
		damo.dm.lang = {};
	});
	
}
/**
 * @method setLang
 * @memberOf damo.method
 * 
 * @description
 * This method feeds tags with an attribute "damo-lang" of a whole scope, with its value found in the file "js/myLang.json"
 *
 * @param {jqueryElement} scope The concerned JQuery scope element
 */
damo.method.setLang = function(scope) {
	
	scope.find('[damo-lang]').each(function() {
		if(!$(this).html()) {
			$(this).html(damo.dm.lang[$(this).attr('damo-lang')]);
		}
	});
	var elems = ['placeholder','value'];
	for(var i=0;i<elems.length;i++) {
		scope.find('['+elems[i]+'^="{{lang"]').each(function() {
			if(!$(this).html()) {
				var item = $(this).attr(elems[i]);
				var str = item.replace(/[\{\}]/g, '').replace(/lang\./, '');
				$(this).attr(elems[i],damo.dm.lang[str]);
			}
		});
	}
	
}


//Build the application ________________________________________________
/**
 * @method build
 * @memberOf damo.method
 * 
 * @description
 * This method build the entire application scope at the start.
 *
 * @param {jqueryElement} scope The concerned JQuery scope element
 */
damo.method.build = function(scope) {
	damo.method.BuildDirectives();
	damo.method.BuildLoops(scope);
	if(scope) {

		fn = window[damo.routing[damo.routing.current.name].controller];
		if (typeof fn === "function") {
			fn();
		}
	}
	setTimeout(function() {
		damo.method.setConditions();
		damo.method.setTriggers();
		damo.method.twoWayDataBinding();
		damo.method.SetDomValues(scope);
		damo.method.getLang();
		damoRefresh();
	},damo.config.switchPageDelay);
	
	
};

$( document ).ready(function() {
	$.get('data/datamodel.json', function(data) {
		damo.dm = data
	})
	.done(function() {
		var scope, fn;		
		damo.method.buildRouting();
		scope = $('damo-page[url="'+damo.routing.current.url+'"]');		
		damo.method.build(scope);
	}).fail(function(error) {

		if(!damo.routing.home) {
			console.log('No default damo.routing.home has been found, creating one');
			damo.routing = {
				home : {
					url 		: '/home',
					template 	: 'index.html',
					controller  : 'controller_home'
				}
			}

			damo.method.buildRouting();			
			damo.routing.current = {
				name 	: 'home',
				url 	: damo.routing.home.url,
				oldUrl 	: damo.routing.home.url
			}
		}

		damo.method.buildRouting();
		scope = $('damo-page[url="'+damo.routing.current.url+'"]');		
		damo.method.build(scope);
	});

	$(window).on('hashchange', function(e){
		//XXXXXX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//expression à complexifier pour des urls complexes
		//XXXXXX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		setTimeout(function() {
		var page = window.location.hash.replace(/^#!/, '');			
			damoGo(page);		
		},300);
	});
});

//Refreshes the whole dom ______________________________________________
/**
 * @function damoRefresh
 * 
 * @description
 * This function refreshes all the DOM from the javascript.
 *
 */
damoRefresh = function() {

	if($('[damo-loop]').length) {
		damo.method.BuildLoops();
		damo.method.SetDomValues();		
		damo.method.setConditions();
		damo.method.setTriggers();
	}
	if($('[damo-seed]').length) {
		damo.method.BuildDirectives();
		damo.method.SetDomValues();
		fn = window[damo.routing[damo.routing.current.name].controller];
		if (typeof fn === "function") fn();
		damo.method.setConditions();
		damo.method.setTriggers();
	}
	for(var i=0; i<2; i++) {		
		$('[damo-looping-start]').each(function() {
			damo.method.renewLoop($(this).attr('damo-looping-start'));
		});
	}
	damo.method.SetDomValues();
	damo.method.setConditions();

};

//Export data model facility ___________________________________________
damoExport = function() {
	var d = new Date();
	var exp = {
		id			: 'app',
		title 		: "Extract",
		description : "Data Model",
		date 		: d.toUTCString(),
		dataModel 	: damo.dm
	}
	var a = document.createElement('a');
	a.href        = 'data:attachment/text,' + encodeURI(JSON.stringify(exp, null, 4));
	a.target      = '_blank';
	a.download    = 'export.json';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

