_b.addEventListener("log",function(e,message)
{
	console.log(message);
});
_b.addEventListener("classReady",function(e,clsName)
{
	console.log(clsName);
});
/*
_b.setConfig({
	imports: {
		parser: {
			"qunit/tests/import":'file:///Users/tureki/Documents/github/jsborn/tests/'
		}
	}
});
*/
QUnit.asyncTest( "Import Class Test", function( assert ) {

	expect(1);

	_b.define("tests/import/ClassParent", {
		
		initialize: function(options) {


		}

	});

	_b.define("tests/import/ClassNode", {
		
		imports:[
			"tests/import/ClassParent"
		],

		initialize: function(options) {


		}

	});

	_b.classReady("tests/import/ClassNode",function(){
		
		assert.ok( _b.create("tests/import/ClassParent")!==false, "qunit/tests/import/Class" );

		QUnit.start();

	});

});

QUnit.asyncTest( "Import Class async Test", function( assert ) {

	expect(2);

	_b.define("tests/import/Class", {
		
		imports:[
			"qunit/tests/import/Class",
			"qunit/tests/import/ClassNode",
		],

		initialize: function(options) {


		}

	});

	_b.classReady("tests/import/Class",function(){

		assert.ok( _b.create("qunit/tests/import/Class")!==false, "qunit/tests/import/Class" );

		assert.ok( _b.create("qunit/tests/import/ClassNode")!==false, "qunit/tests/import/ClassNode" );

		QUnit.start();

	});

});

QUnit.asyncTest( "Import Class Depth Test", function( assert ) {
	
	expect(4);

	_b.define("tests/import/ClassMulti", {
		
		imports:[
			"qunit/tests/import/ClassNode",
		],

		initialize: function(options) {

		}

	});

	_b.classReady("qunit/tests/import/ClassParent",function(){
		
		assert.ok( _b.create("qunit/tests/import/ClassParent")!==false, "qunit/tests/import/ClassParent" );

	});

	// console.log("1");
	_b.classReady("tests/import/ClassMulti",function(){

		assert.ok( _b.create("qunit/tests/import/ClassNode")!==false, "qunit/tests/import/ClassNode" );

		assert.ok( true, "tests/import/ClassMulti Ready" );

	},function(){
	});

	_b.ready(function(){
		assert.ok( true, "All Class Ready" );
		QUnit.start();
	},function(){
		QUnit.start();
	});

});

QUnit.asyncTest( "Import Class Infinite Import Test", function( assert ) {
	
	expect(1);

	_b.define("tests/import/ClassInfinite", {
		
		imports:[
			"qunit/tests/import/ClassNode",
			"qunit/tests/import/ClassInfiniteLevel1",
		],

		initialize: function(options) {

		}

	});

	_b.ready(function(){
		assert.ok( _b.create("tests/import/ClassInfinite")!==false, "all class ready" );
		QUnit.start();
	},function(){
		console.log("fail");
		QUnit.start();
	});

});

QUnit.asyncTest( "Import Class Test Error Require", function( assert ) {
	
	expect(2);

	_b.define("tests/import/ClassFail", {
		
		imports:[
			"qunit/tests/import/ClassFail",
			// "qunit/tests/Class2",
		],

		initialize: function(options) {

		}

	});
	// console.log("1");
	_b.classReady("tests/import/ClassFail",function(){


	},function(){
		assert.ok( true, "video has loaded and is ready to play" );
	});

	_b.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true, "video has loaded and is ready to play" );
		QUnit.start();
	});

});

QUnit.asyncTest( "Import Class Test Error Again Require", function( assert ) {
	
	expect(1);

	_b.define("tests/import/ClassFailAgain", {
		
		imports:[
			"qunit/tests/import/ClassFail",
			// "qunit/tests/Class2",
		],

		initialize: function(options) {

		}

	});

	_b.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true, "video has loaded and is ready to play" );
		QUnit.start();
	});

});

