$("#pics").justifiedGallery({
	lastRow: 'nojustify',
	rowHeight: 150,
	margins: 13,
	rel: 'gallery2'
}).on('jg.complete', function () {
	var links = $(this).find('a');

	// generate slides array
	var slides = [];
	links.each(function(index) {
		var $t = $(this);
		var dimension = $t.attr("data-size").split("x");
		slides.push({
			src: $t.attr("href"),
			w: dimension[0],
			h: dimension[1]
		});
	});

	links.on("click", function(event) {
		var index = links.index(event.currentTarget);
		event.preventDefault();

		var pswpElement = document.querySelectorAll('.pswp')[0];

		// define options (if needed)
		var options = {
			// optionName: 'option value'
			// for example:
			index: index // start at first slide
		};

		// Initializes and opens PhotoSwipe
		var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
		gallery.init();
	});
});
