function FormatDateTimeLongToDisplay(s)
{
    var m=parseInt( s.substring(5,7), 10 );

    var time = FormatTimeToDisplay(s);

    return (s!=null) ? s.substring(8,10) + ' ' + GetMonthName(m) + ' ' + s.substring(0,4) + ' ' + time : "null";
}

function FormatTimeToDisplay(s)
{
    var hour = s.substring(11,13);
    var hourNum = new Number(hour);
    var AmPm = '';
    if (hourNum >= 12)
    {
        if (hourNum != 12)
            hour = hourNum - 12;

        AmPm = ' p.m.';
    }
    else
    {
        if (hourNum == 0)
            hour = '12';

        AmPm = ' a.m.';
    }

    //hour = LZN(hour,2);

    return (s!=null) ? new Number(hour) + ':' + s.substring(14,16) + AmPm : "null";
}

function GetMonthName(m)
{
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return (m>=1 && m<=12) ? months[m-1] : "Err";
}

var DT=
{
      MINSEC:60
    , HOURSEC:60*60
    , DAYSEC:60*60*24
    , WEEKSEC:60*60*24*7
    , MONTHSEC:60*60*24*30
    , YEARSEC:60*60*24*365
    
    // --- Returns time of the day formatted from specified number of minutes
    , DisplayMinutes:function(min)
      {
        h = LZN( min / 60, 2 );
        m = LZN( min % 60, 2 );
        return h+':'+m;
      }
    
    // --- Populates specified element as indicator of specified due time
    , DueTimeIndicate:function(due,div)
      {
        var ics = [[Sprite.CRGreen14,Sprite.CRGreen24,Sprite.CRGreen34,Sprite.CRGreen44],[Sprite.CRRed14,Sprite.CRRed24,Sprite.CRRed34,Sprite.CRRed44]];
        var now = new Date();
        var mnow = now.getHours()*60+now.getMinutes();
        
        var pmin = mnow - due;
        var fp = pmin>=0 ? 1 : 0;
        pmin = pmin>0 ? pmin : -pmin;
        
        var ri;
        if (pmin<10) ri=-1;
        else if (pmin>50) ri=3;
        else if (pmin>40) ri=2;
        else if (pmin>25) ri=1;
        else ri=0;
        
        div.style.color=fp?"#800000":"#008000";
        
        var txt = "";
        
        if (ri>=0)
        {   Sprite.Set(div,ics[fp][ri]);
            var hrs = Math.floor(pmin/60);
            if (hrs>0) txt = ""+hrs;
        }
        else txt="now";
        
        return txt;
      }
    , MinusMonths:function(dt,mdec)
    {
        dt.m-=mdec;
        if (dt.m<1)
        {
            dt.m=12+dt.m;
            dt.y--;
        }
    }
};

function LZN( v, n )
{
    var s = "0000" + v;
    return s.substring(s.length-n,s.length);
}

function GetDateTimeFormatted(dt)
{
    var VYear = dt.getYear();
    var y = VYear % 100;
    y += (y < 38) ? 2000 : 1900;
    VYear = y;
    var VMonth = dt.getMonth() + 1;
    var VDay = dt.getDate();
    var VHour = dt.getHours();
    var VMinute = dt.getMinutes();
    return LZN(VYear,4) + '.' + LZN(VMonth,2) + '.' + LZN(VDay,2) + ' ' + LZN(VHour,2) + ':' + LZN(VMinute,2);
}

function DateWeekDay(dt)
{
    var wd = dt.getDay()-1;
    if (wd<0) wd=6;
    return wd;
}

function GetMonthName(m)
{
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return (m>=1 && m<=12) ? months[m-1] : "Err";
}

function GetWeekdayName(wd)
{
    var weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return (wd>=0 && wd<7) ? weekdays[wd] : "Err";
}

function GetMonthDaysNumber( m, y )
{
    var mdays = [31,(((y % 4)>0) ? 28 : 29),31,30,31,30,31,31,30,31,30,31];
    return (m>=1 && m<=12) ? mdays[m-1] : 15;
}

function GetWeekDay( d, m, y )
{
    var date = new Date( y, m-1, d );
    return (date.getDay()+5) % 6;
}

function FormatDateToDisplay(s)
{
    return (s!=null) ? s.substring(8,10) + '.' + s.substring(5,7) + '.' + s.substring(0,4) : "null";
}

function FormatDateTimeToDisplay(s)
{
    return (s!=null) ? s.substring(8,10) + '.' + s.substring(5,7) + '.' + s.substring(0,4) + ' ' + s.substring(11,13) + ':' + s.substring(14,16) : "null";
}

function GetTimeIntervalString(v)
{
    var h=false;
    var r = "";
    if (v>=60*60*24)
    {
        h = true;
        var ds = Math.floor(v / (60*60*24));
        v = v - (ds * 60*60*24);
        if (r!="") r += ":";
        r += ds;
    }
    if (v>=60*60)
    {
        h = true;
        var hrs = Math.floor(v / (60*60));
        v = v - (hrs * 60*60);
        if (r!="") r += ":";
        r += LZN(hrs,2);
    }
    if (v>=60)
    {
        var min = Math.floor(v / 60);
        v = v - min * 60;
        if (r!="") r += ":";
        r += LZN(min,2);
    }
    if (!h)
    {
        if (r!="") r += ":";
        r += LZN(v,2);
    }
    return r;
}

function GetTimeStamp()
{
    var today = new Date();
    return "" + today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds() + "_" + today.getMilliseconds();
}

function nonnan(v,d)
{
    return isNaN(v)?d:v;
}

function StringDateToJSON(txt)
{
    var json = {y:0,m:0,d:0,hh:0,mm:0,ss:0};
    json.y=nonnan(parseInt( txt.substring(0,4), 10 ),0);
    json.m=nonnan(parseInt( txt.substring(5,7), 10 ),0);
    json.d=nonnan(parseInt( txt.substring(8,10), 10 ),0);
    json.hh=nonnan(parseInt( txt.substring(11,13), 10 ),0);
    json.mm=nonnan(parseInt( txt.substring(14,16), 10 ),0);
    json.ss=nonnan(parseInt( txt.substring(17,19), 10 ),0);
    return json;
}

function JSONDateToString(json)
{
    var txt =
                    LZN(json.y,4)
            + '.' + LZN(json.m,2)
            + '.' + LZN(json.d,2)
            ;
    if (json.hh>0 || json.mm>0 || json.ss)
    {
        txt +=
              ' ' + LZN(json.hh,2)
            + ':' + LZN(json.mm,2)
            + (json.ss>0 ? ':' + LZN(json.ss,2) : '');
    }
    return txt;
}

function JSONDateToDate(json)
{
    if (!json) return null;
    var date = new Date();
    date.setFullYear(json.y);
    date.setMonth(json.m-1);
    date.setDate(json.d);
    if (json.hh!=null) date.setHours(json.hh);
    if (json.mm!=null) date.setMinutes(json.mm);
    if (json.ss!=null) date.setSeconds(json.ss);
    return date;
}

function DateToJSON(date)
{
    return {y:date.getFullYear(),m:date.getMonth()+1,d:date.getDate(),hh:date.getHours(),mm:date.getMinutes(),ss:date.getSeconds()};
}

function JSONDateFormat(json)
{
    return json?""+json.d+" "+GetMonthName(json.m)+" "+json.y:"";
}

function JSONDateTime(json)
{
    return json?""+LZN(json.hh,2)+":"+LZN(json.mm,2):"";
}

function SForPlural(v)
{
    return v>1 ? "s" : "";
}

function JSONDateToDisplaySimplified(json)
{
    if (!json) return "NONE";
    var tnow = new Date().getTime();
    var dat = JSONDateToDate(json);
    var tthen=dat.getTime();
    var minssago = (tnow-tthen)/(60000);
    var pref,post,v;
    pref = minssago>0 ? "" : "in ";
    post = minssago>0 ? " ago" : "";
    if (minssago<0) minssago = -minssago;

    if (minssago<=1)                return "now";
    else if (minssago<60)           { v = Math.floor(minssago); return pref + v + " minute" + SForPlural(v) + post; }
    else if (minssago<(24*60))      { v = Math.floor(minssago/60); return pref + v + " hour" + SForPlural(v) + post; }
    else if (minssago/(24*60)<7)    { v = Math.floor(minssago/(24*60)); return pref + v + " day" + SForPlural(v) + post; }

    if (json.hh>0 || json.mm>0 || json.ss>0)    return JSONDateFormat(json)+" "+JSONDateTime(json);
    else                                        return JSONDateFormat(json);
}

function JSONDateToDisplayShort(json)
{
    if (!json) return "NONE";
    var txt =
                    LZN(json.d,2)
            + '.' + LZN(json.m,2)
            + '.' + LZN(json.y,4)
            ;
    if (json.hh>0 || json.mm>0 || json.ss)
    {
        txt +=
              ' ' + LZN(json.hh,2)
            + ':' + LZN(json.mm,2)
            ;
    }
    return txt;
}

function JSONDateToDisplayLong(json)
{
    if (!json) return "NONE";
    var dt = JSONDateToDate(json);
    return dt.toLocaleDateString().replace(/,/g, ",<br/>") + "<br/>" + dt.toLocaleTimeString();
}

function SecondsTimespanToJSON(sec)
{
    var json={y:0,m:0,w:0,d:0,hh:0,mm:0,ss:0};
    if (sec>=DT.YEARSEC)
    {
        json.y=Math.floor(sec/DT.YEARSEC);
        sec -= json.y * DT.YEARSEC;
    }
    if (sec>=DT.MONTHSEC)
    {
        json.m=Math.floor(sec/DT.MONTHSEC);
        sec -= json.m * DT.MONTHSEC;
    }
    if (sec>=DT.WEEKSEC)
    {
        json.w=Math.floor(sec/DT.WEEKSEC);
        sec -= json.w * DT.WEEKSEC;
    }
    if (sec>=DT.DAYSEC)
    {
        json.d=Math.floor(sec/DT.DAYSEC);
        sec -= json.d * DT.DAYSEC;
    }
    if (sec>=DT.HOURSEC)
    {
        json.hh=Math.floor(sec/DT.HOURSEC);
        sec -= json.hh * DT.HOURSEC;
    }
    if (sec>=DT.MINSEC)
    {
        json.mm=Math.floor(sec/DT.MINSEC);
        sec -= json.mm * DT.MINSEC;
    }
    json.ss=Math.floor(sec);
    return json;
}

function SecondsTimespanToDisplay(sec,mini)
{
    if (!sec || sec<=0) return "";
    var json=SecondsTimespanToJSON(sec);
    var r = "";
    if (json.y>0) {r += " " + json.y + " year"+SForPlural(json.y);if (mini && json.m<1) return r;}
    if (json.m>0) {r += " " + json.m + " month"+SForPlural(json.m);if (mini && json.w<1) return r;}
    if (json.w>0) {r += " " + json.w + " week"+SForPlural(json.w);if (mini && json.d<1) return r;}
    if (json.d>0) {r += " " + json.d + " day"+SForPlural(json.d);if (mini && json.hh<1) return r;}
    if (json.hh>0) {r += " " + json.hh + " hour"+SForPlural(json.hh);if (mini && json.mm<5) return r;}
    if (json.mm>0) {r += " " + json.mm + " minute"+SForPlural(json.mm);if (mini) return r;}
    if (sec<60) r = "&lt;1 minute ";
    return r;
}

function SecondsTimespanToDisplayShort(sec,mini)
{
    if (!sec || sec<=0) return "";
    var json=SecondsTimespanToJSON(sec);
    var r = "";
    if (json.y>0) {r += " " + json.y + " y";if (mini && json.m<1) return r;}
    if (json.m>0) {r += " " + json.m + " m";if (mini && json.w<1) return r;}
    if (json.w>0) {r += " " + json.w + " w";if (mini && json.d<1) return r;}
    if (json.d>0) {r += " " + json.d + " d";if (mini && json.hh<1) return r;}
    if (json.hh>0) {r += " " + json.hh + " h";if (mini && json.mm<5) return r;}
    if (json.mm>0) {r += " " + json.mm + " m";if (mini) return r;}
    if (sec<60) r = "&lt;1 minute ";
    return r;
}

function IsDateInPast(json)
{
    if (!json) return false;
    var tnow = new Date().getTime();
    var dat = JSONDateToDate(json);
    return tnow>dat.getTime();
}

function JSONDateZerotime(dt)
{
    dt.hh=0;
    dt.mm=0;
    dt.ss=0;
    return dt;
}

function WeekOfYear(dt)
{
    var jan1=new Date();
    jan1.setTime(dt.getTime());
    jan1.setDate(1);
    jan1.setMonth(0);
    var diff = dt.getTime()-jan1.getTime();
    return Math.floor((diff/1000)/DT.WEEKSEC)+1+(jan1.getDay()==1?0:1);
}

function DateTimeToday()
{
    var json = DateToJSON(new Date());
    JSONDateZerotime(json);
    return JSONDateToDate(json);
}

function DateTimeTomorrow()
{
    var json = DateToJSON(new Date());
    JSONDateZerotime(json);
    var dt = JSONDateToDate(json);
    dt.setTime(dt.getTime()+DT.DAYSEC*1000);
    return dt;
}

function NextDayJSON(jsonDate)
{
    var jsd = {y:jsonDate.y,m:jsonDate.m,d:jsonDate.d,hh:0,mm:0,ss:0};
    var dt = JSONDateToDate(jsd);
    dt.setTime(dt.getTime()+DT.DAYSEC*1000);
    return DateToJSON(dt);
}

function FormatMinSec(sec)
{
    var sm = "" + (sec/60);
    var t = sm.indexOf('.');
    if (t>0) sm = sm.substring(0,t);
    var m = parseInt(sm,10);
    var s = "" + (sec - m * 60);
    if (s.length<2) s = "0" + s;
    return "" + m + ":" + s;
}

function FormatDataSize(bytes)
{
    if (bytes<1024) return "" + bytes + " Bytes";
    else if (bytes<1024*1024) return "" +FormatFloat(bytes/1024,1)+ "Kb";
    else return "" +FormatFloat(bytes/(1024*1024),1)+ "Mb";
}

function FormatFloat(v,prec)
{
    var str = "" + v;
    var dp = str.indexOf('.');
    if (dp<0) return str;
    var l = dp+prec+1;
    if (l>str.length) l=str.length;
    return str.substring(0,l);
}
