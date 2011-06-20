/* ************************************************************************************************

    Collection of methods to operate with dates and times

************************************************************************************************ */
var $DT = 
{

      MINSEC:60
    , HOURSEC:60*60
    , DAYSEC:60*60*24
    , WEEKSEC:60*60*24*7
    , MONTHSEC:60*60*24*30
    , YEARSEC:60*60*24*365

    , monthdays : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
       
	/*
		Returns current date and time
	*/
	 , now : function() { return new Date(); }

	
	/*
	  Returns specified value in JSON-notated date and time
	*/
	, toJSON : function(d)
		{
			if (!d) return null;
			if (d.y) return d;
			var j = {y:d.getFullYear(),m:d.getMonth()+1,d:d.getDate(),hh:d.getHours(),mm:d.getMinutes(),ss:d.getSeconds()};
			return j;
		}
		 
	/*
		Returns spcified value as Date() 
	*/
	, toDate : function(j)
		{
			if (j==null || j.y==null) return j;
			var date = new Date();
			date.setFullYear(j.y);
			date.setMonth(j.m-1);
			date.setDate(j.d);
			if (j.hh!=null)
			{
				date.setHours(j.hh);
				date.setMinutes(j.mm);
				date.setSeconds(j.ss);
			}
		   return date;
		}
		
	/*
		Returns the json-clone of specified value
	*/
	, clone : function(v)
		{
			var j = v.y ? {y:v.y,m:v.m,d:v.d,hh:v.hh,mm:v.mm,ss:v.ss} : $DT.toJSON(v);
			return j;
		}
		
	/*
		Returns string notation of specified date. Accepts both json-notated and Date() as the input
	*/
   , toString : function(v)
		{         
			 var d = v.y ? v : $DT.toJSON(v);
		    if (d)
		    {
			    
			    var txt =
			                    LZN(d.y,4)
			            + '.' + LZN(d.m,2)
			            + '.' + LZN(d.d,2)
			            ;
			    if (d.hh>0 || d.mm>0 || d.ss)
			    {
			        txt +=
			              ' ' + LZN(d.hh,2)
			            + ':' + LZN(d.mm,2)
			            + (d.ss>0 ? ':' + LZN(d.ss,2) : '');
			    }
			    return txt;
			}
		}
		
	/*
	  Returns json-notated date which is provided value PLUS the spcified number of time-units also specified
	  v - initial value
	  grad - time unit code ('h', 'd', 'w', 'm', 'y')
	  inc - how many to add
	*/
	, Add : function(v, grad, inc)
		{
			switch (grad)
			{
			case 'h' :	{
								var d = $DT.toDate(v);
								d.setTime(d.getTime() + $DT.HOURSEC * inc * 1000);
								return $DT.toJSON(d);
			            }
			case 'd' :	return $DT.Add(v,'h',inc * 24);
			case 'w' :	return $DT.Add(v,'d',inc * 7);
			case 'm' :	{
								var j = $DT.clone(v);
								j.y += Math.floor(inc/12);
								inc = inc % 12;
								j.m += inc;
								if (j.m>12)
								{
									j.y++;
									j.m-=12;
								}
								
                                // === Adjusting maximum day of the month
                                var maxmd = $DT.monthdays[j.m-1];
                                if (j.d>maxmd)
                                {
                                    j.d=maxmd;
                                }
                                
                                return j;
							}
			case 'y' :	{
								var j = $DT.clone(v);
								j.y += inc;
								return j;
							}
			}
		}
		
	/*
	  Returns json-notated date which is provided value MINUS the spcified number of time-units also specified
	  v - initial value
	  grad - time unit code ('h', 'd', 'w', 'm', 'y')
	  dec - how many to subtract
	*/
	, Sub : function(v, grad, dec)
		{
			switch (grad)
			{
			case 'h' :	return $DT.Add(v,'h',-dec);
			case 'd' :	return $DT.Add(v,'h',-dec * 24);
			case 'w' :	return $DT.Add(v,'d',-dec * 7);
			case 'm' :	{
								var j = $DT.clone(v);
								j.y -= Math.floor(dec/12);
								dec = dec % 12;
								j.m -= dec;
								if (j.m<1)
								{
									j.y--;
									j.m+=12;
								}
                                
                                // === Adjusting maximum day of the month
                                var maxmd = $DT.monthdays[j.m-1];
                                if (j.d>maxmd)
                                {
                                    j.d=maxmd;
                                }

								return j;
							}
			case 'y' :	return $DT.Add(v,'y',-dec);
			}
		}
		
	/*
		Returns json-notated date which is the nearest moment in the past matching to beginning of the time unit specified
		v - initial value
		grad - time unit code ('h', 'd', 'w', 'm', 'y')
	*/
	, AdjustBack : function(v, grad)
		{
			var j = $DT.clone(v);
			
			switch (grad)
			{
			case 'y' :	j.m = 1;
			case 'm' :	j.d = 1;
			case 'd' :	j.hh = 0;
			case 'h' :	j.mm = j.ss = 0;
							break;
			case 'w' :
							{
    							var date = $DT.toDate(v);
    							var wd = (date.getDay()+5) % 6;
    							var j = $DT.Sub(v,'d',wd);
								j.hh = j.mm = j.ss = 0;
							}
							break;
			}
			
			return j;
		}

	/*
		Returns json-notated date which is the nearest moment in the future matching to beginning of the next time unit specified
		v - initial value
		grad - time unit code ('h', 'd', 'w', 'm', 'y')
	*/
	, AdjustAhead : function(v, grad)
	{
		var j = $DT.AdjustBack(v, grad);
		j = $DT.Add(j, grad, 1);
		return j;
	}

    /*
        Compares two specified date/times.
        Returns:
                    -1 : a < b
                     0 : a = b
                    +1 : a > b
    */
    , Compare : function(a, b)
    {
        var at = a.y ? $DT.toDate(a).getTime() : a.getTime();
        var bt = b.y ? $DT.toDate(b).getTime() : b.getTime();
        if (at==bt) return 0;
        else if (at<bt) return -1;
        else return 1;
    }

    /*
        Calculates the specified time range splitting to a series of smaller ranges suitable for displaying in a calendar form.
        
        Input:
                {
                    .start  - start of the range
                    .end    - end of the range (date/time right after the end of range)
                    .size   - size of the range ('y', 'm', 'w', 'd')
                    .grad   - size of the generated subrange
                    .count  - number of .grad - size steps required
                }
        
        Expected variations of input:
                
                {start,end}         - Determines the .grad and .count, adjusts both (start,end) to a nearest .grad/.size point
                {start,end,grad}    - Determines the .count after adjustment of both ends to the nearest .grad/.size point
                {start,end,grad,count} - Adjusts both (start,end) to a nearest .grad point
                {start,size}
                {end,size}          - Determines the other end of the range opposite to provided one by adding/subtracting the size specified.
                                      After that does the same as above.
                {end,grad,count}    - Determines .start
                {start,grad,count}  - Determines .end

        Output:
                {
                    .start - date/time for the start of the first range
                    .end   - date/time after the end of the very last range
                    .grad  - range size ( 'y', 'm', 'w', 'd', 'h' )
                    .count - number of ranges
                }
    */
    , CalculateTheRange : function(arg)
    {
        var out = {start:arg.start, end:arg.end, grad:arg.grad, count:arg.count};
        var isEndAdj = false;

        // === Adjusting by specified size if it is specified
        if (arg.size)
        {
            if (!out.end)
            {
                out.start = $DT.AdjustBack(out.start,arg.size);
                out.end = $DT.AdjustAhead(out.start,arg.size);
                isEndAdj = true;
            }
            else if (!out.start)
            {
                out.end = $DT.AdjustAhead(out.end,arg.size);
                out.start = $DT.AdjustBack(out.start,arg.size);
                isEndAdj = true;
            }
        }
        
        // === Now that we have both the start and the end we can decide what will be the size of a subdivision
        if (!out.grad)
        {
            var s = $DT.toDate(out.end).getTime() - $DT.toDate(out.start).getTime();
            s = Math.floor( s / 1000 );
            if (s>$DT.MONTHSEC*36)      out.grad = "y"; // more then 36 month - cs = year
            else if (s>$DT.MONTHSEC*3)  out.grad = "m"; // more then 3 month - cs = month
            else if (s>$DT.DAYSEC)      out.grad = "d"; // more then a day - cs = day
            else                        out.grad = "h"; // less then a day - cs = hour
        }
        
        // === Adjusting both ends to their nearest end point of the same size as decided gradient
        out.start = $DT.AdjustBack(out.start,out.grad);
        if (!isEndAdj) out.end = $DT.AdjustAhead(out.end,out.grad);

        // === Now we just count how many times we have to add out.grad to out.start to reach the out.end
        if (!out.count)
        {
            var cur = $DT.clone(out.start);
            out.count = 0;
            while (!$DT.Compare(out,out.end)<0)
            {
                out.count++;
                cur = $DT.Add(cur, out.grad);
            }
        }

        return out;
    }

};
