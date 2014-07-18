JSB.cls("qunit/tests/plugin/ClassInfiniteLevel2", {
	
	plugins:[
		"qunit/tests/plugin/ClassParent",
		"qunit/tests/plugin/ClassInfiniteLevel3"
	],
	
	initialize: function(options) {

		

	}

});