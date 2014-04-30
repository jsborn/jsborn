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

				var _ns_class = JSB.create(_str_cls,this);

				me.PLUG_DOM.nodes.push(_ns_class);

				jQuery(me).triggerHandler('cls.controller-create', [_ns_class, k]);

			});

		},

		registerEvent: function() {

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