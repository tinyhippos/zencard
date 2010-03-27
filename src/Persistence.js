(ZenCard.Persistence = function($){

	var _persistenceTypes = {
		"Widget": "Widget",
		"widget": "widget",
		"localstorage": "localstorage"
	},
	_currentPersistence;

	function _isValidPreferenceValue(value){
		return !(value === null || value === 'undefined' || value === 'null' || value === '');
		}

	// attempt to detect persistence
	function _detect(){
		_currentPersistence = _persistenceTypes.localstorage;

		//        if(window && window.localStorage){
		//            _currentPersistence = _persistenceTypes.localstorage;
		//        }
		//        else if(window && window.Widget){
		//            _currentPersistence = _persistenceTypes.Widget;
		//        }
		//        else if(window && window.widget){
		//            _currentPersistence = _persistenceTypes.widget;
		//        }
		//        else{
		//            $.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism.");
		//        }
	}

	function _invokeSave(key, value, prefix){

			prefix = _validateAndSetPrefix(prefix);

			switch(_currentPersistence){
				
				case _persistenceTypes.localstorage:
					localStorage[prefix+key] = value;
					break;

				case _persistenceTypes.Widget:
					Widget.setPreferenceForKey(value, prefix+key);
					break;

				case _persistenceTypes.widget:
					widget.setPreferenceForKey(value, prefix+key);
					break;

				default:
					$.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism.");

		}

	}

	function _invokeRetrieve(key, prefix){

		var result;

		prefix = _validateAndSetPrefix(prefix);

		switch(_currentPersistence){
			
			case _persistenceTypes.localstorage:
				result = localStorage[prefix + key];
				break;

			case _persistenceTypes.Widget:
				result = Widget.preferenceForKey(prefix + key);
				break;

			case _persistenceTypes.widget:
				result = widget.preferenceForKey(prefix + key);
				break;

			default:
				$.Exception.raise($.Exception.types.UnknownPersistence, "Could not detect an appropriate persistence mechanism when attempting to invoke storage call.");

		}

		return result;
	}

	function _invokeRemove(key, prefix){

		var result;

		prefix = _validateAndSetPrefix(prefix);

		switch(_currentPersistence){
			
			case _persistenceTypes.localstorage:
				result = localStorage.removeItem(prefix + key);
				break;

			case _persistenceTypes.Widget:
				result = Widget.setPreferenceForKey(null, prefix + key);
				break;

			case _persistenceTypes.widget:
				result = widget.setPreferenceForKey(null, prefix + key);
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

		return prefix || $.Constants.common.prefix;
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

			_invokeSave(key, value, prefix);

			$.Event.trigger($.Event.eventTypes.storageUpdated);
		},

		saveObject: function (key, obj, prefix){
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.saveObject");
			if (obj) {
				$.Utils.validateArgumentType(obj, "object");
			}

			_invokeSave(key, JSON.stringify(obj), prefix);

			$.Event.trigger($.Event.eventTypes.storageUpdated);
		},

		retrieve: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.retrieve");

			return _invokeRetrieve(key, prefix);
		},

		retrieveObject: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string");

			var retrievedValue = _invokeRetrieve(key, prefix);
			return retrievedValue ? JSON.parse(retrievedValue) : retrievedValue;
		},

		remove: function (key, prefix){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.remove");

			$.Event.trigger($.Event.eventTypes.storageUpdated);

			return _invokeRemove(key, prefix);
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

        //saveArray: function(keys, values){

            //var i,
                //passed = true;

            //for (i = 0; i < keys.length; i++){
                //if (!save(keys[i], values[i])){
                    //passed = false;
                //}
            //}

            //return passed;

        //}

	};
}(ZenCard));