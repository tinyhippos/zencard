(ZenCard.Routes = function($, JQuery){

	var _history = [],
		_routes = {

			"index.html": function(){

				$.Routes.clearHistory();


			},

			"help.html": function(){

				$.UI.setLeftNav("Back");

			},
            
			"about.html": function(){

				$.UI.setLeftNav("Back");

			},

			// Card Specific Routes

			"cards/list.html": function(){
                var cardNames,
                    i,
                    nameContainer = document.getElementById($.Constants.htmlElements.cardList);

                $.UI.showHeader();
				$.UI.setLeftNav("About", "about.html");
				$.UI.setTitle("Cards");				
				$.UI.setRightNav("+", "cards/add.html");

				cardNames = $.Cards.getAllCardNames();
                if (cardNames) {
                    for (i = 0; i < cardNames.length; i++) {
                        nameContainer.appendChild(
                                $.Utils.createElement("div",{
                                    "class": "card_to_select",
                                    "innerHTML": cardNames[i]
                                })
                        )
                    }
                }
                else {
                    $.UI.showPopup("Welcome to ZenCard!<br /><br /> Let's get started by adding a membership / loyalty card. Press the + button at the top right to start. <br /><br /> May all your cards be one...");
                }
			},

			"cards/add.html": function(){

                $.UI.showHeader();
				$.UI.setLeftNav("Back");
				$.UI.setTitle("Add");
				$.UI.setRightNav("?", "help.html");

				// bind to Forms submit here
				JQuery("#cards_add_form button").click(function (){
                    var name = JQuery("#cards_add_company_name")[0] ? JQuery("#cards_add_company_name")[0].value : "",
                        code = JQuery("#cards_add_code")[0] ? JQuery("#cards_add_code")[0].value : "",
                        msg = "";

                    if (name === "") {
                        msg = "* Please enter a company/card name.<br /><br />";
                    }
                    else {
                        if (name.length > 50) {
                            msg = "* Company/card name must be less then 50 characters long.<br /><br />";
                        }
                    }

                    if (code === "") {
                        msg += "* Please enter the numeric barcode found on your card";
                    }

                    if (msg !== "") {
                        alert(msg);
                    }
                    else {
                        $.Cards.save(JQuery("#cards_add_company_name")[0].value, JQuery("#cards_add_code")[0].value);
                        $.Routes.navigate("cards/barcode_select.html");
                    }
				});

			},

			"cards/edit.html": function(){

				$.UI.setLeftNav("Back");
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

		// TODO: add other callback in case callee wants to pass a custom callback not in Routes.
		// Note: if view is BACK or default view (hack for now) will default to last history item
		navigate: function (view){

            $.UI.hidePopup();

			try{

				if(!view){

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