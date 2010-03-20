(ZenCard.Routes = function($){

    var _routes = {

        "index.html": function(){

            $.UI.setLeftNav("Cards", "cards.html");

            $.UI.setRightNav("?", "help.html");

            $.Main.loadOptions();

        },

        "cards.html": function(){

            $.UI.setLeftNav("Back", "index.html");
            
        },

        "help.html": function(){

            $.UI.setLeftNav("Back", "index.html");

        }

    };

    return {

        load: function(view){

            return _routes[view] || null;
            
        }

    };

}(ZenCard));