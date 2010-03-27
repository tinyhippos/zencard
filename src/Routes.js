(ZenCard.Routes = function($, JQuery){

	var _history = [],
		_routes = {

			"index.html": function(){

				$.Routes.clearHistory();

				$.UI.setLeftNav("Cards", "cards/list.html");
				$.UI.setTitle();
				$.UI.setRightNav("?", "help.html");

				//$.Main.loadOptions();

			},

			"help.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());

			},

			// Card Specific Routes

			"cards/list.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());
                $.UI.setTitle("Cards");
				$.UI.setRightNav("+", "cards/add.html");

				// TODO: abstract into a class
				//var cards = $.Persistence.

			},

			"cards/add.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());
                $.UI.setTitle("Add");
				$.UI.setRightNav("?", "help.html");

				// bind to Forms submit here
				JQuery("#cards_add_form button").click(function (){
					console.log(JQuery("#cards_add_company_name")[0].value);
					console.log(JQuery("#cards_add_code")[0].value);
				});

			},

			"cards/edit.html": function(){

				$.UI.setLeftNav("Back", $.Routes.back());
                $.UI.setTitle("Edit");
				$.UI.setLeftNav("Home", $.Constants.common.defaultView);

				// bind to Forms submit here
				JQuery("#cards_edit_form button").click(function (){
					console.log(JQuery("#cards_edit_company_name")[0].value);
					console.log(JQuery("#cards_edit_code")[0].value);
				});

			},

			"cards/barcode_select.html": function(){

				$.UI.setLeftNav("Edit Code", "cards/edit.html");
                $.UI.setTitle("Codes");
				$.UI.setRightNav("Home", $.Constants.common.defaultView);

			}

		};

	return {

		load: function(view){

			return _routes[view] || null;

		},

		clearHistory: function (){
			_history = [];
		},

		back: function (){
			//TODO : hack for now
			return "";
		},

		// TODO: add other callback in case callee wants to pass a custom callback not in Routes.
		// Note: if view is BACK or default view (hack for now) will default to last history item
		navigate: function (view){

			try{

				// TODO: do really better
				if(!view || view === ""){

                    // if im going back I need to remove myself first
                    _history.pop();

                    var lastView = _history.pop();

					view = (lastView && lastView[0]) || $.Constants.common.defaultView;

				}
				
				// TODO: save callback to history (and call it) only if its a custom one (and not Routes)

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

                            $.Routes.historyChanged(view, callback);
							
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
		}

	};

}(ZenCard, $));