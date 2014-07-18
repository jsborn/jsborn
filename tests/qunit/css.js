JSB.addEventListener("log",function(e,message)
{
	console.log(message);
});

QUnit.asyncTest( "Class CSS test", function( assert ) {

	expect(2);

	JSB.cls("tests/css/Class", {
		
		css:["qunit/tests/css/Class.css"],

		initialize: function(options) {



		}

	});

	JSB.classReady("tests/css/Class",function(){
		assert.ok( JSB.create("tests/css/Class")!==false , "tests/css/Class object create!" );		
	},function(){
		QUnit.start();
	});

	JSB.ready(function(){
		assert.ok( true , "all Class Ready!" );		
		QUnit.start();
	},function(){
		QUnit.start();
	});

	// var _cls = JSB.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.className == "tests/common/Class" , "tests/common/Class object create!" );

});

QUnit.asyncTest( "Class Multi CSS test", function( assert ) {

	JSB.cls("tests/css/ClassMulti", {
		
		css:[
			"qunit/tests/css/Class.css",
			"qunit/tests/css/Class2.css",
			"qunit/tests/css/Class3.css"
		],

		initialize: function(options) {



		}

	});

	JSB.classReady("tests/css/ClassMulti",function(){
		var _cls = JSB.create("tests/css/ClassMulti");
		assert.ok( _cls.getCss().length === 3 , "tests/css/ClassMulti" );
		assert.ok( _cls.getCss("tests/css/Class").length === 1 , "tests/css/ClassMulti" );
		assert.ok( true , "tests/css/ClassMulti object create!" );		
	},function(){
		QUnit.start();
	});

	JSB.ready(function(){
		assert.ok( true , "all Class Ready!" );		
		QUnit.start();
	},function(){
		QUnit.start();
	});

	// var _cls = JSB.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.className == "tests/common/Class" , "tests/common/Class object create!" );

});

QUnit.asyncTest( "Class CSS Error test", function( assert ) {

	expect(2);

	JSB.cls("tests/css/ClassError", {
		
		css:[
			"qunit/tests/css/Class.css",
			"qunit/tests/css/Class2.css",
			"qunit/tests/css/Class3.css",
			"qunit/tests/css/Class4.css"
		],

		initialize: function(options) {



		}

	});

	JSB.classReady("tests/css/ClassError",function(){
		QUnit.start();
	},function(){
		assert.ok( true , "tests/css/ClassError!" );		
	});

	JSB.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true , "Class Fail!" );		
		QUnit.start();
	});

	// var _cls = JSB.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.className == "tests/common/Class" , "tests/common/Class object create!" );

});