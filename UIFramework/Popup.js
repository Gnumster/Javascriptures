/*
 * This is a collection of functions for helping to organize pop-ups of all sorts
 *
 */
function CreateShroud( opt )
{
    var div = document.createElement('div');
    document.body.appendChild(div);
    $(div).html('&nbsp;');
    $(div).css( 'position', 'fixed' );
    $(div).css( 'top', '0px' );
    $(div).css( 'left', '0px' );
    $(div).css( 'width', '100%' );
    $(div).css( 'height', '100%' );
    $(div).css( 'background-color', opt.color ? opt.color : '#000000' );
    $(div).attr( 'class', opt.className ? opt.className : '' );
    SetOpacity( div, opt.opacity ? opt.opacity : 0.0 );
    return div;
}

var PopupCount = 0;

function Popup( opt )
{
    var timer = null;
    var resize = null;
    var scroll = null;
    var shroud = null;

    if( opt.div.HidePopup )
        return;
    if( !opt.type )
        opt.type = 'normal';

    $(opt.div).css( 'position', 'fixed' );
    if( opt.div.parentNode && opt.div.parentNode != document.body )
    {
        opt.div.parentNode.removeChild(opt.div);
        document.body.appendChild(opt.div);
    }

    shroud = CreateShroud( opt );

    if( opt.base )
    {
        if( opt.type == 'normal' )
        {
            resize = scroll = Hide;
            $(window).resize( Hide );
            $(window).scroll( Hide );
            $(shroud).click( Hide );
        }
        else if( opt.type == 'sticky' )
            $(shroud).click( Hide );
        else if( opt.type == 'always' )
        {}
        Position();
        timer = setInterval( Position, 10 );
    }
    else
    {
        if( opt.type == 'normal' )
        {
            resize = scroll = Hide;
            $(window).resize( Hide );
            $(window).scroll( Hide );
            $(shroud).click( Hide );
        }
        else if( opt.type == 'sticky' )
        {
            resize = Center;
            $(window).resize( Center );
            $(shroud).click( Hide );
        }
        else if( opt.type == 'always' )
        {
            resize = Center;
            $(window).resize( Center );
        }
        Center();
        timer = setInterval( Center, 10 );
    }

    var zBase = 0;
    if( opt.z )
        zBase = opt.z;
    else
    {
        PopupCount++;
        zBase = 1000 + PopupCount*100;
    }
    $(shroud).css('zIndex', zBase );
    $(opt.div).css('zIndex', zBase + 1 );
    $(opt.div).show();

    if( opt.show )
        opt.show();

    function Center()
    {
        var left = ( $(window).width() - $(opt.div).innerWidth() ) / 2;
        var top = ( $(window).height() - $(opt.div).innerHeight() ) / 2;
        $(opt.div).css('left', left > 0 ? left : 0 + 'px' );
        $(opt.div).css('top',  top > 0 ? top : 0 + 'px' );
    }

    function Position()
    {
        var basePos = $(opt.base).offset();
        basePos.top -= $(window).scrollTop();
        basePos.left -= $(window).scrollLeft();
        var baseSize = { width:$(opt.base).outerWidth(), height:$(opt.base).outerHeight() };
        var divSize = { width:$(opt.div).outerWidth(), height:$(opt.div).outerHeight() };
        var divPos = { top:0, left:0 };

        if( $(window).width() - basePos.left >= basePos.left + baseSize.width )
            divPos.left = basePos.left;
        else
            divPos.left = basePos.left + baseSize.width - divSize.width;

        if( $(window).height() - basePos.top - baseSize.height - 1 >= basePos.top )
            divPos.top = basePos.top + baseSize.height + 1;
        else
            divPos.top = basePos.top - divSize.height - 1;

        $(opt.div).css( 'top', divPos.top + 'px' );
        $(opt.div).css( 'left', divPos.left + 'px' );
    }

    function Hide()
    {
        if( opt.div.HidePopup )
        {
            clearInterval( timer );
            $(window).unbind('scroll', scroll );
            $(window).unbind('resize', resize );
            shroud.parentNode.removeChild(shroud);
            shroud = null;
            opt.div.HidePopup = null;

            if( !opt.z )
                PopupCount--;

            $(opt.div).hide();

            if( opt.hide )
                opt.hide();
        }
    }

    opt.div.HidePopup = Hide;
}