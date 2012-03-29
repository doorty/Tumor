eveo = {
  browser : {
    IE : (navigator.appName=="Microsoft Internet Explorer"),
    FF : (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)),
    NS : (navigator.appName == "Netscape"),
    SAFARI : (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent))
  },
  library : {
    savedValueOf : new Object(),  // savedValueOf will hold "original" values that we override/restore as needed
    ////////////////////////////////////////////////////////////////////////////////
    //
    // addClassName([object|string] oHTMLElement, string classNameToAdd)
    //           Adds classNameToAdd to an HTMLElement. Guaranteed not to add the same className twice.
    //           classNameToAdd can be a space separated list of classNames.
    //           You can pass in the id to an object or the actual object
    //
    ////////////////////////////////////////////////////////////////////////////////
    addClassName : function(oHTMLElement, classNameToAdd) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      if (oHTMLElement && !this.hasClassName(oHTMLElement, classNameToAdd)) {   // Make sure we have an oHTMLElement ot operate on and that the classname isn't already there
        var theClassName = oHTMLElement.className;
        if (theClassName && (theClassName.length > 0)) {  // If oHTMLElement already has a class name, some malert(iTunesU.PodcastManager._universeOfore work is needed
          var classNamesToAdd = classNameToAdd.split(" ");
          if (classNamesToAdd.length===1 && ((" " + theClassName + " ").lastIndexOf(" " + classNameToAdd + " ") === -1) ) { // If we only have one className to potentially add, take the "less work" approach
            oHTMLElement.className = oHTMLElement.className + " " + classNameToAdd;
          } else {
            var theClassNames = theClassName.split(" "),
                iEnd = classNamesToAdd.length,
                aClassName,
                theClassNamesToAddArray = [];
            for (var i=0;i<classNamesToAdd.length;i++) {
              aClassName = classNamesToAdd[i];
              if (theClassNames.indexOf(aClassName)===-1) {
                theClassNamesToAddArray.push( aClassName );
              }
            }
            oHTMLElement.className = oHTMLElement.className + " " + ((theClassNamesToAddArray.length > 1) ? theClassNamesToAddArray.join(" ") : theClassNamesToAddArray[0]);
          }
        } else {
          oHTMLElement.className = classNameToAdd;        // If oHTMLElement did not already have a class name, just add it
        }
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    // addEvent( [object|string] oHTMLElement, string eventName, string handler )          //
    //   Adds an event handler to an HTMLElement.  Note that the eventName must be passed  //
    //   in without the "on" prefix.                                                       //
    /////////////////////////////////////////////////////////////////////////////////////////
    addEvent : function( oHTMLElement, eventName, handler ) {
      try   {
        if (typeof(oHTMLElement)=="string")  {
          oHTMLElement = document.getElementById(oHTMLElement);
        }
        if (eveo.browser.NS) {
          oHTMLElement.addEventListener(eventName, handler, false);
        } else {
          oHTMLElement.attachEvent("on" + eventName, handler);
        }
      }
        catch(err) {
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    // disableTextSelection() - (temporarily) disables text selection on the page          //
    /////////////////////////////////////////////////////////////////////////////////////////
    disableTextSelection : function() {
      switch (true) {
        case ( typeof document.onselectstart!="undefined" ) : // IE
          this.savedValueOf["onselectstart"] = document.onselectstart;
          document.onselectstart=function() { return false; };
          break;
        case ( typeof document.body.style.MozUserSelect != "undefined" ) : // Firefox
          this.savedValueOf["-moz-user-select"] = document.body.style.MozUserSelect || "text";
          document.body.style.MozUserSelect="none";
          break;
        case ( document.body.style["-khtml-user-select"] != "undefined" ) : // Safari
          this.savedValueOf["-khtml-user-select"] = document.body.style["-khtml-user-select"];
          document.body.style["-khtml-user-select"] = 'none';
          break;
      }
    },
    ///////////////////////////////////////////////////////////////////////////////////////
    // extractedWebkitTranslate3DProperty([object|string] oHTMLElement, string property) //
    // ================================================================================= //
    // Extracts x,y,or z value from a webkitTranslate3D style. Returns a string value.    //
    ///////////////////////////////////////////////////////////////////////////////////////
    extractedWebkitTranslate3DProperty : function( oHTMLElement, property ) {
      var retVal = 0;
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      if (oHTMLElement.style.webkitTransform && oHTMLElement.style.webkitTransform.indexOf('translate3d') > -1 && property !== undefined) {
        var webkitTransform = oHTMLElement.style.webkitTransform,
            propertyArray   = webkitTransform.replace(/ /gi,"").replace("translate3d(","").replace(")","").split(","); // WAS webkitTransform.replace(/[translate3d( )]/gi,'').split(",");
        switch (property.toLowerCase()) {
          case "x" :
            retVal = propertyArray[0];
            break;
          case "y" :
            retVal = propertyArray[1];
            break;
          case "z" :
            retVal = propertyArray[2];
            break;
        }
      }
      return parseFloat(retVal);
    },
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    // findElementOfClassFromChild([object|string] oHTMLElement, string className) //
    // =========================================================================== //
    // Searches up from a child until it find a containing element with className  //
    /////////////////////////////////////////////////////////////////////////////////
    findElementOfClassFromChild : function( oHTMLElement, className) {
      var retVal=null;
      while ( oHTMLElement != document.body ) {
        if (this.hasClassName(oHTMLElement, className)) {
          retVal = oHTMLElement;
        }
        oHTMLElement = oHTMLElement.parentElement;
      }
// TODO: Clean this up
      return retVal;
    },
    ////////////////////////////////////////////////////////////////////////////////
    // getStyle([object|string] oHTMLElement, string cssProperty)                 //
    // ==========================================================                 //
    // Returns value of a cssProperty                                             //
    ////////////////////////////////////////////////////////////////////////////////
    getStyle : function(oHTMLElement, cssProperty) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      var retVal = "";
      if(document.defaultView && document.defaultView.getComputedStyle){
        retVal = document.defaultView.getComputedStyle(oHTMLElement, null).getPropertyValue(cssProperty);
      } else {
        if (oHTMLElement.currentStyle){
          cssProperty = cssProperty.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
          });
          retVal = oHTMLElement.currentStyle[cssProperty];
        }
      }
      return retVal;
    },
    ////////////////////////////////////////////////////////////////////////////////
    //
    // hasClassName([object|string] oHTMLElement, string classNameOfInterest)
    //           Returns a boolean value of if an HTMLElement has the className of interest
    //           You can pass in the id to an object or the actual object
    //
    ////////////////////////////////////////////////////////////////////////////////
    hasClassName : function(oHTMLElement, classNameOfInterest) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      return ((" " + oHTMLElement.className + " ").lastIndexOf(" " + classNameOfInterest + " ") > -1);
    },
    ////////////////////////////////////////////////////////////////////////////////
    //
    // padWithZero(number number) - ensures 01, 02, 10, etc. and returns a string value
    //
    ////////////////////////////////////////////////////////////////////////////////
    padWithZero : function( number ) {
      var retVal = number.toString();
      if (retVal.length===1) { retVal = "0" + retVal; }
      return retVal;
    },
    ////////////////////////////////////////////////////////////////////////////////
    //
    // removeClassName([object|string] oHTMLElement, string classNameToRemove)
    //           Removes classNameToRemove from an HTMLElement, if it exists.
    //           classNameToRemove can be a space separated list of classNames.
    //           You can pass in the id to oHTMLElement or the actual object
    //
    ////////////////////////////////////////////////////////////////////////////////
    removeClassName : function(oHTMLElement, classNameToRemove) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      if (oHTMLElement) {
        var theClassName = oHTMLElement.className;
        if (theClassName && (theClassName.length > 0)) {
          var theClassNameArray = theClassName.split(" "),
              classNamesToRemove = classNameToRemove.split(" "),
              iEnd = theClassNameArray.length,
              aClassName,
              theNewClassNameArray = [];
          for (var i=0;i<theClassNameArray.length;i++) {
            aClassName = theClassNameArray[i];
            if (classNamesToRemove.indexOf(aClassName)===-1) {
              theNewClassNameArray.push( aClassName );
            }
          }
          switch (true) {
            case (theNewClassNameArray.length>1) :
              oHTMLElement.className = theNewClassNameArray.join(" ");
              break;
            case (theNewClassNameArray.length==1) :
              oHTMLElement.className = theNewClassNameArray[0];
              break;
            case (theNewClassNameArray.length==0) :
              oHTMLElement.className = "";
              break;
          }
        }
        //oHTMLElement.className = oHTMLElement.className.trim();
        oHTMLElement.className = oHTMLElement.className; // trim not supported <= IE 8
      }
    },
    ////////////////////////////////////////////////////////////////////////////////
    //
    // removeDuplicatesFromArray(array sourceArray)
    //           Removes all duplicates from sourceArray. Returns a new array.
    //
    ////////////////////////////////////////////////////////////////////////////////
    removeDuplicatesFromArray : function( sourceArray ) {
      var retVal = [];
      if (sourceArray && sourceArray.length) {
        for (var i=0,iEnd=sourceArray.length;i<iEnd;i++) {
          var arrayItem = sourceArray[i];
          if (retVal.indexOf(arrayItem)===-1) {
            retVal.push( arrayItem );
          }
        }
      }
      return retVal;
    },
    ////////////////////////////////////////////////////////////////////////////////
    //
    // removeElement([object|string] oHTMLElement)
    //           Removes an element from the DOM
    //
    ////////////////////////////////////////////////////////////////////////////////
    removeElement : function(oHTMLElement) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      if (oHTMLElement) {
        oHTMLElement.parentElement.removeChild( oHTMLElement );
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    // removeEvent( [object|string] oHTMLElement, string eventName, string handler )       //
    //   Removes an event handler to an HTMLElement.  Note that the eventName must be      //
    //   passed in without the "on" prefix.                                                //
    /////////////////////////////////////////////////////////////////////////////////////////
    removeEvent : function( oHTMLElement, eventName, handler ) {
      try   {
        if (typeof(oHTMLElement)=="string")  {
          oHTMLElement = document.getElementById(oHTMLElement);
        }
        if (eveo.browser.NS) {
          oHTMLElement.removeEventListener(eventName, handler, false);
        } else {
          oHTMLElement.detachEvent("on" + eventName, handler);
        }
      }
      catch(err) {
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    // setSelectedIndexBasedOnValue( [object|string] oHTMLElement, string optionValue )    //
    //   Sets the selected index of a <select> element based on a value passed in          //
    /////////////////////////////////////////////////////////////////////////////////////////
    setSelectedIndexBasedOnValue : function( oHTMLElement, optionValue ) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      if (oHTMLElement) {
        for (var i=0, iEnd=oHTMLElement.options.length; i< iEnd; i++) {
          if (oHTMLElement.options[i].value == optionValue) {
            oHTMLElement.selectedIndex = i;
            break;  
          }  
        }
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    // show( [object|string] oHTMLElement, bool bIsVisible ) - adds/removes special class  //
    //   to show/hide selected oHTMLElement based on boolean bIsVisible                    //
    /////////////////////////////////////////////////////////////////////////////////////////
    show : function( oHTMLElement, bIsVisible ) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      if (bIsVisible) {
        this.removeClassName( oHTMLElement, 'hidden' );
      } else {
        this.addClassName( oHTMLElement, 'hidden' );
      }
    },
    ////////////////////////////////////////////////////////////////////////////////
    //
    // toggleClassName([object|string] oHTMLElement, string classNameOfInterest)
    //           Adds or Removes className of an HTMLElement that has the className of interest
    //           You can pass in the id to an object or the actual object
    //
    ////////////////////////////////////////////////////////////////////////////////
    toggleClassName : function(oHTMLElement, classNameOfInterest) {
      if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
      return (this.hasClassName(oHTMLElement, classNameOfInterest) ? this.removeClassName(oHTMLElement, classNameOfInterest) : this.addClassName(oHTMLElement, classNameOfInterest));
    }

  }
}

////////////////////////////////////////////////////////////////////////////////
//
// Array.jsonValueForKey( key, value ) - searches Array of JSON objects
//                                          [ { item:"foo", page:"0" } ]
//     Returns array element if any key matches value. For example
//     jsonValueForKey( "item", "foo") would return { item:"foo", page:"0" }
////////////////////////////////////////////////////////////////////////////////
Array.prototype.jsonValueForKey = function( key, value ) {
  var i = 0,
      iEnd = this.length,
      retVal = null;
  for ( ;i<iEnd;i++) {
    if (this[i][key]===value) {
      retVal = this[i];
      break;
    }
  }
  return retVal;
};
////////////////////////////////////////////////////////////////////////////////
//
// Array.indexOf() - returns integer index where valueToSearchFor is in an Array
//
////////////////////////////////////////////////////////////////////////////////
if (Array.prototype.indexOf===undefined) {
  Array.prototype.indexOf = function( valueToSearchFor ) {
    var iEnd = this.length;
    var retVal = -1;
    for (var i=0;i<iEnd; i++) {
      if (this[i] == valueToSearchFor) {
        retVal = i;
        break;
      }
    }
    return retVal;
  };
}
////////////////////////////////////////////////////////////////////////////////
//
// Array.remove( object|string item) - removes an item from an array
//    Example x = ["abc","xyz",1,4]  x.remove("xyz") returns ["abc",1,4]
//
////////////////////////////////////////////////////////////////////////////////
if (Array.prototype.remove===undefined) {       // Presumably this will eventually be added to Javascript
  Array.prototype.remove = function( item ) {
    var itemLocation = this.indexOf(item);
    if (itemLocation > -1) {
      this.splice(itemLocation,1);
    }
  }
}

var oLogWindow;
function log( message ) {
  if (oLogWindow === undefined) {
    oLogWindow = document.getElementById('log');
  }
  oLogWindow.innerHTML += message +"<br/>";
}

var scroller = {
  _currentDragObject : {
	  oContainer : null,      // This will contain the "parent" div contining all of the horizontaly scrolling divs
    oHTMLElement : null,    // This contains the div being scroller
    originalX : 0,          // Starting Margin-Left of scroll container before scrolling begins
    startX : 0,
    startY : 0,
    timeScrollStarted : 0
  },
  _default : {
    kBounceLimit : 0.25,      // Percentage of the page which content can be overscrolled before it must bounce back
    kPageEscapeVelocity : 55  // Velocity of movement at which scroller will automatically advance to the next page
  },
  handlerFor : {
    touchStart : function(event, oScrollContainer) {
      event = event.touches[0];
	    scroller._currentDragObject.oContainer   = document.getElementById(oScrollContainer);
      scroller._currentDragObject.oHTMLElement = eveo.library.findElementOfClassFromChild(event.target, 'pane');
      scroller._currentDragObject.originalX    = parseFloat(eveo.library.getStyle(scroller._currentDragObject.oContainer, "margin-left"));
	    scroller._currentDragObject.startX       = event.clientX - parseFloat(eveo.library.getStyle(scroller._currentDragObject.oContainer, "margin-left"));
	    scroller._currentDragObject.startY       = event.clientY;
      scroller._currentDragObject.timeScrollStarted = new Date().getTime();
	    eveo.library.disableTextSelection();
	    eveo.library.addEvent(scroller._currentDragObject.oHTMLElement, 'touchmove', scroller.handlerFor.touchMove );
	    eveo.library.addEvent(scroller._currentDragObject.oHTMLElement, 'touchend', scroller.handlerFor.touchEnd );
    },
    touchMove : function(event) {
      event.preventDefault();
      var xPos = event.touches[0].clientX,
          yPos = event.touches[0].clientY,
          deltaX = xPos - scroller._currentDragObject.startX;

      scroller._currentDragObject.oContainer.style.marginLeft =  deltaX + "px";
    },
    touchEnd : function(event) {
	    eveo.library.removeEvent(scroller._currentDragObject.oHTMLElement, 'touchmove', scroller.handlerFor.touchMove );
	    eveo.library.removeEvent(scroller._currentDragObject.oHTMLElement, 'touchend', scroller.handlerFor.touchEnd );
	    var containerCurrentMarginLeft = parseFloat( scroller._currentDragObject.oContainer.style.marginLeft),
	        containerWidth   = parseFloat(eveo.library.getStyle( scroller._currentDragObject.oContainer, "width")),
	        elementWidth     = parseFloat(eveo.library.getStyle( scroller._currentDragObject.oHTMLElement, "width")),
	        newMarginLeft    = 0,
          timeScrollEnded  = new Date().getTime(),
	        widthOfLastChild = parseFloat(eveo.library.getStyle( scroller._currentDragObject.oContainer.children[ scroller._currentDragObject.oContainer.children.length-1 ], "width")),
          deltaTime = (timeScrollEnded - scroller._currentDragObject.timeScrollStarted),
          deltaX    = (containerCurrentMarginLeft - scroller._currentDragObject.originalX),
          direction = (deltaX > 0) ? "right" : "left",
          velocity  = Math.abs(deltaX / deltaTime) * 100,
          bHasScrolledEnoughToWarrantAction = (Math.abs(deltaX) > elementWidth*scroller._default.kBounceLimit) || velocity > scroller._default.kPageEscapeVelocity;  // If we have scrolled more than a certain number of pixels OR are scrolling fast enough, jump to the next page
//      log("bHasScrolledEnoughToWarrantAction: " + bHasScrolledEnoughToWarrantAction + '<br/>based on velocity:' + (velocity > scroller._default.kPageEscapeVelocity) + '<br/>based on distance:' + (Math.abs(deltaX) > elementWidth*scroller._default.kBounceLimit));
	    switch (true) {
	      case (containerCurrentMarginLeft > 0) :
	        log("Past left limit")
	        newMarginLeft = 0;
	  	    break;
	      case (containerCurrentMarginLeft < -containerWidth + widthOfLastChild) : // Here is the case for past the width
	        log("Past right limit")
	        newMarginLeft = -containerWidth + widthOfLastChild;
	        break;
	      case (direction==="left" && !bHasScrolledEnoughToWarrantAction) :
	        log( "Not enough for left" );
	        newMarginLeft = scroller._currentDragObject.originalX;
	        break;
	      case (direction==="right" && !bHasScrolledEnoughToWarrantAction) :
	        log( "Not enough for right" );
          newMarginLeft = scroller._currentDragObject.originalX;
	        break;
	      case (direction==="left") :
          if (window["onDisplayOfEveryPage"]) {
            window["onDisplayOfEveryPage"]();
          }
	        newMarginLeft = scroller._currentDragObject.originalX - elementWidth;
	        var itemPageNumber = ((-newMarginLeft/1024) + 1);
          var onDisplayOfNewPageMethod = 'onDisplayOfPage_' + itemPageNumber;
          if (window[onDisplayOfNewPageMethod]) {
            window[onDisplayOfNewPageMethod]();
          }
          zytiga.setActiveThumbnail( itemPageNumber );
	        break;
	      case (direction==="right") :
          if (window["onDisplayOfEveryPage"]) {
            window["onDisplayOfEveryPage"]();
          }
	        newMarginLeft = scroller._currentDragObject.originalX + elementWidth;
	        var itemPageNumber = ((-newMarginLeft/1024) + 1),
              onDisplayOfNewPageMethod = 'onDisplayOfPage_' + itemPageNumber;
          if (window[onDisplayOfNewPageMethod]) {
            window[onDisplayOfNewPageMethod]();
          }
          zytiga.setActiveThumbnail( itemPageNumber );
	        break;
	      default:
		    // newMarginLeft = containerCurrentMarginLeft - parseFloat(library.getStyle( scroller._currentDragObject.oHTMLElement, "width"));
		    // 	      newMarginLeft = -parseFloat(library.getStyle(scroller._currentDragObject.oHTMLElement,'left'));
	        break;
	    }
	    eveo.library.addClassName(scroller._currentDragObject.oContainer, 'animating');
	    scroller._currentDragObject.oContainer.style.marginLeft = newMarginLeft + "px";
	    setTimeout( function() {
	      eveo.library.removeClassName(scroller._currentDragObject.oContainer, 'animating');
	      scroller._currentDragObject.oContainer = null;
	     },500);
	    // Make nice
	    eveo.library.enableTextSelection();
	    scroller._currentDragObject.oHTMLElement = null;
	    scroller._currentDragObject.startX = 0;
	    scroller._currentDragObject.startY = 0;
	    scroller._currentDragObject.timeScrollStarted = 0;
    }
  }
}

  ///////////////////////////////////////////////////////////////////////////////////
  // Spinner([object|string] oHTMLElement, json params) - injects a Spinner Object //
  // ==================================================   into the page. Note that //
  // the height and width are inherited from the containing oHTMLElement. Accepts  //
  // the following json parameters:                                                //
  //   innerRadius - dist from center where fins begin to draw (def 55% of radius) //
  //   outerRadius - dist from innerRadius where fins stop drawing                 //
  //   finColors - this is an array of twelve colors that can be overridden        //
  //   finWidth - how "fat" each fin is (default is 8% of radius)                  //
  //   strokeWidth - this is how many pixels wide the outline for each fin is. "0" //
  //     draws no outline. (useful for smaller spinners)                           //
  //   strokeStyle - this is the (usually rgba) outline color. Default #808080     //
  // *Note start(),stop() and spin() methods assigned to constructor's prototype   //
  ///////////////////////////////////////////////////////////////////////////////////
  function Spinner( oHTMLElement, params ) {
    if (typeof(oHTMLElement)=="string")  { oHTMLElement = document.getElementById(oHTMLElement); }
    if (params===undefined) { params={} };
    var oCanvas = document.createElement('canvas');

    this.height = parseFloat( getComputedStyle( oHTMLElement, null)["height"] );
    this.width  = parseFloat( getComputedStyle( oHTMLElement, null)["width"] );
    var radius = Math.min(this.height / 2, this.width / 2);
    this.innerRadius     = params["innerRadius"] || radius * 2 * .27833333;
    this.outerRadius     = params["outerRadius"] || radius * .99;
    this.finWidth        = params["finWidth"]   ||  .08 * radius; //8;
    this.finColors       = params["finColors"]   || [ "e8e8e8","f1f1f1", "fafafa", "b2b2b2", "b6b6b6", "b9b9b9", "bebebe", "c3c3c3", "c9c9c9", "d0d0d0", "d7d7d7", "dfdfdf" ];
    this.strokeStyle     = params["strokeStyle"] || "rgba(128,128,128,1)";
    this.strokeWidth     = (params["strokeWidth"]!==undefined) ? params["strokeWidth"] : 2;  // Specifies whether an outline will appear around each fin
    this.finColorOffset  = 0;  // This is a counter that is mod-ed around 12 to draw the spinner with appropriate color as indexed into the finColors array
    this.spinnerInterval = null;
    this.id = oHTMLElement.id;
    this.oHTMLElement = oHTMLElement;
    // Set up the <canvas> object
    oCanvas.width  = this.width;
    oCanvas.height = this.height;
    this.context  = oCanvas.getContext('2d');
    this.context.translate( radius, radius );
    oHTMLElement.appendChild( oCanvas );
    oHTMLElement._spinner = this;
  }
  ///////////////////////////////////////////////////////////////////////////////////
  // Spinner.draw() - this clears the previous spinner drawn, then loops through   //
  // ==============   the 12 fins, rotating the canvas 30 degrees each time and    //
  // drawing each fin with the appropriate color from the finColors array          //
  ///////////////////////////////////////////////////////////////////////////////////
  Spinner.prototype.draw = function() {
    this.context.clearRect(-this.width,-this.height,this.width*2,this.height*2);
    for (var i=0;i<12;i++) {
      this.drawFin( this.finColors[ (i + this.finColorOffset) % 12] );
      this.context.rotate(-360/12 * Math.PI/180);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////
  // Spinner.drawFin( string fillColor ) - this draws a single fin.  Each is made  //
  // ===================================   up of a half circle on either end of a  //
  // rectangle. Trust me, this took a while to work out. But I overcame!           //
  ///////////////////////////////////////////////////////////////////////////////////
  Spinner.prototype.drawFin = function( fillColor ) {
    var ctx = this.context;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth   = this.strokeWidth;
    ctx.beginPath();
    ctx.arc(this.outerRadius-this.finWidth,0,this.finWidth,-Math.PI/2,Math.PI/2, false);
    ctx.rect(this.innerRadius,-this.finWidth,this.outerRadius-this.innerRadius-this.finWidth,this.finWidth*2);
    ctx.arc(this.innerRadius,0,this.finWidth,Math.PI/2,-Math.PI/2,false);
    ctx.closePath();
    if (this.strokeWidth > 0) {
      ctx.stroke();
    }
    ctx.fill();
  };
  Spinner.prototype.spin = function() {
    this.finColorOffset += 1;
    this.draw();
  }
  Spinner.prototype.start = function() {
    this.spinnerInterval = setInterval( this.id + ".spin()", 100);
  }
  Spinner.prototype.stop = function() {
    clearInterval( this.spinnerInterval );
  }