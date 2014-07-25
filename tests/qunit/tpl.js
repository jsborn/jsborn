_b.addEventListener("log",function(e,message)
{
	console.log(message);
});
_b.addEventListener("classReady",function(e,clsName)
{
	console.log(clsName);
});
QUnit.asyncTest( "Class TPL test", function( assert ) {

	expect(2);

	_b.define("tests/tpl/Class", {
		
		tpl:"qunit/tests/tpl/tpl.html",

		initialize: function(options) {



		}

	});

	_b.classReady("tests/tpl/Class",function(){
		assert.ok( _b.create("tests/tpl/Class")!==false , "tests/tpl/Class object create!" );		
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

QUnit.asyncTest( "Class Multi TPL test", function( assert ) {

	expect(6);

	_b.define("tests/tpl/ClassMulti", {
		
		tpl:[
			"qunit/tests/tpl/tpl.html",
			"qunit/tests/tpl/tpl2.html",
			"qunit/tests/tpl/tpl3.html"
		],

		initialize: function(options) {



		}

	});

	_b.classReady("tests/tpl/ClassMulti",function(){

		var _cls = _b.create("tests/tpl/ClassMulti");

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

	_b.ready(function(){
		assert.ok( true , "all Class Ready!" );		
		QUnit.start();
	},function(){
		QUnit.start();
	});

	// var _cls = _b.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.getName() == "tests/common/Class" , "tests/common/Class object create!" );

});


QUnit.asyncTest( "Class TPL Error test", function( assert ) {

	expect(2);

	_b.define("tests/tpl/ClassError", {
		
		tpl:[
			"qunit/tests/tpl/tpl.html",
			"qunit/tests/tpl/tpl2.html",
			"qunit/tests/tpl/tpl3.html",
			"qunit/tests/tpl/tpl4.html"
		],

		initialize: function(options) {



		}

	});

	_b.classReady("tests/tpl/ClassError",function(){
		QUnit.start();
	},function(){
		assert.ok( true , "Class Error!" );
	});

	_b.ready(function(){
		QUnit.start();
	},function(){
		assert.ok( true , "Fail Ready!" );
		QUnit.start();
	});

	// var _cls = _b.create("tests/common/Class",{"data":"hello world"});

	// assert.ok( _cls.getName() == "tests/common/Class" , "tests/common/Class object create!" );

});