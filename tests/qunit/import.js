JSB.addEventListener("log",function(e,message)
{
	console.log(message);
});

QUnit.asyncTest( "Import Class Test", function( assert ) {

	expect(1);

	JSB.cls("tests/import/ClassParent", {
		
		initialize: function(options) {


		}

	});

	JSB.cls("tests/import/ClassNode", {
		
		imports:[
			"tests/import/ClassParent"
		],

		initialize: function(options) {


		}

	});

	JSB.classReady("tests/import/ClassNode",function(){
		
		assert.ok( JSB.create("tests/import/ClassParent")!==false, "qunit/tests/import/Class" );

		QUnit.start();

	});

});

QUnit.asyncTest( "Import Class async Test", function( assert ) {

	expect(2);

	JSB.cls("tests/import/Class", {
		
		imports:[
			"qunit/tests/import/Class",
			"qunit/tests/import/ClassNode",
		],

		initialize: function(options) {


		}

	});

	JSB.classReady("tests/import/Class",function(){

		assert.ok( JSB.create("qunit/tests/import/Class")!==false, "qunit/tests/import/Class" );

		assert.ok( JSB.create("qunit/tests/import/ClassNode")!==false, "qunit/tests/import/ClassNode" );

		QUnit.start();

	});

});

QUnit.asyncTest( "Import Class Depth Test", function( assert ) {
	
	expect(4);

	JSB.cls("tests/import/ClassMulti", {
		
		imports:[
			"qunit/tests/import/ClassNode",
		],

		initialize: function(options) {

		}

	});

	JSB.classReady("qunit/tests/import/ClassParent",function(){
		
		assert.ok( JSB.create("qunit/tests/import/ClassParent")!==false, "qunit/tests/import/ClassParent" );

	});

	// console.log("1");
	JSB.classReady("tests/import/ClassMulti",function(){

		assert.ok( JSB.create("qunit/tests/import/ClassNode")!==false, "qunit/tests/import/ClassNode" );

		assert.ok( true, "tests/import/ClassMulti Ready" );

	},function(){
	});

	JSB.ready(function(){
		assert.ok( true, "All Class Ready" );
		QUnit.start();
	},function(){
		QUnit.start();
	});

});

QUnit.asyncTest( "Import Class Infinite Import Test", function( assert ) {
	
	expect(1);

	JSB.cls("tests/import/ClassInfinite", {
		
		imports:[
			"qunit/tests/import/ClassNode",
			"qunit/tests/import/ClassInfiniteLevel1",
		],

		initialize: function(options) {

		}

	});

	JSB.ready(function(){
		assert.ok( JSB.create("tests/import/ClassInfinite")!==false, "all class ready" );
		QUnit.start();
	},function(){
		console.log("fail");
		QUnit.start();
	});

});

QUnit.asyncTest( "Import Class Test Error Require", function( assert ) {
	
	expect(2);

	JSB.cls("tests/import/ClassFail", {
		
		imports:[
			"qunit/tests/import/ClassFail",
			// "qunit/tests/Class2",
		],

		initialize: function(options) {

		}

	});
	// console.log("1");
	JSB.classReady("tests/import/ClassFail",function(){


	},function(){
		assert.ok( true, "video has loaded and is ready to play" );
	});

	JSB.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true, "video has loaded and is ready to play" );
		QUnit.start();
	});

});

QUnit.asyncTest( "Import Class Test Error Again Require", function( assert ) {
	
	expect(1);

	JSB.cls("tests/import/ClassFailAgain", {
		
		imports:[
			"qunit/tests/import/ClassFail",
			// "qunit/tests/Class2",
		],

		initialize: function(options) {

		}

	});

	JSB.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true, "video has loaded and is ready to play" );
		QUnit.start();
	});

});

