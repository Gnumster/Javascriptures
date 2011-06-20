// .bt - Div to use as the button
// .expansion - Div to show/hide
// .OnExpand - called when expanding
// .OnCollapse - called when collapsing
// .OnToggle - called in both expanding and collapsing
function EXButton(opt)
{
    Sprite.Set(opt.bt,Sprite.Expand);
    $(opt.bt).addClass("clickable");
    opt.bt.Expand=function()
    {
        Sprite.Set(opt.bt,Sprite.Collapse);
        opt.bt.IsExpanded = true;
        $(opt.expansion).slideDown(200);
        if (opt.OnExpand) opt.OnExpand(opt.bt);
        if (opt.OnToggle) opt.OnToggle(opt.bt);
    };
    opt.bt.Collapse=function()
    {
        Sprite.Set(opt.bt,Sprite.Expand);
        opt.bt.IsExpanded = false;
        $(opt.expansion).slideUp(200);
        if (opt.OnCollapse) opt.OnExpand(opt.bt);
        if (opt.OnToggle) opt.OnToggle(opt.bt);
    };
    opt.bt.Toggle=function()
    {
        if (opt.bt.IsExpanded)
            opt.bt.Collapse();
        else
            opt.bt.Expand();
    };
    $(opt.bt).click(opt.bt.Toggle);
}