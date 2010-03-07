var ZenCard = {};

window.addEventListener("load", function (){
    ZenCard.Main.loadOptions();
});

// ----------------- Main ----------------- \\
(ZenCard.Main = function ($, JQuery){

    var _DIV_BARCODES = "#barcodes",
        _SELECT_BARCODES = "barcode_type",
        _BARCODE_TYPES = ["ean13", "ean9", "code11", "code39", "code128", "codabar", "std25", "int25", "code93", "msi"],
        _barcode_options = {
                "barWidth":2,
                "barHeight":30,
                "output":"svg"
            };

    return {
        
        generate: function (code, codeType){
            try{
                JQuery(_DIV_BARCODES).barcode(code, codeType, _barcode_options);
            }
            catch (e){ $.Exception.handle(e); }
        },

        loadOptions: function (){
            var select = document.getElementById(_SELECT_BARCODES),
                i;

            for (i = 0; i < _BARCODE_TYPES.length; i+=1){
                select.appendChild($.Utils.createElement("option", {
                    "value": _BARCODE_TYPES[i],
                    innerHTML: _BARCODE_TYPES[i]
                }));
            }
            
        }
        
    };
    
}(ZenCard, $));
