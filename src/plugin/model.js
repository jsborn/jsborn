JSB.extendPlugin(JSB.oop("jsborn.plugin.model", {

	depends:["jsborn.core.model"],

	getPrototype:function(){

		var dd = this;

		return {

			getModelData: dd._get_model_data,

			getModel: dd._get_model,

			setModel: dd._set_model,

			delModel: dd._del_model,

			addModel: dd._add_model

		};

	},

	initialize: function() {

		var dd = this;

		dd.PLUGIN_MODEL = {
			model:[]
		}
		
		// this.config = (new Date()).getTime();
		// console.log("com1",this);
		// _test();
		// this.test1();
		dd.addListener('destroy',function(){
			console.log("START::model");
			for (var i = 0; i < dd.PLUGIN_MODEL.model.length; i++) {

				var _ns = dd.PLUGIN_MODEL.model[i];

				_ns.destroy();

			};
			console.log("END::model");
		});

	},

	_get_model_data:function(str_key){

		var dd = this;

		return dd.PLUGIN_MODEL.model;

	},

	_get_model:function(str_key){

		var dd = this;

		for (var i = 0; i < dd.PLUGIN_MODEL.model.length; i++) {

			var _ns_model_node = dd.PLUGIN_MODEL.model[i];
			
			if(_ns_model_node.getData().key==str_key){
				return _ns_model_node;
			}

		};

		return false;

	},

	_set_model:function(str_key,obj_data){

		var dd = this;

		var _obj_model = dd.getModel(str_key);

		if(!_obj_model){
			return false;
		}

		_obj_model.change(obj_data);
		

	},

	_add_model:function(str_key,obj_data){

		// if(jQuery.type(str_key) !== "string"){
		// 	console.error("bindModel:key need string");
		// 	return false;
		// }

		var dd = this;

		var _ns_model_node = JSB.create("jsborn.plugin.model.node",{
			key:str_key,
			data:jQuery.extend(true,{},obj_data)
		});
		
		dd.PLUGIN_MODEL.model.push(_ns_model_node);

		return _ns_model_node;

	},

	_del_model:function(str_key){

		var dd = this;

		for (var i = 0; i < dd.PLUGIN_MODEL.model.length; i++) {

			var _ns_model_node = dd.PLUGIN_MODEL.model[i];
			
			if(_ns_model_node.getData().key==str_key){

				dd.PLUGIN_MODEL.model.splice(i,1);

				return _ns_model_node;
			}

		};

		return false;

	}

}));

JSB.oop("jsborn.plugin.model.node",{

	setData:function(obj_data){

		var dd = this;

		dd._obj_data = obj_data;

		return dd._obj_data;

	},

	getData:function(){

		var dd = this;

		return dd._obj_data;

	},

	change:function(obj_data){

		var dd = this;

		for (var i = 0; i < dd._ary_listeners.length; i++) {

			var _obj_listener = dd._ary_listeners[i];
			
			var _ns_scope = _obj_listener.scope?_obj_listener.scope:dd;
			
			var _obj_diff = JSB.core.model.getObjtDiff(dd.getData().data, obj_data,_obj_listener.type);

			if(!jQuery.isEmptyObject(_obj_diff)){
				_obj_listener.func.apply(_ns_scope,[_obj_diff]);	
			}

		};

		dd.getData().data = obj_data;
		// console.log(diff);

	},

	initialize: function(options) {

		var dd = this;

		dd.setData(options);

		dd._ary_listeners = [];

		dd.addListener('destroy',function(){
			console.log("jsborn.plugin.model.node destroy");
		})

	},

	listener:function(type,func_cb,scope){

		var dd = this;

		var _obj_data = {
			type:type,
			func:func_cb,
			scope:scope
		}

		dd._ary_listeners.push(_obj_data);

		return scope;

	}

});