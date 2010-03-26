// ----------------- Main ----------------- \\
(ZenCard.UI = function ($, JQuery){

    function _setNav(el, text, view){

        el.innerHTML = text;
        // TODO: dont do this..
        el.setAttribute("onclick", "ZenCard.Routes.navigate('" + view + "')");
    }

    return {

        loadView: function(str){
            JQuery($.Constants.common.view).html(str);
        },

        // TODO; allow custom callbacks
        setLeftNav: function(text, view, callback){
            _setNav(document.getElementById($.Constants.common.navLeft), text, view);
        },

        setRightNav: function(text, view, callback){
            _setNav(document.getElementById($.Constants.common.navRight), text, view);

        },

        setTitle: function (text){
            JQuery($.Constants.common.headerTitle).html(text);
        }
		

    };

}(ZenCard, $));