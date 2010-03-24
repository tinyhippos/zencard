// ----------------- Main ----------------- \\
(ZenCard.UI = function ($, JQuery){

    function _setNav(el, text, view){

        el.innerHTML = text;
        el.setAttribute("onclick", "ZenCard.Main.navigate('" + view + "')");
    }

    return {

        loadView: function(str){
            JQuery($.Constants.common.view).html(str);
        },

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