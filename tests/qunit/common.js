_b.addEventListener("log",function(e,message)
{
	console.log(message);
});

QUnit.test( "Define class and init param", function( assert ) {

	_b.define("tests/common/Class", {
		
		initialize: function(options) {

			assert.ok( options.data == "hello world" , "my/Class initialize!" );

		}

	});

	var _cls = _b.create("tests/common/Class",{"data":"hello world"});

	assert.ok( _cls.getName() == "tests/common/Class" , "tests/common/Class object create!" );

});

QUnit.test( "Undefine class Test", function( assert ) {

	expect(2);

	var func = function(e,status){

		if(status.message=="JSB_ERROR_CREATE")
		{
			assert.ok( true , status.message );
		}

		_b.removeEventListener("log",func);

	};

	_b.addEventListener("log",func);

	assert.ok( _b.create("tests/common/Undefine") === false , "JSB_ERROR_CREATE" );

});

QUnit.test( "Define Some Class Test", function( assert ) {

	expect(1);

	var func = function(e,status){
		// console.log(status);

		if(status.message=="JSB_ERROR_CLASS_DEFINE")
		{
			assert.ok( true , status.message );
		}

		_b.removeEventListener("log",func);

	};

	_b.addEventListener("log",func);
	// _b.addEventListener("log",func);

	_b.define("tests/common/Class", {

		initialize: function(options) {


		}

	});

});

QUnit.test( "Singleton class", function( assert ) {

	expect(2);

	_b.define("tests/common/ClassSingleton", {
		
		single:true,

		initialize: function() {

		}

	});

	var _cls = _b.create("tests/common/ClassSingleton");

	assert.ok( _cls.getName() == "tests/common/ClassSingleton" , "tests/common/ClassSingleton object create!" );

	var func = function(e,status){

		if(status.message=="JSB_ERROR_CREATE")
		{
			assert.ok( true , status.message );
		}

		_b.removeEventListener("log",func);

	};

	_b.addEventListener("log",func);

	_b.create("tests/common/ClassSingleton");

});

QUnit.test( "Abstract class", function( assert ) {

	_b.define("abstr/Class", {
		
		abstr:true,

		initialize: function() {

		}

	});

	var func = function(e,status){

		if(status.message=="JSB_ERROR_CREATE")
		{
			assert.ok( true , status.message );
		}

		_b.removeEventListener("log",func);

	};

	_b.addEventListener("log",func);

	_b.create("abstr/Class");

});

QUnit.test( "Class method", function( assert ) {

	_b.define("my/ClassMethod", {
		
		setData:function(data){
			this.data = data;
		},

		getData:function(){
			return this.data;
		},

		initialize: function() {

		}

	});

	_b.classReady("my/ClassMethod",function(){

		assert.ok( 1 , "my/ClassMethod classReady" );

		var _cls = _b.create("my/ClassMethod");

		_cls.setData("hello world");

		assert.ok( _cls.getData()=="hello world" , "ClassMethod getData success!" );

	});

});

QUnit.test( "Class Event test", function( assert ) {

	_b.define("my/event/Node", {

		callback: function() {

			this.dispatchEvent("customEvent", this);

		},

		initialize: function(options) {

		}

	})

	_b.define("my/event/Class", {

		getNode: function() {

			return this._cls_node;

		},

		initialize: function(options) {

			var me = this;

			me._cls_node = _b.create("my/event/Node");

			me._cls_node.addEventListener("customEvent", me._callback);

		},

		_callback: function(e, scope) {

			assert.ok( 1, "customEvent call back!" );

			scope.removeEventListener("customEvent");

		}

	});

	var _cls = _b.create("my/event/Class");

	_cls.getNode().callback();

});

QUnit.test( "Destroy Class test", function( assert ) {

	expect(2);

	_b.define("my/event/ClassDestroy", {

		initialize: function(options) {

			this.addEventListener("destroy", this._destroy_cb);

		},

		_destroy_cb: function(e, scope) {

			assert.ok( 1, "_destroy call back!" );

		}

	});

	var func = function(e,status){
		// console.log(status);
		if(status.message=="JSB_ERROR_CLASS_DESTROY")
		{
			assert.ok( true , status.message );
		}

		_b.removeEventListener("log",func);

	};

	_b.addEventListener("log",func);

	var _cls = _b.create("my/event/ClassDestroy");

	_cls.destroy();
	_cls.destroy();

});

QUnit.test( "Not Ready Class Test", function( assert ) {

	_b.define("tests/common/ClassNotReady", {

		imports:[
			"qunit/tests/common/Class"
		],

		initialize: function(options) {

		}

	});

	var func = function(e,status){
		// console.log(status);
		if(status.message=="JSB_ERROR_CREATE")
		{
			assert.ok( true , status.message );
		}

		_b.removeEventListener("log",func);

	};

	_b.addEventListener("log",func);

	var _cls = _b.create("tests/common/ClassNotReady");

});

QUnit.test( "Class Create Trigger", function( assert ) {

	_b.addEventListener("create",function(e,cls)
	{
		if(cls.getName()=="tests/common/ClassTrigger")
		{
			assert.ok( true , cls.getName() );
		}
	});

	_b.define("tests/common/ClassTrigger", {
		
		initialize: function(options) {

			// assert.ok( options.data == "hello world" , "my/Class initialize!" );

		}

	});
	// var func = function(e,status){
	// 	// console.log(status);
	// 	if(status.message=="JSB_ERROR_CREATE")
	// 	{
			
	// 	}

	// 	_b.removeEventListener("log",func);

	// };

	// _b.addEventListener("log",func);

	var _cls = _b.create("tests/common/ClassTrigger",{},true);

});

QUnit.asyncTest( "Class Import Class Test", function( assert ) {

	expect(1);

	_b.importClass("qunit/tests/common/Class",function(){
		// alert("XD");
		_b.classReady("qunit/tests/common/Class",function(){
			assert.ok( true , "qunit/tests/common/Class" );
			QUnit.start();
		},function(){
			QUnit.start();
		});
		
	},function(){
		QUnit.start();
	});

});

QUnit.asyncTest( "Class Import Class Routing Test", function( assert ) {

	expect(1);

	_b.setConfig({
		imports: {
			parser: {
				"qunit/tests/common": {
					path:'../',
					parser:function(name){
						return name;
					}
				},
				"qunit/tests/common/router":'../'
			}
		}
	});

	_b.importClass(["qunit/tests/common/ClassRouting","qunit/tests/common/router/Class"],function(){
		_b.classReady("qunit/tests/common/ClassRouting",function(){
			assert.ok( true , "ClassRouting!" );
			QUnit.start();
		},function(){
			QUnit.start();
		});
	},function(){
		QUnit.start();
	});

});

QUnit.asyncTest( "Extend Core Test", function( assert ) {

	expect(4);

	_b.importClass(["qunit/tests/common/ClassCore"],function(){

		_b.classReady("qunit/tests/common/ClassCore",function(){
			
			assert.ok( _b.getImportData("qunit/tests/common/ClassCore") != false , "global.obj!" );
			
			assert.ok( global.obj , "global.obj!" );

			assert.ok( global.obj.hello() , "hello world" );


			var func = function(e,status){

				if(status.message=="JSB_ERROR_EXTEND_CORE")
				{
					assert.ok( true , status.message );
				}

				_b.removeEventListener("log",func);

			};

			_b.addEventListener("log",func);

			_b.registerGlobal("global.obj",_b.define("tests/common/ClassCore", {
				
				initialize: function(options) {

				}

			}));

			QUnit.start();
		},function(){
			QUnit.start();
		});
		
	},function(){
		QUnit.start();
	});

});