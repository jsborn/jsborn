JSB.extendCore("model",JSB.oop("jsborn.core.model", {

	initialize: function() {

		var me = this;

	},

	getObjKey:function(obj,str_key,index){

		var dd = this;

		var _ary_key = str_key.split('.');

		var _return = false;

		if(!index){
			index = 0;
		}

		jQuery.each(obj, function(key, val) {

			if(key==_ary_key[index]){

				if(index < _ary_key.length-1){

					if (typeof obj[key] === 'object') {
						_return = dd.getObjKey(obj[key],str_key,index+1);
					}else{
						_return = obj[key];	
					}

				}else{
					_return = obj[key];	
				}

			}

		});

		return _return;

	},

	getObjtDiff:function(obj_org,obj_mod,str_type){

		var dd = this;

		dd._ary_diff_check = new Array();

		var _obj_data = dd._check_obj_diff(obj_org,obj_mod);

		if(_obj_data[str_type]){
			return _obj_data[str_type];	
		}
		
		return _obj_data;

	},

	setObjKey: function (obj, str_key, value) {
		
	},

	_check_obj_diff:function(obj_org,obj_mod){

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
			if (typeof obj_val === 'undefined'){
				_obj_add[key] = val;
			}else if (typeof obj_val != typeof val){
				_obj_mod[key] = val;
			}else if (obj_val !== val) {
				if (typeof val === 'object') {
					if (jQuery.inArray(dd._ary_diff_check, val) >= 0){
						return false;
					}
					ret = dd._check_obj_diff(obj_val, val);
					if (!jQuery.isEmptyObject(ret.mod)){
						_obj_mod[key] = jQuery.extend(true, {}, ret.mod);
					}
					if (!jQuery.isEmptyObject(ret.add)){
						_obj_add[key] = jQuery.extend(true, {}, ret.add);
					}
					if (!jQuery.isEmptyObject(ret.del)){
						_obj_del[key] = jQuery.extend(true, {}, ret.del);
					}
					dd._ary_diff_check.push(val);
				} else{
					_obj_mod[key] = val;
				}
			}
		});

		jQuery.each(obj_org, function(key, obj_org) {
			if (typeof obj_mod[key] === 'undefined'){
				_obj_del[key] = true;
			}
		});

		return {
			mod: _obj_mod,
			add: _obj_add,
			del: _obj_del
		};

	}

}));