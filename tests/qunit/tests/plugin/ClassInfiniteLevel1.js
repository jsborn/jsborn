_b.define("qunit/tests/plugin/ClassInfiniteLevel1", {
	
	plugins:[
		"qunit/tests/plugin/ClassParent",
		"qunit/tests/plugin/ClassInfiniteLevel2"
	],
	
	initialize: function(options) {

		

	}

});