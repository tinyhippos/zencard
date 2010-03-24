(ZenCard.Routes = function($, JQuery){

	var _history = [],
		_routes = {

			"index.html": function(){

				$.UI.setLeftNav("Cards", "cards/list.html");
				$.UI.setTitle("ZenCard");
				$.UI.setRightNav("?", "help.html");

				$.Main.loadOptions();

			},

			"help.html": function(){

				$.UI.setLeftNav("Back", $.Main.lastHistoryView(true));

			},

			// Card Specific Routes

			"cards/list.html": function(){

				$.UI.setLeftNav("Back", $.Main.lastHistoryView(true));
				$.UI.setRightNav("+", "cards/add.html");

			},

			"cards/add.html": function(){

				$.UI.setLeftNav("Back", $.Main.lastHistoryView(true));
				$.UI.setRightNav("Home", $.Constants.common.defaultView);

				// bind to Forms submit here
				JQuery("#cards_add_form button").click(function (){
					console.log(JQuery("#cards_add_company_name")[0].value);
					console.log(JQuery("#cards_add_code")[0].value);
				});

			},

			"cards/edit.html": function(){

				$.UI.setLeftNav("Back", $.Main.lastHistoryView(true));
				$.UI.setLeftNav("Home", $.Constants.common.defaultView);

				// bind to Forms submit here
				JQuery("#cards_edit_form button").click(function (){
					console.log(JQuery("#cards_edit_company_name")[0].value);
					console.log(JQuery("#cards_edit_code")[0].value);
				});

			},

			"cards/barcode_select.html": function(){

				$.UI.setLeftNav("Edit Code", "cards/edit.html");
				$.UI.setLeftNav("Edit Code", "cards/edit.html");

			}

		};

	return {

		load: function(view){

			return _routes[view] || null;

		},

		// TODO: add other callback in case callee wants to pass a custom callback not in Routes.
		navigate: function (view){

			try{

				$.Main.loading();

				var xhr = new XMLHttpRequest(),
				callback;

				xhr.onreadystatechange = function (){

					if(this.readyState === 4){
						try{

							$.UI.loadView(this.responseText);

							callback = $.Routes.load(view);

							if (callback){
							callback.call(null);
							}

							$.Main.historyChanged(view, callback);

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

		historyChanged: function(view, callback){
			_history.push([view, callback]);
		},

		lastHistoryView: function (popOff){
			return popOff ? (_history.pop()[0]) : (_history[0][0] || $.Constants.common.defaultView);
		}

	};

}(ZenCard, $));