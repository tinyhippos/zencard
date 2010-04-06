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

			var el, elParent,
				i, barcodeDiv,
				barcodeTypes = $.Constants.BARCODE_TYPES;

			try{

				barcodeDiv = document.getElementById($.Constants.DIV_BARCODES);

				for (i = 0; i < barcodeTypes.length; i++){

					el = $.Utils.createElement("div", {
						"class": "barcode_generated"
					});

					elParent = $.Utils.createElement("div", {
						"class": "barcode_generated_container"
					});

                    elParent.appendChild(el);
                    barcodeDiv.appendChild(elParent);

                    JQuery(el).barcode(code, barcodeTypes[i], _barcode_options);

					// if generation failed
					if(el.childNodes.length === 0){
						barcodeDiv.removeChild(elParent);
					}


				}

			}
			catch (e){ $.Exception.handle(e); }
		},

		loading: function(){
			$.UI.setBodyBgColour("#FFFFFF")
				.loadView('<div class="ajax_loader"></div>');
		}

	};

}(ZenCard, $));