_b.addEventListener("log",function(e,message)
{
	console.log(message);
});

QUnit.asyncTest( "Extend Class Test", function( assert ) {

	expect(5);

	_b.define("tests/extend/ClassParent", {
		
		hello:function(){

			return "hello world";

		},

		initialize: function() {

			this.name = "parent";

		}

	});

	_b.define("tests/extend/ClassNodeSuper", {
		
		extend:"tests/extend/ClassParent",

		initialize: function() {

			this.name = "node";

			assert.ok( this.name=="node", "before SUPER" );

			this.SUPER();

			assert.ok( this.name=="parent", "after SUPER" );

		}

	});

	_b.define("tests/extend/ClassNode", {
		
		extend:"tests/extend/ClassParent",

		initialize: function() {

			this.name = "node";

		}

	});

	_b.ready(function(){

		var _cls_node_super  = _b.create("tests/extend/ClassNodeSuper");
	
		var _cls_node = _b.create("tests/extend/ClassNode");

		assert.ok( _cls_node_super.hello, "hello properties not null!" );

		assert.ok( _cls_node_super.hello()=="hello world", "hello method return test" );

		assert.ok( _cls_node.name == "parent", "SUPER test" );

		QUnit.start();

	},function(){
		console.log("fail");
		QUnit.start();

	});
	
});

QUnit.asyncTest( "Extend Class async Test", function( assert ) {

	expect(4);

	_b.define("tests/extend/Class", {
		
		extend:"qunit/tests/extend/ClassNode",

		initialize: function() {


		}

	});

	_b.ready(function(){

		var _cls = _b.create("tests/extend/Class");
		assert.ok( _cls !== false, "tests/extend/Class" );
		assert.ok( _cls.a() === true, "tests/extend/Class a()" );
		assert.ok( _cls.b() === true, "tests/extend/Class b()" );
		assert.ok( _cls.c() === true, "tests/extend/Class c()" );

		QUnit.start();

	},function(){

		QUnit.start();

	});

});

QUnit.asyncTest( "Import Class Test Error Require", function( assert ) {
	
	expect(2);

	_b.define("tests/extend/ClassFail", {
		
		extend:"qunit/tests/extend/ClassFail",

		initialize: function(options) {

		}

	});

	_b.classReady("tests/extend/ClassFail",function(){
		

	},function(){
		assert.ok( true, "tests/extend/ClassFail Fail" );
	});

	_b.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true, "all class Fail" );
		QUnit.start();
	});

});

QUnit.asyncTest( "Import Class Infinite Loop Test", function( assert ) {
	
	expect(1);

	_b.define("tests/extend/ClassInfinite", {
		
		extend:"qunit/tests/extend/ClassInfiniteLevel1",

		initialize: function(options) {

		}

	});

	_b.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true, "all class Fail" );
		QUnit.start();
	});

});