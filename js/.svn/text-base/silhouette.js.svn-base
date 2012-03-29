/**************************************************
 * silhouette.js
 * functionality for silhouette.html
 **************************************************/
if (typeof eveo === "undefined") { eveo = {}; }
eveo.silhouette = {};
eveo.silhouette = {

	_body: null,
	_organs: null,
	_isTouchDevice: 'ongesturestart' in window,

	/* when an organ is selected transition to tumor.html */
	selectedOrgan: function(e) {
	
		var target = eveo.caris.getTargetFromEvent(e),
				organImg = null,
				transitionEndEvent = eveo.caris.whichTransitionEvent();

		if (target.tagName == "IMG") {
			organImg = document.getElementById(target.id);
		}
		else {
			organImg = document.getElementById(target.id + "_tumor");
		}

		
		if (organImg && transitionEndEvent) {
			// if it's modern webkit browser use a transition

			eveo.library.addClassName(document.body, "transition");
			eveo.library.addClassName(eveo.silhouette._body, "transition");
			eveo.library.addEvent(eveo.silhouette._body, transitionEndEvent, function() {
				window.location.href = "tumor.html?type=" + organImg.id;
			});

		}
		else {
			// browser doesn't support fancy transitions, just redirect 
			window.location.href = "tumor.html?type=" + organImg.id;
		}
	},

	/* add events for selecting organs */
	load: function() {

		eveo.silhouette._body = document.getElementById("body");
		eveo.silhouette._organs = eveo.caris.getElementsByClassName("organ");

		if (eveo.silhouette._isTouchDevice) {
			for (var i=0, max = eveo.silhouette._organs.length; i < max; i++) {
				eveo.library.addEvent(eveo.silhouette._organs[i], "touchstart", eveo.silhouette.selectedOrgan);
			}
		}
		else {
			for (var i=0, max = eveo.silhouette._organs.length; i < max; i++) {
				eveo.library.addEvent(eveo.silhouette._organs[i], "click", eveo.silhouette.selectedOrgan);
			}
		}
				
	},
	
	/* reset page (remove transition) for mobile safari */
	popstate: function() {

		eveo.library.removeClassName(document.body, "transition");
	
		if (eveo.silhouette._body) {
			eveo.library.removeClassName(eveo.silhouette._body, "transition");
		}
	}
};

ready.push(eveo.silhouette.load);
eveo.library.addEvent(window, "popstate", eveo.silhouette.popstate);