
$(function() {

	//Determines if we're listening for click or touch events
	var clickEvent = Modernizr.touch ? 'touchstart' : 'click';

	//Helper to abstract the unfortunate setTimeouts
	var deferAnimation = function(paper, attrs, duration, easing, delay, callback) {
		setTimeout(function() {
			paper.stop().animate(attrs, duration, easing, callback);
		}, delay);
	};

	var wobble = function(t, el) {
		if (t <= 0) {
			el.stop().animate({transform: 'r0 48,96'}, 100, mina.easeout);//reset center
			return;
		}
		var half = Math.round(t/2);

		el.stop().animate({transform: 'r' +half+ ' 48,96'}, 100*half, mina.easeout, function() {
			el.stop().animate({transform: 'r-' +half+ ' 48,96'}, 100*half, mina.easeout, function() {
				--t;
				wobble(t, el);
			});
		});
	};

	var loadSvg = function(elSelector, size, externalSvgUrl, onSvgLoadedFn) {
		var $svgEl = $(elSelector);
		var $button = $svgEl.closest('.button');
		var svg = Snap(size, size);
		svg.attr('viewBox', '0 0 '+size+' '+size);
		$svgEl.append(svg.node);
		//Load our external SVG
		var url = externalSvgUrl;

		Snap.load(url, function(fragment) {
			onSvgLoadedFn.call(null, fragment, svg, $button);
		});
	};



/*************************************************************************\
** CLOUDS THUNDER RAIN ANIMATION *****************************************\
**************************************************************************/

	var initCloudsAnimation = function() {
		loadSvg('.icon-clouds', 96, 'svg/clouds-thunder-rain.svg', function (fragment, svg, $button) {
			//Starts out with clouds displayed
			var clouds = fragment.select('#clouds');
			svg.append(clouds);
			var thunder = fragment.select('#thunder');
			var rightRain = fragment.select('#right-rain');
			var middleRain = fragment.select('#middle-rain');
			var leftRain = fragment.select('#left-rain');
			var leftBolt = thunder.select('#left-bolt');
			var rightBolt = thunder.select('#right-bolt');
			var middleBolt = thunder.select('#middle-bolt');

			$button.on(clickEvent, function(e) {
				animateRain(svg, leftRain, middleRain, rightRain);
				animateCloud(svg, clouds);
				animateThunder(svg, leftBolt, middleBolt, rightBolt);
			});
		});
	};

	var animateCloud = function(svg, clouds) {
		var cloudPath = clouds.select('path');

		//Oscillate the color and add some semi-random movement
		for(var i = 0; i < 8; i++) {
			//Color
			var isEven = i % 2 === 0;
			var fillColor = isEven ? '#bbbbbb' : '#ffffff';

			deferAnimation(cloudPath, {fill: fillColor}, 1000, mina.easeout, i * 700);

			//Movement
			if (i===4 || i===7) {
				var randomTransform = Math.floor(Math.random()*6);
				var sign = isEven ? '-' : '';
				deferAnimation(clouds, {'transform': 't' + sign + randomTransform + ' 0 0'}, 225, mina.easeout, i*250);
			}
		}
		clouds.animate({'transform': 't0 0 0'}, 200);//reset
	};

	var doRain = function (svg, rain, counter, delay, speed, totalSequences) {
		if (counter === totalSequences) {return;}
		setTimeout(function() {
			if (counter === 1) svg.append(rain);
			rain.attr({opacity: 1});
			rain.animate({'transform': 't0 50'}, speed, mina.easeout, function() {
				rain.animate({'transform': 't0 0', opacity: 0}, 25, mina.easeout, function() {
					doRain(svg, rain, counter, delay, speed, totalSequences);
				});
			});
			counter++;
		}, delay);
	}

	var animateRain = function(svg, leftRain, middleRain, rightRain) {
		var counter = 1;
		setTimeout(function() {
			doRain(svg, leftRain, counter, 50, 600, 4);
			doRain(svg, middleRain, counter, 0, 1000, 4);
			doRain(svg, rightRain, counter, 0, 1600, 3);
		}, 600);
	};

	var animateThunder = function(svg, leftBolt, middleBolt, rightBolt) {
		setTimeout(function() {
			svg.append(leftBolt);
			deferAnimation(leftBolt, {'opacity': '0'}, 250, mina.easeout, 250);
			deferAnimation(leftBolt, {'opacity': '1', 'transform': 's1.5,1.5'}, 250, mina.easeout, 1500);
			deferAnimation(leftBolt, {'opacity': '0'}, 250, mina.easeout, 2000);
		}, 500);
		setTimeout(function() {
			svg.append(middleBolt);
			deferAnimation(middleBolt, {'opacity': '0'}, 300, mina.easeout, 100);
		}, 1200);
		setTimeout(function() {
			svg.append(rightBolt);
			deferAnimation(rightBolt, {'opacity': '0'}, 150, mina.easeout, 250);
			deferAnimation(rightBolt, {'opacity': '1', transform: 's1.5,1.5'}, 150, mina.easeout, 2500);
			deferAnimation(rightBolt, {'opacity': '0'}, 150, mina.easeout, 3000);
			deferAnimation(rightBolt, {'opacity': '1', transform: 's2,2'}, 150, mina.easeout, 3500);
			deferAnimation(rightBolt, {'opacity': '0'}, 150, mina.easeout, 3800);
		}, 50);
	};



/*************************************************************************\
** ROCKET SHIP ANIMATION *************************************************\
**************************************************************************/
	var initRocketShipAnimation = function() {
		loadSvg('.icon-rocket-ship', 96, 'svg/rocket-ship.svg', function (fragment, svg, $button) {
			var ship = fragment.select('#ship');
			svg.append(ship);

			var exhaust = fragment.select('#exhaust');

			//On click event fires off the animation sequence
			$button.on(clickEvent, function(e) {
				exhaust.attr({transform: 't0,5 s.2,.2', opacity: '.1'})
				animateExhaust(svg, exhaust, ship);
			});
		});
	}

	var animateRocketShip = function(ship) {
		ship.animate({transform: 't75,-150'}, 2000, mina.easeout, function() {
			ship.attr({transform: 't-300,300', opacity: 0});
			ship.stop().animate({transform: 't0,0', opacity: 1}, 1000, mina.easeout);
		});
	};

	var animateExhaust = function(svg, exhaust, ship) {
		//Tilt ship
		ship.animate({transform: 't-4,4 r15, 48,48'}, 30, mina.bounce, function() {
			ship.stop().animate({transform: 't0,0 r0, 48,48'}, 200, mina.easeout);

			//Exhaust diffusion
			svg.append(exhaust);
			deferAnimation(exhaust, {transform: 't-10,15 s1.3,1.3', opacity: .3}, 200, mina.easeout, 50, function() {
				exhaust.animate({transform: 't-15,20 s5,5', opacity: 0}, 1500);

				//Now launch ship!
				animateRocketShip(ship);
			});
		});
	};


/*************************************************************************\
** SHOPPING CART ANIMATION ***********************************************\
**************************************************************************/
	var initShoppingCartAnimation = function() {
		loadSvg('.icon-cart', 96, 'svg/cart.svg', function (fragment, svg, $button) {
			var cart = fragment.select('#cart');
			var cartBody = fragment.select('#cart-body');
			var wheels = fragment.select('#cart-wheels');
			var items = fragment.select('#cart-items');
			svg.append(cartBody);
			svg.append(wheels);
			$button.on(clickEvent, function(e) {
				items.attr({transform: 't0, -100', opacity: .95});
				svg.append(items);
				items.stop().animate({transform: 't0,0', opacity: .9}, 1000, mina.bounce, function() {
					cartBody.stop().animate({transform: 'r2, 96,96'}, 250, mina.backout, function() {
						cartBody.attr({transform: 'r0 96,96'});
						cartBody.stop().animate({transform: 't-200, 0'}, 500, mina.easeout);
						wheels.stop().animate({transform: 't-200, 0'}, 500, mina.easeout);
						items.stop().animate({transform: 't-200, 0'}, 500, mina.easeout, function() {
							cartBody.attr({opacity: 0, transform: 't0, 0'});
							wheels.attr({opacity: 0, transform: 't0, 0'});
							cartBody.stop().animate({opacity: 1}, 2000, mina.easeout);
							wheels.stop().animate({opacity: 1}, 2000, mina.easeout);
						});
					});
				});
			});
		});
	};

/*************************************************************************\
** SHARE ANIMATION *******************************************************\
**************************************************************************/
	var initSharingAnimation = function() {
		loadSvg('.icon-share', 64, 'svg/share.svg', function (fragment, svg, $button) {
			var group = fragment.select('g');
			svg.append(group);
			var circleLeft = group.select('#circle-left');
			var topRight = group.select('#top-right');
			var bottomRight = group.select('#bottom-right');

			$button.on(clickEvent, function(e) {
				topRight.attr({opacity: 0, transform: 't-10,5'});
				topRight.stop().animate({transform: 't0,0', opacity: 1}, 400, mina.bounce);
				bottomRight.attr({opacity: 0, transform: 't-10,-5'});
				deferAnimation(bottomRight, {transform: 't0,0', opacity: 1}, 300, mina.easeout, 50);

			});
		});
	};


/*************************************************************************\
** MIC STAND ANIMATION ****************************************************\
**************************************************************************/
	var initMicrophoneAnimation = function() {
		loadSvg('.icon-microphone', 64, 'svg/mic-stand.svg', function (fragment, svg, $button) {
			var group = fragment.select('g');
			svg.append(group);
			var mic = group.select('#mic');

			$button.on(clickEvent, function(e) {
				wobble(3, mic);
			});
		});
	};








//
// TODO
//





/*************************************************************************\
** ALARM CLOCK ANIMATION *************************************************\
**************************************************************************/
var initAlarmClockAnimation = function() {
		loadSvg('.icon-alarm-clock', 64, 'svg/alarm-clock.svg', function (fragment, svg, $button) {
			var clockGroup = fragment.select('#clock');
			var ringEffectGroup = fragment.select('#ring-effect');
			svg.append(clockGroup);
			ringEffectGroup.attr({opacity: 0});
			svg.append(ringEffectGroup);

			var leftBell = clockGroup.select('#bell-left');
			var rightBell = clockGroup.select('#bell-right');

			$button.on(clickEvent, function(e) {
				console.log("TODO .. animate");
			});
		});
	};

/*************************************************************************\
** USB ANIMATION *************************************************\
**************************************************************************/
var initUSBAnimation = function() {
	loadSvg('.icon-usb', 64, 'svg/usb.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		var path = group.select('path');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};


/*************************************************************************\
** QUOTES ANIMATION ******************************************************\
**************************************************************************/
var initQuotesRightAnimation = function() {
	loadSvg('.icon-quotes-right', 64, 'svg/quotes-right.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		var quoteLeft = group.select('#quote-left');
		var quoteRight = group.select('#quote-right');

		$button.on(clickEvent, function(e) {
			quoteLeft.stop().animate({transform: 'r10 0,32'}, 150, mina.easeout, function() {
				quoteLeft.stop().animate({transform: 'r0, 0,32'}, 150, mina.bounce);
			});
			//Not sure why I have to "stagger" the delays...logged ticket:
			//https://github.com/adobe-webplatform/Snap.svg/issues/340
			quoteRight.stop().animate({transform: 'r10 32,32'}, 175, mina.easeout, function() {
				quoteRight.animate({transform: 'r0, 32,32'}, 175, mina.bounce);
			});
		});
	});
};


/*************************************************************************\
** FACE ANIMATION ********************************************************\
**************************************************************************/
var initFaceAnimation = function() {
	loadSvg('.icon-face', 64, 'svg/face.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		var smile = group.select('#smile');
		var frown = group.select('#frown');
		frown.attr({opacity: 0});

		$button.on(clickEvent, function(e) {
			var isFrowning = $('.icon-face').data('is-frowning');
			$('.icon-face').data('is-frowning', !isFrowning);

			if (isFrowning) {
				smile.stop().animate({path: 'M32.2,49c-5.1,0-10.2-1.9-14.1-5.6c-1-1-1-2.5-0.1-3.5c1-1,2.5-1,3.5-0.1c5.9,5.7,15.5,5.7,21.4,0 c1-1,2.6-0.9,3.5,0.1c1,1,0.9,2.6-0.1,3.5C42.5,47.1,37.3,49,32.2,49z'}, 600, mina.bounce);
			} else {
				smile.stop().animate({path: 'M32.2,39c-5.2,0-10.3,1.9-14.3,5.7c-1,1-1,2.5-0.1,3.5c1,1,2.5,1,3.5,0.1c5.9-5.7,15.6-5.7,21.6,0 c1,1,2.6,0.9,3.5-0.1c1-1,0.9-2.6-0.1-3.5C42.5,40.9,37.4,39,32.2,39z'}, 200, mina.easeout);
			}
		});
	});
};



/*************************************************************************\
** BAR CHART ANIMATION ***************************************************\
**************************************************************************/
var initBarChartAnimation = function() {
	loadSvg('.icon-bar-chart', 64, 'svg/bar-chart.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};

/*************************************************************************\
** PLUG ANIMATION ********************************************************\
**************************************************************************/
var initPlugAnimation = function() {
	loadSvg('.icon-plug', 64, 'svg/plug.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};

/*************************************************************************\
** BELL ANIMATION ********************************************************\
**************************************************************************/
var initBellAnimation = function() {
	loadSvg('.icon-bell', 64, 'svg/bell.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);
		var clapper = group.select('#clapper');
		var bell = group.select('#bell');

		$button.on(clickEvent, function(e) {
			clapper.stop().animate({transform: 't-6,-2 s.9,.9'}, 100, mina.backin, function() {
				clapper.stop().animate({transform: 't0,0'}, 800, mina.bounce);
			});
		});
	});
};

/*************************************************************************\
** FROG ANIMATION ********************************************************\
**************************************************************************/
var initFrogAnimation = function() {
	loadSvg('.icon-frog', 64, 'svg/frog.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);
		var eyeLeft = group.select('#eye-left');
		var eyeRight = group.select('#eye-right');

		$button.on(clickEvent, function(e) {
			wobble(3, eyeLeft);
			setTimeout(function() {
				wobble(2, eyeRight);
			}, 250);
		});
	});
};



/*************************************************************************\
** IMAGE ANIMATION ********************************************************\
**************************************************************************/
var initImageAnimation = function() {
	loadSvg('.icon-image', 64, 'svg/image.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);
		var mountains = group.select('#mountains');
		var sun = group.select('#sun');
		$button.on(clickEvent, function(e) {
			sun.stop().animate({transform: 't100,0'}, 500, mina.easeout, function() {
				sun.attr({opacity: 0});
				sun.stop().animate({transform: 't-60,0'}, 50, mina.easeout, function() {
					sun.stop().animate({transform: 't0,0', opacity: 1}, 2000, mina.bounce);
				});
			});
		});
	});
};


/*************************************************************************\
** PENCIL ANIMATION ********************************************************\
**************************************************************************/
var initPencilAnimation = function() {
	loadSvg('.icon-pencil', 64, 'svg/pencil.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};


/*************************************************************************\
** REFRESH ANIMATION *****************************************************\
**************************************************************************/
var initRefreshAnimation = function() {
	loadSvg('.icon-refresh', 64, 'svg/refresh.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			group.attr({ transform: 's1,1 r0 32,32'});//reset scale and rotation
			group.stop().animate({transform: 's.6,.6 r180 32,32'}, 400, mina.easeout, function() {
				group.stop().animate({transform: 's1,1 r360 32,32'}, 600, mina.easeout);
			});
		});
	});
};


/*************************************************************************\
** ARROW LEFT & UP ANIMATIONS ********************************************\
**************************************************************************/
var initBorderedArrowLeft = function() {
	loadSvg('.icon-bordered-arrow-left', 64, 'svg/bordered-arrow-left.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};

var initBorderedArrowUp = function() {
	loadSvg('.icon-bordered-arrow-up', 64, 'svg/bordered-arrow-up.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};


/*************************************************************************\
** MAP MARKER ANIMATION ********************************************************\
**************************************************************************/
var initMapMarkerAnimation = function() {
	loadSvg('.icon-map-marker', 64, 'svg/map-marker.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');

		svg.append(group);

		$button.on(clickEvent, function(e) {
			group.stop().animate({transform: 't-5,-5 s.4,.4 r-90, 32,32'}, 100, mina.easeout, function() {
				deferAnimation(group,{transform: 't0,0 s1,1 r0 32,32'}, 100, mina.backout, 500, function() {
					wobble(2, group);
				});
			});
		});
	});
};



/*************************************************************************\
** EQ ANIMATION **********************************************************\
**************************************************************************/
var initEQAnimation = function() {
	loadSvg('.icon-eq', 64, 'svg/equalizer.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');

		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};


/*************************************************************************\
** MAXIMIZE ANIMATION ****************************************************\
**************************************************************************/
var initMaximizeAnimation = function() {
	loadSvg('.icon-maximize', 64, 'svg/maximize.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		var rightUp = group.select('#arrow-right-up');
		var leftUp = group.select('#arrow-left-up');
		var rightDown = group.select('#arrow-right-down');
		var leftDown  = group.select('#arrow-left-down');

		svg.append(group);
			

		$button.on(clickEvent, function(e) {
			var duration = 200,
				isMaximized = $('.icon-maximize').data('is-maximized');

			$('.icon-maximize').data('is-maximized', !isMaximized);

			if (isMaximized) {
				leftUp.stop().animate({transform: 't0,0'}, duration, mina.easeout);
				leftDown.stop().animate({transform: 't0,0'}, duration, mina.easeout);
				rightUp.stop().animate({transform: 't0,0'}, duration, mina.easeout);
				rightDown.stop().animate({transform: 't0,0'}, duration, mina.easeout);
			} else {
				leftUp.stop().animate({transform: 't-4,-4'}, duration, mina.easeout);
				leftDown.stop().animate({transform: 't-4,4'}, duration, mina.easeout);
				rightUp.stop().animate({transform: 't2,-4'}, duration, mina.easeout);
				rightDown.stop().animate({transform: 't4,4'}, duration, mina.easeout);
			}
		});
	});
};

/*************************************************************************\
** PINNED ANIMATION ******************************************************\
**************************************************************************/
var initPinnedAnimation = function() {
	loadSvg('.icon-pinned', 64, 'svg/pinned.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			group.stop().animate({transform: 't0, -8 s.7,.8'}, 100, mina.easeout, function() {
				deferAnimation(group,{transform: 't0,0 s1,1'}, 100, mina.elastic, 500);
			});
		});
	});
};


/*************************************************************************\
** STAR ANIMATION ********************************************************\
**************************************************************************/
var initStarAnimation = function() {
	loadSvg('.icon-star-outline', 64, 'svg/star-outline.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		var path = group.select('#outline');

		var filledPath = "M12.6,63.2L20,40.1L0.7,26h23.9L32,2.6L39.4,26h23.9L44,40.1l7.4,23.2L32,48.8L12.6,63.2z";
		var outlinedPath = "M12.6,62.2L20,38.6L0.7,24h23.9L32,0.6L39.4,24h23.9L44,38.6l7.4,23.5L32,47.7L12.6,62.2z M6.6,26l15.7,11.8l-6,19L32,45.2l15.6,11.6l-6-18.9L57.4,26H38L32,7.2L26,26H6.6z";

		svg.append(group);

		$button.on(clickEvent, function(e) {
			var isFilled = $('.icon-star-outline').data('is-filled');
			$('.icon-star-outline').data('is-filled', !isFilled);

			if (isFilled) {
				path.animate({path: outlinedPath}, 100, mina.bounce);
			} else 	{
				path.animate({path: filledPath}, 300, mina.backout);
			}
		});
	});
};

/*************************************************************************\
** SEARCH ANIMATION ******************************************************\
**************************************************************************/
var initSearchAnimation = function() {
	loadSvg('.icon-search-add', 64, 'svg/search-add.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		var path = group.select('#plus');

		var minusPath = 'M30,22H11v-3h19V22z';
		var plusPath = 'M30,22h-8v8h-3v-8h-8v-3h8v-8h3v8h8V22z';

		svg.append(group);

		$button.on(clickEvent, function(e) {

			var isRemoving = $('.icon-search-add').data('is-removing');
			$('.icon-search-add').data('is-removing', !isRemoving);

			if (isRemoving) {
				path.animate({path: plusPath}, 300, mina.easeout);
			} else 	{
				path.animate({path: minusPath}, 300, mina.easeout);
			}
		});
	});
};


/*************************************************************************\
** LINK ANIMATION ******************************************************\
**************************************************************************/
var initLinkAnimation = function() {
	loadSvg('.icon-link-connected', 64, 'svg/link-connected.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');


		//TODO ------------- MORPH TO LINK-BROKEN.SVG

		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};


/*************************************************************************\
** PERSON MALE ANIMATION **************************************************\
**************************************************************************/
var initPersonMaleAnimation = function() {
	loadSvg('.icon-person-male', 64, 'svg/person-male.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);
		var head = group.select("#head");

		$button.on(clickEvent, function(e) {
			wobble(2, head);
		});
	});
};

/*************************************************************************\
** CELL ANIMATION ********************************************************\
**************************************************************************/
var initCellAnimation = function() {
	loadSvg('.icon-cell', 64, 'svg/cell.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');


		//TODO ------------- MORPH TO DESKTOP.SVG

		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};

/*************************************************************************\
** CAMERA ANIMATION ******************************************************\
**************************************************************************/
var initCameraAnimation = function() {
	loadSvg('.icon-camera', 64, 'svg/camera.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};

/*************************************************************************\
** BUG ANIMATION *********************************************************\
**************************************************************************/
var initBugAnimation = function() {
	loadSvg('.icon-bug', 64, 'svg/bug.svg', function (fragment, svg, $button) {
		var group = fragment.select('g');
		svg.append(group);

		$button.on(clickEvent, function(e) {
			console.log("TODO .. animate");
		});
	});
};





















/*************************************************************************\
** ENVELOP ANIMATION *****************************************************\
**************************************************************************/
	var initEnvelopeAnimation = function() {
		loadSvg('.icon-envelope', 64, 'svg/envelope.svg', function (fragment, svg, $button) {
			var envelope = fragment.select('g');
			var envelopeBody = envelope.select('#body');
			var flapOpened = envelope.select('#flap-opened');
			var flapClosed = envelope.select('#flap-closed');
			var topLine = envelope.select('#top-line');
			svg.append(envelopeBody);
			svg.append(flapClosed);

			//Also append flapOpened shape, but hide initially
			flapOpened.attr({opacity: 0});
			svg.append(flapOpened);

			//Inverse for top line of envelope (show initially)
			topLine.attr({opacity: 1});
			svg.append(topLine);

			$button.on(clickEvent, function(e) {

				//Determine last toggled state then toggle as appropriate
				var isOpened = $('.icon-envelope').data('is-open');
				$('.icon-envelope').data('is-open', !isOpened);

				if (isOpened) {
					flapOpened.stop().animate({opacity: 0}, 200, mina.easeout);
					deferAnimation(flapClosed, {opacity: 1}, 200, mina.easeout, 250);
					topLine.stop().animate({opacity: 1}, 400, mina.easeout);
				} else {
					flapClosed.stop().animate({ opacity: .3}, 200, mina.easeout);
					deferAnimation(flapOpened, {opacity: 1}, 200, mina.easeout, 250);
					topLine.stop().animate({opacity: 0}, 300, mina.easeout);
				}
			});
		});
	};




/*************************************************************************\
** PLUS/MINUS ANIMATION ***************************************************\
**************************************************************************/
	var initPlusMinusAnimation = function() {
		loadSvg('.icon-plus', 64, 'svg/plus.svg', function (fragment, svg, $button) {
			var plus = fragment.select('g');
			svg.append(plus);

			//Store the vertical and horizontal lines of the '+'
			var vertical = plus.select('#vertical-line');
			var horizontal = plus.select('#horizontal-line');

			$button.on(clickEvent, function(e) {
				plus.attr({transform: 'r0 32,32'});//reset

				//Determine last toggled state then toggle as appropriate
				var isPlus = $('.icon-plus').data('is-plus');
				$('.icon-plus').data('is-plus', !isPlus);

				if (isPlus) {
					plus.stop().animate({transform: 'r-180 32,32'}, 500, mina.easeout);
					deferAnimation(vertical, {opacity: 1}, 150, mina.easeout, 400);
				} else {
					plus.stop().animate({transform: 'r360 32,32'}, 500, mina.easeout);
					deferAnimation(vertical, {opacity: 0}, 150, mina.easeout, 400);
				}
			});
		});
	};


/*************************************************************************\
** SPEAKER ON/OFF ANIMATION **********************************************\
**************************************************************************/
	var initSpeakerAnimation = function() {
		loadSvg('.icon-speaker', 64, 'svg/speaker.svg', function (fragment, svg, $button) {
			var group = fragment.select('g');
			var speaker = group.select('path:nth-child(1)');
			var volume = group.select('#volume');
			svg.append(speaker);
			svg.append(volume);
			var crossedOut = group.select('#crossed-out');
			crossedOut.attr({opacity: 0});
			svg.append(crossedOut);

			$button.on(clickEvent, function(e) {

				//Determine last toggled state then toggle as appropriate
				var isPlaying = $('.icon-speaker').data('is-playing');
				$('.icon-speaker').data('is-playing', !isPlaying);

				if (isPlaying) {
					crossedOut.stop().animate({opacity: 0}, 200, mina.easeout, function() {
						volume.attr({transform: 's.8,.8 t0,0'});
						volume.stop().animate({transform: 's1,1', opacity: 1}, 200, mina.easeout);
					});
				} else {
					volume.stop().animate({transform: 's1.3,1.3 t20,0', opacity: 0}, 350, mina.easeout, function() {
						crossedOut.stop().animate({opacity: 1}, 100, mina.easeout);
					});
				}
			});
		});
	};


/*************************************************************************\
** PLAY/STOP ANIMATION ***************************************************\
**************************************************************************/
	var initPlayStopAnimation = function() {
		loadSvg('.icon-play', 64, 'svg/play.svg', function (fragment, svg, $button) {
			var group = fragment.select('g');
			svg.append(group);
			var path = group.select('path');

			$button.on(clickEvent, function(e) {

				//Determine last toggled state then toggle as appropriate
				var isPlaying = $('.icon-play').data('is-playing');
				$('.icon-play').data('is-playing', !isPlaying);

				if (isPlaying) {
					path.stop().animate({path: 'M30.9,16.9L58,32L11.5,57.5L5,61V3L30.9,16.9z', opacity: 1}, 300, mina.easeout);
				} else {
					path.stop().animate({path: 'M30,7h28v48H5V7H30z', opacity: 1}, 300, mina.easeout);
				}
			});
		});
	};

/*************************************************************************\
** GEAR ANIMATION ********************************************************\
**************************************************************************/
	var initGearAnimation = function() {
		loadSvg('.icon-gear', 64, 'svg/gear.svg', function (fragment, svg, $button) {
			var group = fragment.select('g');
			svg.append(group);
			$button.on(clickEvent, function(e) {
				group.stop().animate({transform: 's.1,.1', opacity: .1}, 500, mina.backout, function() {
					group.stop().animate({transform: 's1,1 r-720 32,32', opacity: 1}, 1200, mina.easeout);
				});
			});
		});
	};


/*************************************************************************\
** HAMBURGER ANIMATION ********************************************************\
**************************************************************************/
	var initHamburgerAnimation = function() {
		loadSvg('.icon-hamburger', 64, 'svg/hamburger.svg', function (fragment, svg, $button) {
			var group = fragment.select('g');

			var rectTop = group.select('#rect-top');
			var rectMiddle = group.select('#rect-middle');
			var rectBottom = group.select('#rect-bottom');
			svg.append(rectTop);
			svg.append(rectMiddle);
			svg.append(rectBottom);

			$button.on(clickEvent, function(e) {
				var isOpened = $('.icon-hamburger').data('is-open');
				$('.icon-hamburger').data('is-open', !isOpened);

				if (isOpened) {
					rectTop.stop().animate({path: 'M58.7,22.7H5.3v-5.3h53.3V22.7z'}, 200, mina.bounce);
					rectMiddle.stop().animate({opacity: 1}, 200, mina.linear);
					rectBottom.stop().animate({path: 'M58.7,46.7H5.3v-5.3h53.3V46.7z'}, 200, mina.bounce);
				} else {
					rectTop.stop().animate({path: 'M58.7,8.8L8.5,59l-3.8-3.8L55,5L58.7,8.8z'}, 200, mina.easeout);
					rectMiddle.stop().animate({opacity: 0}, 100, mina.linear);
					rectBottom.stop().animate({path: 'M8.5,5l50.2,50.2L55,59L4.8,8.8L8.5,5z'}, 200, mina.easeout);
				}
			});
		});
	};


/*************************************************************************\
** EYE ANIMATION ********************************************************\
**************************************************************************/
	var initEyeAnimation = function() {
		loadSvg('.icon-eye', 64, 'svg/eye.svg', function (fragment, svg, $button) {
			var group = fragment.select('g');
			svg.append(group);

			var outerPupil = group.select('#outer-pupil');
			var innerPupil = group.select('#inner-pupil');

			$button.on(clickEvent, function(e) {
				//Look right
				outerPupil.stop().animate({transform: 't-7,0 s.95,.95'}, 150, mina.easeout);
				innerPupil.stop().animate({transform: 't-9,0 s.9,.9'}, 150, mina.easeout);
				//Look left
				deferAnimation(outerPupil,{transform: 't7,1 .95,.95'}, 150, mina.easeout, 400);
				deferAnimation(innerPupil,{transform: 't9,0 s.9,.9'}, 150, mina.easeout, 400);
				//Look back to center
				deferAnimation(outerPupil,{transform: 't0,0'}, 150, mina.easeout, 750);
				deferAnimation(innerPupil,{transform: 't0,0'}, 150, mina.easeout, 750);
			});
		});
	};

/*************************************************************************\
** LIGHT BULB ANIMATION *************************************************\
**************************************************************************/
	var initLightBulbAnimation = function() {
		loadSvg('.icon-light-bulb', 64, 'svg/light-bulb.svg', function (fragment, svg, $button) {
			var wholeBulb = fragment.select('#bulb');
			svg.append(wholeBulb);

			var beams = fragment.select('#beams');
			beams.attr('opacity', 0);
			svg.append(beams);

			//On click event fires off the animation sequence
			$button.on(clickEvent, function(e) {
				//Determine last toggled state then toggle as appropriate
				var isLightOn = $('.icon-light-bulb').data('on');
				$('.icon-light-bulb').data('on', !isLightOn);

				if (isLightOn) {
					animateLightOff(svg, wholeBulb, beams);
				} else {
					animateLightOn(svg, wholeBulb, beams);
				}
			});
		});
	}

	var animateLightOn = function(svg, bulb, beams) {
		var beamRects = beams.selectAll('rect');
		var bulbPaths = bulb.selectAll('path');
		bulb.animate({transform: 's.8,.8 t0,8'}, 300, mina.easeout, function() {
			bulbPaths.forEach(function(el, i) {
				el.attr({fill: '#f5d76e', opacity: 1});
			});
		});

		beams.animate({transform: 's1.2,1.2 t0,3', opacity: 1}, 200, mina.bounce, function() {
			beamRects.forEach(function(el, i) {
				el.stop().animate({fill: '#f5d76e', opacity: 1}, 200, mina.easeout);
			});
		});
	};

	var animateLightOff = function(svg, bulb, beams) {
		var beamRects = beams.selectAll('rect');
		var bulbPaths = bulb.selectAll('path');
		beamRects.forEach(function(el, i) {
			el.stop().animate({fill: 'white', opacity: 0}, 300, mina.easeout);
		});
		bulb.stop().animate({transform: 's1,1 t0,0', opacity:1}, 300, mina.easeout, function() {
			bulbPaths.forEach(function(el, i) {
				el.stop().animate({fill: 'white'}, 200, mina.easeout);
			});
		});
	};


/*************************************************************************\
** LOCK ANIMATION ********************************************************\
**************************************************************************/
	var initLockAnimation = function() {
		loadSvg('.icon-lock', 64, 'svg/ic_lock_open_64px.svg', function (fragment, svg, $button) {
			var g = fragment.select('g');
			svg.append(g);

			//On click event fires off the animation sequence
			$button.on(clickEvent, function(e) {
				animateLockHandle(svg);
			});
		});
	}

	var animateLockHandle = function(svg) {

		//Determine last locked state and then toggle
		var isLocked = $('.icon-lock').data('locked');
		$('.icon-lock').data('locked', !isLocked);

		//Animate the lock handle
		var lockHandle = svg.select('#lock-handle');
		var locked = {path: 'M46.9,21.5v-6c0-8.3-6.6-14.9-14.9-14.9S17.1,7.2,17.1,15.5l-0.1,6h5.8v-6c0-5.1,4.2-9.4,9.4-9.4 s9.4,4.2,9.4,9.4v6'};
		var unLocked = {path: 'M47.5,21.5v-6c0-8.3-6.6-14.9-14.9-14.9S17.8,7.3,17.8,15.5h0.1h5.5h0.1c0-5.1,4.2-9.3,9.3-9.3 s9.3,4.2,9.3,9.3v6'};
		var attrs = isLocked ? unLocked : locked;
			lockHandle.animate(attrs, 250, mina.easeout);
	};


/*************************************************************************\
** TRASH CAN ANIMATION ***************************************************\
**************************************************************************/

	var initTrashCanAnimation = function() {
		loadSvg('.icon-delete-v2', 96, 'svg/ic_delete_48px.svg', function (fragment, svg, $button) {
			var g = fragment.select('g');
			svg.append(g);//inject group into our SVG

			//On click event fires off the animation sequence
			$button.on(clickEvent, function(e) {
				animateOpeningLid(svg);
				animateIncomingGarbage(svg);
				animateClosingLid(svg, g);
			});
		});
	}

	/////////////////////////////////////////////////////////////////
	// 1. Open Trash Can's Lid                                     //
	/////////////////////////////////////////////////////////////////
	var animateOpeningLid = function(svg) {
		var trashCanLid = svg.select('.lid');
		//Path that represents opened trash can lid
		var attrs={"path":"M69,4.7l-13.7,5l-5.4-2.5l-19.6,7.1l-2.5,5.4l-13.7,5l2.9,7.9l55-20L69,4.7z"};

		deferAnimation(trashCanLid, attrs, 150, mina.easeout, 0);
	};

	/////////////////////////////////////////////////////////////////
	// 2. Simulates some incoming garbage                          //
	/////////////////////////////////////////////////////////////////
	var animateIncomingGarbage = function(svg) {
		console.log("WIll animate garbage...");

		//We're taking the liberty of using a circle for our trash
		var circle = svg.circle(110, 0, 5);

		//t-N is moving x coordinate left
		//second number is y coordinate and increasing number moves downward
		for (var i = 6; i < 10; i++) {
			var transformValue = 't-' + i*7 + ' ' + (34+i);
			deferAnimation(circle, {'transform': transformValue}, 400, mina.easeout, i*20);
		}
	};

	/////////////////////////////////////////////////////////////////
	// 3. Close Trash Can's Lid                                    //
	/////////////////////////////////////////////////////////////////
	var animateClosingLid = function(svg, entireTrashCanGroup) {
		var trashCanLid = svg.select('.lid');

		//Path represents, essentially, the original path (lid closed)
		var attrs = {"path": "M75.5,24.2H60.9L56.7,20H35.8l-4.2,4.2H17v8.4h58.5V24.2z"};

		deferAnimation(trashCanLid, attrs, 150, mina.easeout, 500, function() {
			animateWobblingTrashCan(entireTrashCanGroup);
		});
	};

	/////////////////////////////////////////////////////////////////
	// 4. Close Trash Can's Lid                                    //
	/////////////////////////////////////////////////////////////////
	var animateWobblingTrashCan = function(svg) {
		svg.animate({'transform': 'r-5 48 48'}, 100, mina.easeout, function() {
			svg.animate({'transform': 'r5 48 48'}, 50, mina.easeout, function() {
				svg.animate({'transform': 'r-7 48 48'}, 50, mina.easeout, function() {
					svg.animate({'transform': 'r0 48 48'}, 50, mina.easeout);
				});
			});
		});
	};




/////////////////////////////////////////////////////////////////
// ENTRY POINT                                                 //
/////////////////////////////////////////////////////////////////
	initTrashCanAnimation();
	initCloudsAnimation();
	initLockAnimation();
	initRocketShipAnimation();
	initLightBulbAnimation();
	initGearAnimation();
	initHamburgerAnimation();
	initEyeAnimation();
	initShoppingCartAnimation();
	initMicrophoneAnimation();
	initSharingAnimation();
	initPlayStopAnimation();
	initPlusMinusAnimation();
	initSpeakerAnimation();
	initEnvelopeAnimation();
	initAlarmClockAnimation();
	initUSBAnimation();
	initQuotesRightAnimation();
	initBarChartAnimation();
	initFaceAnimation();
	initPlugAnimation();
	initBellAnimation();
	initCameraAnimation();
	initCellAnimation();
	initPersonMaleAnimation();
	initStarAnimation ();
	initSearchAnimation();
	initLinkAnimation();
	initBugAnimation();
	initFrogAnimation();
	initImageAnimation();
	initPencilAnimation();
	initRefreshAnimation();
	initBorderedArrowLeft();
	initBorderedArrowUp();
	initMapMarkerAnimation();
	initEQAnimation();
	initMaximizeAnimation();
	initPinnedAnimation();

	//Vivus
	window.vivusPlayground = new Vivus('svg-playground',
	{
		type: 'scenario-sync',
		duration: 15,
		start: 'autostart',
		forceRender: false,
		dashGap: 20
	}, function () {
	});

});
