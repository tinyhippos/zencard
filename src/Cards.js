(ZenCard.Cards = function($) {

    return {
        get: function(cardName){},

        getAllCardNames: function(){
            var namesRaw = $.Persistence.retrieve($.Constants.persistence.cardKeys);

            return namesRaw ? namesRaw.split($.Constants.persistence.keyDelimiter) : null;
        }
    }
}(ZenCard));