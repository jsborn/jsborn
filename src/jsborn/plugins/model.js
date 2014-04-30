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