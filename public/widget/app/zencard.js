/* 
  Zencard :: zencard.mobi 

  --> Licensed Under
  
  The MIT License
  http://www.opensource.org/licenses/mit-license.php
  
  Copyright (c) 2010 all contributors:
  
  tinyHippos Inc.
  	Dan Silivestru
  	Brent Lintner
  
  CuteGecko 
  	Karl Allen-Muncey
  	Amy Vandenberg
  
*/
// ----------------- Main ----------------- \\
(ZenCard.UI = function ($, JQuery){

    function _setNav(id, text, view){
        var el = document.getElementById(id);
        // TODO: dont do this..
        el.setAttribute("onclick", "ZenCard.Routes.navigate('" + view + "')");
        JQuery("#" + id + " span").html(text);
    }

    return {

        loadView: function(str){
            JQuery($.Constants.common.view).html(str);
        },

        // TODO; allow custom callbacks
        setLeftNav: function(text, view, callback){
            _setNav($.Constants.common.navLeft, text, view);
        },

        setRightNav: function(text, view, callback){
            _setNav($.Constants.common.navRight, text, view);

        },

        setTitle: function (text){
            JQuery($.Constants.common.headerTitle).html(text);
        }
		

    };

}(ZenCard, $));
/*
 * Class: Console
 * Purpose: Perform various functions with the browser javasript console
 */
(ZenCard.Console = function ($) {


	var _buffer = "",
			_options = {
			"append": "append"
		};

	return {

		isAvailable: function(){
			return console ? true : false;
		},

		/*
		 * Public Method: returns all available logging options (only supports append at this time)
		 * Purpose:
		 */
		getOptions: function (){
			return $.Copy(_options);
		},

		/*
		 * Public Method:
		 * Purpose:
		 */
		bufferLog: function(msg, options, method){

			if(!console){ $.Exception.raise($.Exception.types.ConsoleNotFound, "console was not found or is falsy."); }
			if(!console[method]){ $.Exception.raise($.Exception.types.ConsoleMethodNotFound, "console method "+method+" was not found or is falsy."); }

			options = options || {};

			_buffer += msg;

			if (options !== _options.append){
				console[method](_buffer);
				_buffer = "";
			}

		},

		/*
		 * Public Method:
		 * Purpose:
		 */
		log: function (msg, options) {
			$.Utils.validateNumberOfArguments(0, 2, arguments.length);
			this.bufferLog(msg, options, "log");
		},

         /*
		 * Public Method:
		 * Purpose:
		 */
		logObj: function (obj) {
			$.Utils.validateNumberOfArguments(1, 1, arguments.length);
			console.log(obj);
		},

		/*
		 * Public Method:
		 * Purpose:
		 */
		warn: function(msg, options){
			$.Utils.validateNumberOfArguments(0, 2, arguments.length);
			this.bufferLog(msg, options, "warn");
		},

		/*
		 * Public Method:
		 * Purpose:
		 */
		error: function(msg, options){
			$.Utils.validateNumberOfArguments(0, 2, arguments.length);
			this.bufferLog(msg, options, "error");
		},

		/*
		 * Public Method:
		 * Purpose:
		 */
		clear: function(){
			console.clear();
		},

		/*
		 * Public Method:
		 * Purpose:
		 */
		transactionBegin: function(title){
			console.group(title);
		},

		/*
		 * Public Method:
		 * Purpose:
		 */
		transactionEnd: function(){
			console.groupEnd();
		}

	};

}(ZenCard));
// ----------------- Main ----------------- \\
(ZenCard.Main = function ($, JQuery){

	var _SELECT_BARCODES = "barcode_type",
		_BARCODE_TYPES = ["ean13", "ean9", "code11", "code39", "code128", "codabar", "std25", "int25", "code93", "msi"],
		_barcode_options = {
			"barWidth": 1,
			"barHeight": 30,
			"output": "svg",
			"showHRI": false
		};

	return {

		generate: function (code){
		
			var el;

			try{

				for (var i = 0; i < _BARCODE_TYPES.length; i++){

					el = $.Utils.createElement("div", {
						"class": "barcode_generated",
						"onclick": 'alert("selected barcode index ' + i + '");'
					});

					document.getElementById($.Constants._DIV_BARCODES).appendChild(el);

					JQuery(el).barcode(code, _BARCODE_TYPES[i], _barcode_options);

				}

			}
			catch (e){ $.Exception.handle(e); }
		},

		loadOptions: function (){
			var select = document.getElementById(_SELECT_BARCODES),
				i;

			for (i = 0; i < _BARCODE_TYPES.length; i+=1){
				select.appendChild($.Utils.createElement("option", {
					"value": _BARCODE_TYPES[i],
					innerHTML: _BARCODE_TYPES[i]
				}));
			}

		},

		loading: function(){
			$.UI.loadView('<div class="ajax_loader"></div>');
		}

	};

}(ZenCard, $));
(ZenCard.Constants = {
	
	"_DIV_BARCODES": "barcodes",

	"common": {
		"prefix": "zencard-",
		"view": ".view",
		"viewDirectory": "app/views/",
		"navLeft": "nav_left",
		"navRight": "nav_right",
		"defaultView": "index.html",
		"headerTitle": ".header h1"
	}

});
// ----------------- Utils ----------------- \\
(ZenCard.Utils = function ($){

	return {

		createElement: function(elementType, attributes){

			attributes = attributes || {};

			this.validateNumberOfArguments(1, 2, arguments.length);

			var d = document.createElement(elementType);

			for (var attr in attributes){

				if(attributes.hasOwnProperty(attr)){
					
					switch (attr.toLowerCase()){

						case "innerhtml":
						d.innerHTML = attributes[attr];
						break;

						case "innertext":
						d.innerText = attributes[attr];
						break;

						default:
						d.setAttribute(attr,attributes[attr]);
						
					}
					
				}

			}

			return d;
		},

		validateNumberOfArguments: function (lowerBound, upperBound, numberOfArguments){

			if (arguments.length < 3 || arguments.length > 3) {
				$.Exception.raise($.Exception.types.Argument, "Wrong number of arguments when calling: tinyHippos.Utils.validateNumberOfArguments()");
			}

			if (isNaN(lowerBound) && isNaN(upperBound) && isNaN(numberOfArguments)) {
				$.Exception.raise($.Exception.types.ArgumentType, "Arguments are not numbers");
			}

			lowerBound = parseInt(lowerBound, 10);
			upperBound = parseInt(upperBound, 10);
			numberOfArguments = parseInt(numberOfArguments, 10);

			if (numberOfArguments < lowerBound || numberOfArguments > upperBound) {
				$.Exception.raise($.Exception.types.ArgumentLength, "Wrong number of arguments");
			}

		},

		validateArgumentType: function (arg, argType){
			var invalidArg = false;
			
			switch (argType) {
				case "array":
					if (!arg instanceof Array){ invalidArg = true; }
					break;
				case "date":
					if (!arg instanceof Date){ invalidArg = true; }
					break;
				default:
					if (typeof arg !== argType){ invalidArg = true; }
				break;
			}
			if(invalidArg) {
				$.Exception.raise($.Exception.types.ArgumentType, "Invalid Argument type. argument: " + arg + " ==> was expected to be of type: " + argType);
			}
		},

		validateMultipleArgumentTypes: function (argArray, argTypeArray){
			for (var i = 0; i < argArray.length; i+=1){
				this.validateArgumentType(argArray[i], argTypeArray[i]);
			}
		}

	};

}(ZenCard));
(ZenCard.Exception = function ($){

	return {

		types: {
			ArgumentLength: "ArgumentLength",
			ArgumentType: "ArgumentType",
			Argument: "Argument", 
			DomObjectNotFound: "DomObjectNotFound",
			MethodNotImplemented: "MethodNotImplemented",
			InvalidState: "InvalidState",
			TestSuite: "TestSuiteException",
			ConsoleNotFound: "ConsoleNotFound",
			ConsoleMethodNotFound: "ConsoleMethodNotFound"
		},

		handle: function(exception, reThrow){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);

			reThrow = reThrow || false;

            // TODO: find out why jsUnity stops running if line below is deleted
			$.Utils.validateMultipleArgumentTypes(arguments, ['object', 'boolean']);

			var eMsg = exception.message || "exception caught!",
				msg = eMsg+"\n\n"+(exception.stack || "*no stack provided*")+"\n\n";


			// TODO: make this more robust (i.e. catch errors that could mangle logging an error to non-existence console or markup), also log Exception name
			if($.Console.isAvailable()){
				$.Console.error(msg);
			}

			if (reThrow){
				throw exception;
			}
		},

		raise: function(exceptionType, message, customExceptionObject){
			$.Utils.validateNumberOfArguments(1, 3, arguments.length);

			var obj = customExceptionObject || {};
			message = message || "";

			$.Utils.validateMultipleArgumentTypes([exceptionType, message, obj], ['string', 'string', 'object']);

			obj.name = exceptionType;
			obj.type = exceptionType;
			obj.message = message;

			if($.Console.isAvailable()){ $.Console.error(obj); }

			throw obj;
		}


	};

}(ZenCard));
(ZenCard.Persistence = function($){

	var _persistenceTypes = {
			"widget": 0,
			"localstorage": 1
		},
		_currentPersistence;

	function _validateAndSetPrefix(prefix) {
		if (prefix) {
			$.Utils.validateArgumentType(prefix, "string");
		}

		return prefix || $.Constants.common.prefix;
	}

	return {
		save: function (key, value, prefix){
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.save");
			
			if (value) {
				$.Utils.validateArgumentType(value, "string");
			}

			localStorage[_validateAndSetPrefix(prefix)+key] = value;

			$.Event.trigger($.Event.eventTypes.storageUpdated);
		},

		saveObject: function (key, obj, prefix){
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.saveObject");
			if (obj) {
				$.Utils.validateArgumentType(obj, "object");
			}

			localStorage[_validateAndSetPrefix(prefix)+key] = JSON.stringify(obj);

			$.Event.trigger($.Event.eventTypes.storageUpdated);
		},

		retrieve: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.retrieve");

			return localStorage[_validateAndSetPrefix(prefix)+key];
		},

		retrieveObject: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string");

			var retrievedValue = localStorage[_validateAndSetPrefix(prefix)+key];
			return retrievedValue ? JSON.parse(retrievedValue) : retrievedValue;
		},

		remove: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.remove");

			$.Event.trigger($.Event.eventTypes.storageUpdated);

			return localStorage.removeItem(_validateAndSetPrefix(prefix)+key);
		},

		removeAll: function (prefix) {
			$.Utils.validateNumberOfArguments(0, 1, arguments.length);

			prefix = _validateAndSetPrefix(prefix);

			// loop over keys and regex out the ones that have our prefix and delete them
			for (var key in localStorage) {
				if (key.match("^"+prefix)) {
					localStorage.removeItem(key);
				}
			}

			$.Event.trigger($.Event.eventTypes.storageUpdated);
		}
	};
}(ZenCard));
// clone code courtesy of: http://my.opera.com/GreyWyvern/blog/show.dml/1725165
// but modified and tightened by Dan Silivestru, Brent Lintner
(ZenCard.Copy = function($){
    return (function(obj) {

        var i,
            newObj = (obj instanceof Array) ? [] : {};
        if( typeof obj === 'number' || typeof obj === 'string' || typeof obj === 'boolean'){
            return obj;
        }

        if(obj instanceof Date){
            newObj = new Date(obj);
            return newObj;
        }

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (obj[i] && typeof obj[i] === "object") {
                    if (obj[i] instanceof Date) {
                        newObj[i] = obj[i];
                    }
                    else {
                        newObj[i] = $.Copy(obj[i]);
                    }
                } else { newObj[i] = obj[i]; }
            }
        }


        return newObj;
    });
}(ZenCard));

/*
 * Class: Event
 * Purpose: publish-subscribe Event class for DOM based and non-DOM based event facilitation
 * kudos: http://blog.jcoglan.com/2010/02/21/events-theyre-not-just-for-the-dom-you-know/
 */
(ZenCard.Event = function ($){

		var _listeners = {};

		return {

			eventTypes: {
                storageUpdated: "storageUpdated",
                ApplicationState:"ApplicationState"
			},

			on: function (eventType, listener, scope) {
				$.Utils.validateNumberOfArguments(2, 3, arguments.length);
				$.Utils.validateMultipleArgumentTypes(arguments, ["string", "function", "object"]);
				var listenerList = _listeners[eventType] = _listeners[eventType] || [];
				listenerList.push([listener, scope]);
			},

			trigger: function (eventType, args) {
				args = args || [];
				$.Utils.validateNumberOfArguments(1, 2, arguments.length);
				$.Utils.validateMultipleArgumentTypes(arguments, ["string", "array"]);

				if (!_listeners || !_listeners[eventType]) {
					return;
				}

				var i, listenerList = _listeners[eventType];

				for (i = 0; i < listenerList.length; i+=1) {
					try {
						listenerList[i][0].apply(listenerList[i][1], args);
					}
					catch (e) {
						$.Exception.handle(e);
					}
				}
			},

			eventHasSubscriber: function (eventType){
				$.Utils.validateNumberOfArguments(1, 1, arguments.length);
				$.Utils.validateArgumentType(eventType, "string");
				return _listeners[eventType] ? true : false;
			},

			getEventSubscribers: function (eventType) {
				$.Utils.validateNumberOfArguments(1, 1, arguments.length);
				$.Utils.validateArgumentType(eventType, "string");
				return $.Copy(_listeners[eventType]) || [];
			}

    };

}(ZenCard));

(ZenCard.Routes = function($, JQuery){

	var _history = [],
		_routes = {

			"index.html": function(){

				$.Routes.clearHistory();

				$.UI.setLeftNav("Cards", "cards/list.html");
				$.UI.setTitle("ZenCard");
				$.UI.setRightNav("?", "help.html");

				//$.Main.loadOptions();

			},

			"help.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());

			},

			// Card Specific Routes

			"cards/list.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());
				$.UI.setRightNav("+", "cards/add.html");

				// TODO: abstract into a class
				//var cards = $.Persistence.

			},

			"cards/add.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());
				$.UI.setRightNav("?", "help.html");

				// bind to Forms submit here
				JQuery("#cards_add_form button").click(function (){
					console.log(JQuery("#cards_add_company_name")[0].value);
					console.log(JQuery("#cards_add_code")[0].value);
				});

			},

			"cards/edit.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());
				$.UI.setLeftNav("Home", $.Constants.common.defaultView);

				// bind to Forms submit here
				JQuery("#cards_edit_form button").click(function (){
					console.log(JQuery("#cards_edit_company_name")[0].value);
					console.log(JQuery("#cards_edit_code")[0].value);
				});

			},

			"cards/barcode_select.html": function(){

				$.UI.setLeftNav("Edit Code", "cards/edit.html");
				$.UI.setRightNav("Home", $.Constants.common.defaultView);

			}

		};

	return {

		load: function(view){

			return _routes[view] || null;

		},

		clearHistory: function (){
			_history = [];
		},

		back: function (){
			//TODO : hack for now
			return "";
		},

		// TODO: add other callback in case callee wants to pass a custom callback not in Routes.
		// Note: if view is BACK or default view (hack for now) will default to last history item
		navigate: function (view){

			try{

				var goingBackInTime = false,
					tempHistoryItem;

				// TODO: do really better
				if(view === ""){
					_history.pop();
					tempHistoryItem = _history.pop();
					view = ((tempHistoryItem && tempHistoryItem[0]) || $.Constants.common.defaultView);
					goingBackInTime = true;
				}	
				
				// TODO: save callback to history (and call it) only if its a custom one (and not Routes)

				$.Main.loading();

				var xhr = new XMLHttpRequest(),
					callback;

				xhr.onreadystatechange = function (){

					if(this.readyState === 4){
						
						try{

							$.UI.loadView(this.responseText);

							callback = $.Routes.load(view);

							if (callback){
								callback.call(null);
							}

							if(!goingBackInTime){
								$.Routes.historyChanged(view, callback);
							}
							
						}
						catch (e){
							$.Exception.handle(e);
						}

					}

				};

				xhr.open("GET", $.Constants.common.viewDirectory + view);

				xhr.send(null);
			}
			catch (e){
				$.Exception.handle(e);
			}

		},
		
		historyChanged: function(view, callback){
			_history.push([view, callback]);
		}

	};

}(ZenCard, $));
