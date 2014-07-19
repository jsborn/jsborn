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

	var _q = jQuery;

	var _q_v = _q.fn.jquery.split('.');

	var _s_e_o = (_q_v[0]==1&&_q_v[1]<7)?"bind":"on";

	var _s_e_f = (_q_v[0]==1&&_q_v[1]<7)?"unbind":"off";

	var JSB = {

		version: '0.5.3',

		status: 'ready',

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
			console: false,
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
		addEventListener: function(str_event, func_cb, misc_scope) {

			_q(_j)[_j.event.on]('jsb.' + str_event, {
				scope: misc_scope
			}, func_cb);

			return this;

		},

		/**
		 * Detect is Class ready.
		 * @param  {String}   name class name
		 * @param  {Function} cb   call back function
		 * @return {boolean}
		 */
		classReady:function(str_name,func_cb,func_err){

			var _obj_status = false;

			var _bol_check = true;

			var _obj_cls =  _j._get_cls(str_name);

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
				if(_obj_cls.fileRequire<=0&&_bol_check==false)
				{
					if(func_err){
						func_err.call();
						return false;
					}	
				}

			}else{
				_bol_check = false;
			}

			if(func_cb){
				if(_bol_check){
					func_cb.call();
				}else{
					_j.ready(func_cb,func_err,str_name);	
				}
				return true;
			}

			return _bol_check;

		},

		cls:function(str_name, obj_cls) {

			if (_j._get_cls(str_name)) {

				_j.echo("warn", "JSB_ERROR_CLASS_DEFINE", "CLASS:'" + str_name + "' define again");

				return false;

			}

			JSB.status = "progress";

			var _jsb_cls = function(misc_opt) {

				obj_cls.plugins = obj_cls.plugins ? obj_cls.plugins : [];

				this.className = str_name;

				this.__plugins = _q.extend([],this.plugins,obj_cls.plugins);

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

			_j.data.clss[str_name] = {
				cls: _jsb_cls,
				config: {
					name: str_name,
					single: obj_cls.single ? true : false,
					abstr: obj_cls.abstr ? true : false
				},
				ready:false,
				fileRequire:0,
				fileLoad:0,
				extend:obj_cls.extend?obj_cls.extend:false,
				plugins:obj_cls.plugins?obj_cls.plugins.slice():[],
				status:{
					extend:obj_cls.extend?[obj_cls.extend]:true,
					plugins:obj_cls.plugins?obj_cls.plugins.slice():true,
					css:obj_cls.css?obj_cls.css.slice():true,
					tpl:obj_cls.tpl?obj_cls.tpl.slice():true,
					imports:obj_cls.imports?obj_cls.imports.slice():true
				}
			};
			//開始計算要預期要載入的檔案
			_j._file_require_count(str_name);
			//繼承JSB預設的Class 和 Class 的 PROTOTYPE
			_q.extend(_jsb_cls.prototype, _j.cls.prototype, obj_cls);
			//如果是被async載入，則檢查是否已經準備完畢
			if(JSB.getImportData()[str_name])
			{
				_j._check_cls_status(str_name);
			}
			// console.log("qunit/tests/Parent",str_name,JSB.getImportData()["qunit/tests/Parent"]);

			if (obj_cls.imports) {

				for (var i = 0; i < obj_cls.imports.length; i++) {

					_j._parser_imports(str_name,obj_cls.imports[i]);

				};

			}

			if (obj_cls.extend) {

				if(!_j._check_cls_infite("extend",obj_cls.extend,str_name)){

					_j.echo("error",str_name, "Extend: infinite loop.");

					_j._set_cls_status(str_name,'fail', obj_cls.extend);

				}else{
					_j._parser_extend(_jsb_cls,obj_cls,str_name,obj_cls.extend);	
				}

			}

			if (obj_cls.plugins) {

				for (var i = 0; i < obj_cls.plugins.length; i++) {
					
					var _plug = obj_cls.plugins[i];

					if(!_j._check_cls_infite("plugins",_plug,str_name)){

						_j.echo("error",str_name, "PLUGIN: infinite loop.");

						_j._set_cls_status(str_name,'fail', _plug);
						
					}else{
						_j._parser_plugin(str_name,_plug);
					}

				};

			}

			if (obj_cls.tpl) {

				for (var i = 0; i < obj_cls.tpl.length; i++) {

					_j._parser_tpl(str_name,obj_cls.tpl[i]);

				};

			}

			if (obj_cls.css) {

				for (var i = 0; i < obj_cls.css.length; i++) {

					_j._parser_css(str_name,obj_cls.css[i]);

				};

			}

			setTimeout(function() {

				_j._check_cls_status(str_name);

			}, 1);
			
			return _j.data.clss[str_name];

		},

		create: function(str_name, misc_opt, bol_trigger) {

			var me = this;

			var _ns_cls = me._get_cls(str_name);

			if(!_ns_cls){
				me.echo("error", "JSB_ERROR_CREATE", "CLASS:"+str_name+" NOT FIND");
				return false;
			}

			if(!_j.classReady(str_name)){
				me.echo("error", "JSB_ERROR_CREATE", "CLASS:"+str_name+" NOT READY");
				return false;
			}

			if (_ns_cls.config.abstr) {
				me.echo("error", "JSB_ERROR_CREATE", "CLASS:"+str_name+" ABSTR");
				return false;
			}

			if (!_ns_cls.config.nodes) {
				_ns_cls.config.nodes = [];
			}

			if (_ns_cls.config.single && _ns_cls.config.nodes.length > 0) {
				me.echo("error", "JSB_ERROR_CREATE", "CLASS:"+str_name+" SINGLE");
				return false;
			}

			var _ns = new _ns_cls["cls"](misc_opt);

			_ns_cls.config.nodes.push(_ns);

			if (bol_trigger) {
				_q(me).triggerHandler('jsb.create', _ns);
			}


			return _ns

		},

		dispatchEvent: function(str_event, misc_data) {

			_q(_j).triggerHandler('jsb.' + str_event, [misc_data]);

		},

		echo: function(type,message,detail) {

			// if(_j.config.debug){

				// throw new Object({type:type,message:message,detail:detail});


			// }
			
			_j.dispatchEvent("log",{type:type,message:message,detail:detail});

			// if (console && _j.config.console) {

			// 	if (console[type]) {

			// 		console[type](arguments);

			// 	} else {

			// 		_j.echo("log", "console no " + type + " method.");

			// 	}

			// }

		},

		extendCore: function(str_ns, cls) {

			var _ary_ns = str_ns.split('.');

			var _str_name = cls.config.name;

			if (_j._get_core(str_ns)) {

				_j.echo("log", "JSB_ERROR_EXTEND_CORE", "Core: " + str_ns + " already register.");

				return false;

			}

			cls["config"] = _q.extend(cls["config"], {
				single: true,
				abstr: false
			});

			for (var i = 0; i < _ary_ns.length; i++) {

				var obj = obj ? obj : window;

				if (i != _ary_ns.length - 1) {

					if (_q.isEmptyObject(obj[_ary_ns[i]])) {
						obj[_ary_ns[i]] = new Object();
					}

					obj = obj[_ary_ns[i]];

				} else {

					obj[_ary_ns[i]] = _j.create(_str_name,{},false);

					_j.data.cores[str_ns] = obj[_ary_ns[i]];

					return obj[_ary_ns[i]];

				}

			};

		},

		extendPlugin: function(str_ns, cls) {

			var me = this;

			var _str_name = cls.config.name;

			var _obj_plug = me.data.plugins;

			for(var key in _obj_plug)
			{
				if(_obj_plug[key]["name"]==str_ns)
				{
					me.echo("error", "JSB_ERROR_EXTEND_PLUGIN", "[Plugin] Name Space: '" + str_ns + "' define again.");
					return false;
				}
			}

			if (me._get_plugin(_str_name)) {

				me.echo("warn", "JSB_ERROR_EXTEND_PLUGIN", "Plugin: " + cls + " already register.");

				return me._get_plugin(_str_name);

			}

			me.data.plugins[_str_name] = {
				name: str_ns,
				cls: cls["cls"]
			};

			return me.data.plugins[_str_name];

		},

		getClassData: function(name) {

			if(name)
			{
				return _j.data.clss[name];				
			}

			return _j.data.clss;

		},

		getImportData: function(name) {

			if(name){
				return _j.data.imports[name];
			}

			return _j.data.imports;

		},
		//*
		importClass: function(misc_imports,func_cb,func_err) {

			var _str_url = '';

			var _ary_import = _q.isArray(misc_imports)?misc_imports:[misc_imports]; 

			var _ary_xhr = [];

			for (var i = 0; i < _ary_import.length; i++) {
				
				if(_j.data.imports[_ary_import[i]]){
					continue;
				}

				_ary_xhr.push(_j._xhr(_ary_import[i]));

			};

			if(_ary_xhr.length>0){
				_q.when.apply( _q, _ary_xhr ).then(function(){
					if(_q.isFunction(func_cb)){
						func_cb.call();
					}
				},function(){

					if(_q.isFunction(func_err)){
						func_err.call();
					}
					// console.log("data");
				});	
			}else{
				if(_q.isFunction(func_cb)){
					func_cb.call();
				}
			}

		},

		removeEventListener: function(str_event,func_cb) {

			_q(_j)[_j.event.off]('jsb.' + str_event,func_cb);

		},
		//*
		ready:function(func_cb,func_err,str_event){

			str_event = str_event?str_event:'ready';

			if(str_event=="ready"&&JSB.status=="complete"){
				func_cb.call();
				return true;
			}

			var _func = function(){

				_j.removeEventListener(str_event,_func);

				_j.removeEventListener(str_event+"::ERROR",_err_func);

				if(_q.isFunction(func_cb))
				{
					func_cb.call();
				}
				
			}

			var _err_func = function(){

				_j.removeEventListener(str_event,_func);

				_j.removeEventListener(str_event+"::ERROR",_err_func);
				
				if(_q.isFunction(func_err))
				{
					func_err.call();
				}
				
			}

			_j.addEventListener(str_event,_func);
			// console.log(str_event+"::ERROR");
			_j.addEventListener(str_event+"::ERROR",_err_func);

		},

		setConfig: function(obj) {

			var me = this;

			me.config = _q.extend(true, me.config, obj);

			return me.config;

		},

		_check_cls_infite:function(type,extend,name){

			var _obj = _j.data.clss[extend];

			if(!_obj){
				return true;
			}else{
				
				if(_obj[type]){

					var _ary_check = _q.isArray(_obj[type])?_obj[type]:[_obj[type]];

					for (var i = 0; i < _ary_check.length; i++) {

						if(_ary_check[i]==name){

							return false;

						}else{

							if(!_j._check_cls_infite(type,_ary_check[i],name))
							{	
								return false;
							}

						}
					};
					
				}

			}
			
			return true;			

		},

		// _check_cls_infite_plugin:function(plug,name){

		// 	var _obj = _j.data.clss[plug];

		// 	if(!_obj){

		// 		return true;

		// 	}else{

		// 		for (var i = 0; i < _obj.plugins.length; i++) {

		// 			if(_obj.plugins[i]==name){

		// 				return false;

		// 			}else{

		// 				if(!_j._check_cls_infite_plugin(_obj.plugins[i],name))
		// 				{	
		// 					return false;
		// 				}

		// 			}
		// 		};

		// 	}
			
		// 	return true;			

		// },
		/*
		_check_cls: function(str_cls,func_cb) {

			var me = this;

			if (!me._get_cls(str_cls)) {

				me.importClass(str_cls,func_cb);

				return false;

			}

			return true;

		},*/
		//*
		_check_cls_status:function(str_name){

			if(_j.classReady(str_name)){
				// console.log("classReady:",str_name);
				_j._get_cls(str_name)["ready"] = true;
				// console.log("dispatchEvent:",str_name);
				_j.dispatchEvent(str_name,str_name);

			}else{

				var _int_file = _j._get_cls(str_name)["fileRequire"];
				// console.log("_check",str_name,_int_file);
				var obj = JSON.stringify(_j.data.clss);

				var obj2 = JSON.stringify(_j.data.imports);
				// console.log(jQuery.parseJSON(obj));
				// console.log(jQuery.parseJSON(obj2));
				// console.log(_j.data.loads);
				if(_int_file==0)
				{
					console.log("classError:",str_name);
					_j.dispatchEvent(str_name+"::ERROR");
				}else{

					_j._check_cls_repeat(str_name);

				}

			}

			var _bol_check = true;

			_q.each(_j.getClassData(), function(i, e) {
				
				if(!_j.classReady(i)&&!e.ready){
					// console.log(JSON.stringify(e));
					_bol_check = false;
				}					
							
			});

			if(_bol_check){

				JSB.status = 'complete';
				_j.dispatchEvent('ready');

			}else{
				
				if(_j._file_all_load())
				{
					JSB.status = 'fail';
					_j.dispatchEvent('ready::ERROR');
				}

			}

			
			// _q.each(_j.getClassData(), function(i, e) {
								
			// 	if(!e.ready||e.fileRequire==0){
			// 		_bol_check = false;
			// 	}					
							
			// });

		},

		_check_cls_repeat:function(str_name){

			//如果該Class有被載入
			// console.log(_j._check_last_cls(str_name),str_name);
			if(_j._check_last_cls(str_name))
			{

				var _obj_status = _j.data.clss[str_name]["status"];

				if(_obj_status.imports!==true)
				{
					
					for (var i = 0; i < _obj_status.imports.length; i++) {
						
						var name = _obj_status.imports[i];
						var imports = _j.data.imports[name];
						if(imports&&imports["status"]=="success"){
							// console.log("!!!!YES",str_name);
							_j._update_cls_status(str_name,"imports",name);
							_j._file_require_decrease(str_name);
							// _j._get_cls(str_name)["fileRequire"]--;
							_j._check_cls_status(str_name);
						}
					};

				}

				if(_obj_status.plugins!==true)
				{
					
					for (var i = 0; i < _obj_status.plugins.length; i++) {
						
						var name = _obj_status.plugins[i];
						var imports = _j.data.imports[name];
						if(imports&&imports["status"]=="success"){
							// console.log("!!!!YES",str_name);
							_j._update_cls_status(str_name,"plugins",name);
							_j._file_require_decrease(str_name);
							// _j._get_cls(str_name)["fileRequire"]--;
							_j._check_cls_status(str_name);
						}
					};

				}

				if(_obj_status.extend!==true)
				{
					
					for (var i = 0; i < _obj_status.extend.length; i++) {	

						var name = _obj_status.extend[i];

						var imports = _j.data.imports[name];

						if(imports&&imports["status"]=="success"){
							// console.log("!!!!YES",str_name);
							_j._update_cls_status(str_name,"extend",name);
							_j._file_require_decrease(str_name);
							// _j._get_cls(str_name)["fileRequire"]--;
							_j._check_cls_status(str_name);
						}

					}

				}


				// console.log("data");


			}

		},

		_check_last_cls:function(str_name){

			if(_j.data.imports[str_name])
			{

				var _ary_load = _j.data.loads;

				for (var i = _ary_load.length-1; i >= 0; i--) {
					
					var name = _ary_load[i];

					if(name==str_name){

						return true;

					}else{

						var _obj_import = _j.data.imports[name];

						if(_obj_import["status"]!="success")
						{
							return false;
						}

					}

				};

			}

			return false;

		},

		//檢查所有class的需要依賴的檔案是否已經全部嘗試載入
		_file_all_load:function(){

			var _bol_check = true;

			_q.each(_j.getClassData(), function(i, e) {
								
				if(e.fileRequire > 0){
					_bol_check = false;
				}					
							
			});

			return _bol_check;

		},

		//需要引用的檔案數
		_file_require_count:function(name){

			var me = this;

			var _int_count = 0;

			var obj = me.data.clss[name];

			for(var key in obj["status"]){
				
				if(_q.isArray(obj["status"][key])){
					_int_count += obj["status"][key]["length"];
				}

			}

			obj["fileRequire"] = _int_count;

		},

		_file_require_decrease:function(name)
		{

			var me = this;

			var obj = me.data.clss[name];

			obj["fileRequire"]--;

		},

		_get_core: function(str_name) {

			var me = this;

			if (me.data.cores[str_name]) {

				return me.data.cores[str_name];

			} else {

				return false;

			}

		},

		_get_cls: function(str_name) {

			var me = this;

			if (me.data.clss[str_name]) {

				return me.data.clss[str_name];

			} else {

				return false;

			}

		},

		_get_plugin: function(str_name) {

			var me = this;

			if (me.data.plugins[str_name]) {

				return me.data.plugins[str_name];

			} else {

				return false;

			}

		},
		
		//*
		_init_cls:function(){

			_j.cls.prototype = {

				_plugin: function() {

					var _ary_plugin = [];

					_q.each(this.__plugins, function(i, e) {
						//filter same name plugin
						if (_q.inArray(e, _ary_plugin) == -1 && _j.className != e) {
							_ary_plugin.push(e);
						}
					});

					if (_q.isArray(_ary_plugin)) {

						for (var i = 0; i < _ary_plugin.length; i++) {

							// _j._check_cls(_ary_plugin[i]);

							var _obj_plug = _j._get_plugin(_ary_plugin[i]);

							this[_obj_plug.name] = _j.create(_ary_plugin[i], this,false);

						};

					}

				},
				//TODO:優化message
				_extend: function(misc_scope) {

					var me = this;

					var _str_extend = misc_scope.extend;

					if (_str_extend) {

						this.__extend.push(misc_scope.extend);

						var _ns_cls = _j._get_cls(_str_extend)["cls"];

						if (_ns_cls.prototype) {

							// try{
								this._extend(_ns_cls.prototype);
							// }catch(e){

									// _j.echo("error",_str_extend, "Extend: infinite loop.");
								// console.log("XDDDD");
								// console.log(e.message);
								
								// _j.echo("error", this, "already destroy");
							// }
							

						}

					}

				},

				SUPER: function() {

					if (this.__extend.length > 0 && this.__count < this.__extend.length) {

						var _str_extend = this.__extend[this.__count];

						if (_str_extend) {

							var _proto_class = _j._get_cls(_str_extend)["cls"].prototype;

							this.__count++;

							_proto_class.initialize.apply(this, arguments);

							if (_proto_class.extend) {

								this.SUPER();

							}

						}

					}

				},

				destroy: function() {

					if (this.__destroy) {
						_j.echo("error", "JSB_ERROR_CLASS_DESTROY","Class:"+ this.className +" already destroy.");
						return true;
					}

					var _ns_cls = _j._get_cls(this.className);

					for (var i = 0; i < _ns_cls.config.nodes.length; i++) {
						if (_ns_cls.config.nodes[i] == this) {
							_ns_cls.config.nodes.splice(i, 1);
						}
					};

					_q(this).triggerHandler('cls.destroy', this);

					_q(_j).triggerHandler('jsb.destroy', this);

					this.__destroy = true;

					return this;

				},

				addEventListener: function(str_event, func_cb, misc_scope) {

					_q(this)[_j.event.on]('cls.' + str_event, {
						scope: misc_scope
					}, func_cb);

				},

				dispatchEvent: function(str_event, misc_data) {

					_q(this).triggerHandler('cls.' + str_event, [this, misc_data]);

				},

				getTpl: function(str_id,str_name) {

					var _str_id = str_id ? 'script#' + str_id : '';

					var _str_name = str_name?str_name:this.className;

					return _q('head').find(_str_id + '[jsb-tpl="' + _str_name + '"]');

				},

				getCss: function(str_name) {

					var _str_name = str_name?str_name:this.className;

					return _q('head').find('[jsb-css="' + _str_name + '"]');

				},

				removeEventListener: function(str_event) {

					_q(this)[_j.event.off]('cls.' + str_event);

				}

			}

		},

		_parser_callback:function(str_name,str_file,done,fail){

			var _obj_import_status = _j.data.imports[str_file];

			//檢查要被載入的檔案是否已載入
			if(!_j._get_cls(str_file) && !_obj_import_status){

				_j.importClass(str_file,function(){
					_j.classReady(str_file,function(){
						done.call();
					},function(){
						fail.call();
					});
				},function(){
					fail.call();
				});

			}else{

				_j.classReady(str_file,function(){
					done.call();
				},function(){
					fail.call();
				});	

			}

		},

		_parser_imports: function(str_name,str_file) {

			_j._parser_callback(str_name,str_file,function(){
				_j._set_cls_status(str_name,'imports',str_file);
			},function(){
				_j._set_cls_status(str_name,'fail', str_file);
			});

		},

		_parser_extend: function(jsbcls,cls,str_name,str_file) {

			_j._parser_callback(str_name,str_file,function(){

				_q.extend(
					jsbcls.prototype,
					_j.cls.prototype,
					_j._get_cls(str_file)["cls"].prototype,
					cls
				);

				_j._set_cls_status(str_name,'extend',str_file);
			},function(){
				_j._set_cls_status(str_name,'fail', str_file);
			});

		},

		_parser_plugin: function(str_name,str_file) {

			_j._parser_callback(str_name,str_file,function(){
				_j._set_cls_status(str_name,'plugins',str_file);
			},function(){
				_j._set_cls_status(str_name,'fail', str_file);
			});

		},

		_parser_css: function(str_name,str_file) {

			_q.ajax({
				type: "GET",
				cache:false,
				dataType:'text',
				url: _j._parser_url(str_file)
			}).done(function(data){

				var _el_style = document.createElement("style");

				_q(_el_style)
					.attr("type", "text/css")
					.attr('jsb-css', str_name);
		
				if (_el_style.styleSheet) {
					_el_style.styleSheet.cssText = data;
				} else {
					_el_style.innerHTML = data;
				}

				_q(_el_style).appendTo('head');

				_j._set_cls_status(str_name,'css',str_file);

			}).fail(function(){

				_j._set_cls_status(str_name,'fail',str_file);

			});
			
		},

		_parser_tpl: function(str_name,str_file) {

			_q.ajax({
				type: "GET",
				cache:false,
				dataType: "html",
				url: _j._parser_url(str_file)
			}).done(function(data){

				var _ary_el = _q(data);

				_ary_el.attr('jsb-tpl', str_name);

				_ary_el.appendTo('head');

				_j._set_cls_status(str_name,'tpl',str_file);

			}).fail(function(){

				_j._set_cls_status(str_name,'fail',str_file);				

			});

		},

		_parser_url: function(str_url, str_ext) {

			var _obj_config = _j.config.imports;

			var _str_url = '';

			var _str_path = _obj_config.path;

			if (!_q.isEmptyObject(_obj_config.parser)) {

				var num_str_len = 0;

				for (key in _obj_config.parser) {

					var reg = new RegExp('^' + key, 'g');

					if (str_url.match(reg)) {

						if (key.length > num_str_len) {

							var misc = _obj_config.parser[key];

							_str_path = misc.path ? misc.path : misc;

							num_str_len = key.length;

						}

					}

				}

			}

			// if (str_url.match(/^(http|https):\/\//g)) {

				// _str_url = str_url;

			// }else{

				_str_url = _str_path + str_url + (str_ext ? str_ext : '');

			// }
			// console.log(_str_url);
			if (misc && _q.isFunction(misc.parser)) {

				_str_url = misc.parser.call(misc,_str_url);

			}

			return _str_url;

		},
		//*
		_set_cls_status:function(str_name,str_type,str_value){

			if(str_type!="fail"){

				_j._update_cls_status(str_name,str_type,str_value);

			}else{

				_j.dispatchEvent(str_value+"::ERROR");

			}
			// console.log("str_type",str_type,str_name,str_value);
			this._file_require_decrease(str_name);
			// _j._get_cls(str_name)["fileRequire"]--;
			_j._check_cls_status(str_name);

		},

		_update_cls_status:function(str_name,str_type,str_value){

			var _ary = _j._get_cls(str_name)["status"][str_type];

			for (var i = 0; i < _ary.length; i++) {

				if(_ary[i]==str_value){
					_ary.splice(i,1);
					break;
				}

			};

			if(_ary.length>0){
				_j._get_cls(str_name)["status"][str_type] = _ary;
			}else{
				_j._get_cls(str_name)["status"][str_type] = true;
			}

		},

		_xhr:function(str_impcls){

			_str_url = _j._parser_url(str_impcls, '.js');

			_j.data.imports[str_impcls] = {
				status: 'progress'
			};

			_j.data.loads.push(str_impcls);

			return _q.ajax({

				url: _str_url,

				dataType: "script",

				cache: _j.config.imports.cache

			}).done(function(){

				_j.data.imports[str_impcls]["status"] = "success";

			}).fail(function(jqXHR, textStatus, errorThrown){

				// for (var i = 0; i < _j.data.loads.length; i++) {
				// 	if(_j.data.loads[i]==str_impcls){
				// 		_j.data.loads.splice(i,1);
				// 	}
				// };

				_j.data.imports[str_impcls]["status"] = "fail";

				_j.echo("error", "JSB_ERROR_CLASS_IMPORT","Require:" + _str_url + " Message:" + errorThrown);

			});

		}

	}

	window.JSB = JSB;

	if(!window.jsb) { window.jsb = JSB };

	if(!window._j) { window._j = JSB };

	JSB._init_cls();

})(window);