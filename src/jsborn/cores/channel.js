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