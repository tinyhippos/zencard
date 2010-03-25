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