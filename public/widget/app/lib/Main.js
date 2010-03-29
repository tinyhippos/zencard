// ----------------- Main ----------------- \\
(ZenCard.Main = function ($, JQuery){

    var _barcode_options = {
			"barWidth": 0.13,
			"barHeight": 6.25,
			"output": "css",
			"showHRI": true,
            "fontSize": "1em"
		};

	return {

		initialize: function(){
            $.Persistence.detect();
            
            var waitTime = 3000;

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