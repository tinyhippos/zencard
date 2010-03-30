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
        setLeftNav: function(text, view, params, callback){
            _setNav(document.getElementById($.Constants.common.navLeft), text, view, params);
            return this;
        },

        setRightNav: function(text, view, params, navType, callback){

			if(navType === "big"){
				JQuery(".nav_right div.image img")[0]
					.src = "app/images/smallgreenbutton.png";
				JQuery(".nav_right")
					.addClass("nav_right_big")
					.removeClass("nav_right_small");
			}
			else{
				JQuery(".nav_right div.image img")
					.attr("src", "app/images/breenbox.png");
				JQuery(".nav_right")
					.addClass("nav_right_small")
					.removeClass("nav_right_big");
			}
			
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

        setBodyBgColour: function(colour){

			try{
				var bodyStyle = $.Utils.getAllStylesheetRules(".layout"),
				viewStyle = $.Utils.getAllStylesheetRules(".layout .view");

				bodyStyle[0].style.backgroundColor = colour;	
				viewStyle[0].style.backgroundColor = colour;
			}
			catch (e){
				$.Exception.handle(e);					
			}

			return this;
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