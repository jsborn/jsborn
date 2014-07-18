JSB.addEventListener("log",function(e,message)
{
	console.log(message);
});

QUnit.asyncTest( "Class TPL test", function( assert ) {

	expect(2);

	JSB.cls("tests/tpl/Class", {
		
		tpl:["qunit/tests/tpl/tpl.html"],

		initialize: function(options) {



		}

	});

	JSB.classReady("tests/tpl/Class",function(){
		assert.ok( JSB.create("tests/tpl/Class")!==false , "tests/tpl/Class object create!" );		
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

QUnit.asyncTest( "Class Multi TPL test", function( assert ) {

	expect(6);

	JSB.cls("tests/tpl/ClassMulti", {
		
		tpl:[
			"qunit/tests/tpl/tpl.html",
			"qunit/tests/tpl/tpl2.html",
			"qunit/tests/tpl/tpl3.html"
		],

		initialize: function(options) {



		}

	});

	JSB.classReady("tests/tpl/ClassMulti",function(){

		var _cls = JSB.create("tests/tpl/ClassMulti");

		assert.ok( _cls.getTpl().length === 3 , "tests/common/ClassMulti get tempalte count!" );
		assert.ok( jQuery.trim(_cls.getTpl("tpl","tests/tpl/Class").html()) === "<div>hi</div>" , "tests/common/ClassMulti get tempalte count!" );
		assert.ok( jQuery.trim(_cls.getTpl("tpl2").html()) === "<div>hi2</div>" , "tests/common/ClassMulti get tempalte count!" );
		assert.ok( jQuery.trim(_cls.getTpl("tpl3").html()) === "<div>hi3</div>" , "tests/common/ClassMulti get tempalte count!" );
		// assert.ok( _cls.getTpl("tpl").html() , "tests/common/ClassMulti get tempalte count!" );		
		// console.log(_cls.getTpl().length);
		assert.ok( true , "tests/common/ClassMulti object create!" );
		// QUnit.start();
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


QUnit.asyncTest( "Class TPL Error test", function( assert ) {

	expect(2);

	JSB.cls("tests/tpl/ClassError", {
		
		tpl:[
			"qunit/tests/tpl/tpl.html",
			"qunit/tests/tpl/tpl2.html",
			"qunit/tests/tpl/tpl3.html",
			"qunit/tests/tpl/tpl4.html"
		],

		initialize: function(options) {



		}

	});

	JSB.classReady("tests/tpl/ClassError",function(){
		QUnit.start();
	},function(){
		assert.ok( true , "Class Error!" );
	});

	JSB.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true , "Fail Ready!" );
		QUnit.start();
	});

	// var _cls = JSB.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.className == "tests/common/Class" , "tests/common/Class object create!" );

});