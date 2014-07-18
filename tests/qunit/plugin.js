JSB.addEventListener("log",function(e,message)
{
	console.log("log",message);
});

QUnit.asyncTest( "Plugins Class Test", function( assert ) {

	expect(2);

	JSB.cls("tests/plugin/Class", {

		plugins:[
			"qunit/tests/plugin/ClassParent"
		],		

		initialize: function() {


		}

	});

	JSB.ready(function(){

		var _cls  = JSB.create("tests/plugin/Class");
		// console.log(_cls);
		assert.ok( _cls.plugin3 !== false, "_cls.plugin" );

		assert.ok( _cls.plugin3.hello() == "hello world", "_cls.plugin.hello()" );

		QUnit.start();

	},function(){

		QUnit.start();

	});

});

QUnit.asyncTest( "Plugins Register Error Test", function( assert ) {

	expect(2);

	JSB.cls("tests/plugin/Class", {

		plugins:[
			"qunit/tests/plugin/ClassParent"
		],		

		initialize: function() {


		}

	});

	JSB.ready(function(){

		var func = function(e,status){

			if(status.message=="JSB_ERROR_EXTEND_PLUGIN")
			{
				assert.ok( true , status.message );
			}

		};

		JSB.addEventListener("log",func);

		JSB.extendPlugin("plugin3",JSB.cls("tests/plugin/ClassParent", {

			initialize: function(options) {

				

			}

		}));

		JSB.extendPlugin("testError2",JSB.getClassData("qunit/tests/plugin/ClassParent"));


		JSB.removeEventListener("log",func);
		QUnit.start();

	},function(){

		QUnit.start();

	});

});

QUnit.asyncTest( "Plugins Class Depth Test", function( assert ) {

	expect(4);

	JSB.cls("tests/plugin/ClassDepth", {

		plugins:[
			"qunit/tests/plugin/ClassNode",
		],		

		initialize: function() {


		}

	});

	JSB.ready(function(){

		var _cls  = JSB.create("tests/plugin/ClassDepth");

		assert.ok( _cls.plugin !== false, "_cls.plugin" );
		
		assert.ok( _cls.plugin.plugin2 !== false, "_cls.plugin" );
		
		assert.ok( _cls.plugin.plugin2.plugin3 !== false, "_cls.plugin" );

		assert.ok( _cls.plugin.plugin2.plugin3.hello() == "hello world", "_cls.plugin.hello()" );

		QUnit.start();

	},function(){

		QUnit.start();

	});

});

QUnit.asyncTest( "Plugins Class Multi Test", function( assert ) {

	expect(5);

	JSB.cls("tests/plugin/ClassMulti", {

		plugins:[
			"qunit/tests/plugin/Class",
			"qunit/tests/plugin/ClassNode",
			"qunit/tests/plugin/ClassParent"
		],		

		initialize: function() {


		}

	});

	JSB.ready(function(){

		var _cls  = JSB.create("tests/plugin/ClassMulti");

		assert.ok( _cls.plugin !== false, "_cls.plugin" );

		assert.ok( _cls.plugin2 !== false, "_cls.plugin2" );

		assert.ok( _cls.plugin3 !== false, "_cls.plugin3" );

		assert.ok( _cls.plugin.c() === true, "_cls.plugin.c()" );

		assert.ok( _cls.plugin3.hello() == "hello world", "_cls.plugin.hello()" );

		QUnit.start();

	},function(){

		QUnit.start();

	});

});

QUnit.asyncTest( "Plugins Class Test Fail", function( assert ) {

	expect(1);

	JSB.cls("tests/plugin/ClassFail", {

		plugins:[
			"qunit/tests/plugin/Class",
			"qunit/tests/plugin/ClassFail"
		],		

		initialize: function() {


		}

	});

	JSB.ready(function(){

		QUnit.start();

	},function(){

		assert.ok( true, "fail plugin" );

		QUnit.start();

	});

});

QUnit.asyncTest( "Plugins Class Infinite Loop Test", function( assert ) {
	
	expect(1);

	JSB.cls("tests/plugin/ClassInfinite", {
		
		plugins:["qunit/tests/plugin/ClassInfiniteLevel1"],

		initialize: function(options) {

		}

	});

	JSB.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true, "all class Fail" );
		QUnit.start();
	});

});