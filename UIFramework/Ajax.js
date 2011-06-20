var ScriptCache = [];
var RequestCache = [];
var TemplateCache = [];
var SessionLostQueue = [];

function InCache( cache, name )
{
    for( var i in cache )
    {
        if( cache[i].name == name )
            return cache[i];
    }
    return null;
}

function UnCache( cache, name )
{
    for( i in cache )
    {
        if( cache[i].name == name )
        {
            cache.splice( i, 1 );
            return;
        }
    }
}

function IsUserAborted(xhr)
{
    return xhr != null && !xhr.getAllResponseHeaders();
}

function Error( xhr, status, thrown )
{
    // if( IsUserAborted(xhr) )return;

    var c = this;

    var s   = ""
            + (c.msg ? 'Mesage: ' + c.msg : '')
            + (c.url ? '<br/>query: ' + c.url : '')
            + (c.data ? '<br/>post: ' + c.data : '')
            + (c.response ? '<br/>response: ' + c.response : '')
            ;
    if( xhr != null )
        s   += (status?'<br/><br/>status: ' + status:'')
            + (thrown?'<br/>thrown: ' + thrown:'')
            + (xhr.responseText?'<br/><br/>responseText: ' + xhr.responseText:'')
            + (xhr.statusText?'<br/>statusText: ' + xhr.statusText:'')
            + (xhr.status?'<br/>status: ' + xhr.status :'')
            ;

    if (c.err) c.err(s);
    else ShowGeneralFault( s );
}

function TextOk( data )
{
    var c = this;
    if( c.cached != null )
    {
        c.cached.loaded = true;
        c.cached.response = data;
        c.cached = null;
    }
    if( c.ok != null )c.ok( data );
    else
    {
        c.response = data;
        c.msg = 'Data handler undefined';
        Error.call( c );
    }
}

function XmlOk( data )
{
    var jsonText = data.lastChild.textContent ? data.lastChild.textContent : data.lastChild.text;
    var json = eval("("+jsonText+")");
    JsonOk( json, this );
}

function JsonOk( data, cnt )
{
    var c = cnt ? cnt : this;
    if( data.ERROR != undefined )
    {
        if( data.ERROR.Type == 'UserSession' )
        {
            //SessionLostQueue.push( c );
            //ShowSessionLost();
            document.location=$$.Root;
        }
        else
        {
            if( c.cached != null )
            {
                UnCache( RequestCache, c.cached.name );
                c.cached = null;
            }
            if( c.err != null ) c.err( data.ERROR );
            else
            {
                c.response = data;
                c.msg = 'Error handler undefined';
                Error.call( c );
            }
        }
    }
    else TextOk.call( c, data );
}

function ReleaseSessionLostQueue()
{
    for( i in SessionLostQueue )
    {
        var opt = SessionLostQueue[i];
        SessionLostQueue.splice( i, 1 );
        $.ajax( opt );
    }
}

function GetHttpResponse( query, ok, err, cached, ignore )
{
    var addQuery = query;
    
    // This is mechanism of recovering from expired session - if( ClientUserID != null && ignore != true )addQuery = ( query.indexOf('?') == -1 ) ? query + "?ReportSessionLost" : query + "&ReportSessionLost";

    var opt = { type:'GET', dataType:'xml', url:addQuery, cache:true, success:XmlOk, error:Error, ok:ok, err:err };
    if( cached == true )CheckCache();
    else $.ajax( opt );
    
    function CheckCache()
    {
        var cache = InCache( RequestCache, query );
        if( cache == null )
        {
            RequestCache.push( { name:query, loaded:false, context:null, response:null } );
            cache = RequestCache[RequestCache.length-1];
            opt.cached = cache;
            $.ajax( opt );
        }
        else if( cache.loaded == true ) JsonOk.call( { ok:ok, err:err }, cache.response );
        else setTimeout( CheckCache, 100 );
    }
}

function PostHttpResponse( query, post, ok, err, cached, ignore )
{
    var addPost = post;
    // This is mechanism of recovering from expired session - if( ClientUserID != null && ignore != true )addPost = ( post == null || post == "" ) ? "ReportSessionLost" : post + "&ReportSessionLost";

    var opt = { type:'POST', dataType:'xml', url:query, data:addPost, cache:true, success:XmlOk, error:Error, ok:ok, err:err };
    if( cached == true )CheckCache();
    else $.ajax( opt );
    
    function CheckCache()
    {
        var cache = InCache( RequestCache, query + post );
        if( cache == null )
        {
            RequestCache.push( { name:query + post, loaded:false, context:null, response:null } );
            cache = RequestCache[RequestCache.length-1];
            opt.cached = cache;
            $.ajax( opt );
        }
        else if( cache.loaded == true ) JsonOk.call( { ok:ok, err:err }, cache.response );
        else setTimeout( CheckCache, 100 );
    }
}

function GetHttpTextResponse( query, ok, cached )
{
    var opt = { type:'GET', dataType:'html', url:query, cache:true, success:TextOk, error:Error, ok:ok };
    if( cached == true )CheckCache();
    else $.ajax( opt );

    function CheckCache()
    {
        var cache = InCache( RequestCache, query );
        if( cache == null )
        {
            RequestCache.push( { name:query, loaded:false, context:null, response:null } );
            cache = RequestCache[RequestCache.length-1];
            opt.cached = cache;
            $.ajax( opt );
        }
        else if( cache.loaded == true ) TextOk.call( { ok:ok }, cache.response );
        else setTimeout( CheckCache, 100 );
    }
}

function PostHttpTextResponse( query, post, ok, cached )
{
    var opt = { type:'POST', dataType:'html', url:query, data:post, cache:true, success:TextOk, error:Error, ok:ok };
    if( cached == true )CheckCache();
    else $.ajax( opt );

    function CheckCache()
    {
        var cache = InCache( RequestCache, query + post );
        if( cache == null )
        {
            RequestCache.push( { name:query + post, loaded:false, context:null, response:null } );
            cache = RequestCache[RequestCache.length-1];
            opt.cached = cache;
            $.ajax( opt );
        }
        else if( cache.loaded == true ) TextOk.call( { ok:ok }, cache.response );
        else setTimeout( CheckCache, 100 );
    }
}

function WUIControl( name, cont, arg1, arg2, arg3 )
{
    CreateControl( name, cont, arg1, arg2, arg3 );
}

function CreateControl( name, cont, arg1, arg2, arg3 )
{
    var l = new ControlLoader( name, cont, arg1, arg2, arg3 );
    l.Start();
}

function ControlLoader( name, cont, arg1, arg2, arg3 )
{
    var ctlName;
    var fileName;
    var ctlprefix;
    var Arg1 = arg1;
    var Arg2 = arg2;
    var Arg3 = arg3;

    this.SetPrefix=function (v) { ctlprefix=v; };

    this.Start = function()
    {
        cont.templateName = name;
        //todo - legacy
        cont.ControlTemplateName = name;

        fileName = $$.Root + name + $$.RVSuffix + '.jsc';

        if (ctlprefix)
            name = name.substring(ctlprefix.length);
        
        ctlName = 'ctl' + name.replace( /~/g,'' );

        if( Create( true ) == false ) Loading();
    };

    function Loading()
    {
        var cache = InCache( ScriptCache, name );
        if( cache == null )
        {
            ScriptCache.push( { name:name, loaded:false } );
            cache = ScriptCache[ScriptCache.length-1];
            if( $$.Debug )
            {
                var head = document.getElementsByTagName("head")[0];
                var script = document.createElement("script");
                script.src = fileName;
                var done = false;
                script.onload = script.onreadystatechange = function()
                {
                    if ( !done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") )
                    {
                        done = true;
                        script.onload = script.error = script.onreadystatechange = null;
                        cache.loaded = true;
                        Create();
                    }
                };
                script.onerror = function()
                {
                    UnCache( ScriptCache, name );
                    LoadTemplate();
                };
                head.appendChild(script);
            }
            else
            {
                $.ajax({
                        type:'GET',
                        dataType:'script',
                        url:fileName,
                        cache:true,
                        error:function( xhr, status, thrown )
                        {
                            UnCache( ScriptCache, name );
                            if( xhr.status == 404 )
                                LoadTemplate();
                            else
                            {
                                this.msg = 'Failed to load control:' + ctlName;
                                Error.call( this, xhr, status, thrown );
                            }
                        },
                        success : function()
                        {
                            cache.loaded = true;
                            Create();
                        }
                });
            }
        }
        else if( cache.loaded == true ) Create();
        else setTimeout( Loading, 100 );
    }

    function Create( check )
    {
        try
        {
            var ctl = null;
            eval( 'ctl = new ' + ctlName + '();' );
            try
            {
                ctl.Init( cont, Arg1, Arg2, Arg3 );
                if( cont != null && cont.OnInit != null )
                {
                    try
                    {
                        cont.OnInit( ctl );
                    }
                    catch(e)
                    {
                        ShowGeneralFault( 'Unable to initialize parent of control: ' + name + '\nexception: ' + e.toString() );
                    }
                }
            }
            catch(e)
            {
                ShowGeneralFault( 'Unable to initialize control: ' + name + '\nexception: ' + e.toString() );
            }
        }
        catch(e)
        {
            if( check == true ) return false;
            else ShowGeneralFault( 'Unable to create control: ' + name + '\nexception: ' + e.toString() );
        }
    }

    function LoadTemplate()
    {
        InitializeControl( { name:name, ok: function(text){ cont.innerHTML = text; } } );
    }
}

function DataControlInitializer( name, query, ok, err )
{
    var i = new ControlInitializer( { name:name, query:query, ok:ok, err:err } );
    i.Start();
}

function InitializeControl( opt )
{
    var i = new ControlInitializer( opt );
    i.Start();
}

//name, query, post, cached, ok, err
function ControlInitializer( opt )
{
    var data;
    var error;
    var template;

    this.Start = function()
    {
        if( opt.name != null )
            LoadTemplate();
        if( opt.query != null )
            LoadData();
        if( opt.name == null && opt.query == null )
            ShowGeneralFault( "Empty InitializeControl call" );
    };

    function LoadTemplate()
    {
        var cache = InCache( TemplateCache, opt.name );
        if( cache == null )
        {
            TemplateCache.push( { name:opt.name, loaded: false, template:null } );
            cache = TemplateCache[TemplateCache.length-1];
            GetHttpTextResponse( $$.Root + opt.name + $$.RVSuffix + '.jst', function(text){ cache.loaded = true; cache.template = text; template = text; Done(); } );
        }
        else if( cache.loaded == true )
        {
            template = cache.template;
            Done();
        }
        else setTimeout( LoadTemplate, 100 );
    }

    function LoadData()
    {
        //if( opt.query.indexOf(".json") != -1 )
        //opt.cached = true;

        if( opt.err != null )
        {
            if( opt.post != undefined ) PostHttpResponse( opt.query, opt.post, function(json){ data = json; Done(); }, function(err){ error = err; Done(); }, opt.cached );
            else GetHttpResponse( opt.query, function(json){ data = json; Done(); }, function(err){ error = err; Done(); }, opt.cached );
        }
        else
        {
            if( opt.post != undefined ) PostHttpTextResponse( opt.query, opt.post, function(text){ data = text; Done(); }, opt.cached );
            else GetHttpTextResponse( opt.query, function(text){ data = text; Done(); }, opt.cached );
       }
    }

    function Done()
    {
        //todo - simplify
        var a = ( template != null ) == ( opt.name != null );
        var b = ( data != null ) == ( opt.query != null );
        var c = ( error != null ) == ( opt.query != null );

        if( a && ( b || c ) )
        {
            if( error == null )
            {
                if( opt.ok != null ) opt.ok( template, data );
                else ShowGeneralFault( 'Data handler undefined for control: ' + opt.name );
            }
            else
            {
                if( opt.err != null ) opt.err( error, template );
                else ShowGeneralFault( 'Error handler undefined for control: ' + opt.name );
            }
        }
    }
}

var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~@";

function EncodeBase64( input )
{
    if (input==null || input.length<=0)
        return null;
    var out = "";
    var C1, C2, C3;
    var E1, E2, E3, E4;
    var p = 0;
    do
    {
        C1 = input.charCodeAt(p++);
        C2 = input.charCodeAt(p++);
        C3 = input.charCodeAt(p++);
        E1 = C1 >> 2;
        E2 = ((C1 & 3) << 4) | (C2 >> 4);
        E3 = ((C2 & 15) << 2) | (C3 >> 6);
        E4 = C3 & 63;
        if (isNaN(C2))
            E3 = E4 = 64;
        else if (isNaN(C3))
            E4 = 64;
        out += base64chars.charAt(E1) + base64chars.charAt(E2) + base64chars.charAt(E3) + base64chars.charAt(E4);
    }
    while (p < input.length);
    return out;
}

function DecodeBase64( input )
{
    if (input==null)
        return null
    if (input.length<=0)
        return "";
    var out = "";
    var C1, C2, C3;
    var E1, E2, E3, E4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\~\/\=\@]/g, "");
    do
    {
        E1 = base64chars.indexOf(input.charAt(i++));
        E2 = base64chars.indexOf(input.charAt(i++));
        E3 = base64chars.indexOf(input.charAt(i++));
        E4 = base64chars.indexOf(input.charAt(i++));

        C1 = (E1 << 2) | (E2 >> 4);
        C2 = ((E2 & 15) << 4) | (E3 >> 2);
        C3 = ((E3 & 3) << 6) | E4;

        out = out + String.fromCharCode(C1);

        if (C2!=0 && E3 != 64)
            out += String.fromCharCode(C2);
        if (C3!=0 && E4 != 64)
            out += String.fromCharCode(C3);
    }
    while (i < input.length);
    return out;
}
