_b.addEventListener("log",function(e,message)
{
	console.log(message);
});
_b.addEventListener("classReady",function(e,clsName)
{
	console.log(clsName);
});
QUnit.asyncTest( "Class CSS test", function( assert ) {

	expect(2);

	_b.define("tests/css/Class", {
		
		css:"qunit/tests/css/Class.css",

		initialize: function(options) {



		}

	});

	_b.classReady("tests/css/Class",function(){
		assert.ok( _b.create("tests/css/Class")!==false , "tests/css/Class object create!" );		
	},function(){
		QUnit.start();
	});

	_b.ready(function(){
		assert.ok( true , "all Class Ready!" );		
		QUnit.start();
	},function(){
		QUnit.start();
	});

	// var _cls = _b.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.getName() == "tests/common/Class" , "tests/common/Class object create!" );

});

QUnit.asyncTest( "Class Multi CSS test", function( assert ) {

	_b.define("tests/css/ClassMulti", {
		
		css:[
			"qunit/tests/css/Class.css",
			"qunit/tests/css/Class2.css",
			"qunit/tests/css/Class3.css"
		],

		initialize: function(options) {



		}

	});

	_b.classReady("tests/css/ClassMulti",function(){
		var _cls = _b.create("tests/css/ClassMulti");
		assert.ok( _cls.getCss().length === 3 , "tests/css/ClassMulti" );
		assert.ok( _cls.getCss("tests/css/Class").length === 1 , "tests/css/ClassMulti" );
		assert.ok( true , "tests/css/ClassMulti object create!" );		
	},function(){
		QUnit.start();
	});

	_b.ready(function(){
		assert.ok( true , "all Class Ready!" );		
		QUnit.start();
	},function(){
		QUnit.start();
	});

	// var _cls = _b.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.getName() == "tests/common/Class" , "tests/common/Class object create!" );

});

QUnit.asyncTest( "Class CSS Error test", function( assert ) {

	expect(2);

	_b.define("tests/css/ClassError", {
		
		css:[
			"qunit/tests/css/Class.css",
			"qunit/tests/css/Class2.css",
			"qunit/tests/css/Class3.css",
			"qunit/tests/css/Class4.css"
		],

		initialize: function(options) {



		}

	});

	_b.classReady("tests/css/ClassError",function(){
		QUnit.start();
	},function(){
		assert.ok( true , "tests/css/ClassError!" );		
	});

	_b.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true , "Class Fail!" );		
		QUnit.start();
	});

	// var _cls = _b.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.getName() == "tests/common/Class" , "tests/common/Class object create!" );

});