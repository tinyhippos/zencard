
// ----------------- Utils ----------------- \\
(ZenCard.Utils = function ($, JQuery){

    var _DIV_BARCODES = "#barcodes";

    return {
        
        clear: function (){
            document.getElementById(_DIV_BARCODES.replace("#","")).innerHTML = "";
        },

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
				$.Exception.throwException($.Exception.types.Argument, "Wrong number of arguments when calling: tinyHippos.Utils.validateNumberOfArguments()");
			}

			if (isNaN(lowerBound) && isNaN(upperBound) && isNaN(numberOfArguments)) {
				$.Exception.throwException($.Exception.types.ArgumentType, "Arguments are not numbers");
			}

			lowerBound = parseInt(lowerBound, 10);
			upperBound = parseInt(upperBound, 10);
			numberOfArguments = parseInt(numberOfArguments, 10);

			if (numberOfArguments < lowerBound || numberOfArguments > upperBound) {
				$.Exception.throwException($.Exception.types.ArgumentLength, "Wrong number of arguments");
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
            if(invalidArg) { $.Exception.throwException($.Exception.types.ArgumentType, "Invalid Argument type. argument: " + arg + " ==> was expected to be of type: " + argType); }
		},

		validateMultipleArgumentTypes: function (argArray, argTypeArray){
			for (var i = 0; i < argArray.length; i+=1){
                this.validateArgumentType(argArray[i], argTypeArray[i]);
            }
		}
        
    };
    
}(ZenCard, $));


// ----------------- Exception ----------------- \\
(ZenCard.Exception = function ($, JQuery){

	return {

        types: {
            ArgumentLength: "ArgumentLength",
            ArgumentType: "ArgumentType",
            Argument: "Argument", 
            DomObjectNotFound: "DomObjectNotFound",
            MethodNotImplemented: "MethodNotImplemented",
            InvalidState: "InvalidState"
        },

		handle: function(exception, reThrow){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);

			reThrow = reThrow || false;

			$.Utils.validateMultipleArgumentTypes(arguments, ['object', 'boolean']);
			
			var eMsg = exception.message || "exception caught!",
				msg = eMsg+"\n\n"+(exception.stack || "*no stack provided*")+"\n\n",
				smallMsg;

			console.error(e.name);
            console.error(e.message);
            console.error(e.stack);

			if (reThrow){
				throw exception;
			}

		},

		throwException: function(exceptionType, message){
			$.Utils.validateNumberOfArguments(1, 2, arguments.length);

			message = message || "";

			$.Utils.validateMultipleArgumentTypes(arguments, ['string', 'string']);

			throw {name: exceptionType, message: message};
		}

	};

}(ZenCard, $));