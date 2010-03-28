(ZenCard.Cards = function($) {
    var _card = {
        name: "",
        code: "",
        codeType: ""
    };
    
    return {
        get: function(cardName){
            return $.Persistence.retrieveObject(cardName);
        },

        getAllCardNames: function(){
            var namesRaw = $.Persistence.retrieve($.Constants.persistence.cardKeys);

            return namesRaw ? namesRaw.split($.Constants.persistence.keyDelimiter) : null;
        },

        save: function(name, code) {
            var card = $.Copy(_card);
            card.name = name;
            card.code = code;

            $.Utils.saveKeyToCategory($.Constants.persistence.cardKeys, name);
            $.Persistence.saveObject(name, card);
        }
    }
}(ZenCard));