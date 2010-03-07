var ZenCard = {};

// ----------------- Runner ----------------- \\
(ZenCard.Main = function ($, JQuery){

    var DIV_BARCODES = "#barcodes";

    return {
        
        generate: function (code){
            try{
                JQuery(DIV_BARCODES).barcode(code, "ean13",{"barWidth":2, "barHeight":30, "output":"svg"});
            }
            catch (e){
                this.handleError(e);
            }
        },

        clear: function (){
            document.getElementById(DIV_BARCODES.replace("#","")).innerHTML = "";
        },
        
        handleError: function (e){
            console.error(e.name);
            console.error(e.message);
            console.error(e.stack);
        }
        
        
    };
    
}(ZenCard, $));

