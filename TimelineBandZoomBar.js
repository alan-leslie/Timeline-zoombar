/* 
 * Model a zoombar on the 1st band of the timeline
 * @precon - timeline must be fully constructed and layed out
 */

TimelineBandZoomBar = function(tl, bandNumber) {
    this._timeline = tl;
    this._document = this._timeline.getDocument();
    this._bandNumber = bandNumber;
    this._bandInfo = this._timeline._bandInfos[bandNumber];
    this._zoomStepsLength = this._bandInfo.zoomSteps.length;
    this._bandId = "timeline-band-" + bandNumber;
    this._containerDivId = tl._containerDiv.id;
    this._stemDivId = this._containerDivId + "-" + this._bandId;
    this._sliderIconSelector = "img#" + this._stemDivId + "-ZoomSlider_icon"
    this._sliderStepPx = 11;
      
    var zoomInDiv = this._document.createElement("div");                 
    zoomInDiv.id = this._stemDivId + "-ZoomIn"; 
    zoomInDiv.className = "ZoomIn";
    this._timeline.addDiv(zoomInDiv);
    
    var zoomInElmt = this._document.createElement("img");
    zoomInElmt.id = this._stemDivId + "-ZoomIn_icon";
    zoomInElmt.className = "ZoomIn_icon"; 
    zoomInElmt.setAttribute("src", "img/hzoom-plus-mini.png");
    zoomInDiv.appendChild(zoomInElmt);
    this.zoomInElmt = zoomInElmt;

    var zoomSliderDiv = this._document.createElement("div");
    zoomSliderDiv.id = this._stemDivId + "-ZoomSlider";
    zoomSliderDiv.className = "ZoomSlider";
    this._timeline.addDiv(zoomSliderDiv);
    
    var zoomSliderElmt = this._document.createElement("img");
    zoomSliderElmt.id = this._stemDivId + "-ZoomSlider_icon";
    zoomSliderElmt.className = "ZoomSlider_icon"; 
    zoomSliderElmt.setAttribute("src", "img/hslider.png");
    zoomSliderDiv.appendChild(zoomSliderElmt);
    
    var zoomOutDiv = this._document.createElement("div");
    zoomOutDiv.id = this._stemDivId + "-ZoomOut";
    zoomOutDiv.className = "ZoomOut";
    this._timeline.addDiv(zoomOutDiv);
    
    var zoomOutElmt = this._document.createElement("img");
    zoomOutElmt.id = this._stemDivId + "-ZoomOut";
    zoomOutElmt.className = "ZoomOut_icon";  
    zoomOutElmt.setAttribute("src", "img/hzoom-minus-mini.png");
    zoomOutDiv.appendChild(zoomOutElmt);
    
    SimileAjax.DOM.registerEventWithObject(zoomSliderDiv, "click", this, "_onSliderClick");
    SimileAjax.DOM.registerEventWithObject(zoomInElmt, "click", this, "_onPlusClick");
    SimileAjax.DOM.registerEventWithObject(zoomOutElmt, "click", this, "_onMinusClick");
    
    var sliderStartPos = ((this._bandInfo.zoomIndex * this._sliderStepPx) + 1).toString() + "px";
    $(this._sliderIconSelector).css({
        left: sliderStartPos
    });   
    
    var theBand = this._document.getElementById(this._bandId);
    this._bandElement = theBand;
    
    this._band = this._timeline._bands[bandNumber];
    this._band._zoomBar = this;
}

// @precon - zoom must have already been updated

TimelineBandZoomBar.prototype._updateSlider = function() {
            var theNewSliderPos = (this._band._zoomIndex * this._sliderStepPx) + 1;	    
            var strNewSliderPos = theNewSliderPos + "px";

    $(this._sliderIconSelector).animate({
        left: strNewSliderPos
    }, 50);
}

TimelineBandZoomBar.prototype._onSliderClick = function(innerFrame, evt, target) {
    var now = new Date();
    now = now.getTime();

    if (!this._lastScrollTime || ((now - this._lastScrollTime) > 100)) {
        // limit actions due to FF3 sending multiple events back to back
        this._lastScrollTime = now;    // prevent bubble
	    
	var position = $(this.zoomInElmt).offset(); // position = { left: 42, top: 567 }
        var elmtWidth = $(this.zoomInElmt).width();
	    
        var divXPos = evt.clientX;
	var offsetx = position.left + elmtWidth;
	var stepPx = this._sliderStepPx;
	    
        var theZoomPos = Math.floor((divXPos - offsetx) / this._sliderStepPx);
        	    
        if(theZoomPos > (this._zoomStepsLength - 1)){
            theZoomPos = (this._zoomStepsLength - 1);
        }
		
        if(theZoomPos < 0){
            theZoomPos = 0;
        }
        
        if(this._band._zoomIndex != theZoomPos){
            var theNewSliderPos = (theZoomPos * this._sliderStepPx) + 1;	    
            var strNewSliderPos = theNewSliderPos + "px";
            // todo this should be updateSlider
            $(this._sliderIconSelector).stop().animate({
                left: strNewSliderPos
            }, 300);
        
            this._timeline.zoomToIndex(theZoomPos, this._bandElement);
        }
    }
    
    if (evt.stopPropagation) {
        evt.stopPropagation();
    }
    evt.cancelBubble = true;

    // prevent the default action
    if (evt.preventDefault) {
        evt.preventDefault();
    }
    evt.returnValue = false;
};    

TimelineBandZoomBar.prototype._onPlusClick = function(innerFrame, evt, target) {
    var now = new Date();
    now = now.getTime();

    if (!this._lastScrollTime || ((now - this._lastScrollTime) > 100)) {
        // limit actions due to FF3 sending multiple events back to back
        this._lastScrollTime = now;    // prevent bubble
        
        if(this._band._zoomIndex > 0){
            this._timeline.zoomToIndex(this._band._zoomIndex - 1, this._bandElement);
            this._updateSlider();
        }
    }
    
    if (evt.stopPropagation) {
        evt.stopPropagation();
    }
    evt.cancelBubble = true;

    // prevent the default action
    if (evt.preventDefault) {
        evt.preventDefault();
    }
    evt.returnValue = false;
};    

TimelineBandZoomBar.prototype._onMinusClick = function(innerFrame, evt, target) {
    var now = new Date();
    now = now.getTime();

    if (!this._lastScrollTime || ((now - this._lastScrollTime) > 100)) {
        // limit actions due to FF3 sending multiple events back to back
        this._lastScrollTime = now;    // prevent bubble
        
        if(this._band._zoomIndex < (this._zoomStepsLength -1)){
            this._timeline.zoomToIndex(this._band._zoomIndex + 1, this._bandElement);
            this._updateSlider();	    
        }
    }
    
    if (evt.stopPropagation) {
        evt.stopPropagation();
    }
    evt.cancelBubble = true;

    // prevent the default action
    if (evt.preventDefault) {
        evt.preventDefault();
    }
    evt.returnValue = false;
}; 

// utility function to help get a correct zoom increment
function nthroot(x, n) {
    var retVal;
    
    try {
        var negate = n % 2 == 1 && x < 0;
        if(negate)
            x = -x;
        var possible = Math.pow(x, 1 / n);
        n = Math.pow(possible, n);
        if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
            retVal = negate ? -possible : possible;
    } catch(e){/* nothing needed return value will ne undefined*/}
    
    return retVal;
}

// utitliy function to calculate the step values
// N.B. works for same unit or unit switch from DECADE to CENTURY 
function initZoomSteps(noOfSteps, greatestMag, leastMag){
    var newZoomSteps;
                
    if((noOfSteps > 1 && noOfSteps < 20) &&
        leastMag != undefined &&
        greatestMag != undefined){
                    
        var greatestMagCentury = greatestMag.pixelsPerInterval * 10;
                    
        if(greatestMagCentury > leastMag.pixelsPerInterval){
            var sizeDiv = greatestMagCentury/leastMag.pixelsPerInterval;
            var theRoot = nthroot(sizeDiv, noOfSteps -1);
            var ratio = theRoot - 1;
                    
            newZoomSteps = new Array();
                    
            for(var i = (noOfSteps -1); i >= 0; --i){
                var theStepData = new Object();
                var stepValue = Math.round(leastMag.pixelsPerInterval * Math.pow(1 + ratio, i));
                        
                if(stepValue > 500 && greatestMag.unit != leastMag.unit){
                    theStepData.pixelsPerInterval = Math.floor(stepValue/10);
                    theStepData.unit = greatestMag.unit;
                } else {
                    theStepData.pixelsPerInterval = stepValue;
                    theStepData.unit = leastMag.unit;
                }
                                     
                newZoomSteps.push(theStepData);
            }
        }
    }
    
    return newZoomSteps;
}



