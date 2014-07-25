/**
 * Copyright jsborn.org [tureki11@gmail.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(window) {

	var _a_j_v = $.fn.jquery.split('.');
	
	var _i_j_v = parseInt(_a_j_v[0],10);

	var _b     = {

		/**
		 * Default config.
		 * @type {Object}
		 */
		config: {
			imports: {
				cache: false,
				path: '',
				parser: {
					"jsborn": ''
				}
			}
		},

		/**
		 * JSBorn data store.
		 * @type {Object}
		 */
		data: {
			cores: {},
			clss: {},
			plugins: {},
			imports: {},
			loads:[]
		},

		/**
		 * JSBorn Object event list.
		 *
		 * log    : dispatch when JSBorn execute error                        
		 * create : dispatch when JSBorn Class Object create.    
		 * destroy: dispatch when JSBorn Class Object destroy.
		 * 
		 * @type {Array}
		 */
		events: [
			"log",
			"create",
			"destroy",
			"classReady"
		],

		/**
		 * Error message list.
		 * @type {Array}
		 */
		errors: [
			"JSB_ERROR_CLASS_DEFINE",
			"JSB_ERROR_CLASS_DESTROY",
			"JSB_ERROR_CLASS_IMPORT",
			"JSB_ERROR_CREATE",
			"JSB_ERROR_EXTEND_CORE",
			"JSB_ERROR_EXTEND_PLUGIN",
			"JSB_ERROR_CLASS_INFINITE_LOOP"
		],

		/**
		 * jQuery event bind/on.
		 * @type {String}
		 */
		on:(_i_j_v===1&&_a_j_v[1]<7)?"bind":"on",

		/**
		 * jQuery event unbind/off.
		 * @type {String}
		 */
		off:(_i_j_v===1&&_a_j_v[1]<7)?"unbind":"off",

		/**
		 * JSBorn status.
		 * @type {String}
		 */
		status: 'ready',

		/**
		 * JSBorn version.
		 * @type {String}
		 */
		version: '0.5.3',

		/**
		 * Registers an event listener with JSBorn Object so that the listener receives notification of an event.
		 *
		 * @example
		 * _b.addEventListener("customEvent",function(e,data){
		 * 	console.log("receive event");
		 * });
		 *
		 * @example
		 * _b.addEventListener("customEvent",function(e,data){
		 * 	console.log(this);
		 * },scope);
		 * 
		 * @param  {String} 		event 	event name
		 * @param  {Function} 		func  	callback function
		 * @param  {Object} 		scope 	scope variable
		 * @return {JSBorn}
		 */
		addEventListener: function(event, func, scope) {

			$(_b)[_b.on]('jsb.' + event, {
				scope: scope
			}, func);

			return _b;

		},

		/**
		 * IS JSBorn Class Object Ready. 
		 * Then done function will be call when all depend files load.
		 * The fail function will be call when depend files have an error.
		 * 
		 * @example
		 * _b.classReady("YourDefineClass",function(){
		 * 	console.log("READY");
		 * },function(){
		 *  console.log("HAVE ERROR");
		 * });
		 * 
		 * @param  {String}   	clsName class name
		 * @param  {Function} 	done    success callback
		 * @param  {Function}   fail  	fail callback
		 * @return {Boolean}          
		 */
		classReady:function(clsName,done,fail) {

			var _obj_status = false;
			
			var _bol_check  = true;
			
			var _obj_cls    =  _b._get_cls(clsName);

			if(_obj_cls){

				_obj_status  =  _obj_cls["status"];

				if(
					_obj_status.extend  !==true
					||
					_obj_status.plugins !==true
					||
					_obj_status.css     !==true
					||
					_obj_status.tpl     !==true
					||
					_obj_status.imports !==true
				)
				{
					_bol_check = false;
				}

				if(_obj_cls.fileRequire<=0&&_bol_check===false){

					if(fail){

						fail.call();

						return false;

					}	

				}

			}else{

				_bol_check = false;

			}

			if(done){
				
				if(_bol_check){

					done.call();

				}else{

					_b._ready(done,fail,clsName);	

				}

				return true;

			}

			return _bol_check;

		},

		/**
		 * Create a JSBorn Class Instance.
		 *
		 * @example
		 * var _cls = _b.create("ClassName");
		 *
		 * @example
		 * //pass a param
		 * var _cls = _b.create("ClassName",{param:"hello world"});
		 *  
		 * @param  {String} 	clsName class name
		 * @param  {Object} 	options construct param
		 * @param  {Boolean} 	trigger dispatch event when create
		 * @return {Object}     class
		 */
		create: function(clsName, options, trigger) {

			var _obj_cls = _b._get_cls(clsName);

			if(!_obj_cls){

				_b._log("error", _b.errors[3], "[Class]:'"+clsName+"' not found.");

				return false;

			}

			if(!_b.classReady(clsName)){

				_b._log("error", _b.errors[3], "[Class]:'"+clsName+"' is not ready");

				return false;

			}

			if (_obj_cls.config.abstr) {

				_b._log("error", _b.errors[3], "[Class]:'"+clsName+"' is an abstract class.");

				return false;

			}

			if (!_obj_cls.config.nodes) {

				_obj_cls.config.nodes = [];

			}

			if (_obj_cls.config.single && _obj_cls.config.nodes.length > 0) {

				_b._log("error", _b.errors[3], "[Class]:'"+clsName+"' is define as singleton.");

				return false;

			}

			var _cls = new _obj_cls["cls"](options);

			_obj_cls.config.nodes.push(_cls);

			if (trigger) {

				$(_b).triggerHandler('jsb.'+_b.events[1], _cls);

			}

			return _cls;

		},

		/**
		 * Define a JSBorn Class.
		 * 
		 * @example
		 * _b.define("className", {
		 * 	initialize: function(options) {
		 * 	}
		 * });
		 * 
		 * @example
		 * _b.define("className", {
		 * 	hello:function(){
		 * 		console.log("hello world");
		 * 	},
		 * 	initialize: function(options) {
		 * 	}
		 * });
		 * 
		 * @param  {String} clsName class name
		 * @param  {Object} cls     class prototype
		 * @return {Object}         class config or false
		 */
		define:function(clsName, cls) {

			if (_b._get_cls(clsName)) {

				_b._log("warning", _b.errors[0], "[Class]:'" + clsName + "' define again.");

				return false;

			}

			_b.status = "progress";
			//JSBorn class construct
			var _jsb_cls = function(misc_opt) {

				cls.plugins = cls.plugins ? cls.plugins : [];

				this.__classname = clsName;

				this.__plugins = $.extend([],this.plugins,cls.plugins);

				this.__extend = [];

				this.__count = 0;

				this.__destroy = false;
				//class extend super
				this._extend(this);
				//class plugin create
				this._plugin();
				//class initialize
				this.initialize(misc_opt);

				this.SUPER();

				delete this.__count;

				return true;

			};

			if(cls.tpl){
				cls.tpl = $.isArray(cls.tpl)?cls.tpl:[cls.tpl];	
			}
			
			if(cls.css){
				cls.css = $.isArray(cls.css)?cls.css:[cls.css];	
			}

			//Class config
			_b.data.clss[clsName] = {
				cls: _jsb_cls,
				config: {
					name: clsName,
					single: cls.single ? true : false,
					abstr: cls.abstr ? true : false
				},
				ready:false,
				fileRequire:0,
				fileLoad:0,
				extend:cls.extend?cls.extend:false,
				plugins:cls.plugins?cls.plugins.slice():[],
				status:{
					extend:cls.extend?[cls.extend]:true,
					plugins:cls.plugins?cls.plugins.slice():true,
					css:cls.css?cls.css.slice():true,
					tpl:cls.tpl?cls.tpl.slice():true,
					imports:cls.imports?cls.imports.slice():true
				}
			};
			//class require file count
			_b._file_require_count(clsName);
			//extend JSBorn class prototype
			$.extend(_jsb_cls.prototype, _b.define.prototype, cls);
			//is class on async load? if on loading then check class status.
			if(_b.getImportData()[clsName]){

				_b._cls_status_dispatch(clsName);

			}

			var i;
			//check class imports file
			if (cls.imports) {

				for (i = 0; i < cls.imports.length; i++) {

					_b._parser_imports(clsName,cls.imports[i]);

				}

			}
			//check class extend file
			if (cls.extend) {

				if(!_b._cls_infinite("extend",cls.extend,clsName)){

					_b._log("error",_b.errors[6], "[Extend]: '"+clsName+"' infinite loop extend.");

					_b._cls_status_set(clsName,'fail', cls.extend);

				}else{

					_b._parser_extend(_jsb_cls,cls,clsName,cls.extend);	

				}

			}
			//check class plugin file
			if (cls.plugins) {

				for (i = 0; i < cls.plugins.length; i++) {
					
					var _plug = cls.plugins[i];

					if(!_b._cls_infinite("plugins",_plug,clsName)){

						_b._log("error",_b.errors[6], "[Plugin]: '"+clsName+"' infinite loop.");

						_b._cls_status_set(clsName,'fail', _plug);
						
					}else{

						_b._parser_plugin(clsName,_plug);

					}

				}

			}
			//check class template file
			if (cls.tpl) {

				for (i = 0; i < cls.tpl.length; i++) {

					_b._parser_tpl(clsName,cls.tpl[i]);

				}

			}
			//check class css file
			if (cls.css) {

				for (i = 0; i < cls.css.length; i++) {

					_b._parser_css(clsName,cls.css[i]);

				}

			}

			if(!_b.getImportData()[clsName]){
				//class status check 
				setTimeout(function() {
					_b._cls_status_dispatch(clsName);
				}, 1);

			}
			
			return _b._get_cls(clsName);

		},

		/**
		 * Dispatches an event into JSBorn Object event flow.
		 *
		 * @example
		 * _b.dispatchEvent("customEvent", {data:"hello world"});
		 * 
		 * @param  {String} event event name
		 * @param  {Object} data  dispatch data
		 * @return {JSBorn}
		 */
		dispatchEvent: function(event, data) {

			$(_b).triggerHandler('jsb.' + event, [data]);

			return _b;

		},

		/**
		 * Get JSBorn Class Config.
		 * 
		 * @param  {String} clsName class name
		 * @return {Object}         class config or false
		 */
		getClassData: function(clsName) {

			if(clsName){

				return _b._get_cls(clsName);

			}

			return _b.data.clss;

		},

		/**
		 * Get XHR async Import Data.
		 * 
		 * @param  {String} clsName class name
		 * @return {Object}         import data or false
		 */
		getImportData: function(clsName) {

			if(clsName){

				return _b.data.imports[clsName];

			}

			return _b.data.imports;

		},
		
		/**
		 * Dynamic Import JSBorn Class.
		 *
		 * @example
		 * _b.importClass("my/Class",function(){
		 * 	console.log("Success");
		 * },function(){
		 * 	console.log("Fail");
		 * });
		 * 
		 * @example
		 * _b.importClass([
		 * 	"my/Class",
		 * 	"my/ClassOther",
		 * 	],
		 * function(){
		 * 	console.log("Success");
		 * },
		 * function(){
		 * 	console.log("Fail");
		 * });
		 * 
		 * @param  {Array/String}   imports import files
		 * @param  {Function} 		done    success callback
		 * @param  {Function}   	fail    fail callback
		 * @return {JSBorn}           
		 */
		importClass: function(imports,done,fail) {

			var _ary_import = $.isArray(imports)?imports:[imports]; 

			var _ary_xhr = [];

			for (var i = 0; i < _ary_import.length; i++) {
				
				if(_b.data.imports[_ary_import[i]]){

					continue;

				}

				_ary_xhr.push(_b._xhr(_ary_import[i]));

			}

			if(_ary_xhr.length>0){

				$.when.apply( $, _ary_xhr ).then(function(){

					if($.isFunction(done)){

						done.call();

					}

				},function(e){

					if($.isFunction(fail)){

						fail.call();

					}

					_b._log("error", _b.errors[2],"[Import] error:'"+e.statusText+"' text:" + e.responseText);

				});	

			}else{

				if($.isFunction(done)){

					done.call();

				}

			}

		},
		
		/**
		 * All JSBorn Class file require and ready.
		 *
		 * @example
		 * _b.ready(function(){
		 * 	console.log("ALL CLASS READY");
		 * });
		 * 
		 * @param  {Function} 	done success callback
		 * @param  {Function}   fail fail callback
		 * @return {Void}        
		 */
		ready:function(done,fail) {

			_b._ready(done,fail,"ready");

		},

		/**
		 * Register JSBorn Class Object to a global variable.
		 *
		 * @example
		 * _b.registerGlobal("my.app",_b.define("YourClass",function(){
		 * 	initialize: function(options) {
		 * 	
		 * 	}
		 * }));
		 * console.log(window.my.app);
		 * console.log(my.app);
		 * 
		 * @param  {String} ns  namespace
		 * @param  {Object} cls JSBorn Class Object
		 * @return {Void}        
		 */
		registerGlobal: function(ns, cls) {

			var _ary_ns = ns.split('.');

			var _str_name = cls.config.name;

			if (_b.data.cores[ns]) {

				_b._log("info", _b.errors[4], "[Global]: namespace '" + ns + "' already register.");

				return false;

			}

			cls["config"] = $.extend(cls["config"], {
				single: true,
				abstr: false
			});

			for (var i = 0; i < _ary_ns.length; i++) {

				var obj = obj ? obj : window;

				if (i < _ary_ns.length - 1) {

					if ($.isEmptyObject(obj[_ary_ns[i]])) {

						obj[_ary_ns[i]] = {};

					}

					obj = obj[_ary_ns[i]];

				} else {

					obj[_ary_ns[i]] = _b.create(_str_name,{},false);

					_b.data.cores[ns] = obj[_ary_ns[i]];

					return obj[_ary_ns[i]];

				}

			}

		},

		/**
		 * Register JSBorn Class Object to be a Plugin Class.
		 *
		 * @example
		 * _b.registerPlugin("customPlugin",_b.define("classPlugin", {
		 * 	initialize: function(options) {
		 * 	}
		 * }));
		 *
		 * _b.define("class",function(){
		 * 	plugins:["classPlugin"],
		 * 	initialize: function(options) {
		 * 		console.log(this.customPlugin);
		 *  }
		 * }));
		 * 
		 * @param  {String} ns  namespace
		 * @param  {Object} cls JSBorn Class Object
		 * @return {Void}
		 */
		registerPlugin: function(ns, cls) {

			var _str_name = cls.config.name;

			var _obj_plug = _b.data.plugins;

			for(var key in _obj_plug){

				if(_obj_plug[key]["name"]===ns){

					_b._log("error", _b.errors[5], "[Plugin]: namespace '" + ns + "' define again.");

					return false;

				}

			}

			if (_b._get_plugin(_str_name)) {

				_b._log("warning", _b.errors[5], "[Plugin]: '" + cls + "' already register in another namespace.");

				return _b._get_plugin(_str_name);

			}

			_b.data.plugins[_str_name] = {
				name: ns,
				cls: cls["cls"]
			};

			return _b.data.plugins[_str_name];

		},

		/**
		 * Removes a listener from the JSBorn object.
		 *
		 * @example
		 * _b.removeEventListener("customEvent",FUNCTION);
		 * 
		 * @param  {String} 	event event namme
		 * @param  {Function} 	func  callback function
		 * @return {JSBorn}       
		 */
		removeEventListener: function(event,func) {

			$(_b)[_b.off]('jsb.' + event,func);

			return _b;

		},

		/**
		 * Setting JSBorn Global Config.
		 *
		 * @example
		 * _b.setConfig({
		 * 	imports:{
		 * 		"path":"cdn.example.com"
		 * 	}
		 * });
		 * 
		 * @param 	{Object} config JSBorn option
		 * @return 	{JSBorn} 
		 */
		setConfig: function(config) {

			_b.config = $.extend(true, _b.config, config);

			return _b;

		},

		_cls_infinite:function(type,extend,clsName) {

			var _obj_cls = _b._get_cls(extend);

			if(!_obj_cls){

				return true;

			}else{
				
				if(_obj_cls[type]){

					var _ary_check = $.isArray(_obj_cls[type])?_obj_cls[type]:[_obj_cls[type]];

					for (var i = 0; i < _ary_check.length; i++) {

						if(_ary_check[i]===clsName){

							return false;

						}else{

							if(!_b._cls_infinite(type,_ary_check[i],clsName)){	

								return false;

							}

						}
					}
					
				}

			}
			
			return true;			

		},

		_cls_is_last:function(clsName) {

			if(_b.data.imports[clsName]){

				var _ary_load = _b.data.loads;

				for (var i = _ary_load.length-1; i >= 0; i--) {
					
					var name = _ary_load[i];

					if(name===clsName){

						return true;

					}else{

						var _obj_import = _b.data.imports[name];

						if(_obj_import["status"]!=="success"){

							return false;

						}

					}

				}

			}

			return false;

		},

		_cls_status_check:function(clsName,type) {

			var _str_name,_obj_import;

			var _obj_status = _b._get_cls(clsName)["status"][type];

			if(_obj_status!==true){
				
				for (i = 0; i < _obj_status.length; i++) {
					
					_str_name = _obj_status[i];

					_obj_import = _b.data.imports[_str_name];

					if(_obj_import&&_obj_import["status"]==="success"){

						_b._cls_status_update(clsName,type,_str_name);

						_b._file_require_decrease(clsName);

						_b._cls_status_dispatch(clsName);

					}

				}

			}

		},

		_cls_status_dispatch:function(clsName) {

			var _bol_check = true;

			if(_b.classReady(clsName)){

				var _bol_ready = _b._get_cls(clsName)["ready"];

				if(!_bol_ready){

					_b._get_cls(clsName)["ready"] = true;

					_b.dispatchEvent(clsName,clsName);

					_b.dispatchEvent(_b.events[3],clsName);
					
				}

			}else{

				var _int_file = _b._get_cls(clsName)["fileRequire"];

				if(_int_file===0){
					
					_b.dispatchEvent(clsName+"::Error");

				}else{

					if(_b._cls_is_last(clsName)){

						_b._cls_status_check(clsName,"imports");

						_b._cls_status_check(clsName,"plugins");

						_b._cls_status_check(clsName,"extend");

					}

				}

			}

			$.each(_b.getClassData(), function(i, e) {
				
				if(!_b.classReady(i)&&!e.ready){

					_bol_check = false;

				}					
							
			});

			if(_bol_check){

				_b.status = 'complete';

				_b.dispatchEvent('ready');

			}else{
				
				if(_b._file_all_load()){

					_b.status = 'fail';

					_b.dispatchEvent('ready::Error');

				}

			}

		},
		
		_cls_status_set:function(clsName,type,value) {

			if(type!=="fail"){

				_b._cls_status_update(clsName,type,value);

			}else{

				_b.dispatchEvent(value+"::Error");

			}

			_b._file_require_decrease(clsName);

			_b._cls_status_dispatch(clsName);

		},

		_cls_status_update:function(clsName,type,value) {

			var _ary_file = _b._get_cls(clsName)["status"][type];

			for (var i = 0; i < _ary_file.length; i++) {

				if(_ary_file[i]===value){

					_ary_file.splice(i,1);

					break;

				}

			}

			if(_ary_file.length>0){

				_b._get_cls(clsName)["status"][type] = _ary_file;

			}else{

				_b._get_cls(clsName)["status"][type] = true;
				
			}

		},
		
		_file_all_load:function(){

			var _bol_check = true;

			$.each(_b.getClassData(), function(i, e) {
								
				if(e.fileRequire > 0){

					_bol_check = false;

				}					
							
			});

			return _bol_check;

		},

		_file_require_count:function(name) {

			var _int_count = 0;

			var _obj_cls = _b._get_cls(name);

			for(var key in _obj_cls["status"]){
				
				if($.isArray(_obj_cls["status"][key])){

					_int_count += _obj_cls["status"][key]["length"];

				}

			}

			_obj_cls["fileRequire"] = _int_count;

		},

		_file_require_decrease:function(name) {

			var _obj_cls = _b._get_cls(name);

			_obj_cls["fileRequire"]--;

		},

		_get_cls: function(clsName) {

			if (_b.data.clss[clsName]) {

				return _b.data.clss[clsName];

			} else {

				return false;

			}

		},

		_get_plugin: function(clsName) {

			if (_b.data.plugins[clsName]) {

				return _b.data.plugins[clsName];

			} else {

				return false;

			}

		},

		_init_cls:function() {

			//JSBorn Class Object Prototype
			_b.define.prototype = {

				/**
				 * Invokes the superclass or parent version of a method or constructor
				 */
				SUPER: function() {

					if (this.__extend.length > 0 && this.__count < this.__extend.length) {

						var _str_extend = this.__extend[this.__count];

						if (_str_extend) {

							var _proto_class = _b._get_cls(_str_extend)["cls"].prototype;

							this.__count++;

							_proto_class.initialize.apply(this, arguments);

							if (_proto_class.extend) {

								this.SUPER();

							}

						}

					}

				},

				/**
				 * Registers an event listener with JSBorn Class Object 
				 * so that the listener receives notification of an event.
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * _cls.addEventListener("customEvent",function(e,data){
				 * 	console.log("receive event");
				 * });
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * _cls.addEventListener("customEvent",function(e,data){
				 * 	console.log(this);
				 * },scope);
				 * 
				 * @param  {String} 		event 	event name
				 * @param  {Function} 		func  	callback function
				 * @param  {Object} 		scope 	scope variable
				 * @return {JSBorn Class}
				 */
				addEventListener: function(event, func, scope) {

					$(this)[_b.on]('cls.' + event, {
						scope: scope
					}, func);

					return this;

				},

				/**
				 * Destroy JSBorn Class Object. 
				 * It will dispatch "destroy" event when after destroy. 
				 * Then you can release whatever you want.
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * _cls.addEventListener("destroy",function(){
				 * 	console.log("destroy");
				 * });
				 * _cls.destroy();
				 * 
				 * @return {JSBorn Class}
				 */
				destroy: function() {

					if (this.__destroy) {

						_b._log("error", _b.errors[1],"[Class]:'"+ this.__classname +"' already destroy.");

						return true;

					}

					var _ns_cls = _b._get_cls(this.__classname);

					for (var i = 0; i < _ns_cls.config.nodes.length; i++) {

						if (_ns_cls.config.nodes[i] === this) {

							_ns_cls.config.nodes.splice(i, 1);

						}

					}

					$(this).triggerHandler('cls.'+_b.events[2], this);

					$(_b).triggerHandler('jsb.'+_b.events[2], this);

					this.__destroy = true;

					return this;

				},

				/**
				 * Dispatches an event into JSBorn Class Object event flow.
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * _cls.dispatchEvent("customEvent", {data:"hello world"});
				 * 
				 * @param  {String} event event name
				 * @param  {Object} data  dispatch data
				 * @return {JSBorn Class}
				 */
				dispatchEvent: function(event, data) {

					$(this).triggerHandler('cls.' + event, [this, data]);

					return this;

				},

				/**
				 * Get JSBorn Class CSS element.
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * //get all css element on this class
				 * _cls.getCss();
				 * //get other class css.
				 * _cls.getCss("otherClass");
				 * 
				 * @param  {String} clsName class name.
				 * @return {jQuery Selector}
				 */
				getCss: function(clsName) {

					var _str_name = clsName?clsName:this.__classname;

					return $('head').find('[jsb-css="' + _str_name + '"]');

				},

				/**
				 * Get Class Define Name.
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * console.log(_cls.getName());
				 * 
				 * @return {String}
				 */
				getName: function() {

					return this.__classname;

				},

				/**
				 * Get JSBorn Class template element.
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * //get all template
				 * _cls.getTpl();
				 * //get a template by name
				 * _cls.getTpl("tpl");
				 * //get other class template
				 * _cls.getTpl("tpl","otherClassName");
				 * 
				 * @param  {String} 			tplName template name define in html file.
				 * @param  {String} 			clsName class name.
				 * @return {jQuery Selector}
				 */
				getTpl: function(tplName,clsName) {

					var _str_id   = tplName ? 'script[data-tpl-name="'+tplName+'"]': '';
					
					var _str_name = clsName?clsName:this.__classname;

					return $('head').find(_str_id + '[jsb-tpl="' + _str_name + '"]');

				},

				/**
				 * Removes a listener from the JSBorn Class Object.
				 *
				 * @example
				 * var _cls = _b.create("YourClass");
				 * _cls.removeEventListener("customEvent",FUNCTION);
				 * 
				 * @param  {String} 	event event namme
				 * @param  {Function} 	func  callback function
				 * @return {JSBorn Class}       
				 */
				removeEventListener: function(event) {

					$(this)[_b.off]('cls.' + event);

					return this;

				},

				_plugin: function() {

					var _ary_plugin = [];

					$.each(this.__plugins, function(i, e) {
						//filter same name plugin
						if ($.inArray(e, _ary_plugin) === -1 && _b.__classname !== e) {

							_ary_plugin.push(e);

						}

					});

					if ($.isArray(_ary_plugin)) {

						for (var i = 0; i < _ary_plugin.length; i++) {

							var _obj_plug = _b._get_plugin(_ary_plugin[i]);

							this[_obj_plug.name] = _b.create(_ary_plugin[i], this,false);

						}

					}

				},

				_extend: function(misc_scope) {

					var _str_extend = misc_scope.extend;

					if (_str_extend) {

						this.__extend.push(misc_scope.extend);

						var _ns_cls = _b._get_cls(_str_extend)["cls"];

						if (_ns_cls.prototype) {

							this._extend(_ns_cls.prototype);

						}

					}

				}

			};

		},

		_log: function(type,message,detail) {

			_b.dispatchEvent(_b.events[0],{
				type:type,
				message:message,
				detail:detail}
			);

		},

		_parser_callback:function(fileName,done,fail) {

			var _obj_import_status = _b.data.imports[fileName];

			if(!_b._get_cls(fileName) && !_obj_import_status){

				_b.importClass(fileName,function(){

					_b.classReady(fileName,function(){

						done.call();

					},function(){

						fail.call();

					});

				},function(){

					fail.call();

				});

			}else{

				_b.classReady(fileName,function(){

					done.call();

				},function(){

					fail.call();

				});	

			}

		},

		_parser_imports: function(clsName,fileName) {

			_b._parser_callback(fileName,function(){

				_b._cls_status_set(clsName,'imports',fileName);

			},function(){

				_b._cls_status_set(clsName,'fail', fileName);

			});

		},

		_parser_extend: function(jsborn,cls,clsName,fileName) {

			_b._parser_callback(fileName,function(){

				$.extend(
					jsborn.prototype,
					_b.define.prototype,
					_b._get_cls(fileName)["cls"].prototype,
					cls
				);

				_b._cls_status_set(clsName,'extend',fileName);

			},function(){

				_b._cls_status_set(clsName,'fail', fileName);

			});

		},

		_parser_plugin: function(clsName,fileName) {

			_b._parser_callback(fileName,function(){

				_b._cls_status_set(clsName,'plugins',fileName);

			},function(){

				_b._cls_status_set(clsName,'fail', fileName);

			});

		},

		_parser_css: function(clsName,fileName) {

			$.ajax({
				type: "GET",
				cache:false,
				dataType:'text',
				url: _b._parser_url(fileName)
			})
			.done(function(data){

				var _el_style = document.createElement("style");

				$(_el_style)
					.attr("type", "text/css")
					.attr('jsb-css', clsName);
				//Fixed IE 8 or below
				if (_el_style.styleSheet) {

					_el_style.styleSheet.cssText = data;

				} else {

					_el_style.innerHTML = data;

				}

				$(_el_style).appendTo('head');

				_b._cls_status_set(clsName,'css',fileName);

			})
			.fail(function(){

				_b._cls_status_set(clsName,'fail',fileName);

			});
			
		},

		_parser_tpl: function(clsName,fileName) {

			$.ajax({
				type: "GET",
				cache:false,
				dataType: "html",
				url: _b._parser_url(fileName)
			})
			.done(function(data){

				var _ary_el = $(data);

				_ary_el.attr('jsb-tpl', clsName);

				_ary_el.appendTo('head');

				_b._cls_status_set(clsName,'tpl',fileName);

			})
			.fail(function(){

				_b._cls_status_set(clsName,'fail',fileName);				

			});

		},

		_parser_url: function(url, ext) {

			var _obj_config = _b.config.imports;

			var _str_url = '';

			var _str_path = _obj_config.path;

			var _misc;

			if (!$.isEmptyObject(_obj_config.parser)) {

				var num_str_len = 0;

				for (var key in _obj_config.parser) {

					if (url.match(new RegExp('^' + key, 'g'))) {

						if (key.length > num_str_len) {

							_misc       = _obj_config.parser[key];
							
							_str_path   = _misc.path ? _misc.path : _misc;
							
							num_str_len = key.length;

						}

					}

				}

			}

			_str_url = _str_path + url + (ext ? ext : '');

			if (_misc && $.isFunction(_misc.parser)) {

				_str_url = _misc.parser.call(_misc,_str_url);

			}

			return _str_url;

		},

		_ready:function(done,fail,event) {

			if(event==="ready"&&_b.status==="complete"){

				done.call();

				return true;

			}

			var _func = function(){

				_b.removeEventListener(event,_func);

				_b.removeEventListener(event+"::Error",_err_func);

				if($.isFunction(done)){

					done.call();

				}
				
			};

			var _err_func = function(){

				_b.removeEventListener(event,_func);

				_b.removeEventListener(event+"::Error",_err_func);
				
				if($.isFunction(fail)){

					fail.call();

				}
				
			};

			_b.addEventListener(event,_func);

			_b.addEventListener(event+"::Error",_err_func);

		},

		_xhr:function(clsName) {

			_str_url = _b._parser_url(clsName, '.js');

			_b.data.imports[clsName] = {
				status: 'progress'
			};

			_b.data.loads.push(clsName);

			return $.ajax({

				url: _str_url,

				dataType: "script",

				cache: _b.config.imports.cache

			}).done(function(){

				_b.data.imports[clsName]["status"] = "success";

			}).fail(function(jqXHR, textStatus, errorThrown){

				_b.data.imports[clsName]["status"] = "fail";

				_b._log("error", _b.errors[2],"[XHR]:file:'" + _str_url + "' import error. [Message]:" + errorThrown);

			});

		}

	};

	_b._init_cls();

	window._b     = _b;
	
	window.JSBorn = _b;

})(window);