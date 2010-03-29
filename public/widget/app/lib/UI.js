// ----------------- Main ----------------- \\
(ZenCard.UI = function ($, JQuery){

    function _setNav(el, text, view, params){
        el.innerHTML = text;

        el.setAttribute("onmousedown", "ZenCard.Routes.navigate(" + (view ? "'" + view + "'" : "") + (params ? ", ['" + params.join(",") +"']" : "") + ")");
    }

    return {

        loadView: function(str){
            JQuery($.Constants.common.view).html(str);
            return this;
        },

        // TODO; allow custom callbacks
        setLeftNav: function(text, view, callback){
            _setNav(document.getElementById($.Constants.common.navLeft), text, view);
            return this;
        },

        setRightNav: function(text, view, params, callback){
            _setNav(document.getElementById($.Constants.common.navRight), text, view, params);
            return this;
        },

        setTitle: function (text){
            JQuery($.Constants.common.headerTitle).html((text === "" || !text) ? "&nbsp;" : text);
            return this;
        },

        hideHeader: function () {
            JQuery($.Constants.common.header).addClass($.Constants.css.irrelevant);
            return this;
        },

        showHeader: function () {
            JQuery($.Constants.common.header).removeClass($.Constants.css.irrelevant);
            this.setTitle();
            return this;
        },

        setBodyBgColour: function(){

        },

        showPopup: function (text) {
            var popupDiv = document.getElementById("popup");
            popupDiv.attributes["class"].nodeValue = "";
            popupDiv.innerHTML = text;
            return this;
        },

        hidePopup: function () {
            var popupDiv = document.getElementById("popup");
            popupDiv.attributes["class"].nodeValue = "irrelevant";           
            popupDiv.innerHTML = "";
            return this;
        }


    };

}(ZenCard, $));