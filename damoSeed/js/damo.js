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
 * Date: Sat, 16 Apr 2016 01:11:54 +0200
 */



/** 
 *
 * This is the global Damo's namespace. Each variable or function that has to
 * be created must be a property/method of the scope <span class="mycode">$scp</span>.
 * As a convention the core properties and methods of Damo are prefixed
 * with a <span class="mycode">$</span>. At the contrary, the user's functions or variables shall still be a
 * member of <span class="mycode">$scp</span> but has no need to be prefixed by a <span class="mycode">$</span>.
 *
 * @example
 * 
 * //Damo's datamodel
 * $scp.$dm = myJson;
 * //Damo's internal function
 * $scp.$updateView = function() { ...}
 * 
 * //user's variable
 * $scp.myNiceVariable = 123;
 * //user's function
 * $scp.myAwsomeFunction = function() {
 *     console.log('hello');
 * };
 * 
 *
 * @namespace
 * 
 **/
var $scp 	= {
	/**
	 * Object recording the current route state of damo.
	 *
	 * @extend $scp
	 * 
	 * @example
	 *
  $route : {
    last    : '/',
    current : '/infos',
    next    : null
  }
	 *
	 * 
	 **/ 
	$route : {
		last		: null,
		current		: null,
		next		: null
	},

	
	/**
	 * Array that record the possible routes available to damo.
	 *
	 * @extend $scp
	 *
	 @example
$scp.$routing = [
  {
    url     : '/',
    template   : 'index.html'
  },
  {
    url     : '/infos',
    template   : 'page2.html'
  }
];
	 * 
	 **/ 
	$routing 	: [],

	
	/**
	 * Object that record the available filters for damo. Each filter
	 * is a function that returns the result of the filtering.
	 *
	 * @extend $scp
	 *
	 @example
$scp.$filter.formatInt = function(num) {
	return parseInt(num);
};
	 * 
	 **/ 
	$filter 	: {},

	
	/**
	 * Object that record the available directives for damo. Its members are : <ul>
	 * <li><span class="mycode">seed</span> : the name of the root data model of the directive</li>
	 * <li><span class="mycode">template : the path to the directive's template</li>
	 * </ul>
	 *
	 * @extend $scp
	 *
	 @example
$scp.$directive.myDirective =  {
  seed 		: 'book',
  template 	: 'templates/myTemplate.html'
};
...
//html template 'templates/myTemplate.html'
<div class="myStyle">
  <span id="book.price"></span>
</div>
	 * 
	 **/
	$directive 	: {},

	
	/**
	 * Object for the basic configuration of Damo.
	 *
	 * Its members are :<ul>
	 * <li><span class="mycode">damperDelay</span> : bigger the app, higher it is</li>
	 * <li><span class="mycode">sliderDelay</span> : delay for hide/show</li>
	 * <li><span class="mycode">loaderDelay</span> : initial loading delay, bigger the app, higher it is</li>
	 * <li><span class="mycode">iterationBreak</span> : need to be increased when there are many nested levels of directives and loops</li>
	 * <li><span class="mycode">DirectiveDepth</span> : need to be increased when there are many nested levels of directives</li>
	 * </ul>
	 *
	 * @extend $scp
	 * 
	 **/
	$config 	: {		
	  damperDelay      	: 10,
	  sliderDelay       : 200,
	  loaderDelay		: 100,
	  iterationBreak 	: 10,
	  DirectiveDepth	: 3
	},

	
	/** 
	 *
	 * The variable where the data model (dm) is stored. It is mandatory and
	 * must be defined at the start of the script.
	 * 
	 * @example
	 * 
   var myJsonDataModel = {
    name : 'My Library',
    books : [
      {
        title : 'Document no 1',
        booked : 1,
        pages : 265,
        history : [
          { date : '2015-10-01' },
          { date : '2015-08-12' },
          { date : '2015-02-07' },
        ]
      },
      {
        title : 'Document no 2',
        booked : 0,
        pages : 308,
        history : [
          { date : '2016-03-02' },
          { date : '2016-02-12' },
          { date : '2016-01-15' },
        ]
      }
    ]
   }
	 * $scp.$dm = myJsonDataModel;
	 *
	 * @extend $scp
	 * 
	 */
	$dm : {}
};


/** 
 *
 * the main lib
 *
 * @constructor
 * 
 */
(function(){


	/** 
	 * The jQuery <span class="mycode">change()</span> function is modify to add an update of the
	 * data model <span class="mycode">$scp.$dm</span>, in order to act when a select,
	 * input and textarea are changed.
	 *
	 **/
	jQuery.each(['change'], function( i, name ) {
		jQuery.fn[ name ] = function( data, fn ) {
			if(data) {
				data = new Function (
					data.toString()
					.replace(/\}$/," });")
					.replace(/^function[^{]+{/i,
						"function$1{"+
							"$.when("+
								"$scp.$setObjProperty($scp.$dm,$(this).attr('id'),$(this).val())"+
							").done(function(){")
					.replace(/^function[^{]+{/i,"") 
				);
			}
			return arguments.length > 0 ?
				this.on( name, null, data, fn) :
				this.trigger( name );
		};
	});
		


	/** 
	 *
	 * Set a property, located by its json path, to a value inside an object.
	 *
	 * @extend $scp
	 * @param {object} obj is the whole object in which the property must be set
	 * @param {string} path is the object path of the branche where the property must be set
	 * @param {string} newValue the new value to set up for the property
	 * 
	 */
	$scp.$setObjProperty = function(obj,path,newValue) {
		def = $.Deferred();

		var key, newPath, res;
		if($.isArray(newValue)) return;
		newValue = String(newValue);
		if(!obj || !path || !newValue) {
			def.resolve();
			return def.promise();
		}
		var elem = $('[id="'+path+'"]');

		if(elem.prop('tagName').match(/textarea/i)) {
			newValue = newValue.replace(/\n/, '\\n');
		}

		if(elem.attr('type') && elem.attr('type').match(/checkbox/)) {
			if(elem.is(":checked")) {
				res = 'true';
			}
			else {
				res = 'false';
			}
			try {
				oldValue = eval('$scp.$dm.'+path);
				eval('$scp.$dm.'+path+'='+res+';');
			}
			catch(err) {
				try {
					oldValue = eval('$scp.'+path);
					eval('$scp.'+path+'='+res+';');
				}
				catch(err) {
				}
			}
			if(String(oldValue)!=String(newValue)) {
				$scp.$updateView();
				def.resolve();
				return def.promise();
			}
		}
		else {
			if(newValue=='true' || newValue=='false' || newValue=='null' || newValue.match(/^[0-9\.]+$/)) {
				if(newValue.match(/^[0-9\.]+$/)) 	newValue = parseFloat(newValue);
				else if(newValue.match(/^[0-9]+$/)) newValue = parseInt(newValue);
				try {
					oldValue = eval('$scp.'+path);
					res = eval('$scp.'+path+'='+newValue+';');
					if(String(oldValue)!=String(newValue)) {
						$scp.$updateView();
						def.resolve();
						return def.promise();
					}
				}
				catch(err) {
					try {
						oldValue = eval('$scp.$dm.'+path);
						eval('$scp.$dm.'+path+'='+newValue+';');
						if(String(oldValue)!=String(newValue)) {
							$scp.$updateView();
							def.resolve();
							return def.promise();
						}
					}
					catch(err) {
					}
				}

			}
			else {
				try {
					oldValue = eval('$scp.'+path);
					eval('$scp.'+path+'="'+newValue+'";');
					if(String(oldValue)!=String(newValue)) {
						$scp.$updateView();
						def.resolve();
						return def.promise();
					}
				}
				catch(err) {
					try {
						oldValue = eval('$scp.$dm.'+path);
						eval('$scp.$dm.'+path+'="'+newValue+'";');
						if(String(oldValue)!=String(newValue)) {
							$scp.$updateView();
								def.resolve();
								return def.promise();
							}
					}
					catch(err) {
					}
				}
			}
		}
	};


	/** 
	 *
	 * Parse the available directives to set them up if necessary.
	 *
	 * @extend $scp
	 * @param {object} scope on which the directive parsing takes place.
	 * This is a jquery object.
	 * 
	 */
	$scp.$buildDirectives = function() {
		def_directive = $.Deferred();
		var key,elem,str,seed,def;
		
		var scope = $('body');			

		for(key in $scp.$directive) break;
		if(!key) {
			def_directive.resolve();
		}

		for(key in $scp.$directive) {
			items = scope.find(key);
			if(items.length) {
				$.get($scp.$directive[key].template, function(data) {
					for(i=0;i<items.length;i++) {
						base 	= data;
						seed 	= $(items[i]).attr('damo-seed')+'\.';
						reg 	= new RegExp($scp.$directive[key].seed+'\.','g');
						base 	= base.replace(reg,seed);
						$(items[i]).replaceWith(base);						
					}
				});	
			}
		}
		
		setTimeout(function() {
			def_directive.resolve();
		},$scp.$config.damperDelay);
		
		
		return def_directive.promise();
	};


	/** 
	 *
	 * Update the loops of the application if needed. If an array that
	 * displays as a loop is modified, it is necessary to rebuild the
	 * loop with the correct elements of the array.
	 *
	 * @extend $scp
	 * 
	 */
	$scp.$updateLoops = function() {
		var n,i,j,scope,template,loop,listName,newName,varName,list,total,mem,str,reg,reg2,def;

		def_updateloop = $.Deferred();		
		scope = $('body');
		for(j=0;j<$scp.$config.DirectiveDepth;j++) {

		var previous = false;
			scope.find('[damo-startloop]').each(function() {
								
				if($(this).is(previous)) {
					previous = $(this);
					return true;
				}
				else previous = $(this);
				
				//if($(this)
				len 		= parseInt($(this).attr('damo-length'));
				tag 		= $(this).prop('tagName').toLowerCase();
				elem 		= $(this);
				loop 		= $(this).attr('damo-startloop');
				varName 	= loop.replace(/^ *([^ ]+) *in.*$/, '$1');
				listName 	= loop.replace(/^.*in *([^ ]+) *$/, '$1');
				template 	= $(this).prop('outerHTML');
				list 	 	= $scp.$seekData(false,listName);
				if(list) 	diff = list.length-len;
				else 		diff =0;
				if(diff) {
					if(tag=='option') {
						sel = elem.next();
						elem2 = sel.children().first();
						if(diff>0) {	//add
							if(len===0) {
								len=1;
								elem2.show();
							}
							for(i=0;i<len-1;i++) {
								elem2 = elem2.next();
							}
							for(i=0;i<diff;i++) {
								reg = new RegExp($scp.$rxFormat(varName+'.'),'g');
								str = template.replace(reg, listName+'['+(len+i)+']\.');
								str = str.replace(/\[\[/g, '\{\{').replace(/\]\]/g, '\}\}');
								elem2.after(str);
								elem2 = elem2.next();
								elem2.removeAttr('damo-startloop').removeAttr('damo-length').show();
							}
						}
						else {			//remove
							diff = -diff;
							sel = elem.next();
							elem2 = sel.children().first();
							for(i=0;i<len-1;i++) {
								elem2 = elem2.next();
							}
							for(i=0;i<diff;i++) {
								inter = elem2.prev();
								elem2.remove();
								elem2 = inter;
							}
						}		
					}
					else {
						if(diff>0) {	//add
							for(i=0;i<len;i++) {
								elem = elem.next();
							}
							for(i=0;i<diff;i++) {
								reg = new RegExp($scp.$rxFormat(varName+'.'),'g');
								str = template.replace(reg, listName+'['+(len+i)+']\.');
								str = str.replace(/\[\[/g, '\{\{').replace(/\]\]/g, '\}\}');
								elem.after(str);
								elem = elem.next();
								elem.removeAttr('damo-startloop').removeAttr('damo-length').show();
							}
						}
						else {			//remove

							diff = -diff;
							elem 	= $(this);
							for(i=0;i<len;i++) {
								elem = elem.next();
							}
							for(i=0;i<diff;i++) {
								inter = elem.prev();
								elem.remove();
								elem = inter;
							}
						}
					}
					$(this).attr('damo-length', list.length);
				}
			});
		}
		def_updateloop.resolve();
		return def_updateloop.promise();
	};


	
	/** 
	 *
	 * Seek for the value of a property in the data model
	 * <span class="mycode">$scp.$dm</span>, filtered if necessary.
	 *
	 * @extend $scp
	 * @param {string} filter  The name of the filter that must be used.
	 * @param {string} param The string that describe the position of the
	 *                 data in the data model, e.g. <span class="mycode">shop.stage[3].books[1].price</span>
	 * @return {mixed} the filtered value 
	 * 
	 */
	$scp.$seekData = function(filter,param) {
		val = false;
		if(filter) {
			try {
				val = eval('$scp.$filter.'+filter+'($scp.'+param+')');
				if(!val || val==='undefined') {
					try {
						val = eval('$scp.$filter.'+filter+'($scp.$dm.'+param+')');
					}
					catch(err) {
					}
				}
			}
			catch(err) {
				try {
					val = eval('$scp.$filter.'+filter+'($scp.$dm.'+param+')');
				}
				catch(err) {
				}
			}					
		}
		else {
			try {
				val = eval('$scp.'+param);
				if(!val || val==='undefined') {
					try {
						val = eval('$scp.$dm.'+param);
					}
					catch(err) {
					}					
				}
			}
			catch(err) {
				try {
					val = eval('$scp.$dm.'+param);
				}
				catch(err) {
				}
			}
		}
		return val;
	};
	
	/** 
	 *
	 * Function used during the build of the first view. It launches
	 * <span class="mycode">$scp.$setDmValues(true)</span> that will
	 * set the values of the html tags with the values of the data model,
	 * but also ("true" argument) set up the two-way binding for the
	 * input, select and text area.
	 * 
	 * @extend $scp
	 * 
	 */	
	$scp.$buildDmValues = function() {
		def = $.Deferred();
		$.when($scp.$setDmValues(true)).done(function() {		
			def.resolve();
		});
		return def.promise();	
	};

	
	/** 
	 *
	 * Set the values of the html tags select, input and textarea, consistently
	 * with the data model <span class="mycode">$scp.$dm</span>.
	 * The tag's ids must be the the json path of the concerned property :
	 * 
	 * @example
	 * <input id="library.books[0].title">
	 *
	 * @extend $scp
	 * 
	 */
	$scp.$setDmValues = function(withChange) {
		def = $.Deferred();
		scope = $('body');

		if($('body').find('option').filter(':contains("{{")').length) {
			$('body').find('option').filter(':contains("{{")').each(function() {
				text = $(this).text().replace(/\n/g, '');
				reg = new RegExp('^.*\{\{ *([^\}\{ ]+) *\}\}.*$');
				res = text.match(reg);
				if(!res) return;
				val = $scp.$seekData(false,res[1]);
				reg = new RegExp($scp.$rxFormat('{{ *'+res[1]+' *}}'), 'g');
				$(this).text($(this).text().replace(reg,val));
				$(this).val(val);
			});
		}

		//treat id="param" _____________________________________________
		scope.find('[id]').each(function() {
			tag = $(this).prop('tagName').toLowerCase();
			type = $(this).prop('type') ? $(this).prop('type').toLowerCase() : false;
			filter = $(this).attr('damo-filter');
			val = $scp.$seekData(filter,$(this).attr('id'));


			if(typeof val != 'object') {
				
				val = val=='undefined' ? '' : String(val);
				if(tag=='select') {
					if(withChange) {
						$(this).change(function() {}); //option:first
						if(String($(this).val())!='null') $(this).val(val);
						else $(this).val($(this).find('option').first().val());
					}
					else {
						if(String($(this).val())!='null') $(this).val(val);
						else $(this).val($(this).find('option').first().val());
					}
				}
				
				else if(tag=='input' && type=='radio') {
					$(this).filter('[value="'+val+'"]').attr('checked', true);
					if(withChange) $(this).change(function() {});
				}
				else if(tag=='input' && type=='checkbox') {
					scope.find('input[id="'+$(this).attr('id')+'"][type="checkbox"]').each(function() {
						if(val=='true'||val=='0') {
							$(this).attr('checked', true);
						}
						else {
							$(this).attr('checked', false);
						}
						if(withChange) $(this).change(function() {});
					});
				}
				else if(tag=='input'||tag=='textarea') {
					$(this).val(val);
					if(withChange) $(this).change(function() {});
				}
				else {
					$(this).html(val);
				}
				
			}
		}).promise().done(function() {
			def.resolve();
		});
		return def.promise();
	};
	
	/** 
	 *
	 * Search for the html tags having an attribute <span class="mycode">damo-if="condition"</span>,
	 * evaluates its value, i.e. <span class="mycode">condition</span>, hand hide/show the concerned
	 * tag on the html view.
	 * 
	 * @example
	 * <div damo-if="myCondition">
	 * ...
	 * </div>
	 *
	 * @extend $scp
	 * 
	 */
	$scp.$setConditions = function() {
		var res,newcond,newconddm,def;
		def = $.Deferred();

		scope = $('body');
		
		scope.find('[damo-if]').each(function() {
			
			var cond = $(this).attr('damo-if');

			reg = new RegExp('.*([<>\&\|!= ]).*','g');
			var a = cond.replace(/[!&<>=\|]/g,' ').replace(/ +/g, ' ');
			arr = a.split(' ');
			newcond 	= cond;
			newconddm 	= cond;
			for(var i=0; i<arr.length;i++) {
				if(arr[i]!=='') {
					reg = new RegExp(arr[i].replace(/\[/g,'\\\[').replace(/\]/g,'\\\]'));
					newcond 	= newcond.replace(reg,'$scp.'+arr[i]);
					newconddm 	= newconddm.replace(reg,'$scp.$dm.'+arr[i]);
				}
			}
			res = false;
			try {
				res = eval(newcond);
			}
			catch(err) {
				try {
					res = eval(newconddm);
				}
				catch(err) {
				}
			}

			if(res) {
				$(this).slideDown($scp.$config.sliderDelay);
			}
			else {
				$(this).slideUp($scp.$config.sliderDelay);
			}
		}).promise().done(function() {
			def.resolve();
		});
		return def.promise();
		
	};
	/** 
	 *
	 * The form are enclosed inside a tag having an attribute
	 * <span class="mycode">damo-form="submitFuctionName"</span>,
	 * where <span class="mycode">submitFuctionName</span> is a
	 * user function that must be executed when the form is submitted.
	 * In order to be submitted the html template must also have an
	 * element with an attribute
	 * <span class="mycode">damo-formsubmit="submitFuctionName"</span>,
	 * a button for instance.
	 *
	 * When 'damo-formsubmit' is clicked the scope first retrieve all
	 * the key/value contained, and visible, in the form, and store it
	 * in the variable <span class="mycode">$scp.$submitData</span>.
	 * This done, the scope calls the user function
	 * <span class="mycode">$scp.submitFuctionName</span>, where the variable
	 * <span class="mycode">$scp.$submitData</span> is available, and executes it.
	 * 
	 * @example
	 * //html
	 * <div damo-form="myFormSubmit">
	 * 	  ...
	 *    <button damo-formsubmit="myFormSubmit">Submit the form</button> 
	 * </div>
	 *
	 * //code :
	 * $scp.myFormSubmit = function() {
	 *     console.log($scp.$submitData);
	 * }
	 *
	 * @extend $scp
	 * 
	 */
	$scp.$buildForms = function() {
		var key;
		def = $.Deferred();
		scope = $('body');
		scope.find('[damo-submitform]').each(function() {
			$(this).click(function() {
				for(key in $scp.$dm) break;
				var arr = [];
				$('[damo-form="'+$(this).attr('damo-submitform')+'"]')
				.find('[id]:visible')
				.each(function() {
					arr.push({
						item : $(this).attr('id'),
						value : $(this).val()
					});
				});
				$scp.$submitData = arr;
				try {
					eval('$scp.'+$(this).attr('damo-submitform')+'()');
				}
				catch(err) {
				}
			}) ;
		}).promise().done(function() {
			scope.find('[damo-trigger]').each(function() {
				$(this).click(function() {
					try {
						eval('$scp.'+$(this).attr('damo-trigger')+'()');
					}
					catch(err) {
					}
				}) ;
			}).promise().done(function() {
				def.resolve();
			});
		});
		return def.promise();
	};
				
	/** 
	 *
	 * Build the application from a given datamodel, or an url where to
	 * find the data model, and a function (prog) that will be executed
	 * after the first load of the application.
	 *
	 * @param {object|string} obj is the Json data model of your application
	 * @param {object} prog is the script that shall apply to the view once loaded
	 * 
	 * @extend $scp
	**/
	$scp.$Damo = function(obj,prog) {
		def_Damo = new $.Deferred();
		$( document ).ready(function() {
			if(!obj) return;
			
			if(typeof obj=='string') {
				$.get( obj, function(data) {
					$scp.$dm = data;
					return true;
				});

			}
			else {
				$scp.$dm = obj;
			}

			
			
			setTimeout(function() {
				var i,found,index;
				
				//feed afterLoading ______________________________________________
				$scp.$afterLoading = prog ? prog : function(){};

				//set routing __________________________________________________
				if(!$scp.$routing.length) {
					page = window.location.href.replace(/.*\/([^\/]+)(\?.*)?/, '$1');
					$scp.$routing.push({
						url 		: '/',
						template 	: page
					});
				}
				else {
					found = false;
					for(i=0;i<$scp.$routing.length;i++) {
						if($scp.$routing[i].template==='index.html') {
							found = true;
							if(i!==0) {
								index = $scp.$routing[i];
								$scp.$routing.splice(i,1);
								$scp.$routing.unshift(index);
								$scp.$routing.sort();
							}
							break;
						}
					}
					if(!found) {
						$scp.$routing.unshift({
							url 		: '/',
							template 	: 'index.html'
						});
					}
				}
				$scp.$route.current = $scp.$routing[0].url;
				$('[damo-damo="'+$scp.$route.current+'"]').attr('damo-damo','damoPage_'+$scp.$route.current);
				$scp.$concatenePages().done(function() {
					$scp.$buildDirectives().done(function() {
						$scp.$buildLoops().done(function() {
							$scp.$buildDmValues(true).done(function() {
								$scp.$setConditions().done(function() {
									$scp.$buildForms().done(function() {
										setTimeout(function() {
											$scp.$afterLoading();
											def_Damo.resolve();
										},$scp.$config.damperDelay);
									});
								});
							});
						});
					});
				});
			},$scp.$config.loaderDelay);
		});
		return def_Damo.promise();
	};

	/** 
	 *
	 * Concatenation of the different templates declared in the
	 * <span class="mycode">$scp.$routing</span> array, to make a unique
	 * document.
	 * 
	 * @extend $scp
	**/
	$scp.$concatenePages = function() {
		var i;
		def0_concat = new $.Deferred();
		def_concat = [];
		for(i=0;i<$scp.$routing.length-1;i++) {
			def_concat[i] = new $.Deferred();
			$('body').append('<div damo-damo="damoPage_'+$scp.$routing[i+1].url+'"></div>');
			$('[damo-damo="damoPage_'+$scp.$routing[i+1].url+'"]').css('display','none');
			$('[damo-damo="damoPage_'+$scp.$routing[i+1].url+'"]')
				.load($scp.$routing[i+1].template)
				.promise()
				.done(function() {
					def_concat[i].resolve();
				});
		}

		setTimeout(function() {
			def0_concat.resolve();
		},$scp.$config.damperDelay);

		return def0_concat.promise();
	};
	
	/** 
	 *
	 * Function that build the html loops from the given template.
	 *
	 * @extend $scp
	 * 
	 */
	$scp.$buildLoops = function() {
		def_loop = $.Deferred();
		var scope = $('body');

		if(!$('[damo-loop]').length) {
			def_loop.resolve();
		}
		else {		
			k=0;
			while($('[damo-loop]').length) {
				N = $('[damo-loop]').length;
				n = 1;
		
				$('[damo-loop]').each(function() {				
					loop 		= $(this).attr('damo-loop');
					listName 	= loop.replace(/.*in *([^ ]+) *$/, '$1');
					varName 	= loop.replace(/^ *([^ ]+) *in.*$/, '$1');
					list 		= $scp.$seekData(false,listName);
					tag 		= $(this).prop('tagName');
					template 	= $(this).prop('outerHTML');

					template2 = template.replace(/damo\-loop/, 'damo\-startloop').replace(/\{/g, '\[').replace(/\}/g, '\]');
					if(list) {
						if(tag.match(/option/i)) {
							$(this).parent().before(template2);
							$(this).parent().prev().css('display','none').attr('damo-length',list.length);
						}
						else {
							$(this).before(template2);
							$(this).prev().css('display','none').attr('damo-length',list.length);
						}
						base 		= $(this).prop('outerHTML').replace(/\n/g, '##&#gh491#@@');
						base 		= base.replace(/damo\-loop *= *\"[^\"]+\"/,'');
						total = '';
						for(i=0;i<list.length;i++) {
							str = base;
							reg = new RegExp($scp.$rxFormat(varName+'.'),'g');
							str = str.replace(reg,listName+'['+i+']\.');	
							total += str;
						}
						if(total) $(this).replaceWith(total.replace(/##&#gh491#@@/g, "\n"));	
					}
					else {
						if(tag.match(/option/i)) {
							$(this).parent().before(template2);
							$(this).parent().prev().css('display','none').attr('damo-length',0);
						}
						else {
							$(this).before(template2);
							$(this).prev().css('display','none').attr('damo-length',0);
						}
						$(this).remove();
						
					}
					$(this).remove();
					
					n++;
					if(n>N) {
						def_loop.resolve();
					}
				});

				 
				k++;
				if(k>$scp.$config.iterationBreak) break;
			}
		}
		return def_loop.promise();

	};
	
	/** 
	 *
	 * Update the view. Useful when the datamodel <span class="mycode">$scp.$dm</span> has been
	 * changed in the script and you want to see the result on the view.
	 * This update has to be programmatically called, there is no dirty
	 * checking that could call it.
	 * 
	 *
	 * @extend $scp
	 * 
	 */
	$scp.$updateView = function() {		
		var def = $.Deferred();
		setTimeout(function() {
			$.when($scp.$updateLoops())
			.done($scp.$setDmValues())
			.done($scp.$setConditions())
			.done(function() {
				def.resolve();
			});
		},$scp.$config.timeoutShort);
		return def.promise();
	};

	/** 
	 *
	 * Array filter that returns the array with only unique values.
	 *
	 * @example
	 * 
	 * myArray.filter($scp.$ArrayUnique);
	 * 
	 * @extend $scp
	**/
	$scp.$ArrayUnique = function(value, index, self) { 
		return self.indexOf(value) === index;
	};
	
	/** 
	 *
	 * String filter that turns a usual string into a regular expression.
	 *
	 * @param {string} str the string that has to be transformed
	 * @return {string} str formated to take place as a regular expression
	 * @extend $scp
	**/
	$scp.$rxFormat = function(str) {
		if(!str) return str;
		return str
			.replace(/\"/g, '\\"')
			.replace(/\[/g, '\\[')
			.replace(/\]/g, '\\]')
			.replace(/\-/g, '\\-')
			.replace(/\|/g, '\\|')
			.replace(/\./g, '\\.')
			.replace(/\{/g, '\\{')
			.replace(/\}/g, '\\}');
	};
		
})();


/** 
 *
 * Routing part of the library. Here is setup the url in the browser's
 * address bar, as well as the visibility of the required pages. The
 * used convention is the same as the one used in angular.js, e.g.
 * <span class="mycode">/myHost/MyAppli/#/myUrl</span>
 *
**/
$( document ).ready(function() {
	$(window).on('popstate', function(e) {
		var page = String(window.location.href).replace(/.*#(.*)$/, '$1');
		if($('[damo-damo="damoPage_'+page+'"]').length) {
			$scp.$route.last 	= $scp.$route.current;
			$scp.$route.current = page;
			$('[damo-damo="damoPage_'+$scp.$route.last+'"]').hide();
			$scp.$updateView();
			$('[damo-damo="damoPage_'+$scp.$route.current+'"]').show();
		}
	});

	/** 
	 *
	 * Function that set the required page visible, and the others unvisible.
	 *
	 * @param {string} page the name of the page (i.e. routing[x].url)
	 * to be loaded
	 * @extend $scp
	**/
	$scp.$changePage = function(page) {

		var baseUrl = window.location.href.replace(/#.*$/,'');
		for(i=0;i<$scp.$routing.length;i++) {
			if($scp.$routing[i].url===page) {		
				if(!$('[damo-damo="damoPage_'+page+'"]').length) {
					window.location.href = baseUrl+'#'+$scp.$routing[i].url;					
					$('body').append('<div damo-damo="damoPage_'+page+'"></div>');
					$scp.$route.last 	= $scp.$route.current;
					$scp.$route.current = $scp.$routing[i].url;
					$('[damo-damo="damoPage_'+$scp.$route.last+'"]').hide();
					$('[damo-damo="damoPage_'+$scp.$route.current+'"]').load($scp.$routing[i].template);
					$('[damo-damo="damoPage_'+$scp.$route.current+'"]').show();
				}
				else {
					window.location.href = baseUrl+'#'+$scp.$routing[i].url;
					setTimeout(function() {
						$scp.$updateView();
					},$scp.$config.damperDelay);
					$('[damo-damo="damoPage_'+$scp.$route.last+'"]').hide();
					$('[damo-damo="damoPage_'+$scp.$route.current+'"]').show();
				}
				break;
					
			}
		}				
	};
});
