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


	function _save(key, value, prefix){

		prefix = _validateAndSetPrefix(prefix);

		switch(_currentPersistence){
			
			case _persistenceTypes.localstorage:
				localStorage[prefix+key] = value;
				break;

			case _persistenceTypes.Widget_1_0:
                Widget.setPreferenceForKey(prefix+key, value);
				break;

			case _persistenceTypes.Widget_1_2_1:
                Widget.setPreferenceForKey(value, prefix+key);
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
			
			case _persistenceTypes.Widget_1_0:
				result = Widget.setPreferenceForKey(prefix + key, null);
				break;

			case _persistenceTypes.Widget_1_2_1:
				result = Widget.setPreferenceForKey(null, prefix + key);
				break;

			case _persistenceTypes.widget:
				result = widget.setPreferenceForKey(null, prefix + key);
				break;

            case _persistenceTypes.localstorage:
                result = localStorage.removeItem(prefix + key);
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
	//_detect();

	// Public properties/methods
	return {
        // attempt to detect persistence
        detect: function(){
            try {
                if(window && window.Widget){
                    Widget.setPreferenceForKey("tinyHippos_key", "tinyHippos_value");

                    if(Widget.preferenceForKey("tinyHippos_key") === "tinyHippos_value"){
                        _currentPersistence = _persistenceTypes.Widget_1_0;
                    }
                    else if (Widget.preferenceForKey("tinyHippos_value") === "tinyHippos_key") {
                        _currentPersistence = _persistenceTypes.Widget_1_2_1;
                    }
                    else {
                        $.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism for Widget.");
                    }
                }
                else if(window && window.widget){
                    _currentPersistence = _persistenceTypes.widget;
                }
                else if(window && window.localStorage){
                    _currentPersistence = _persistenceTypes.localstorage;
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
        },

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