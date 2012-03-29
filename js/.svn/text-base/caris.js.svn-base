/**************************************************
 * caris.js
 * the "global" utilities for caris simulator 
 **************************************************/

if (typeof eveo === "undefined") { eveo = {}; }
eveo.caris = {};
eveo.caris = {
	_isTouchDevice: 'ongesturestart' in window,
	
	getParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	  var regexS = "[\\?&]" + name + "=([^&#]*)";
	  var regex = new RegExp(regexS);
	  var results = regex.exec(window.location.href);
	  if(results == null)
	    return "";
	  else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	
	getTargetFromEvent: function(event) {
		return (event.currentTarget) ? event.currentTarget : event.srcElement;
	},
	
	whichTransitionEvent: function() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionEnd',
      'OTransition':'oTransitionEnd',
      'MSTransition':'msTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
	},
	
	getPositionFromEvent: function(e) {
		
		var pos = { x:0, y:0 };
		
		if (e.pageX || e.pageY) {
      pos.x = e.pageX;
      pos.y = e.pageY;
		}
		else if (e.clientX || e.clientY) {
	    pos.x = e.clientX + document.body.scrollLeft
	            + document.documentElement.scrollLeft;
	    pos.y = e.clientY + document.body.scrollTop
	            + document.documentElement.scrollTop;
		}
		
		return pos;
	},
	
	getElementsByClassName: function(className) {
	
		if (typeof document.getElementsByClassName == 'function') {
			return document.getElementsByClassName(className);
		}
		else {
			var elms = document.getElementsByTagName('*');
			var ei = new Array();
			for (i=0;i<elms.length;i++) {
				if (elms[i].getAttribute('class')) {
					ecl = elms[i].getAttribute('class').split(' ');
					for (j=0;j<ecl.length;j++) {
						if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
							ei.push(elms[i]);
						}
					}
				} else if (elms[i].className) {
						ecl = elms[i].className.split(' ');
						for (j=0;j<ecl.length;j++) {
							if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
								ei.push(elms[i]);
							}
						}
					}
			}
			return ei;
		}
	},

	simulateClick: function(el){
		if (typeof el === "string") { el = document.getElementById(el); }
		var evt;
    if (document.createEventObject){
    	// dispatch for IE
    	evt = document.createEventObject();
    	return el.fireEvent('onclick',evt)
    }
    else{
    	// dispatch for firefox + others
    	evt = document.createEvent("HTMLEvents");
    	evt.initEvent('click', true, true ); // event type,bubbling,cancelable
    	return !el.dispatchEvent(evt);
    }
	},
	
	simulateTouch: function(el) {
		if (typeof el === "string") { el = document.getElementById(el); }	
	  var evt;
	  if (document.createEvent) { // DOM Level 2 standard
	    evt = document.createEvent("TouchEvent");
	    evt.initTouchEvent("touchstart", true, true);
	    el.dispatchEvent(evt);
		}
	}
}