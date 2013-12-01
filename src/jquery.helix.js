(function( $ ){

	var initialize = function($elem){
			var children = $elem.addClass("helix").children(),
			    options = $.extend({
					width: $elem.width(),
					height: $elem.height(),
					item: {
						width: children.width() 
					},
					maxDevide: 8,
					rampRate: 2,
					margin: '50%'
				}, arguments[1], true),
			    size = (function(margin){
			    	var width = options.item.width;
			    	if(/%$/.test( margin )){
			    		margin = width * margin.substr(0, margin.length - 1) / 100;
			    	}
			    	return  width + margin;
			    })(options.margin),
			    length = children.length,
			    deg = 0,
			    distance = 360 / length,
			    translateZ = Math.round( ( size / 2 ) / Math.tan( Math.PI / length ) ),
			    cnt = 0,
			    half = parseInt( length/2 ),
			    $container = $("<div class='helix-container' ></div>").css({
			    	'-webkit-perspective': options.width,
			    	perspective: options.width,
			    	width: options.item.width,
			    	height: options.height
			    }),
			    rotateY = ((half+(length%2))*distance),
			    ramp = options.rampRate * options.height / length;

			children.filter(':gt('+(half-1+(length%2))+')').prependTo($elem);
			children = $elem.children();
			children.filter(':eq('+(half)+')').addClass('focus');

			children.each(function(){
					var $this = $(this);
					$this.css('transform', 'rotateY( '+parseInt( deg )+'deg ) translateZ( '+translateZ+'px )')
					     .transition({
						     y: cnt*ramp
					     });
					deg += distance;
					cnt++;
			});

	
			$elem.wrap($container);
			$elem.css({
			     	transform: 'translateY(-'+(half*ramp)+'px) translateZ( -'+translateZ+'px ) rotateY('+rotateY+'deg)',
			     	width: options.item.width
			     })
			     .show()
			     .data({
			    	distance: distance,
			    	length: length,
			    	size: size,
			    	children: children,
			    	translateZ: translateZ,
			    	rotateY: rotateY,
			    	focus: half,
			    	first: 0,
			    	last: length-1,
			    	half: half,
			    	ramp: ramp
			    });

			return $elem;
		},
		move = function($elem, direction){
			var data = $elem.data(),
			    children = data.children,
			    distance = data.distance,
			    translateZ = data.translateZ,
			    rotateY = data.rotateY,
			    length = data.length,
			    focus = data.focus,
			    first = data.first,
			    last = data.last,
			    half = data.half,
			    ramp = data.ramp;

			rotateY += distance*direction*-1;
			focus += direction;
			last += direction;
			first += direction;

			children = $elem.children();

			children.filter(':eq('+half+')').removeClass('focus');

			if(direction === 1){
				children.filter(':first').transition({
					y: last * ramp,
					duration: 0
				}).appendTo($elem);

			} else {
				children.filter(':last').transition({
					y: first * ramp,
					duration: 0
				}).prependTo($elem);
			}

			children.filter(':eq('+(half+direction)+')').addClass('focus');
			$elem.css('transform', 'translateY('+(focus*ramp*-1)+'px) translateZ( -'+translateZ+'px ) rotateY('+parseInt( rotateY )+'deg)')
			     .data({
			     	rotateY: rotateY,
			     	children : children,
			     	focus: focus,
			     	first: first,
			     	last: last
			     });


		},
		next = function($elem){
			move($elem, 1);
		},
		prev = function($elem){
			move($elem, -1);
		};



	$.fn.helix = function(options){
		return (options === 'next') ? next(this) :
		       (options === 'prev') ? prev(this) :
		       initialize(this);
	};
})(jQuery);