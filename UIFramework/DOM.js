function Div(cont,type)
{
    var div = document.createElement(type?type:"div");
    cont.appendChild(div);
    return div;
}

function GetCookie(name)
{
    if( document.cookie.length > 0 )
    {
        var start = document.cookie.indexOf( name + "=" );
        if( start != -1 )
        {
            start = start + name.length + 1;
            var end = document.cookie.indexOf( ";", start );
            if( end == -1 )
                end = document.cookie.length;
            return unescape( document.cookie.substring( start, end ) );
        }
    }
    return null;
}

function SetCookie( name, value, expiredays )
{
    var exdate = new Date();
    exdate.setDate( exdate.getDate() + expiredays );
    document.cookie = name + "=" + escape(value)+
    ( ( expiredays == null ) ? "" : ";expires=" + exdate.toGMTString() ) +
    ";path=/";
}

function DeleteCookie( name )
{
    SetCookie( name, "", -1 );
}

function Encode( str )
{
    return encodeURIComponent(str);
}

function EncodeForJSON( str )
{
    return Encode( str.replace( /"/g,"''" ) );
}

function Decode( str )
{
    if( str == null )
        return "";
    try
    {
        return decodeURIComponent(str);
    }
    catch(e){}
    return str;
}

function getElementAbsolutePos( obj, pos )
{
    var cur = 0;
    while (obj!=null)
    {
        if (pos=='top')
            cur += obj.offsetTop;
        else if (pos=='left')
            cur += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return cur;
}

function getElementAbsolutePos_Fixed( obj, pos )
{
   if (pos=='top')          return $(obj).offset().top;
   else if (pos=='left')    return $(obj).offset().left;
   else                     return 0;
}

function IsElementInFixed(obj)
{
    var isit = false;
    while (!isit && obj!=null)
    {
        isit = obj.style.position=="fixed";
        obj = obj.offsetParent;
    }
    return isit;
}

function getChildByName(par,chname)
{
    var obj = null;
    for (var i=0; obj==null && i < par.childNodes.length; ++i)
    {
        if (par.childNodes[i].attributes)
        {
            var att=par.childNodes[i].attributes["name"];
            if (att && att.value==chname)
                obj = par.childNodes[i];
        }
        if (obj==null)
            obj=getChildByName(par.childNodes[i],chname);
    }
    return obj;
}

function getChildById(par,chid)
{
    var f = $(par).find("#"+chid);
    return f?f[0]:null;
}

function RemoveAllChildren(con)
{
    while (con.childNodes.length>0) con.removeChild(con.childNodes[con.childNodes.length-1]);
}

// This version works fine on FF, IE, Opera and Safari
function FF_ScanAllChildControls(Container,ctrlholder)
{
    if (!ctrlholder) ctrlholder=Container;
    $(Container).find("[id]").each(function(ind,div)
    {
        try{eval("ctrlholder."+$(div).attr("id")+"=div");}catch (e) {}
    });
}

function ScanAllChildControls(C,ctrlholder)
{
    if (!ctrlholder) ctrlholder=C;
    for (var i=0; i<C.childNodes.length; i++)
    {
        var div = C.childNodes[i];
        var attr = $(div).attr("id");
        if (attr)
        {
            try{eval("ctrlholder."+attr+"=div;");} catch (e) {}
        }
        ScanAllChildControls(div,ctrlholder)
    }
}

function insertAfter( after, ins )
{
    var obj = after.nextSibling;
    if (obj && after.parentNode)
        after.parentNode.insertBefore(ins,obj);
    else
        after.parentNode.appendChild(ins);
}

function SetEnabled(bt,v)
{
    if (bt.SetEnabled)  bt.SetEnabled(v);
    else if (bt.Control && bt.Control.SetEnabled) bt.Control.SetEnabled(v);
    else if (bt.disabled!=null) bt.disabled=!v;
}

function GetDivIndex(div)
{
    var ind = 0;
    while (div.previousSibling)
    {
        div = div.previousSibling;
        ind++;
    }
    return ind;
}

function GetElementIndex(div)
{
    var par = div ? div.parentNode : null;
    if (!par || !div) return -1;
    for (var i=0; i<par.childNodes.length; i++)
    {
        if (par.childNodes[i]==div) return i;
    }
    return -1;
}

function SetOpacity( div, opacity )
{
    if( $.browser.msie )
        div.style.filter = "alpha(opacity='" + ( opacity*100).toFixed() + "')";
    else
        div.style.opacity = opacity;
}

document.Reload=function()
{
    //document.location=document.location;
    document.location.reload();
};

function GetLocationHashValue(n)
{
    var shash = window.location.hash;
    if (shash!="") shash = shash.substring(1);
    var strs = shash.split('&');
    var ind = -1;
    var i = 0;
    for (;strs && ind<0 && i<strs.length;i++)
    {
        if (strs[i].indexOf(n+"=")==0)
            ind=i;
    }
    if (ind<0) return null;
    return strs[ind].substr(n.length+1, strs[ind].length-1-n.length);
}

function SetLocationHashValue(n,v)
{
    var shash = window.location.hash;
    if (shash!="") shash = shash.substring(1);
    var strs = shash.split('&');
    var ind = -1;
    var i = 0;
    for (;strs && ind<0 && i<strs.length;i++)
    {
        if (strs[i].indexOf(n+"=")==0)
            ind=i;
    }
    if (ind<0) ind=strs?strs.length:0;
    if (!strs) strs = new Array();
    strs[ind] = (v!=null&&v!="")?n+"="+v:null;
    var res = "";
    for (i=0;i<strs.length;i++)
    {
        if (strs[i]!=null) res += (res!=""?"&":"")+strs[i];
    }
    if (shash!=res)
    {
        if (res=="") res=null;
        window.location.hash=res;
    }
}
