/**************************************************
 * tumor.js
 * functionality for tumor.html
 **************************************************/
if (typeof eveo === "undefined") { eveo = {}; }
eveo.tumor = {};
eveo.tumor = {

	_tumor: null,
	_type:"",
	_transitionEndEvent:"", /* depends on browser, e.g. webkitTransitionEnd */
	_frames: 20,
	_currentFrame: 0,
	_transitionAnimating: false,
	_frameHeight: 512, // in pixels
	/*
	_labels: {
		see eveo.tumor.loadTumorType()
	},
	*/
	_startPos: { x: 0, y:0 },
	_isMouseDown: false,
	
	/* get starting coordinates for tumor movement, and check to see if touch was on a label */
	touchStart: function(e) {
	
		eveo.tumor._startPos.x = e.touches[0].pageX;
		eveo.tumor._startPos.y = e.touches[0].pageY;

		eveo.tumor.detectLabelHit(eveo.tumor._startPos.x, eveo.tumor._startPos.y, true);
		
	},
	
	/* rotate tumor based on direction of touch movement. gets initial coordinates in touchStart */
	touchMove: function(e) {

		var endPos = { x: 0, y: 0 },
				diffPos = { x: 0, y: 0 };

		endPos.x = e.targetTouches[0].pageX;
		endPos.y = e.targetTouches[0].pageY;
		
		diffPos.x = endPos.x - eveo.tumor._startPos.x;
		diffPos.y = endPos.y - eveo.tumor._startPos.y;
		
		//alert("diffPos.x = " + diffPos.x);
		
		if (!eveo.tumor._transitionAnimating) {
			if (diffPos.x > 10) { // swipe left
				eveo.tumor.setFrameOffset(1);
			}
			else if (diffPos.x < -10) { // swipe right
				eveo.tumor.setFrameOffset(-1);
			}
		}
		
		return false;
	},
	
	/* mouse key released, don't rotate tumor on mouseMove */
	mouseDown: function(e) {
	
		var pos = eveo.caris.getPositionFromEvent(e); // (x,y) = (pos.x, pos.y)

		eveo.tumor._isMouseDown = true;
		eveo.tumor._startPos.x = pos.x;
		eveo.tumor._startPos.y = pos.y;

		eveo.tumor.detectLabelHit(eveo.tumor._startPos.x, eveo.tumor._startPos.y, true);
		
	},
	
	/* mouse key released, don't rotate tumor on mouseMove */
	mouseUp: function(e) {
		
		eveo.tumor._isMouseDown = false;
		
	},
	
	/* rotate tumor based on direction of mouse movement. gets initial coordinates in mouseDown */
	mouseMove: function(e) {

		if (eveo.tumor._isMouseDown) {
		
			var endPos = { x: 0, y: 0 },
					diffPos = { x: 0, y: 0 },
					pos = eveo.caris.getPositionFromEvent(e);

			endPos.x = pos.x;
			endPos.y = pos.y;
			
			diffPos.x = endPos.x - eveo.tumor._startPos.x;
			diffPos.y = endPos.y - eveo.tumor._startPos.y;

			if (!eveo.tumor._transitionAnimating) {
				if (diffPos.x > 0) { // swipe left
					eveo.tumor.setFrameOffset(1);
				}
				else if (diffPos.x < 0) { // swipe right
					eveo.tumor.setFrameOffset(-1);
				}
			}
		}
		
		return false;

	},
	
	/* For debugging, rotate tumor via "+" or "-" keys */
	keyPress: function(e) {

		var keyCode = e.keyCode || e.which,
				arrow = {left: 45, up: 45, right: 61, down: 61 };
				
		//alert("key = " + keyCode);

	  switch (keyCode) {
	    case arrow.left:
	    case arrow.up:
	      eveo.tumor.setFrameOffset(-1);
	      return false;
	    break;
	    case arrow.right:
	    case arrow.down:
	      eveo.tumor.setFrameOffset(1);
	      return false;
	    break;
	  }

	},
	
	/* go inside tumor, redirect to subtumor.html */
	detectLabelHit: function(hitX, hitY, isPageCoordinates) {
	
		if (isPageCoordinates) { // need relative coordinates to tumor
			var tumorPos = eveo.tumor.findElementPos(eveo.tumor._tumor);
			hitX -= tumorPos[0];
			hitY -= tumorPos[1];
		}

		for(var label in eveo.tumor._labels) {			
			if (eveo.tumor._labels.hasOwnProperty(label)) {
				var boxes = eveo.tumor._labels[label],
						box = boxes[eveo.tumor._currentFrame];
					
				if (box) {	

					// if touch within block region of label
					if ( hitX >= box[0] && hitX <= (box[0] + box[2]) ) {
						if ( hitY >= box[1] && hitY <= (box[1] + box[3]) ) {

							var hitLabel = label;
							
							// NOTE: anything done below needs to be undone in eveo.tumor.popstate 
							eveo.library.addClassName(eveo.tumor._tumor, "zoom");
							if(eveo.tumor._transitionEndEvent) {
								eveo.library.addEvent(eveo.tumor._tumor, eveo.tumor._transitionEndEvent, eveo.tumor.goToSubtumor(eveo.tumor._type, hitLabel));
							}
							else {
								eveo.tumor.goToSubtumor(eveo.tumor._type, hitLabel).call(this);
							}
						}
					}
				}
				
			}
		}

	},
	
	/* go inside tumor, redirect to subtumor.html */
	goToSubtumor: function(type, biomarker) {
		return function() {
			window.location.href = "subtumor.html?tumor=" + type + "&biomarker=" + biomarker;
		}
	},
	
	/* set frame offset from current frame for the rotating tumor */
	setFrameOffset: function(frameOffset) {

		eveo.tumor._currentFrame += frameOffset;
		
		if (eveo.tumor._currentFrame >= eveo.tumor._frames) {
			eveo.tumor._currentFrame -= eveo.tumor._frames; // loop back to top of sprite
		}
		else if (eveo.tumor._currentFrame < 0) {
			eveo.tumor._currentFrame += eveo.tumor._frames; // loop back to bottom of sprite
		}
		
		eveo.tumor._tumor.style.backgroundPosition = "0 " + -(eveo.tumor._currentFrame * eveo.tumor._frameHeight) + "px";
		
	},
	
	/* based on the tumor type, setup hotspots for labels */
	findElementPos: function(obj) {
		
		var curleft = curtop = 0;
		
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		
		return [curleft,curtop];

	},
	
	/* based on the tumor type, setup hotspots for labels */
	loadTumorType: function(tumorType) {
		
		tumorType = tumorType.toLowerCase();
		eveo.library.addClassName(eveo.tumor._tumor, tumorType);

		switch (true) {
			case (tumorType === "breast_tumor"):
				eveo.tumor._labels = { // [left, top, width, height] in pixels
					SPARC:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [373,130,150,50],[373,130,150,50],[373,130,150,50],[373,130,150,50],[373,130,150,50],[373,130,150,50],[373,130,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TUBB3:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [373,194,150,50],[373,194,150,50],[373,194,150,50],[373,194,150,50],[373,194,150,50],[373,194,150,50],[373,194,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TLE3:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [373,267,150,50],[373,267,150,50],[373,267,150,50],[373,267,150,50],[373,267,150,50],[373,267,150,50],[373,267,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					PGP:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [373,333,150,50],[373,333,150,50],[373,333,150,50],[373,333,150,50],[373,333,150,50],[373,333,150,50],[373,333,150,50],/* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					HER2:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,130,150,50],[0,130,150,50],[0,130,150,50],[0,130,150,50],[0,130,150,50],[0,130,150,50],[0,130,150,50],/* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					PI3K:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,175,150,50],[0,175,150,50],[0,175,150,50],[0,175,150,50],[0,175,150,50],[0,175,150,50],[0,175,150,50],/* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					PTEN:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,230,150,50],[0,230,150,50],[0,230,150,50],[0,230,150,50],[0,230,150,50],[0,230,150,50],[0,230,150,50],/* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TOP2A:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,289,150,50],[0,289,150,50],[0,289,150,50],[0,289,150,50],[0,289,150,50],[0,289,150,50],[0,289,150,50],/* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TS:			[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,343,150,50],[0,343,150,50],[0,343,150,50],[0,343,150,50],[0,343,150,50],[0,343,150,50],[0,343,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ]
				}
				break;
			case (tumorType === "lung_tumor"):
				eveo.tumor._labels = { // [left, top, width, height] in pixels
					EGFR:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [345,90,150,50],[345,90,150,50],[345,90,150,50],[345,90,150,50],[345,90,150,50],[345,90,150,50],[345,90,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					ALK:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [345,139,150,50],[345,139,150,50],[345,139,150,50],[345,139,150,50],[345,139,150,50],[345,139,150,50],[345,139,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					KRAS:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [345,187,150,50],[345,187,150,50],[345,187,150,50],[345,187,150,50],[345,187,150,50],[345,187,150,50],[345,187,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					RRM1:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [345,237,150,50],[345,237,150,50],[345,237,150,50],[345,237,150,50],[345,237,150,50],[345,237,150,50],[345,237,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					ERCC1:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [345,289,150,50],[345,289,150,50],[345,289,150,50],[345,289,150,50],[345,289,150,50],[345,289,150,50],[345,289,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					PGP:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [345,335,150,55],[345,335,150,55],[345,335,150,55],[345,335,150,55],[345,335,150,55],[345,335,150,55],[345,335,150,55], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					PTEN:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [345,390,150,70],[345,390,150,70],[345,390,150,70],[345,390,150,70],[345,390,150,70],[345,390,150,70],[345,390,150,70], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					BRAF:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [25,93,150,50],[25,93,150,50],[25,93,150,50],[25,93,150,50],[25,93,150,50],[25,93,150,50],[25,93,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TUBB3:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [25,145,150,50],[25,145,150,50],[25,145,150,50],[25,145,150,50],[25,145,150,50],[25,145,150,50],[25,145,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TS:			[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [25,192,150,50],[25,192,150,50],[25,192,150,50],[25,192,150,50],[25,192,150,50],[25,192,150,50],[25,192,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TLE3:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [25,252,150,50],[25,252,150,50],[25,252,150,50],[25,252,150,50],[25,252,150,50],[25,252,150,50],[25,252,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TOP01:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [25,300,150,50],[25,300,150,50],[25,300,150,50],[25,300,150,50],[25,300,150,50],[25,300,150,50],[25,300,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					SPARC:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [25,353,150,50],[25,353,150,50],[25,353,150,50],[25,353,150,50],[25,353,150,50],[25,353,150,50],[25,353,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ]
				}
				break;
			case (tumorType === "colon_tumor"): 
				eveo.tumor._labels = { // [left, top, width, height] in pixels
					TS:			[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [350,133,150,50],[350,133,150,50],[350,133,150,50],[350,133,150,50],[350,133,150,50],[350,133,150,50],[350,133,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					TOP01:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [350,192,150,50],[350,192,150,50],[350,192,150,50],[350,192,150,50],[350,192,150,50],[350,192,150,50],[350,192,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					ERCC1:	[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [350,272,150,50],[350,272,150,50],[350,272,150,50],[350,272,150,50],[350,272,150,50],[350,272,150,50],[350,272,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					BRAF:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [350,345,150,70],[350,345,150,70],[350,345,150,70],[350,345,150,70],[350,345,150,70],[350,345,150,70],[350,345,150,70], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					EGFR:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,122,150,50],[0,122,150,50],[0,122,150,50],[0,122,150,50],[0,122,150,50],[0,122,150,50],[0,122,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					KRAS:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,190,150,50],[0,190,150,50],[0,190,150,50],[0,190,150,50],[0,190,150,50],[0,190,150,50],[0,190,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					PI3K:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,267,150,50],[0,267,150,50],[0,267,150,50],[0,267,150,50],[0,267,150,50],[0,267,150,50],[0,267,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
					PTEN:		[/* 0-6 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0], /* 7-13 */ [0,340,150,50],[0,340,150,50],[0,340,150,50],[0,340,150,50],[0,340,150,50],[0,340,150,50],[0,340,150,50], /* 14-19 */ [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0] ]
				}
				break;
			default:
				alert("error: tumor type unknown");
		}
	},
	
	/* initialize tumor based on query parameter type and setup events for rotation */
	load: function() {
	
		eveo.tumor._tumor = document.getElementById("rotating_tumor");
		eveo.tumor._type = eveo.caris.getParameterByName("type").toLowerCase();
		eveo.tumor._transitionEndEvent = eveo.caris.whichTransitionEvent();
		
		eveo.tumor.loadTumorType(eveo.tumor._type);

		if (eveo.caris._isTouchDevice) {
			eveo.library.addEvent(eveo.tumor._tumor, "touchstart", eveo.tumor.touchStart);
			eveo.library.addEvent(eveo.tumor._tumor, "touchmove", eveo.tumor.touchMove);
		}
		else {
			eveo.library.addEvent(eveo.tumor._tumor, "mousedown", eveo.tumor.mouseDown);
			eveo.library.addEvent(eveo.tumor._tumor, "mouseup", eveo.tumor.mouseUp);
			eveo.library.addEvent(eveo.tumor._tumor, "mousemove", eveo.tumor.mouseMove);
			// keyboard event for debug
			eveo.library.addEvent(document, "keypress", eveo.tumor.keyPress);
		}

		eveo.tumor.setFrameOffset(10); // initial frame (offset from 
		
	},
	
	/* reset page (remove transition) for mobile safari */
	popstate: function() {

	}
};

ready.push(eveo.tumor.load);
eveo.library.addEvent(window, "popstate", eveo.tumor.popstate);