var GlobalStopAnchor = null;

function ShowGeneralFault( msg )
{
    if( $$.Debug )alert( msg );
    if( GlobalStopAnchor == null )
    {
        var shroud = CreateShroud( {color:"white",opacity:0.8} );
        GlobalStopAnchor = Div( document.body );
        GlobalStopAnchor.style.position="fixed";
        GlobalStopAnchor.style.top=0;
        GlobalStopAnchor.style.left=0;
        GlobalStopAnchor.msg = msg;
        GlobalStopAnchor.Shroud = shroud;
        GlobalStopAnchor.style.zIndex=10001;
        WUIControl( "Common~GeneralFault", GlobalStopAnchor );
    }
    else if (GlobalStopAnchor.Control) GlobalStopAnchor.Control.AddError(msg);
}

function WaitForPageLoad()
{
    alert("Please wait while page is completely loaded...");
}

function DisplayError(cont,err)
{
    if (err)
    {
        $(cont).addClass("mu10 error");
        $(cont).show();
        cont.innerHTML = err.Message ? err.Message : err;
    }
    else $(cont).hide();
}
