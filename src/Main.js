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
            $.Routes.navigate($.Constants.common.defaultView);
        },

		generate: function (code){
		
			var el;

			try{

				for (var i = 0; i < $.Constants.BARCODE_TYPES.length; i++){

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

		loadOptions: function (){
			var select = document.getElementById($.Constants.SELECT_BARCODES),
				i;

			for (i = 0; i < $.Constants.BARCODE_TYPES.length; i+=1){
				select.appendChild($.Utils.createElement("option", {
					"value": $.Constants.BARCODE_TYPES[i],
					innerHTML: $.Constants.BARCODE_TYPES[i]
				}));
			}

		},

		loading: function(){
			$.UI.loadView('<div class="ajax_loader"></div>');
		}

	};

}(ZenCard, $));