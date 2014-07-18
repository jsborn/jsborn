JSB.addEventListener("log",function(e,message)
{
	console.log(message);
});

QUnit.test( "Define class and init param", function( assert ) {

	JSB.cls("tests/common/Class", {
		
		initialize: function(options) {

			assert.ok( options.data == "hello world" , "my/Class initialize!" );

		}

	});

	var _cls = JSB.create("tests/common/Class",{"data":"hello world"});

	assert.ok( _cls.className == "tests/common/Class" , "tests/common/Class object create!" );

});

QUnit.test( "Undefine class Test", function( assert ) {

	expect(2);

	var func = function(e,status){

		if(status.message=="JSB_ERROR_CREATE")
		{
			assert.ok( true , status.message );
		}

		JSB.removeEventListener("log",func);

	};

	JSB.addEventListener("log",func);

	assert.ok( JSB.create("tests/common/Undefine") === false , "JSB_ERROR_CREATE" );

});

QUnit.test( "Define Some Class Test", function( assert ) {

	expect(1);

	var func = function(e,status){
		// console.log(status);

		if(status.message=="JSB_ERROR_CLASS_DEFINE")
		{
			assert.ok( true , status.message );
		}

		JSB.removeEventListener("log",func);

	};

	JSB.addEventListener("log",func);
	// JSB.addEventListener("log",func);

	JSB.cls("tests/common/Class", {

		initialize: function(options) {


		}

	});

});

QUnit.test( "Singleton class", function( assert ) {

	expect(2);

	JSB.cls("tests/common/ClassSingleton", {
		
		single:true,

		initialize: function() {

		}

	});

	var _cls = JSB.create("tests/common/ClassSingleton");

	assert.ok( _cls.className == "tests/common/ClassSingleton" , "tests/common/ClassSingleton object create!" );

	var func = function(e,status){

		if(status.message=="JSB_ERROR_CREATE")
		{
			assert.ok( true , status.message );
		}

		JSB.removeEventListener("log",func);

	};

	JSB.addEventListener("log",func);

	JSB.create("tests/common/ClassSingleton");

});

QUnit.test( "Abstract class", function( assert ) {

	JSB.cls("abstr/Class", {
		
		abstr:true,

		initialize: function() {

		}

	});

	var func = function(e,status){

		if(status.message=="JSB_ERROR_CREATE")
		{
			assert.ok( true , status.message );
		}

		JSB.removeEventListener("log",func);

	};

	JSB.addEventListener("log",func);

	JSB.create("abstr/Class");

});

QUnit.test( "Class method", function( assert ) {

	JSB.cls("my/ClassMethod", {
		
		setData:function(data){
			this.data = data;
		},

		getData:function(){
			return this.data;
		},

		initialize: function() {

		}

	});

	JSB.classReady("my/ClassMethod",function(){

		assert.ok( 1 , "my/ClassMethod classReady" );

		var _cls = JSB.create("my/ClassMethod");

		_cls.setData("hello world");

		assert.ok( _cls.getData()=="hello world" , "ClassMethod getData success!" );

	});

});

QUnit.test( "Class Event test", function( assert ) {

	JSB.cls("my/event/Node", {

		callback: function() {

			this.dispatchEvent("customEvent", this);

		},

		initialize: function(options) {

		}

	})

	JSB.cls("my/event/Class", {

		getNode: function() {

			return this._cls_node;

		},

		initialize: function(options) {

			var me = this;

			me._cls_node = JSB.create("my/event/Node");

			me._cls_node.addEventListener("customEvent", me._callback);

		},

		_callback: function(e, scope) {

			assert.ok( 1, "customEvent call back!" );

			scope.removeEventListener("customEvent");

		}

	});

	var _cls = JSB.create("my/event/Class");

	_cls.getNode().callback();

});

QUnit.test( "Destroy Class test", function( assert ) {

	expect(2);

	JSB.cls("my/event/ClassDestroy", {

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

		JSB.removeEventListener("log",func);

	};

	JSB.addEventListener("log",func);

	var _cls = JSB.create("my/event/ClassDestroy");

	_cls.destroy();
	_cls.destroy();

});

QUnit.test( "Not Ready Class Test", function( assert ) {

	JSB.cls("tests/common/ClassNotReady", {

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

		JSB.removeEventListener("log",func);

	};

	JSB.addEventListener("log",func);

	var _cls = JSB.create("tests/common/ClassNotReady");

});

QUnit.test( "Class Create Trigger", function( assert ) {

	JSB.addEventListener("create",function(e,cls)
	{
		if(cls.className=="tests/common/ClassTrigger")
		{
			assert.ok( true , cls.className );
		}
	});

	JSB.cls("tests/common/ClassTrigger", {
		
		initialize: function(options) {

			// assert.ok( options.data == "hello world" , "my/Class initialize!" );

		}

	});
	// var func = function(e,status){
	// 	// console.log(status);
	// 	if(status.message=="JSB_ERROR_CREATE")
	// 	{
			
	// 	}

	// 	JSB.removeEventListener("log",func);

	// };

	// JSB.addEventListener("log",func);

	var _cls = JSB.create("tests/common/ClassTrigger",{},true);

});

QUnit.asyncTest( "Class Import Class Test", function( assert ) {

	expect(1);

	JSB.importClass("qunit/tests/common/Class",function(){
		// alert("XD");
		JSB.classReady("qunit/tests/common/Class",function(){
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

	JSB.setConfig({
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

	JSB.importClass(["qunit/tests/common/ClassRouting","qunit/tests/common/router/Class"],function(){

		JSB.classReady("qunit/tests/common/ClassRouting",function(){
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

	JSB.importClass(["qunit/tests/common/ClassCore"],function(){

		JSB.classReady("qunit/tests/common/ClassCore",function(){
			
			assert.ok( JSB.getImportData("qunit/tests/common/ClassCore") != false , "global.obj!" );
			
			assert.ok( global.obj , "global.obj!" );

			assert.ok( global.obj.hello() , "hello world" );


			var func = function(e,status){

				if(status.message=="JSB_ERROR_EXTEND_CORE")
				{
					assert.ok( true , status.message );
				}

				JSB.removeEventListener("log",func);

			};

			JSB.addEventListener("log",func);

			JSB.extendCore("global.obj",JSB.cls("tests/common/ClassCore", {
				
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