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

    function _setNav(el, text, view){
        el.innerHTML = text;

        el.setAttribute("onmousedown", "ZenCard.Routes.navigate(" + (view ? "'" + view + "'" : "") + ")");
    }

    return {

        loadView: function(str){
            JQuery($.Constants.common.view).html(str);
        },

        // TODO; allow custom callbacks
        setLeftNav: function(text, view, callback){
            _setNav(document.getElementById($.Constants.common.navLeft), text, view);
        },

        setRightNav: function(text, view, callback){
            _setNav(document.getElementById($.Constants.common.navRight), text, view);

        },

        setTitle: function (text){
            JQuery($.Constants.common.headerTitle).html((text === "" || !text) ? "&nbsp;" : text);
        },

        hideHeader: function () {
            JQuery($.Constants.common.header).addClass($.Constants.css.irrelevant);
        },

        showHeader: function () {
            JQuery($.Constants.common.header).removeClass($.Constants.css.irrelevant);
            this.setTitle();
        },

        showPopup: function (text) {
            var popupDiv = document.getElementById("popup");
            popupDiv.attributes["class"].nodeValue = "";
            popupDiv.innerHTML = text;
        },

        hidePopup: function () {
            var popupDiv = document.getElementById("popup");
            popupDiv.attributes["class"].nodeValue = "irrelevant";           
            popupDiv.innerHTML = "";
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
			return window && window.console ? true : false;
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

//	var _barcode_options = {
//			"barWidth": 2,
//			"barHeight": 100,
//			"output": "css",
//			"showHRI": true,
//            "fontSize": "1em"
//		};
//
    var _barcode_options = {
			"barWidth": 0.13,
			"barHeight": 6.25,
			"output": "css",
			"showHRI": true,
            "fontSize": "1em"
		};

	return {

		initialize: function(){
            var waitTime = 1000;

            if ($.Persistence.retrieve($.Constants.persistence.cardKeys)) {
                waitTime = 0;
            }

            setTimeout(function() {
                $.Routes.navigate("cards/list.html");
            }, waitTime);
		},

		generate: function (code){

			var el, i, barcodeDiv, success;

			try{

				for (i = 0; i < $.Constants.BARCODE_TYPES.length; i++){

					el = $.Utils.createElement("div", {
						"class": "barcode_generated",
						"onclick": 'alert("selected barcode index ' + i + '");'
					});

					barcodeDiv = document.getElementById($.Constants.DIV_BARCODES);
                    barcodeDiv.appendChild(el);
                    success = JQuery(el).barcode(code, $.Constants.BARCODE_TYPES[i], _barcode_options);

				}

			}
			catch (e){ $.Exception.handle(e); }
		},
        
		loading: function(){
			$.UI.loadView('<div class="ajax_loader"></div>');
		}

	};

}(ZenCard, $));
(ZenCard.Constants = {
	
	"DIV_BARCODES": "barcodes",

    "css": {
        "irrelevant": "irrelevant"
    },
    "htmlElements": {
        "cardList": "cards_list"
    },

	"common": {
		"view": ".view",
		"viewDirectory": "app/views/",
		"navLeft": "nav_left",
		"navRight": "nav_right",
		"defaultView": "index.html",
		"headerTitle": ".header h1",
		"header": ".header"
	},

    "persistence" : {
        "keyDelimiter": "|",
        "prefix": "zencard-",
        "cardKeys": "cardKeys"
    },

	"SELECT_BARCODES": "barcode_type",
	"BARCODE_TYPES": ["ean13", "ean9", "code128"]
//	"BARCODE_TYPES": ["ean13", "ean9", "code11", "code39", "code128", "codabar", "std25", "int25", "code93", "msi"]

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
		},

        saveKeyToCategory: function (categoryKey, itemKey) {
            var value = $.Persistence.retrieve(categoryKey);

            if (!value) {
                $.Persistence.save(categoryKey, itemKey);
            }
            else {
                $.Persistence.save(categoryKey, value + $.Constants.persistence.keyDelimiter + itemKey);
            }
        },

        removeKeyFromCategory: function (categoryKey, removalKey) {
            var potentialRemovalKeys, cleanKeysString, i,
                cleanKeys = [],
                keyDelimiter = $.Constants.persistence.keyDelimiter,
                potentialRemovalKeysString = $.Persistence.retrieve(categoryKey);

            try {
                if (potentialRemovalKeysString) {
                    potentialRemovalKeys = potentialRemovalKeysString.split(keyDelimiter);
                    for (i = 0; i < potentialRemovalKeys.length; i++){
                        if (potentialRemovalKeys[i] !== removalKey){
                            cleanKeys.push(potentialRemovalKeys[i]);
                        }
                    }
                    if (cleanKeys.length === 0){
                        $.Persistence.remove(categoryKey);
                    }
                    else if (cleanKeys.length == 1){
                        cleanKeysString = cleanKeys[0];
                    }
                    else {
                        cleanKeysString = cleanKeys.join(keyDelimiter);
                    }

                    $.Persistence.save(categoryKey, cleanKeysString);
                }
            }
            catch(e) {
                $.Exception.handle(e);
                return false;
            }
        }
	};

}(ZenCard));
(ZenCard.Cards = function($) {
    var _card = {
        name: "",
        code: "",
        codeType: ""
    };
    
    return {
        get: function(cardName){
            return $.Persistence.retrieveObject(cardName);
        },

        getAllCardNames: function(){
            var namesRaw = $.Persistence.retrieve($.Constants.persistence.cardKeys);

            return namesRaw ? namesRaw.split($.Constants.persistence.keyDelimiter) : null;
        },

        save: function(name, code) {
            var card = $.Copy(_card);
            card.name = name;
            card.code = code;

            $.Utils.saveKeyToCategory($.Constants.persistence.cardKeys, name);
            $.Persistence.saveObject(name, card);
        }
    }
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
			ConsoleMethodNotFound: "ConsoleMethodNotFound",
			UnknownPersistence: "UnknownPersistence"
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

            alert(msg);

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
(ZenCard.Persistence = function($, JQuery){

	var _persistenceTypes = {
		"Widget_1_0": "Widget_1_0",
		"Widget_1_2_1": "Widget_1_2_1",
		"widget": "widget",
		"localstorage": "localstorage",
        "cookie": "cookie"
	},
	_currentPersistence;

	function _sanitizeReturnedValue(value){
        //TODO: deal with nokia and empty string issue
		if(value === null || value === undefined || value === ''){
            return null;
        }
        else {
            return value;
        }
    }

	// attempt to detect persistence
	function _detect(){
        try {
            if(window && window.localStorage){
                _currentPersistence = _persistenceTypes.localstorage;
            }
            else if(window && window.Widget){
                Widget.setPreferenceForKey("tinyHippos_key", "tinyHippos_value");

                if(Widget.preferenceForKey("tinyHippos_key") = "tinyHippos_value"){
                    _currentPersistence = _persistenceTypes.Widget_1_0;
                }
                else if (Widget.preferenceForKey("tinyHippos_value") = "tinyHippos_key") {
                    _currentPersistence = _persistenceTypes.Widget_1_2_1;
                }
                else {
                    $.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism for Widget.");
                }
            }
            else if(window && window.widget){
                _currentPersistence = _persistenceTypes.widget;
            }
            else if (JQuery.cookie) {
                _currentPersistence = _persistenceTypes.cookie;
            }
            else{
                $.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism.");
            }
        }
        catch(e) {
            $.Exception.handle(e);
        }
	}

	function _save(key, value, prefix){

		prefix = _validateAndSetPrefix(prefix);

		switch(_currentPersistence){
			
			case _persistenceTypes.localstorage:
				localStorage[prefix+key] = value;
				break;

			case _persistenceTypes.Widget_1_0:
				Widget.setPreferenceForKey(value, prefix+key);
				break;

			case _persistenceTypes.Widget_1_2_1:
				Widget.setPreferenceForKey(prefix+key, value);
				break;

			case _persistenceTypes.widget:
				widget.setPreferenceForKey(value, prefix+key);
				break;
            case _persistenceTypes.cookie:
                JQuery.cookie(prefix+key, value);
                break;

			default:
				$.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism.");

		}

	}

	function _retrieve(key, prefix){

		var result;

		prefix = _validateAndSetPrefix(prefix);

		switch(_currentPersistence){
			
			case _persistenceTypes.localstorage:
				result = localStorage[prefix + key];
				break;

			case _persistenceTypes.Widget_1_0:
			case _persistenceTypes.Widget_1_2_1:
				result = Widget.preferenceForKey(prefix + key);
				break;

			case _persistenceTypes.widget:
				result = widget.preferenceForKey(prefix + key);
				break;

            case _persistenceTypes.cookie:
                result = JQuery.cookie(prefix+key);
                break;

			default:
				$.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism when attempting to invoke storage call.");

		}

		return _sanitizeReturnedValue(result);
	}

	function _remove(key, prefix){

		var result;

		prefix = _validateAndSetPrefix(prefix);

		switch(_currentPersistence){
			
			case _persistenceTypes.localstorage:
				result = localStorage.removeItem(prefix + key);
				break;

			case _persistenceTypes.Widget_1_0:
				result = Widget.setPreferenceForKey(prefix + key, null);
				break;

			case _persistenceTypes.Widget_1_2_1:
				result = Widget.setPreferenceForKey(null, prefix + key);
				break;

			case _persistenceTypes.widget:
				result = widget.setPreferenceForKey(null, prefix + key);
				break;

            case _persistenceTypes.cookie:
                result = JQuery.cookie(prefix+key, null);
                break;

			default:
				$.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism when attempting to invoke storage call.");

		}

		return result;
	}

	function _validateAndSetPrefix(prefix) {
		if (prefix) {
			$.Utils.validateArgumentType(prefix, "string");
		}

		return prefix || $.Constants.persistence.prefix;
	}

	// DETECT persistence
	_detect();

	// Public properties/methods
	return {
		
		currentPersistence: function(){
			return $.Copy(_persistenceTypes[_currentPersistence]);
		},

		set: function(persistenceType){
			$.Utils.validateNumberOfArguments(1, 1, arguments.length);
			$.Utils.validateArgumentType(persistenceType, "string", null, "Persistence.set");

			_currentPersistence = persistenceType;
		},

		save: function (key, value, prefix){
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.save");

			if (value) {
				$.Utils.validateArgumentType(value, "string");
			}

			_save(key, value, prefix);

			$.Event.trigger($.Event.eventTypes.storageUpdated);
		},

		saveObject: function (key, obj, prefix){
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.saveObject");
			if (obj) {
				$.Utils.validateArgumentType(obj, "object");
			}

			_save(key, JSON.stringify(obj), prefix);

			$.Event.trigger($.Event.eventTypes.storageUpdated);
		},

		retrieve: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.retrieve");

			return _retrieve(key, prefix);
		},

		retrieveObject: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string");

			var retrievedValue = _retrieve(key, prefix);
			return retrievedValue ? JSON.parse(retrievedValue) : retrievedValue;
		},

		remove: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.remove");

			$.Event.trigger($.Event.eventTypes.storageUpdated);

			return _remove(key, prefix);
		},

		removeAllLocalStorage: function (prefix) {
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
}(ZenCard, $));
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


			},

			"help.html": function(){

				$.UI.setLeftNav("Back");

			},
            
			"about.html": function(){

				$.UI.setLeftNav("Back");

			},

			// Card Specific Routes

			"cards/list.html": function(){
                var cardNames,
                    i,
                    cardContainer;
                    listContainer = document.getElementById($.Constants.htmlElements.cardList);

                $.UI.showHeader();
				$.UI.setLeftNav("About", "about.html");
				$.UI.setTitle("ZenCards");				
				$.UI.setRightNav("+", "cards/add.html");

				cardNames = $.Cards.getAllCardNames();
                if (cardNames) {
                    for (i = 0; i < cardNames.length; i++) {
                        cardContainer = $.Utils.createElement("div",{
                                            "class": "card_to_select"
                                        });
                        cardContainer.appendChild(
                                    $.Utils.createElement("a",{
                                        "onmousedown": "ZenCard.Routes.navigate('cards/barcode_select.html', ['" + cardNames[i] + "'])",
                                        "innerHTML": cardNames[i]
                                    })
                                );
                        listContainer.appendChild(cardContainer);
                    }
                }
                else {
                    $.UI.showPopup("Welcome to ZenCard!<br /><br /> Let's get started by adding a membership / loyalty card. Press the + button at the top right to start. <br /><br /> May all your cards be one...");
                }
			},

			"cards/add.html": function(){

                $.UI.showHeader();
				$.UI.setLeftNav("Back");
				$.UI.setTitle("Add");
				$.UI.setRightNav("?", "help.html");

				// bind to Forms submit here
				JQuery("#cards_add_form button").click(function (){
                    var name = JQuery("#cards_add_company_name")[0] ? JQuery("#cards_add_company_name")[0].value : "",
                        code = JQuery("#cards_add_code")[0] ? JQuery("#cards_add_code")[0].value : "",
                        msg = "";

                    if (name === "") {
                        msg = "* Please enter a company/card name.\n\n";
                    }
                    else {
                        if (name.length > 50) {
                            msg = "* Company/card name must be less then 50 characters long.\n\n";
                        }
                    }

                    if (code === "") {
                        msg += "* Please enter the numeric barcode found on your card";
                    }

                    if (msg !== "") {
                        alert(msg);
                    }
                    else {
                        $.Cards.save(JQuery("#cards_add_company_name")[0].value, JQuery("#cards_add_code")[0].value);
                        $.Routes.navigate("cards/barcode_select.html", [name]);
                    }
				});

			},

			"cards/edit.html": function(){

				$.UI.setLeftNav("Back");
				$.UI.setTitle("Edit");
				$.UI.setLeftNav("Home", $.Constants.common.defaultView);

				// bind to Forms submit here
				JQuery("#cards_edit_form button").click(function (){
					console.log(JQuery("#cards_edit_company_name")[0].value);
					console.log(JQuery("#cards_edit_code")[0].value);
				});

			},

			"cards/barcode_select.html": function(cardName){
                var card;

				$.UI.setLeftNav("Back");
				$.UI.setTitle();
				$.UI.setRightNav("?", "help.html");
                card = $.Cards.get(cardName);

                document.getElementById("cardName").innerHTML = cardName;

                $.Main.generate(card.code);

			}

		};

	return {

		load: function(view){

			return _routes[view] || null;

		},

		clearHistory: function (){
			_history = [];
		},

		// TODO: add other callback in case callee wants to pass a custom callback not in Routes.
		// Note: if view is BACK or default view (hack for now) will default to last history item
		navigate: function (view, params){

            $.UI.hidePopup();

			try{

				if(!view){

                    // if im going back I need to remove myself first
					_history.pop();

					var lastView = _history.pop();

					view = (lastView && lastView[0]) || $.Constants.common.defaultView;
					params = (lastView && lastView[2]) || null;

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
								callback.apply(null, params);
							}

							$.Routes.historyChanged(view, callback, params);
							
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
		
		historyChanged: function(view, callback, params){
			_history.push([view, callback, params]);
		}

	};

}(ZenCard, $));
