// ----------------- Main ----------------- \\
(ZenCard.UI = function ($, JQuery){

    function _setNav(id, text, view){
        var el = document.getElementById(id);
        // TODO: dont do this..
        el.setAttribute("onclick", "ZenCard.Routes.navigate('" + view + "')");
        JQuery("#" + id + " span").html(text);
    }

    return {

        loadView: function(str){
            JQuery($.Constants.common.view).html(str);
        },

        // TODO; allow custom callbacks
        setLeftNav: function(text, view, callback){
            _setNav($.Constants.common.navLeft, text, view);
        },

        setRightNav: function(text, view, callback){
            _setNav($.Constants.common.navRight, text, view);

        },

        setTitle: function (text){
            JQuery($.Constants.common.headerTitle).html(text);
        }
		

    };

}(ZenCard, $));