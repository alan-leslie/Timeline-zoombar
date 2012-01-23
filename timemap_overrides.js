function sortItemByTimeFunction(a, b){
	if(a.getStartTime() > b.getStartTime())
	return 1;
	
	if(a.getStartTime() < b.getStartTime())
	return -1;
	
	return 0;
}
 
/**
 * Standard open info window function, using static text in map window
 */
TimeMapItem.openInfoWindowCombined = function() {
    var item = this,
    html = item.getInfoHtml(),
    ds = item.dataset,
    placemark = item.placemark;
    // scroll timeline if necessary
    if (!item.onVisibleTimeline()) {
        ds.timemap.scrollToDate(item.getStart());
    }
    
    var allItemsHere = new Array();
    allItemsHere.push(item);
    
    if(item.fromTimeline){
	    item.fromTimeline = false;
    } else {
	    var thisLocation = item.placemark.location;
	    var thisLat = thisLocation.lat;
	    var thisLon = thisLocation.lon;
	    var thisTitle = item.opts.title;
	    
	    for (var i = 0; i < ds.items.length; i++) {
		var theItem = ds.items[i];
		var placemarkVisible = theItem.placemarkVisible;
		var theLocation = theItem.placemark.location;
		var theLat = theLocation.lat;
		var theLon = theLocation.lon;
		var theTitle = theItem.opts.title;

		if(placemarkVisible){
		    if(theLat == thisLat && theLon == thisLon){
			if(thisTitle != theTitle){
				allItemsHere.push(theItem);
			}
		    }
		}
	    }
        }
	
	if(allItemsHere.length > 1){
		allItemsHere.sort(sortItemByTimeFunction);
		
		html = allItemsHere[0].getInfoHtml();
		
		var i = 1;
		for(i=1; i<allItemsHere.length; i++) { 
                    var currentItem = allItemsHere[i]; 
		    var otherHtml  = currentItem.getInfoHtml();
		    var locIndex = otherHtml.indexOf('<br>');
				
		     if(locIndex > 0 && locIndex + 4 < otherHtml.length){
			        html = html + "<br>";
				var htmlMinusLocation = otherHtml.substring(locIndex + 4, otherHtml.length - 1);
				html = html + htmlMinusLocation;
		     }
                }
	}

    // open window
    if (item.getType() == "marker" && placemark.api) {
        placemark.setInfoBubble(html);
        placemark.openBubble();
        // deselect when window is closed
        item.closeHandler = placemark.closeInfoBubble.addHandler(function() { 
            // deselect
            ds.timemap.setSelected(undefined);
            // kill self
            placemark.closeInfoBubble.removeHandler(item.closeHandler);
        });
    } else {
        item.map.openBubble(item.getInfoPoint(), html);
        item.map.tmBubbleItem = item;
    }
}