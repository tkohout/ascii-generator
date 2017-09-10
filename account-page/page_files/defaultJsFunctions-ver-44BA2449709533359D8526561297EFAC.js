function resizeWidgets() {
var i;
resizeWidgetsCallbackFunction();
for (i = 0; i < resizeChartCallbackFunctions.length; i++) {
resizeChartCallbackFunctions[i]();
};
}
function goBack() {
window.history.back();
}
var resizeWidgetsCallbackFunction = function(){};
var resizeChartCallbackFunctions = new Array();
function numberSeparator(nStr, decimal, sep, povolene)
{
var str = nStr.toString();
str = str.replace(/\s/g, '');
var patt = new RegExp("^[0-9"+povolene+"]+$","g");
var res = patt.test(str);
if(!res) return nStr; 

if( (str.match(new RegExp("["+decimal+"]", "g")) || []).length > 1 ){ 
 return nStr;
}
str += '';
var dpos = str.indexOf(decimal);
var nStrEnd = '';
if (dpos != -1) {
nStrEnd = decimal + str.substring(dpos + 1, str.length);
console.log(nStrEnd);
str = str.substring(0, dpos);
console.log(str);
}
var rgx = /(\d+)(\d{3})/;
while (rgx.test(str)) {
str = str.replace(rgx, '$1' + sep + '$2');
}
return str + nStrEnd;
}
function resizeAllResponsiveTable() {
$(".table-responsive table").each(function(index, el) {
responsiveTable($(this));
});
$(".table-responsive2 table").each(function(index, el) {
responsiveTable($(this));
});
}
function setMinimalContentSize() {
$('.content').css('min-height', Math.max($('#sidebar').outerHeight() + 50, 400));
}


$(function() {

	$(".checkAll").click(function() {
$(".tableCheck").find("input.check").not(this).prop("checked", this.checked);
$(".checkAll").not(this).prop("checked", this.checked);
});
$(".prehledKaretShowHide").click(function() {
$(this).closest(".nazevKartyPrehled").children("form").show();
$(this).parent().hide();
});
$(".renameUcetBtn").click(function() {
$(".renameUcetForm").show();
$(this).parent().hide();
});

	$(".renameCardAcc").click(function() {
$(this).closest(".hideRenameCardsAccBox").parent().children(".renameCardAccForm").show()
$(this).parent().hide();
});
$(".hideRenameCardsAcc").click(function() {
$(this).closest(".renameCardAccForm").hide();
$(this).closest(".renameCardAccForm").parent().children(".hideRenameCardsAccBox").show();
});
$('.popoverBtn').popover();


function showHideRemove(){
if($.trim($(".searchInputHeader").val()).length) { 
 $(".searchInputHeader").parent().find(".deleteText").show();
}
else{
$(".searchInputHeader").parent().find(".deleteText").hide();
}
}
showHideRemove();
$(".searchInputHeader").keyup(function(event) {
showHideRemove();
});
$(".searchInputHeader").parent().find(".deleteText").click(function(){
$(".searchInputHeader").val("");
showHideRemove();
$(".searchInputHeader").focus();
});
$(".searchInput").focus(function() {
$(this).closest(".input-group").find(".inputAddonPre").css("border-color","#66AFE9")
});
$(".searchInput").focusout(function() {
$(this).closest(".input-group").find(".inputAddonPre").css("border-color","#CCCCCC")
});

 $(document).on('click', function(e) {
if($(e.target).closest('.dropdownCloseBox').length == 0) {

 if($(e.target).closest('#ui-datepicker-div').length || $(e.target).closest('.ui-datepicker-prev').length || $(e.target).closest('.ui-datepicker-next').length){
}
else{
$('.dropdownClose').parent().removeClass("open");
$('.dropdownClose').hide();
}
}
else{ 
 console.log($(e.target));
if($(e.target).closest('.dropdownCloseBtn').length){
if(!$(e.target).closest('.dropdownCloseBox').hasClass("open")){ 
 if(!$(e.target).closest('.fiiglePohyby').length){
$('.dropdownClose').hide(); 
 $('.dropdownClose').parent().removeClass("open"); 
 }
$(e.target).closest('.dropdownCloseBox').find('.dropdownClose').first().show(); 
 $(e.target).closest('.dropdownCloseBox').addClass("open"); 
 }
else{ 
 $(e.target).closest('.dropdownCloseBox').find('.dropdownClose').hide();
$(e.target).closest('.dropdownCloseBox').removeClass("open");
}
}






 }
});
$(".btn-group").on('show.bs.dropdown', function () {
if(!$(this).closest('.dropdownCloseBox').length){ 
 $('.dropdownClose').hide(); 
 $('.dropdownClose').parent().removeClass("open"); 
 }
});
});
(function($) {
$.fn.extend({
formatInput : function(settings) {
var $elem = $(this);
settings = $.extend({
errback : null
}, settings);
$elem.bind("keyup.filter_input", $.fn.formatEvent);
},
formatEvent : function(e) {
var elem = $(this);
var initial_value = elem.val();

 var valueDecimal = initial_value.split(".");

 var formatedValue = $.fn.insertSpaces(valueDecimal[0]);
var finalValue;

 if (valueDecimal.length > 1) {
finalValue = formatedValue + "." + valueDecimal[1];
} else {
finalValue = formatedValue;
}
elem.val(finalValue);

 
 elem.trigger('change');
},
insertSpaces : function(number) {
return number.replace(" ", "").replace(/(\d)(?=(?:\d{3})+$)/g,
"$1 ");
}
});
})(jQuery);

var docCookies = {
getItem: function (sKey) {
if (!sKey) { return null; }
return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
},
setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
var sExpires = "";
if (vEnd) {
switch (vEnd.constructor) {
case Number:
sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
break;
case String:
sExpires = "; expires=" + vEnd;
break;
case Date:
sExpires = "; expires=" + vEnd.toUTCString();
break;
}
}
document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
return true;
},
removeItem: function (sKey, sPath, sDomain) {
if (!this.hasItem(sKey)) { return false; }
document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
return true;
},
hasItem: function (sKey) {
if (!sKey) { return false; }
return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
},
keys: function () {
var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
return aKeys;
}
};
function resetCookieLogoutModal(timeInMilis){
var openModalBeforeLogoutSec = 60;
var expireDate = new Date(new Date().getTime() + timeInMilis);
var showModalDate = new Date(expireDate.getTime() - openModalBeforeLogoutSec*1000);
var opt = {"expires" : expireDate, "showModalDate" : showModalDate};
docCookies.setItem("jsLogoutTime", JSON.stringify(opt), expireDate, "/", null, true);
}
function timerLogoutModal(urlForLogout){
var interval = setInterval(function(){
var coo = JSON.parse(docCookies.getItem("jsLogoutTime"));
if(coo === null){

 clearInterval(interval);

 window.location.replace(urlForLogout);
}
else{
var nowTime = new Date();
var modalDate = new Date(coo.showModalDate);
if(modalDate <= nowTime){

 if($('.logoutModal').not(':visible')) {
$('.logoutModal').modal('show');
}
}
else{
$('.logoutModal').modal('hide');
}
}
}, 1000); 
}