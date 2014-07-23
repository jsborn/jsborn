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

	var _s_e_o = (_i_j_v===1&&_a_j_v[1]<7)?"bind":"on";

	var _s_e_f = (_i_j_v===1&&_a_j_v[1]<7)?"unbind":"off";

	var _b = {

		version: '0.5.3',

		status: 'ready',

		errors: [
			"JSB_ERROR_CLASS_DEFINE",
			"JSB_ERROR_CLASS_DESTROY",
			"JSB_ERROR_CLASS_IMPORT",
			"JSB_ERROR_CREATE",
			"JSB_ERROR_EXTEND_CORE",
			"JSB_ERROR_EXTEND_PLUGIN"
		],

		event: {
			on: _s_e_o,
			off: _s_e_f
		},

		data: {
			cores: {},
			clss: {},
			plugins: {},
			imports: {},
			loads:[]
		},

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
		 * Listener JSB Object fire event.
		 * @param {String}   event event's type
		 * @param {Function} cb    call back function
		 * @param {Misc}     scope function scope
		 */
		addEventListener: function(event, func, scope) {

			$(_b)[_b.event.on]('jsb.' + event, {
				scope: scope
			}, func);

			return this;

		},

		/**
		 * Detect is Class ready.
		 * @param  {String}   name class name
		 * @param  {Function} cb   call back function
		 * @return {boolean}
		 */
		classReady:function(clsName,funcSuccess,funcError) {

			var _obj_status = false;
			
			var _bol_check  = true;
			
			var _obj_cls    =  _b._get_cls(clsName);

			if(_obj_cls){

				_obj_status  =  _obj_cls["status"];

				if(_obj_status.extend!==true)
				{
					_bol_check = false;
				}

				if(_obj_status.plugins!==true)
				{
					_bol_check = false;
				}

				if(_obj_status.css!==true)
				{
					_bol_check = false;
				}

				if(_obj_status.tpl!==true)
				{
					_bol_check = false;
				}

				if(_obj_status.imports!==true)
				{
					_bol_check = false;
				}
				// console.log("_obj_cls.fileRequire",_obj_cls.fileRequire);
				if(_obj_cls.fileRequire<=0&&_bol_check===false)
				{
					if(funcError){
						funcError.call();
						return false;
					}	
				}

			}else{
				_bol_check = false;
			}

			if(funcSuccess){
				if(_bol_check){
					funcSuccess.call();
				}else{
					_b._ready(funcSuccess,funcError,clsName);	
				}
				return true;
			}

			return _bol_check;

		},

		create: function(clsName, options, trigger) {

			var _ns_cls = _b._get_cls(clsName);

			if(!_ns_cls){
				_b._log("error", _b.errors[3], "CLASS:"+clsName+" NOT FIND");
				return false;
			}

			if(!_b.classReady(clsName)){
				_b._log("error", _b.errors[3], "CLASS:"+clsName+" NOT READY");
				return false;
			}

			if (_ns_cls.config.abstr) {
				_b._log("error", _b.errors[3], "CLASS:"+clsName+" IS DEFINE AN ABSTR CLASS");
				return false;
			}

			if (!_ns_cls.config.nodes) {
				_ns_cls.config.nodes = [];
			}

			if (_ns_cls.config.single && _ns_cls.config.nodes.length > 0) {
				_b._log("error", _b.errors[3], "CLASS:"+clsName+" SINGLE");
				return false;
			}

			var _ns = new _ns_cls["cls"](options);

			_ns_cls.config.nodes.push(_ns);

			if (trigger) {
				$(_b).triggerHandler('jsb.create', _ns);
			}

			return _ns;

		},

		define:function(clsName, cls) {

			var i;

			if (_b._get_cls(clsName)) {

				_b._log("warn", _b.errors[0], "CLASS:'" + clsName + "' define again");

				return false;

			}

			_b.status = "progress";

			var _jsb_cls = function(misc_opt) {

				cls.plugins = cls.plugins ? cls.plugins : [];

				this.__classname = clsName;

				this.__plugins = $.extend([],this.plugins,cls.plugins);

				this.__extend = [];

				this.__count = 0;

				this.__destroy = false;
				//class extend super
				this._extend(this);

				this._plugin();

				this.initialize(misc_opt);

				this.SUPER();

				delete this.__count;

				return true;

			};

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
			//開始計算要預期要載入的檔案
			_b._file_require_count(clsName);
			//繼承JSB預設的Class 和 Class 的 PROTOTYPE
			$.extend(_jsb_cls.prototype, _b.define.prototype, cls);
			//如果是被async載入，則檢查是否已經準備完畢
			if(_b.getImportData()[clsName])
			{
				_b._cls_status_dispatch(clsName);
			}

			if (cls.imports) {

				for (i = 0; i < cls.imports.length; i++) {

					_b._parser_imports(clsName,cls.imports[i]);

				}

			}

			if (cls.extend) {

				if(!_b._cls_infinite("extend",cls.extend,clsName)){

					_b._log("error",clsName, "Extend: infinite loop.");

					_b._cls_status_set(clsName,'fail', cls.extend);

				}else{
					_b._parser_extend(_jsb_cls,cls,clsName,cls.extend);	
				}

			}

			if (cls.plugins) {

				for (i = 0; i < cls.plugins.length; i++) {
					
					var _plug = cls.plugins[i];

					if(!_b._cls_infinite("plugins",_plug,clsName)){

						_b._log("error",clsName, "PLUGIN: infinite loop.");

						_b._cls_status_set(clsName,'fail', _plug);
						
					}else{
						_b._parser_plugin(clsName,_plug);
					}

				}

			}

			if (cls.tpl) {

				for (i = 0; i < cls.tpl.length; i++) {

					_b._parser_tpl(clsName,cls.tpl[i]);

				}

			}

			if (cls.css) {

				for (i = 0; i < cls.css.length; i++) {

					_b._parser_css(clsName,cls.css[i]);

				}

			}

			setTimeout(function() {

				_b._cls_status_dispatch(clsName);

			}, 1);
			
			return _b._get_cls(clsName);

		},

		dispatchEvent: function(event, data) {

			$(_b).triggerHandler('jsb.' + event, [data]);

		},

		getClassData: function(clsName) {

			if(clsName)
			{
				return _b._get_cls(clsName);				
			}

			return _b.data.clss;

		},

		getImportData: function(clsName) {

			if(clsName){
				return _b.data.imports[clsName];
			}

			return _b.data.imports;

		},
		//*
		importClass: function(imports,funcSuccess,funcError) {

			var _str_url = '';

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
					if($.isFunction(funcSuccess)){
						funcSuccess.call();
					}
				},function(){

					if($.isFunction(funcError)){
						funcError.call();
					}
					// console.log("data");
				});	
			}else{
				if($.isFunction(funcSuccess)){
					funcSuccess.call();
				}
			}

		},
		//*
		ready:function(funcSuccess,funcError) {

			_b._ready(funcSuccess,funcError,"ready");

		},

		registerGlobal: function(ns, cls) {

			var _ary_ns = ns.split('.');

			var _str_name = cls.config.name;

			if (_b.data.cores[ns]) {

				_b._log("log", _b.errors[4], "Core: " + ns + " already register.");

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

		registerPlugin: function(ns, cls) {

			var _str_name = cls.config.name;

			var _obj_plug = _b.data.plugins;

			for(var key in _obj_plug)
			{
				if(_obj_plug[key]["name"]===ns)
				{
					_b._log("error", _b.errors[5], "[Plugin] Name Space: '" + ns + "' define again.");
					return false;
				}
			}

			if (_b._get_plugin(_str_name)) {

				_b._log("warn", _b.errors[5], "Plugin: " + cls + " already register.");

				return _b._get_plugin(_str_name);

			}

			_b.data.plugins[_str_name] = {
				name: ns,
				cls: cls["cls"]
			};

			return _b.data.plugins[_str_name];

		},

		removeEventListener: function(event,func) {

			$(_b)[_b.event.off]('jsb.' + event,func);

		},

		setConfig: function(config) {

			_b.config = $.extend(true, _b.config, config);

			return _b.config;

		},

		_cls_infinite:function(type,extend,clsName) {

			var _obj = _b._get_cls(extend);

			if(!_obj){
				return true;
			}else{
				
				if(_obj[type]){

					var _ary_check = $.isArray(_obj[type])?_obj[type]:[_obj[type]];

					for (var i = 0; i < _ary_check.length; i++) {

						if(_ary_check[i]===clsName){

							return false;

						}else{

							if(!_b._cls_infinite(type,_ary_check[i],clsName))
							{	
								return false;
							}

						}
					}
					
				}

			}
			
			return true;			

		},

		_cls_is_last:function(clsName) {

			if(_b.data.imports[clsName])
			{

				var _ary_load = _b.data.loads;

				for (var i = _ary_load.length-1; i >= 0; i--) {
					
					var name = _ary_load[i];

					if(name===clsName){

						return true;

					}else{

						var _obj_import = _b.data.imports[name];

						if(_obj_import["status"]!=="success")
						{
							return false;
						}

					}

				}

			}

			return false;

		},

		_cls_status_check:function(clsName,type) {

			var name,imports;

			var _obj_status = _b._get_cls(clsName)["status"][type];

			if(_obj_status!==true)
			{
				
				for (i = 0; i < _obj_status.length; i++) {
					
					name = _obj_status[i];

					imports = _b.data.imports[name];

					if(imports&&imports["status"]==="success"){
						// console.log("!!!!YES",clsName);
						_b._cls_status_update(clsName,type,name);

						_b._file_require_decrease(clsName);
						// _b._get_cls(clsName)["fileRequire"]--;
						_b._cls_status_dispatch(clsName);
					}
				}

			}

		},

		//*
		_cls_status_dispatch:function(clsName) {

			var _bol_check = true;

			if(_b.classReady(clsName)){

				_b._get_cls(clsName)["ready"] = true;

				_b.dispatchEvent(clsName,clsName);

			}else{

				var _int_file = _b._get_cls(clsName)["fileRequire"];

				if(_int_file===0){
					
					_b.dispatchEvent(clsName+"::Error");

				}else{

					if(_b._cls_is_last(clsName))
					{

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
		
		//*
		_cls_status_set:function(clsName,type,value) {

			if(type!=="fail"){

				_b._cls_status_update(clsName,type,value);

			}else{

				_b.dispatchEvent(value+"::Error");

			}
			// console.log("type",type,clsName,value);
			_b._file_require_decrease(clsName);
			// _b._get_cls(clsName)["fileRequire"]--;
			_b._cls_status_dispatch(clsName);

		},

		_cls_status_update:function(clsName,type,value) {

			var _ary = _b._get_cls(clsName)["status"][type];

			for (var i = 0; i < _ary.length; i++) {

				if(_ary[i]===value){
					_ary.splice(i,1);
					break;
				}

			}

			if(_ary.length>0){

				_b._get_cls(clsName)["status"][type] = _ary;

			}else{

				_b._get_cls(clsName)["status"][type] = true;
				
			}

		},
		//檢查所有class的需要依賴的檔案是否已經全部嘗試載入
		_file_all_load:function(){

			var _bol_check = true;

			$.each(_b.getClassData(), function(i, e) {
								
				if(e.fileRequire > 0){
					_bol_check = false;
				}					
							
			});

			return _bol_check;

		},
		//需要引用的檔案數
		_file_require_count:function(name) {

			var _int_count = 0;

			var obj = _b._get_cls(name);

			for(var key in obj["status"]){
				
				if($.isArray(obj["status"][key])){
					_int_count += obj["status"][key]["length"];
				}

			}

			obj["fileRequire"] = _int_count;

		},

		_file_require_decrease:function(name) {

			var obj = _b._get_cls(name);

			obj["fileRequire"]--;

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
		//*
		_init_cls:function() {

			_b.define.prototype = {

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

					var me = this;

					var _str_extend = misc_scope.extend;

					if (_str_extend) {

						this.__extend.push(misc_scope.extend);

						var _ns_cls = _b._get_cls(_str_extend)["cls"];

						if (_ns_cls.prototype) {

							this._extend(_ns_cls.prototype);

						}

					}

				},

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

				addEventListener: function(str_event, func_cb, misc_scope) {

					$(this)[_b.event.on]('cls.' + str_event, {
						scope: misc_scope
					}, func_cb);

				},

				destroy: function() {

					if (this.__destroy) {

						_b._log("error", _b.errors[1],"Class:"+ this.__classname +" already destroy.");

						return true;

					}

					var _ns_cls = _b._get_cls(this.__classname);

					for (var i = 0; i < _ns_cls.config.nodes.length; i++) {

						if (_ns_cls.config.nodes[i] === this) {

							_ns_cls.config.nodes.splice(i, 1);

						}

					}

					$(this).triggerHandler('cls.destroy', this);

					$(_b).triggerHandler('jsb.destroy', this);

					this.__destroy = true;

					return this;

				},

				dispatchEvent: function(str_event, misc_data) {

					$(this).triggerHandler('cls.' + str_event, [this, misc_data]);

				},

				getCss: function(str_name) {

					var _str_name = str_name?str_name:this.__classname;

					return $('head').find('[jsb-css="' + _str_name + '"]');

				},

				getName: function() {

					return this.__classname;

				},

				getTpl: function(str_id,str_name) {

					var _str_id = str_id ? 'script#' + str_id : '';

					var _str_name = str_name?str_name:this.__classname;

					return $('head').find(_str_id + '[jsb-tpl="' + _str_name + '"]');

				},

				removeEventListener: function(str_event) {

					$(this)[_b.event.off]('cls.' + str_event);

				}

			};

		},

		_log: function(type,message,detail) {

			_b.dispatchEvent("log",{type:type,message:message,detail:detail});

		},

		_parser_callback:function(fileName,funcSuccess,funcError) {

			var _obj_import_status = _b.data.imports[fileName];

			//檢查要被載入的檔案是否已載入
			if(!_b._get_cls(fileName) && !_obj_import_status){

				_b.importClass(fileName,function(){
					_b.classReady(fileName,function(){
						funcSuccess.call();
					},function(){
						funcError.call();
					});
				},function(){
					funcError.call();
				});

			}else{

				_b.classReady(fileName,function(){
					funcSuccess.call();
				},function(){
					funcError.call();
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

			var misc;

			if (!$.isEmptyObject(_obj_config.parser)) {

				var num_str_len = 0;

				for (var key in _obj_config.parser) {

					var reg = new RegExp('^' + key, 'g');

					if (url.match(reg)) {

						if (key.length > num_str_len) {

							misc = _obj_config.parser[key];

							_str_path = misc.path ? misc.path : misc;

							num_str_len = key.length;

						}

					}

				}

			}

			// if (str_url.match(/^(http|https):\/\//g)) {

				// _str_url = str_url;

			// }else{

				_str_url = _str_path + url + (ext ? ext : '');

			// }
			// console.log(_str_url);
			if (misc && $.isFunction(misc.parser)) {

				_str_url = misc.parser.call(misc,_str_url);

			}

			return _str_url;

		},

		_ready:function(funcSuccess,funcError,event) {

			if(event==="ready"&&_b.status==="complete"){

				funcSuccess.call();

				return true;

			}

			var _func = function(){

				_b.removeEventListener(event,_func);

				_b.removeEventListener(event+"::Error",_err_func);

				if($.isFunction(funcSuccess))
				{
					funcSuccess.call();
				}
				
			};

			var _err_func = function(){

				_b.removeEventListener(event,_func);

				_b.removeEventListener(event+"::Error",_err_func);
				
				if($.isFunction(funcError))
				{
					funcError.call();
				}
				
			};

			_b.addEventListener(event,_func);
			// console.log(event+"::Error");
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

				_b._log("error", _b.errors[2],"Require:" + _str_url + " Message:" + errorThrown);

			});

		}

	};

	_b._init_cls();

	window._b     = _b;
	
	window.JSBorn = _b;

})(window);