// ----------------- Utils ----------------- \\
(ZenCard.Utils = function ($, JQuery){

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

		getAllStylesheetRules: function (title){
			this.validateNumberOfArguments(1, 1, arguments.length);

			var i, x, sheet, rules, styles_array = [];

			// get style sheet according to title
			for (i = 0; i < document.styleSheets.length; i += 1) {

				sheet = document.styleSheets[i];
				rules = sheet.cssRules;

				if (rules){
					for (x = 0; x < rules.length; x += 1) {

						if (rules[x].selectorText && rules[x].selectorText === (title.toString())) {
							styles_array.push(rules[x]);
						}
					}
				}
			}

			return(styles_array);
		},

        saveKeyToCategory: function (categoryKey, itemKey) {
            var keysString = $.Persistence.retrieve(categoryKey),
                keys;

            if (!keysString) {
                $.Persistence.save(categoryKey, itemKey);
            }
            else {
                keys = keysString.split($.Constants.persistence.keyDelimiter);
                if (JQuery.inArray(itemKey, keys) === -1) {
                    $.Persistence.save(categoryKey, keysString + $.Constants.persistence.keyDelimiter + itemKey);
                }
                else {
                    // the key is in there already so don't do anything.
                }
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
                        $.Persistence.save(categoryKey, cleanKeysString);
                    }
                    else {
                        cleanKeysString = cleanKeys.join(keyDelimiter);
                        $.Persistence.save(categoryKey, cleanKeysString);
                    }
                }
            }
            catch(e) {
                $.Exception.handle(e);
                return false;
            }
        }
	};

}(ZenCard, $));