/*
 *  BarCode Coder Library (BCC Library)
 *  BCCL Version 1.0
 *    
 *	Porting : Jquery barcode plugin 
 *	Version : 1.3.3
 *	 
 *  Date	: October 17 2009
 *	Author  : DEMONTE Jean-Baptiste (firejocker)
 *	Contact : jbdemonte @ gmail.com
 *	Web site: http://barcode-coder.com/
 * 	dual licence : 	http://www.cecill.info/licences/Licence_CeCILL_V2-fr.html
 *   				http://www.gnu.org/licenses/gpl.html
 *
 * 			-------------------------------------------------------------------------------
 * 		---->  (March 28/2010) NOTE: Modified by Dan Silivestru to render in em vs. px 
 *  		-------------------------------------------------------------------------------
*/

$.barcode={settings:{barWidth:1,barHeight:50,showHRI:true,marginHRI:5,bgColor:"#FFFFFF",color:"#000000",fontSize:"10px",output:"css"},intval:function(a){var b=typeof a;if(b=="string"){a=a.replace(/[^0-9-.]/g,"");a=parseInt(a*1,10);return isNaN(a)||!isFinite(a)?0:a}else return b=="number"&&isFinite(a)?Math.floor(a):0},i25:{encoding:["NNWWN","WNNNW","NWNNW","WWNNN","NNWNW","WNWNN","NWWNN","NNNWW","WNNWN","NWNWN"],compute:function(a,b,c){if(b){if(c=="int25"&&a.length%2==0)a="0"+a;b=true;for(var d=0,
e=a.length-1;e>-1;e--){c=$.barcode.intval(a.charAt(e));if(isNaN(c))return"";d+=b?3*c:c;b=!b}a+=((10-d%10)%10).toString()}else if(a.length%2!=0)a="0"+a;return a},getDigit:function(a,b,c){a=this.compute(a,b,c);if(a=="")return"";result="";if(c=="int25"){result+="1010";var d,e;for(b=0;b<a.length/2;b++){d=a.charAt(2*b);e=a.charAt(2*b+1);for(c=0;c<5;c++){result+="1";if(this.encoding[d].charAt(c)=="W")result+="1";result+="0";if(this.encoding[e].charAt(c)=="W")result+="0"}}result+="1101"}else if(c=="std25"){result+=
"11011010";for(b=0;b<a.length;b++){d=a.charAt(b);for(c=0;c<5;c++){result+="1";if(this.encoding[d].charAt(c)=="W")result+="11";result+="0"}}result+="11010110"}return result}},ean:{encoding:[["0001101","0100111","1110010"],["0011001","0110011","1100110"],["0010011","0011011","1101100"],["0111101","0100001","1000010"],["0100011","0011101","1011100"],["0110001","0111001","1001110"],["0101111","0000101","1010000"],["0111011","0010001","1000100"],["0110111","0001001","1001000"],["0001011","0010111","1110100"]],
first:["000000","001011","001101","001110","010011","011001","011100","010101","010110","011010"],getDigit:function(a,b){var c=b=="ean8"?7:12;a=a.substring(0,c);if(a.length!=c)return"";var d;for(c=0;c<a.length;c++){d=a.charAt(c);if(d<"0"||d>"9")return""}a=this.compute(a,b);d="101";if(b=="ean8"){for(c=0;c<4;c++)d+=this.encoding[$.barcode.intval(a.charAt(c))][0];d+="01010";for(c=4;c<8;c++)d+=this.encoding[$.barcode.intval(a.charAt(c))][2]}else{b=this.first[$.barcode.intval(a.charAt(0))];for(c=1;c<7;c++)d+=
this.encoding[$.barcode.intval(a.charAt(c))][$.barcode.intval(b.charAt(c-1))];d+="01010";for(c=7;c<13;c++)d+=this.encoding[$.barcode.intval(a.charAt(c))][2]}d+="101";return d},compute:function(a,b){a=a.substring(0,b=="ean13"?12:7);b=0;var c=true;for(i=a.length-1;i>-1;i--){b+=(c?3:1)*$.barcode.intval(a.charAt(i));c=!c}return a+((10-b%10)%10).toString()}},msi:{encoding:["100100100100","100100100110","100100110100","100100110110","100110100100","100110100110","100110110100","100110110110","110100100100",
"110100100110"],compute:function(a,b){if(typeof b=="object"){if(b.crc1=="mod10")a=this.computeMod10(a);else if(b.crc1=="mod11")a=this.computeMod11(a);if(b.crc2=="mod10")a=this.computeMod10(a);else if(b.crc2=="mod11")a=this.computeMod11(a)}else if(typeof b=="boolean")if(b)a=this.computeMod10(a);return a},computeMod10:function(a){var b,c=a.length%2,d=0,e=0;for(b=0;b<a.length;b++){if(c)d=10*d+$.barcode.intval(a.charAt(b));else e+=$.barcode.intval(a.charAt(b));c=!c}c=(2*d).toString();for(b=0;b<c.length;b++)e+=
$.barcode.intval(c.charAt(b));return a+((10-e%10)%10).toString()},computeMod11:function(a){var b=2,c=0;b=2;for(var d=a.length-1;d>=0;d--){c+=b*$.barcode.intval(a.charAt(d));b=b==7?2:b+1}return a+((11-c%11)%11).toString()},getDigit:function(a){var b=0,c="";a=this.compute(a,false);c="110";for(i=0;i<a.length;i++){b="0123456789".indexOf(a.charAt(i));if(b<0)return"";c+=this.encoding[b]}c+="1001";return c}},code11:{encoding:["101011","1101011","1001011","1100101","1011011","1101101","1001101","1010011",
"1101001","110101","101101"],getDigit:function(a){var b,c,d="";d="10110010";for(b=0;b<a.length;b++){c="0123456789-".indexOf(a.charAt(b));if(c<0)return"";d+=this.encoding[c]+"0"}var e=0,f=0,g=1,h=0;for(b=a.length-1;b>=0;b--){e=e==10?1:e+1;g=g==10?1:g+1;c="0123456789-".indexOf(a.charAt(b));f+=e*c;h+=g*c}b=f%11;h+=b;h=h%11;d+=this.encoding[b]+"0";if(a.length>=10)d+=this.encoding[h]+"0";d+="1011001";return d}},code39:{encoding:["101001101101","110100101011","101100101011","110110010101","101001101011",
"110100110101","101100110101","101001011011","110100101101","101100101101","110101001011","101101001011","110110100101","101011001011","110101100101","101101100101","101010011011","110101001101","101101001101","101011001101","110101010011","101101010011","110110101001","101011010011","110101101001","101101101001","101010110011","110101011001","101101011001","101011011001","110010101011","100110101011","110011010101","100101101011","110010110101","100110110101","100101011011","110010101101","100110101101",
"100100100101","100100101001","100101001001","101001001001","100101101101"],getDigit:function(a){var b,c,d="";if(a.indexOf("*")>=0)return"";a=("*"+a+"*").toUpperCase();for(b=0;b<a.length;b++){c="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*".indexOf(a.charAt(b));if(c<0)return"";if(b>0)d+="0";d+=this.encoding[c]}return d}},code93:{encoding:["100010100","101001000","101000100","101000010","100101000","100100100","100100010","101010000","100010010","100001010","110101000","110100100","110100010","110010100",
"110010010","110001010","101101000","101100100","101100010","100110100","100011010","101011000","101001100","101000110","100101100","100010110","110110100","110110010","110101100","110100110","110010110","110011010","101101100","101100110","100110110","100111010","100101110","111010100","111010010","111001010","101101110","101110110","110101110","100100110","111011010","111010110","100110010","101011110"],getDigit:function(a,b){var c,d="";if(a.indexOf("*")>=0)return"";a=a.toUpperCase();d+=this.encoding[47];
for(i=0;i<a.length;i++){c=a.charAt(i);index="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%____*".indexOf(c);if(c=="_"||index<0)return"";d+=this.encoding[index]}if(b){var e=c=0,f=1;b=0;for(i=a.length-1;i>=0;i--){c=c==20?1:c+1;f=f==15?1:f+1;index="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%____*".indexOf(a.charAt(i));e+=c*index;b+=f*index}c=e%47;b+=c;a=b%47;d+=this.encoding[c];d+=this.encoding[a]}d+=this.encoding[47];d+="1";return d}},code128:{encoding:["11011001100","11001101100","11001100110","10010011000",
"10010001100","10001001100","10011001000","10011000100","10001100100","11001001000","11001000100","11000100100","10110011100","10011011100","10011001110","10111001100","10011101100","10011100110","11001110010","11001011100","11001001110","11011100100","11001110100","11101101110","11101001100","11100101100","11100100110","11101100100","11100110100","11100110010","11011011000","11011000110","11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000",
"11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110","11101110110","11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110","11100010110","11101101000","11101100010","11100011010","11101111010","11001000010","11110001010","10100110000","10100001100","10010110000","10010000110","10000101100","10000100110","10110010000","10110000100","10011010000","10011000010","10000110100","10000110010","11000010010",
"11001010000","11110111010","11000010100","10001111010","10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100","11110010010","11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000","10111100010","11110101000","11110100010","10111011110","10111101110","11101011110","11110101110","11010000100","11010010000","11010011100","11000111010"],getDigit:function(a){var b="",c=0,d=0,e=0,f=0,g=0;for(e=0;e<a.length;e++)if(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~".indexOf(a.charAt(e))==
-1)return"";f=a.length>1;b="";for(e=0;e<3&&e<a.length;e++){b=a.charAt(e);f&=b>="0"&&b<="9"}c=f?105:104;b=this.encoding[c];for(e=0;e<a.length;){if(f){if(e==a.length||a.charAt(e)<"0"||a.charAt(e)>"9"||a.charAt(e+1)<"0"||a.charAt(e+1)>"9"){f=false;b+=this.encoding[100];c+=++d*100}}else{for(f=0;e+f<a.length&&a.charAt(e+f)>="0"&&a.charAt(e+f)<="9";)f++;if(f=f>5||e+f-1==a.length&&f>3){b+=this.encoding[99];c+=++d*99}}if(f){g=$.barcode.intval(a.charAt(e)+a.charAt(e+1));e+=2}else{g=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~".indexOf(a.charAt(e));
e+=1}b+=this.encoding[g];c+=++d*g}b+=this.encoding[c%103];b+=this.encoding[106];b+="11";return b}},codabar:{encoding:["101010011","101011001","101001011","110010101","101101001","110101001","100101011","100101101","100110101","110100101","101001101","101100101","1101011011","1101101011","1101101101","1011011011","1011001001","1010010011","1001001011","1010011001"],getDigit:function(a){var b,c,d="";d+=this.encoding[16]+"0";for(b=0;b<a.length;b++){c="0123456789-$:/.+".indexOf(a.charAt(b));if(c<0)return"";
d+=this.encoding[c]+"0"}d+=this.encoding[16];return d}},lec:{cInt:function(a,b){for(var c="",d=0;d<b;d++){c+=String.fromCharCode(a&255);a>>=8}return c},cRgb:function(a,b,c){return String.fromCharCode(c)+String.fromCharCode(b)+String.fromCharCode(a)},cHexColor:function(a){a=parseInt("0x"+a.substr(1));var b=a&255;a>>=8;return this.cRgb(a>>8,a&255,b)}},isHexColor:function(a){return a.match(new RegExp("#[0-91-F]","gi"))},base64Encode:function(a){for(var b="",c,d,e,f,g,h,j=0;j<a.length;){c=a.charCodeAt(j++);
d=a.charCodeAt(j++);e=a.charCodeAt(j++);f=c>>2;c=(c&3)<<4|d>>4;g=(d&15)<<2|e>>6;h=e&63;if(isNaN(d))g=h=64;else if(isNaN(e))h=64;b+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h)}return b},digitToBmp:function(a,b,c){var d=$.barcode.intval(b.barWidth),
e=$.barcode.intval(b.barHeight),f=0,g=this.isHexColor(b.bgColor)?this.lec.cHexColor(b.bgColor):this.lec.cRgb(255,255,255),h=this.isHexColor(b.color)?this.lec.cHexColor(b.color):this.lec.cRgb(0,0,0),j=b="";for(f=0;f<d;f++){b+=g;j+=h}g="";h=c.length;var k=(4-d*h*3%4)%4,l=(d*h+k)*e;for(f=0;f<c.length;f++)g+=c.charAt(f)=="0"?b:j;for(f=0;f<k;f++)g+="\u0000";c="BM"+this.lec.cInt(54+l,4)+"\u0000\u0000\u0000\u0000"+this.lec.cInt(54,4)+this.lec.cInt(40,4)+this.lec.cInt(d*h,4)+this.lec.cInt(e,4)+this.lec.cInt(1,
2)+this.lec.cInt(24,2)+"\u0000\u0000\u0000\u0000"+this.lec.cInt(l,4)+this.lec.cInt(2835,4)+this.lec.cInt(2835,4)+this.lec.cInt(0,4)+this.lec.cInt(0,4);for(f=0;f<e;f++)c+=g;e=document.createElement("object");e.setAttribute("type","image/bmp");e.setAttribute("data","data:image/bmp;base64,"+this.base64Encode(c));a.html("").append(e)},digitToCss:function(a,b,c,d){var e=b.barWidth,f=b.barHeight,g="",h='<div style="float: left; background-color: '+b.color+"; height: "+f+"em; width: ";f='<div style="float: left; background-color: '+
b.bgColor+"; height: "+f+"em; width: ";for(var j=0,k=c.charAt(0),l=0,m=0;m<c.length;m++)if(k==c.charAt(m))j++;else{l+=j*e;g+=(k=="0"?f:h)+j*e+'em"></div>';k=c.charAt(m);j=1}if(j>0){l+=j*e;g+=(k=="0"?f:h)+j*e+'em"></div>'}if(b.showHRI)g+='<div style="clear:both; width: 100%; background-color: '+b.bgColor+"; color: "+b.color+"; text-align: center; font-size: "+b.fontSize+';">'+d+"</div>";a.css("padding","0px").css("overflow","auto").css("text-align","center").html(g).css("width",l+"em")},digitToSvg:function(a,
b,c,d){var e=$.barcode.intval(b.barWidth),f=$.barcode.intval(b.barHeight),g=c.length*e,h=f,j=$.barcode.intval(b.fontSize);if(b.showHRI)h+=$.barcode.intval(b.marginHRI)+j;var k='<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+g+'" height="'+h+'">';k+='<rect width="'+g+'" height="'+h+'" x="0" y="0" fill="'+b.bgColor+'" />';for(var l=0,m=c.charAt(0),n=0;n<c.length;n++)if(m==c.charAt(n))l++;else{if(m=="1")k+='<rect width="'+l*e+'" height="'+f+'" x="'+(n-l)*e+'" y="0" fill="'+b.color+'" />';
m=c.charAt(n);l=1}if(l>0&&m=="1")k+='<rect width="'+l*e+'" height="'+f+'" x="'+(n-l)*e+'" y="0" fill="'+b.color+'" />';if(b.showHRI){k+='<g transform="translate('+Math.floor(g/2)+' 0)">';k+='<text y="'+h+'" text-anchor="middle" style="font-family: Arial; font-size: '+j+'px;" fill="'+b.color+'">'+d+"</text>";k+="</g>"}k+="</svg>";b=document.createElement("object");b.setAttribute("type","image/svg+xml");b.setAttribute("data","data:image/svg+xml,"+k);a.html("").append(b)}};
$.fn.extend({barcode:function(a,b,c){var d="",e="",f="",g=true;if(typeof a=="string")f=a;else if(typeof a=="object"){f=typeof a.code=="string"?a.code:"";g=typeof a.crc!="undefined"?a.crc:true}if(f=="")return false;switch(b){case "std25":case "int25":d=$.barcode.i25.getDigit(f,g,b);e=$.barcode.i25.compute(f,g,b);break;case "ean8":case "ean13":d=$.barcode.ean.getDigit(f,b);e=$.barcode.ean.compute(f,b);break;case "code11":d=$.barcode.code11.getDigit(f);e=f;break;case "code39":d=$.barcode.code39.getDigit(f);
e=f;break;case "code93":d=$.barcode.code93.getDigit(f,g);e=f;break;case "code128":d=$.barcode.code128.getDigit(f);e=f;break;case "codabar":d=$.barcode.codabar.getDigit(f);e=f;break;case "msi":d=$.barcode.msi.getDigit(f,g);e=$.barcode.msi.compute(f,g);break}if(d.length==0)return $(this);d="0000000000"+d+"0000000000";if(c==undefined)c=[];for(var h in $.barcode.settings)if(c[h]==undefined)c[h]=$.barcode.settings[h];a=$(this);switch(c.output){case "bmp":$.barcode.digitToBmp(a,c,d,e);break;case "svg":$.barcode.digitToSvg(a,
c,d,e);break;default:$.barcode.digitToCss(a,c,d,e);break}return a}});