// ----------------- Main ----------------- \\
(ZenCard.UI = function ($, JQuery){

    function _setNav(el, text, view){
        el.innerHTML = text;

        el.setAttribute("onmousedown", "ZenCard.Routes.navigate(" + (view ? "'" + view + "'" : "") + ")");
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
            JQuery($.Constants.common.headerTitle).html((text === "" || !text) ? "&nbsp;" : text);
        },

        hideHeader: function () {
            JQuery($.Constants.common.header).addClass($.Constants.css.irrelevant);
        },

        showHeader: function () {
            JQuery($.Constants.common.header).removeClass($.Constants.css.irrelevant);
            this.setTitle();
        }


    };

}(ZenCard, $));