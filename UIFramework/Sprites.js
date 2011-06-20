/*
 * This is a description of all sprites we have in this UI
 * 
 */
var Sprite =
{
    // --- Width, Height, X0, Y0, X1, Y1, ... etc
      Refresh :         [16,16,0,0]
    , Expand :          [16,16,16,0]
    , Collapse :        [16,16,32,0]
    , Select :          [16,16,48,0]
    , Edit :            [16,16,64,0]
    
    // --- Clock-like rounds to represent time left or passed
    , CRGreen44 :       [32,32, 0,16]
    , CRGreen34 :       [32,32,32,16]
    , CRGreen24 :       [32,32,64,16]
    , CRGreen14 :       [32,32,96,16]
    , CRRed44   :       [32,32, 0,48]
    , CRRed34   :       [32,32,32,48]
    , CRRed24   :       [32,32,64,48]
    , CRRed14   :       [32,32,96,48]

    , Attach:function()
    {
        var ss = document.styleSheets ? document.styleSheets[0] : null;
        if (ss)
        {
            if ($.browser.msie) ss.addRule(".sprimage","background-image:url(../English/Common/Image/allsprites"+$$.RVSuffix+".png)",0);
            else ss.insertRule(".sprimage{ background-image:url(../English/Common/Image/allsprites"+$$.RVSuffix+".png) }",ss.cssRules.length);
        }
    }
    , Set:function(div,pic,n)
    {
        n = n>0 ? n*2 : 0;
        $(div).addClass("sprimage");
        var dx = pic[2+n];
        div.style.backgroundPosition="-"+dx+"px -"+pic[3+n]+"px";
        div.style.width=pic[0]+"px";
        div.style.height=pic[1]+"px";
    }
};

var $$Colors = 
{
      Selection :   [
                        "#1761AB",
                        "#4FA833","#FC0A1C","#E040E0",
                        "#990033","#6600CC","#0099CC",
                        "#85A67A","#2973B8","#FFAB59",
                        "#009900","#0000FF","#33FF00",
                        "#BFE3BA","#F0D6AB","#E89CB5"
                    ]
    , get : function(ind)
    {
        if (!ind || ind<0) ind = 0;
        ind = (ind % $$Colors.Selection.length);
        return $$Colors.Selection[ind];
    }

};