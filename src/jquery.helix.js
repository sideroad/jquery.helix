(function( $ ){

	var refreshClass = function($children, data){
			$children.removeClass('show first last focus');

			$children.filter(':lt('+(data.devide*data.turns)+')').addClass('show');
			$children.filter(':first').addClass('first');
			$children.filter(':eq('+(data.half)+')').addClass('focus');
			$children.filter(':eq('+((data.devide*data.turns)-1)+')').addClass('last');
		},
	    initialize = function($elem){
			var children = $elem.addClass("helix").children(),
			    options = $.extend({
					width: $elem.width(),
					height: $elem.height(),
					item: {
						width: children.width(),
						height: children.height()
					},
					devide: 10,
					turns: 3,
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
			    devide = options.devide > length ? length: options.devide,
			    deg = 0,
			    distance = 360 / devide,
			    translateZ = Math.round( ( size / 2 ) / Math.tan( Math.PI / devide ) ),
			    cnt = 0,
			    half = parseInt( (devide*options.turns)/2 ),
			    $container = $("<div class='helix-container' ></div>").css({
			    	'-webkit-perspective': options.width,
			    	perspective: options.width,
			    	width: options.item.width,
			    	height: options.height
			    }),
			    rotateY = ((half+(devide%2))*distance),
			    height = options.height,
			    center = ((height / 2) - (options.item.height / 2 )),
			    start = 0,
			    start = (-height/(2*options.turns)),
			    ramp = (center - start) / half,
			    data = {
			    	distance: distance,
			    	length: length,
			    	size: size,
			    	children: children,
			    	translateZ: translateZ,
			    	rotateY: rotateY,
			    	focus: half,
			    	turns: options.turns,
			    	first: 0,
			    	last: children.length-1,
			    	half: half,
			    	ramp: ramp,
			    	devide: devide,
			    	height: height,
			    	start : start
			    };

			//prepend for infinate loop
			children.filter(':gt('+(length - half -1+(length%2))+')').prependTo($elem);

			children = $elem.children();
			children.each(function(){
					var $this = $(this);
					$this.css({
						     'transform': 'rotateY( '+parseInt( deg )+'deg ) translateZ( '+translateZ+'px )'
						 })
					     .transition({
						     y: start + (cnt*ramp)
					     });
					deg += distance;
					cnt++;
			});

			refreshClass( children, data );
	
			$elem.wrap($container);
			$elem.css({
			     	transform: 'translateY(0px) translateZ( -'+translateZ+'px ) rotateY('+rotateY+'deg)',
			     	width: options.item.width
			     })
			     .show()
			     .data(data);

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
			    ramp = data.ramp,
			    distance = data.distance,
			    height = data.height,
			    devide = data.devide,
			    start = data.start;

			rotateY += distance*direction*-1;
			focus += direction;
			last += direction;
			first += direction;


			children = $elem.children();

			if(direction === 1){
				children.filter(':first').transition({
					y: start + (last * ramp),
					rotateY: last * distance,
					duration: 0
				}).appendTo($elem);
			} else {
				children.filter(':last').transition({
					y: start + (first * ramp),
					rotateY: first * distance,
					duration: 0
				}).prependTo($elem);
			}
			console.log(first, ramp)

			refreshClass( $elem.children(), data );
			$elem.css('transform', 'translateY('+(first*ramp*-1)+'px) translateZ( -'+translateZ+'px ) rotateY('+parseInt( rotateY )+'deg)')
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
		       initialize(this, options);
	};
})(jQuery);