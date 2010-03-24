(ZenCard.Routes = function($, JQuery){

    var _routes = {

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
            
        }

    };

}(ZenCard, $));