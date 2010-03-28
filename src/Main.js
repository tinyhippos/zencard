// ----------------- Main ----------------- \\
(ZenCard.Main = function ($, JQuery){

	var _barcode_options = {
			"barWidth": 1,
			"barHeight": 30,
			"output": "svg",
			"showHRI": false
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

			var el,
                i;

			try{

				for (i = 0; i < $.Constants.BARCODE_TYPES.length; i++){

					el = $.Utils.createElement("div", {
						"class": "barcode_generated",
						"onclick": 'alert("selected barcode index ' + i + '");'
					});

					document.getElementById($.Constants.DIV_BARCODES).appendChild(el);

					JQuery(el).barcode(code, $.Constants.BARCODE_TYPES[i], _barcode_options);

				}

			}
			catch (e){ $.Exception.handle(e); }
		},
        
		loading: function(){
			$.UI.loadView('<div class="ajax_loader"></div>');
		}

	};

}(ZenCard, $));