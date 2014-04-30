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

		version: '0.5.2a',

		status: 'ready',

		event: {
			on: _s_e_o,
			off: _s_e_f
		},

		data: {
			cores: {},
			clss: {},
			plugins: {},
			imports: {}
		},

		config: {
			console: true,
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
		classReady:function(str_name,func_cb){

			var _obj_status = _j._get_cls(str_name)["status"];

			var _bol_check = true;

			if(!_obj_status){
				_j.echo("info","class not find:"+str_name);
				return false;
			}

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

			if(_obj_status.imports!==true)
			{
				_bol_check = false;
			}

			if(func_cb){
				if(_bol_check){
					func_cb.call();
				}else{
					_j.ready(func_cb,str_name);	
				}
				return true;
			}

			return _bol_check;

		},

		create: function(str_name, misc_opt, bol_trigger) {

			var me = this;

			var _ns_cls = me._get_cls(str_name);

			if(!_j.classReady(str_name)){
				me.echo("error", "CLASS:NOT READY", str_name);
				return false;
			}

			if (!_ns_cls) {
				me.echo("error", "CLASS:NOT FIND", str_name);
				return false;
			}

			if (_ns_cls.config.abstr) {
				me.echo("error", "CLASS:ABSTR", str_name);
				return false;
			}

			if (!_ns_cls.config.nodes) {
				_ns_cls.config.nodes = [];
			}

			if (_ns_cls.config.single && _ns_cls.config.nodes.length > 0) {
				me.echo("error", "CLASS:SINGLE", str_name);
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

			_q(_j).triggerHandler('jsb.' + str_event, [this, misc_data]);

		},

		echo: function(str_type) {

			if (console && _j.config.console) {

				if (console[str_type]) {

					console[str_type](arguments);

				} else {

					_j.echo("log", "console no " + str_type + " method.");

				}

			}

		},

		extendCore: function(str_ns, cls) {

			var _ary_ns = str_ns.split('.');

			var _str_name = cls.config.name;

			if (_j._get_core(_str_name)) {

				_j.echo("log", "Core: " + _str_name + " already register.");

				return _j._get_core(_str_name);

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

					_j.data.cores[_str_name] = obj[_ary_ns[i]];

					return obj[_ary_ns[i]];

				}

			};

		},

		extendPlugin: function(str_ns, cls) {

			var _str_name = cls.config.name;

			var me = this;
			//check plugin
			if (me._get_plugin(_str_name)) {

				me.echo("log", "Plugin: " + cls + " already register.");

				return me._get_plugin(_str_name);

			}

			me.data.plugins[_str_name] = {
				name: str_ns,
				cls: cls["cls"]
			};

			return me.data.plugins[_str_name];

		},

		getClassData: function() {

			return _j.data.clss;

		},

		getImportData: function() {

			return _j.data.imports;

		},

		importClass: function(misc_imports,func_cb) {

			var _str_url = '';

			if(_q.isArray(misc_imports)){
				var _ary_import = misc_imports; 
			}else{
				var _ary_import = [misc_imports];
			}

			var _ary_xhr = [];

			for (var i = 0; i < _ary_import.length; i++) {
				
				if(_j.data.imports[_ary_import[i]]){
					continue;
				}

				_ary_xhr.push(_j._xhr(_ary_import[i]));

			};

			if(_ary_xhr.length>0){
				_q.when.apply( _q, _ary_xhr ).done(function(){
					if(_q.isFunction(func_cb)){
						func_cb.call();
					}
				});	
			}else{
				if(_q.isFunction(func_cb)){
					func_cb.call();
				}
			}

		},

		removeEventListener: function(str_event,func_cb) {

			_q(_j).off('jsb.' + str_event,func_cb);

		},

		ready:function(func_cb,str_event){

			str_event = str_event?str_event:'ready';

			if(str_event=="ready"&&JSB.status=="complete"){
				func_cb.call();
				return true;
			}

			var _func = function(){

				_j.removeEventListener(str_event,_func);

				if(_q.isFunction(func_cb))
				{
					func_cb.call();
				}
				
			}

			_j.addEventListener(str_event,_func);

		},

		setConfig: function(obj) {

			var me = this;

			me.config = _q.extend(true, me.config, obj);

			return me.config;

		},

		_xhr:function(str_impcls){

			_str_url = _j._parser_url(str_impcls, '.js');

			_j.data.imports[str_impcls] = {
				status: 'progress'
			};

			return _q.ajax({

				url: _str_url,

				dataType: "script",

				cache: _j.config.imports.cache

			}).done(function(){

				_j.data.imports[str_impcls]["status"] = "success";

			}).fail(function(jqXHR, textStatus, errorThrown){

				_j.echo("error", "Require:" + _str_url + " Message:" + errorThrown);

			});

		},

		_check_cls: function(str_cls,func_cb) {

			var me = this;

			if (!me._get_cls(str_cls)) {

				me.importClass(str_cls,func_cb);

				return false;

			}

			return true;

		},

		_check_cls_status:function(str_name){

			if(_j.classReady(str_name))
			{

				_j._get_cls(str_name)["ready"] = true;

				_j.dispatchEvent(str_name,str_name);

				var _bol_check = true;

				_q.each(_j.getClassData(), function(i, e) {
									
					if(!e.ready){
						_bol_check = false;
					}					
								
				});

				if(_bol_check)
				{
					JSB.status = 'complete';
					_j.dispatchEvent('ready');
				}

			}

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

		_init_cls: function() {

			var me = this;

			me.cls = function(str_name, obj_cls) {

				if (me._get_cls(str_name)) {

					me.echo("warn", "CLASS:'" + str_name + "' define again");

					return true;

				}

				JSB.status = "progress";

				var _jsb_cls = function(misc_opt) {

					obj_cls.plugins = obj_cls.plugins ? obj_cls.plugins : [];

					this.className = str_name;

					this._ary_extend = [];

					this._count = 0;

					this._destroy = false;
					//class extend super
					this._extend(this);

					this._plugin(obj_cls.plugins);

					this.initialize(misc_opt);

					this.SUPER();

					delete this._count;

					return true;

				};

				me.data.clss[str_name] = {
					cls: _jsb_cls,
					config: {
						name: str_name,
						single: obj_cls.single ? true : false,
						abstr: obj_cls.abstr ? true : false
					},
					ready:false,
					status:{
						extend:obj_cls.extend?[obj_cls.extend]:true,
						plugins:obj_cls.plugins?obj_cls.plugins.slice():true,
						css:obj_cls.css?obj_cls.css.slice():true,
						tpl:obj_cls.tpl?obj_cls.tpl.slice():true,
						imports:obj_cls.imports?obj_cls.imports.slice():true
					}
				};

				_q.extend(_jsb_cls.prototype, me.cls.prototype, obj_cls);

				if (obj_cls.imports) {

					for (var i = 0; i < obj_cls.imports.length; i++) {

						_j._parser_imports(str_name,obj_cls.imports[i]);

					};

				}

				if (obj_cls.extend) {

					if(!me._check_cls(obj_cls.extend)||!_j.classReady(obj_cls.extend)){

						_j.addEventListener(obj_cls.extend,function(e,misc_scope,str_cls){

							_q.extend(
								_jsb_cls.prototype,
								me.cls.prototype,
								me._get_cls(obj_cls.extend)["cls"].prototype,
								obj_cls
							);

							me._set_cls_status(str_name,'extend',str_cls);

							_j.removeEventListener(str_cls);

						});

					}else{

						_q.extend(
							_jsb_cls.prototype,
							me.cls.prototype,
							me._get_cls(obj_cls.extend)["cls"].prototype,
							obj_cls
						);

						me._set_cls_status(str_name,'extend',obj_cls.extend);

					}

				}

				if (obj_cls.plugins) {

					for (var i = 0; i < obj_cls.plugins.length; i++) {
						
						var _plug = obj_cls.plugins[i];

						if(!me._check_cls(_plug)||!_j.classReady(_plug)){
							//waiting async
							_j.addEventListener(_plug,function(e,misc_scope,str_cls){

								me._set_cls_status(str_name,'plugins',str_cls);

								_j.removeEventListener(str_cls);

							});

						}else{

							me._set_cls_status(str_name,'plugins',_plug);

						}

					};

				}

				if (obj_cls.tpl) {

					var _ary_file = _q.isArray(obj_cls.tpl) ? obj_cls.tpl : obj_cls.tpl.files;

					for (var i = 0; i < _ary_file.length; i++) {

						_j._parser_tpl(str_name,_ary_file[i]);

					};

				}

				if (obj_cls.css) {

					var _ary_file = _q.isArray(obj_cls.css) ? obj_cls.css : obj_cls.css.files;

					for (var i = 0; i < _ary_file.length; i++) {

						_j._parser_css(str_name,_ary_file[i]);

					};

				}

				setTimeout(function() {

					me._check_cls_status(str_name);

				}, 1);
				
				return me.data.clss[str_name];

			};

			me.cls.prototype = {

				_plugin: function(ary_plugins) {

					this._ary_plugin = _q.merge([], ary_plugins);

					var _ary_plugin = [];

					_q.each(this._ary_plugin, function(i, e) {
						//filter same name plugin
						if (_q.inArray(e, _ary_plugin) == -1 && me.className != e) {
							_ary_plugin.push(e);
						}
					});

					if (_q.isArray(_ary_plugin)) {

						for (var i = 0; i < _ary_plugin.length; i++) {

							me._check_cls(_ary_plugin[i]);

							var _obj_plug = me._get_plugin(_ary_plugin[i]);

							this[_obj_plug.name] = _j.create(_ary_plugin[i], this,false);

						};

					}

				},

				_extend: function(misc_scope) {

					var _str_extend = misc_scope.extend;

					if (_str_extend) {

						this._ary_extend.push(misc_scope.extend);

						var _ns_cls = _j._get_cls(_str_extend)["cls"];

						if (_ns_cls.prototype) {

							this._extend(_ns_cls.prototype);

						}

					}

				},

				SUPER: function() {

					if (this._ary_extend.length > 0 && this._count < this._ary_extend.length) {

						var _str_extend = this._ary_extend[this._count];

						if (_str_extend) {

							var _proto_class = _j._get_cls(_str_extend)["cls"].prototype;

							this._count++;

							_proto_class.initialize.apply(this, arguments);

							if (_proto_class.extend) {

								this.SUPER();

							}

						}

					}

				},

				destroy: function() {

					if (this._destroy) {
						_j.echo("error", this, "already destroy");
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

					this._destroy = true;

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

				},

				initialize: function() {}

			}

		},

		_parser_imports: function(str_name,str_file) {

			if(!_j._get_cls(str_file)&&!_j.data.imports[str_file]){

				_j.importClass(str_file,function(){

					_j._set_cls_status(str_name,'imports',str_file);

				});

			}else{

				_j._set_cls_status(str_name,'imports',str_file);

			}

		},

		_parser_css: function(str_name,str_file) {

			if(str_file.match(/^(http|https):\/\//g)){

				var _el_style = document.createElement("link");

				_q(_el_style).attr("type", "text/css");
				
				_q(_el_style).attr("rel", "stylesheet");

				_q(_el_style).attr('jsb-css', str_name);

				_q(_el_style).attr('href', str_file);

				_q(_el_style).appendTo('head');

				_q(_el_style).load(function(){
					_j._set_cls_status(str_name,'css',str_file);
				});
				

			}else{

				_q.ajax({
					type: "GET",
					dataType:'text',
					url: _j._parser_url(str_file)
				}).done(function(data){

					var _el_style = document.createElement("style");

					_q(_el_style).attr("type", "text/css");

					_q(_el_style).attr('jsb-css', str_name);
			
					if (_el_style.styleSheet) {

						_el_style.styleSheet.cssText = data;

					} else {

						_el_style.innerHTML = data;

					}

					_q(_el_style).appendTo('head');

					_j._set_cls_status(str_name,'css',str_file);

				});
			}
			
		},

		_parser_tpl: function(str_name,str_file) {

			_q.ajax({
				type: "GET",
				dataType: "html",
				url: _j._parser_url(str_file),
				success: function(data) {

					var _ary_el = _q(data);

					_ary_el.attr('jsb-tpl', str_name);

					_ary_el.appendTo('head');

					_j._set_cls_status(str_name,'tpl',str_file);

				}

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

			if (str_url.match(/^(http|https):\/\//g)) {

				_str_url = str_url;

			}else{

				_str_url = _str_path + str_url + (str_ext ? str_ext : '');

			}

			if (misc && _q.isFunction(misc.parser)) {

				_str_url = misc.parser.call(misc, _str_url);

			}

			return _str_url;

		},

		_set_cls_status:function(str_name,str_type,str_value){

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

			_j._check_cls_status(str_name);

		}

	}

	JSB._init_cls();

	window.JSB = JSB;

	if(!window.jsb) { window.jsb = JSB };

	if(!window._j) { window._j = JSB };

})(window);

(function(window) {

	JSB.extendCore("JSB.core.model", JSB.cls("jsborn/cores/model", {

		initialize: function() {

			var me = this;

		},

		getObjKey: function(obj, str_key, index) {

			var dd = this;

			var _ary_key = str_key.split('.');

			var _return = false;

			if (!index) {
				index = 0;
			}

			jQuery.each(obj, function(key, val) {

				if (key == _ary_key[index]) {

					if (index < _ary_key.length - 1) {

						if (typeof obj[key] === 'object') {
							_return = dd.getObjKey(obj[key], str_key, index + 1);
						} else {
							_return = obj[key];
						}

					} else {
						_return = obj[key];
					}

				}

			});

			return _return;

		},

		getObjtDiff: function(obj_org, obj_mod, str_type) {

			var dd = this;

			dd._ary_diff_check = new Array();

			var _obj_data = dd._check_obj_diff(obj_org, obj_mod);

			if (_obj_data[str_type]) {
				return _obj_data[str_type];
			}

			return _obj_data;

		},

		_check_obj_diff: function(obj_org, obj_mod) {

			var dd = this;

			if (typeof obj_org === 'undefined') {
				obj_org = {};
			}

			if (typeof obj_mod === 'undefined') {
				obj_mod = {};
			}

			var _obj_del = {};
			var _obj_mod = {};
			var _obj_add = {};


			jQuery.each(obj_mod, function(key, val) {

				var obj_val = obj_org[key];
				if (typeof obj_val === 'undefined') {
					_obj_add[key] = val;
				} else if (typeof obj_val != typeof val) {
					_obj_mod[key] = val;
				} else if (obj_val !== val) {
					if (typeof val === 'object') {
						if (jQuery.inArray(dd._ary_diff_check, val) >= 0) {
							return false;
						}
						ret = dd._check_obj_diff(obj_val, val);
						if (!jQuery.isEmptyObject(ret.modify)) {
							_obj_mod[key] = jQuery.extend(true, {}, ret.modify);
						}
						if (!jQuery.isEmptyObject(ret.add)) {
							_obj_add[key] = jQuery.extend(true, {}, ret.add);
						}
						if (!jQuery.isEmptyObject(ret.del)) {
							_obj_del[key] = jQuery.extend(true, {}, ret.del);
						}
						dd._ary_diff_check.push(val);
					} else {
						_obj_mod[key] = val;
					}
				}
			});

			jQuery.each(obj_org, function(key, obj_org) {
				if (typeof obj_mod[key] === 'undefined') {
					_obj_del[key] = true;
				}
			});

			return {
				modify: _obj_mod,
				add: _obj_add,
				del: _obj_del
			};

		}

	}));

})(window);

(function(window) {

	JSB.extendCore("JSB.core.channel", JSB.cls("jsborn/cores/channel", {

		addChannel: function(str_room) {

			var dd = this;

			if (dd.getChannel(str_room)) {
				return false;
			}

			dd._obj_channel[str_room] = {
				member: []
			};

			return true;

		},

		delChannel: function(str_room) {

			var dd = this;

			if (!dd.getChannel(str_room)) {
				return false;
			}

			delete dd._obj_channel[str_room];

			return true;

		},

		join: function(str_room, ns_scope, func_cb) {

			var dd = this;

			dd.addChannel(str_room);

			var _obj_room = dd.getChannel(str_room);

			_obj_room["member"].push(ns_scope);

			jQuery(this)[JSB.event.on](str_room, {
				scope: ns_scope
			}, function(e) {
				func_cb.apply(ns_scope, arguments);
			});

			return true;

		},

		getChannel: function(str_room) {

			var dd = this;

			return dd._obj_channel[str_room];

		},

		getChannelData: function() {

			var dd = this;

			return dd._obj_channel;

		},

		send: function(str_room) {

			var dd = this;

			var _obj_room = dd.getChannel(str_room);

			if (!_obj_room) {
				return false;
			}

			var _ary_member = _obj_room["member"];

			var _ary_send = [];

			for (var i = 1; i < arguments.length; i++) {

				_ary_send.push(arguments[i]);

			};

			jQuery(this).triggerHandler(str_room, _ary_send);

			return true;

		},

		leave: function(str_room, ns_scope) {

			var _obj_jq_data = jQuery._data(this, "events");

			if (!_obj_jq_data[str_room]) {
				return false;
			}

			for (var i = 0; i < _obj_jq_data[str_room].length; i++) {
				if (_obj_jq_data[str_room][i]["data"]["scope"] == ns_scope) {
					_obj_jq_data[str_room].splice(i, 1);
					return true;
				}
			};

			return false;

		},

		initialize: function() {

			var dd = this;

			dd._obj_channel = {};

			JSB.addEventListener('destroy', function(e, obj) {

				for (x in dd._obj_channel) {
					dd.leave(x, obj);
				}

			})

		}

	}));

})(window);

(function(window) {

	JSB.extendPlugin("model", JSB.cls("jsborn/plugins/model", {

		imports: ["jsborn/cores/model"],

		initialize: function(parent) {

			var me = this;

			me.PLUG_MODEL = {
				model: []
			}

			me.parent = parent ? parent : me;

			me.parent.addEventListener('destroy', function() {

				for (var i = 0; i < me.PLUG_MODEL.model.length; i++) {

					var _ns = me.PLUG_MODEL.model[i];

					_ns.destroy();

				};

			});

		},

		getModelData: function(str_key) {

			var me = this;

			return me.PLUG_MODEL.model;

		},

		getModel: function(str_key) {

			var me = this;

			for (var i = 0; i < me.PLUG_MODEL.model.length; i++) {

				var _ns_model_node = me.PLUG_MODEL.model[i];

				if (_ns_model_node.getOption().key == str_key) {
					return _ns_model_node;
				}

			};

			return false;

		},

		setModel: function(str_key, obj_data) {

			var me = this;

			var _obj_model = me.getModel(str_key);

			if (!_obj_model) {
				return false;
			}

			return _obj_model.change(obj_data);

		},

		addModel: function(str_key, obj_data) {

			var me = this;

			var _ns_model_node = JSB.create("jsborn/plugin/model/node", {
				key: str_key,
				data: jQuery.extend(true, {}, obj_data)
			});

			me.PLUG_MODEL.model.push(_ns_model_node);

			return _ns_model_node;

		},

		delModel: function(str_key) {

			var me = this;

			for (var i = 0; i < me.PLUG_MODEL.model.length; i++) {

				var _ns_model_node = me.PLUG_MODEL.model[i];

				if (_ns_model_node.getOption().key == str_key) {

					me.PLUG_MODEL.model.splice(i, 1);

					return _ns_model_node;
				}

			};

			return false;

		}

	}));

	JSB.cls("jsborn/plugin/model/node", {

		getData: function() {

			var me = this;

			return jQuery.extend(true, {}, me._obj_data.data);

		},

		setData: function(obj_data) {

			var me = this;

			me._obj_data.data = obj_data;

			return jQuery.extend(true, {}, me._obj_data.data);

		},

		setOption: function(obj_data) {

			var me = this;

			me._obj_data = obj_data;

			return me._obj_data;

		},

		getOption: function() {

			var me = this;

			return me._obj_data;

		},

		change: function(obj_data) {

			var me = this;

			var _obj_diff = JSB.core.model.getObjtDiff(me.getData(), obj_data, "all");

			if (!jQuery.isEmptyObject(_obj_diff.add)) {
				me.dispatchEvent("model-add", _obj_diff.add);
			}

			if (!jQuery.isEmptyObject(_obj_diff.del)) {
				me.dispatchEvent("model-del", _obj_diff.del);
			}

			if (!jQuery.isEmptyObject(_obj_diff.modify)) {
				me.dispatchEvent("model-modify", _obj_diff.modify);
			}

			return me.setData(obj_data);

		},

		initialize: function(options) {

			var me = this;

			me.setOption(options);

		}

	});

})(window);

(function(window) {

	JSB.extendPlugin("dom", JSB.cls("jsborn/plugins/dom", {

		extend: "jsborn/plugins/model",

		initialize: function(parent) {

			var me = this;

			me.SUPER(me);

			me.PLUG_DOM = {
				str_root: 'body',
				tag: ["INPUT", "SELECT"],
				nodes: []
			};

			me.parent = parent ? parent : me;

			me.parent.addEventListener('destroy', function() {

				for (var i = 0; i < me.PLUG_DOM.nodes.length; i++) {

					var _ns = me.PLUG_DOM.nodes[i];

					_ns.destroy();

				};

			});

		},

		registerData: function() {

			var me = this;

			var _str_filter = '';

			this.select().find("[jsb-data]").filter(function() {

				return !$(this).parentsUntil(me.select(), "[jsb-cls]").length;

			}).each(function(i, k) {

				var _el = jQuery(this);

				var _str_cls = _el.attr("jsb-data");

				var _str_d_e = _el.attr("jsb-data-event");

				var _ary_event = _str_d_e ? _str_d_e.split(',') : [];

				var _ary_key = _str_cls.split(':');

				var _str_key = _ary_key[0];

				var _str_name = _ary_key[1];

				var _str_ctrl;

				var _obj_ctrl = me.PLUG_DOM;

				if (_ary_event.length <= 0) {
					_ary_event.push("modify");
				}

				if (jQuery.inArray(_el[0].tagName, _obj_ctrl.tag) == -1) {
					_str_ctrl = "html";
				} else {
					_str_ctrl = "val";
				}

				for (var i = 0; i < _ary_event.length; i++) {

					if (!me.getModel(_str_key)) {
						continue;
					}

					me.getModel(_str_key).addEventListener("model-" + _ary_event[i], function(e, scope, obj) {

						var _misc_val = JSB.core.model.getObjKey(obj, _str_name);

						if (_misc_val !== false) {

							_el[_str_ctrl](_misc_val);

						}

					});

				};

			});

		},

		registerClass: function() {

			var me = this;

			this.select().find("[jsb-cls]").filter(function() {

				return !$(this).parentsUntil(me.select(), "[jsb-cls]").length;

			}).each(function(i, k) {

				var _str_cls = jQuery(this).attr("jsb-cls");

				var _ns_class = JSB.create(_str_cls);

				me.PLUG_DOM.nodes.push(_ns_class);

				jQuery(me).triggerHandler('cls.controller-create', [_ns_class, k]);

			});

		},

		registerEvent: function(func) {

			var me = this;

			this.select().find("[jsb-event]").filter(function() {

				return !$(this).parentsUntil(me.select(), "[jsb-cls]").length;

			}).each(function(i, k) {

				var _ary_key = jQuery(this).attr("jsb-event").split(':');

				var _str_event = _ary_key[0];

				var _str_cb = _ary_key[1];

				var _func_cb = me.parent[_str_cb];

				jQuery(this)[JSB.event.off](_str_event)[JSB.event.on](_str_event, {
					scope: me.parent
				}, function(e) {

					if (jQuery.isFunction(_func_cb)) {
						_func_cb.apply(this, arguments);
					} else {
						console.log("DOM IS NOT DEFINE EVENT CallBack", i);
					}

				})

			});

		},

		select: function(target) {

			var _str_root = this.PLUG_DOM.str_root;

			if (target) {
				return jQuery(_str_root).find(target);
			}

			if (!_str_root) {
				_str_root = 'body';
			}

			return jQuery(_str_root);

		},

		setRoot: function(str_root) {

			this.PLUG_DOM.str_root = str_root;

			return this.PLUG_DOM.str_root;

		},

		getRoot: function() {

			return this.PLUG_DOM.str_root;

		}

	}));

})(window);