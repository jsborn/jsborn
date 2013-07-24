JSB.extendPlugin(JSB.oop("jsborn.plugin.controller", {

	depends:[
		"jsborn.core.model",
		"jsborn.plugin.model"
	],

	getPrototype:function(){

		var dd = this;

		return {
			registerEvent: dd._auto_bind,

			registerOOP: dd._auto_class,

			registerData: dd._auto_data,

			setRoot: dd._set_root,

			getRoot: dd._get_root,

			select: dd._select
		};

	},

	initialize: function() {

		var dd = this;

		dd.PLUGIN_CONTROLLER = {
			str_root: 'body',
			tag: ["INPUT","SELECT"],
			nodes:[]
		};

		dd.addListener('destroy',function(){

			for (var i = 0; i < dd.PLUGIN_CONTROLLER.nodes.length; i++) {

				var _ns = dd.PLUGIN_CONTROLLER.nodes[i];

				_ns.destroy();

			};

		});

	},

	_auto_data: function(){

		var dd = this;

		var _str_filter = '';

		this.select().find("[jsb-data]").filter(function() {

			return !$(this).parentsUntil(dd.select(), "[jsb-oop]").length;

		}).each(function(i, k) {

			var _el    = jQuery(this);
			
			var _str_cls  = _el.attr("jsb-data");
			
			var _str_d_e  = _el.attr("jsb-data-event");
			
			var _ary_key  = _str_cls.split(':');
			
			var _str_key  = _ary_key[0];
			
			var _str_name = _ary_key[1];

			var _str_ctrl ;

			var _obj_ctrl = dd.PLUGIN_CONTROLLER;

			if(jQuery.isEmptyObject(_str_d_e)){
				_str_d_e = "mod";
			}

			if(jQuery.inArray(_el[0].tagName, _obj_ctrl.tag)==-1){
				_str_ctrl = "html";
			}else{
				_str_ctrl = "val";
			}

			dd.getModel(_str_key).listener(_str_d_e,function(obj){

				var _misc_val = JSB.core.model.getObjKey(obj,_str_name);

				_el[_str_ctrl](_misc_val);			
				
			});

		});

	},

	_auto_class: function() {

		var dd = this;

		this.select().find("[jsb-oop]").filter(function() {

			return !$(this).parentsUntil(dd.select(), "[jsb-oop]").length;

		}).each(function(i, k) {

			var _str_cls = jQuery(this).attr("jsb-oop");

			var _str_d_e  = jQuery(this).attr("jsb-oop-register");
			
			var _ary_key  = _str_d_e.split(':');

			var _ns_class = JSB.create(_str_cls);

			dd.PLUGIN_CONTROLLER.nodes.push(_ns_class);

			jQuery(dd).triggerHandler('oop.controller.create',[_ns_class,k]);

		});

	},

	_auto_bind: function(func) {

		var dd = this;

		this.select().find("[jsb-event]").filter(function() {

			return !$(this).parentsUntil(dd.select(), "[jsb-oop]").length;

		}).each(function(i, k) {

			var _str_event = jQuery(this).attr("jsb-event");

			var _str_cb = jQuery(this).attr("jb-cb");

			var _func_cb = dd[_str_cb];

			jQuery(this).off(_str_event).on(_str_event,{scope:dd}, function(e) {

				if (jQuery.isFunction(_func_cb)) {
					_func_cb.apply(this, arguments);
				} else {
					console.log("DOM IS NOT DEFINE EVENT CallBack", i);
				}
				
			})
		
		});

	},

	_select: function() {

		return jQuery(this.PLUGIN_CONTROLLER.str_root);

	},

	_set_root: function(str_root) {

		this.PLUGIN_CONTROLLER.str_root = str_root;

		return this.PLUGIN_CONTROLLER.str_root;

	},

	_get_root: function() {

		return this.PLUGIN_CONTROLLER.str_root;

	}

}));