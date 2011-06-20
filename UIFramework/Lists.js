function SetSelectedItem(list,item)
{
    for(var i=0; i<list.childNodes.length; i++)
    {
        var li = list.childNodes[i];
        if (li.Control) li.Control.SetSelected(li==item);
        else li.IsSelected=li==item;
    }
}
function FillTheList(cnt,jlist,nontext,ctlname,clkfn)
{
    if (jlist && jlist.length>0)
    {
        cnt.innerHTML="";
        cnt.IsEmptyList=false;
        if (jlist.length<15)
        {
            for (var i=0; i<jlist.length; i++)
            {
                var d = Div(cnt);
                d.JSON=jlist[i];
                if (clkfn) d.OnClick=clkfn;
                WUIControl(ctlname,d);
            }
        }
        else
        {
            cnt.ListFiller = new ListFillerTicker(cnt,jlist,ctlname,clkfn);
            cnt.ListFiller.Tick();
        }
    }
    else
    {
        cnt.innerHTML=nontext;
        cnt.IsEmptyList=true;
    }
}

function ListFillerTicker(cnt,jlist,ctlname,clkfn)
{
    var This=this;
    var Pos=0;
    this.Tick=function()
    {
        var d = Div(cnt);
        d.JSON=jlist[Pos];
        if (clkfn) d.OnClick=clkfn;
        WUIControl(ctlname,d);
        Pos++;
        if (Pos<jlist.length) setTimeout(This.Tick,10);
    };
}

function Foreach(list,func)
{
    for (var i in list)
    {
        func(list[i]);
    }
}

function FindDefaultNumber(numbers)
{
    if (numbers && numbers.length>0)
    {
        for(var i in numbers)
        {
            if (numbers[i].IsDefaultNumber) return numbers[i];
        }
    }
    return null;
}

function FillPageSelector(cnt,cur,total,onClick,shoulder,reverse)
{
    cnt.innerHTML="";
    
    if (total<=1) return;
    
    var div;
    if (!shoulder) shoulder = 5;
    
    var firstPrev = cur-shoulder;
    if (firstPrev<0) firstPrev=0;
    
    var lastNext = cur+shoulder-1;
    if (lastNext>total-1) lastNext=total-1;
    
    // --- First page if not covered by prev
    if (firstPrev>0) AddPage(0);
    
    // --- Delimiter if required
    if (firstPrev>1) AddDelimiter();
    
    // --- Series from first prev to last next
    for(var i=firstPrev; i<=lastNext; i++)
        AddPage(i);
        
    // --- Delimiter if required
    if (lastNext<total-2) AddDelimiter();
    
    // --- Last page if required
    if (lastNext<total-1) AddPage(total-1);
    
    // --- float-terminator
    div = Div(cnt);
    div.className="cl";
    
    function AddPage(ind)
    {
        var div = Div(cnt);
        if (!reverse)        div.innerHTML = ""+(ind+1);
        else                 div.innerHTML = ""+(total-ind);
        if (ind==cur)
        {
            div.className = (ind>0 ? "ml5 " : "") + "fl pd3 fs1 fc4 bcF b";
        }
        else
        {
            div.className = (ind>0 ? "ml5 " : "") + "fl clickable selectable pd3 fs1 fc4 bcE";
            if (onClick) $(div).click(function(){onClick(ind);});
        }
    }
    
    function AddDelimiter()
    {
        var div = Div(cnt);
        div.innerHTML = "&nbsp;...&nbsp;";
        div.className = "ml5 pd3 fl";
    }
}

function GetSelectedList(list)
{
    var r = [];
    for(var i in list.childNodes)
    {
        var div = list.childNodes[i];
        if (
                (div.Control && div.Control.IsSelected && div.Control.IsSelected())
                ||
                div.IsSelected
           )
           {
            r.push(div);
           }
    }
    return r;
}

function GetListIDs(list)
{
    var ids = "";
    if (list)
    {
        for(var i in list)
        {
            var div = list[i];
            if (div.JSON && div.JSON.ID)
            {
                if (ids.length>0) ids += ",";
                ids += div.JSON.ID;
            }
        }
    }
    return ids;
}

function SetListEnabled(list,v)
{
    for(var i in list.childNodes)
    {
        SetEnabled(list.childNodes[i],v);
    }
}

function MatressItem(div,pref)
{
    div.Index = GetDivIndex(div);
    div.className = (pref ? pref + " " : "") + ((div.Index%2) > 0 ? "bcE" : "bcF");
}

