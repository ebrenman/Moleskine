var cached_images	= {}; // Initialize an object
var image_position	= {}; // Initialize an object
const cache_size	= 3;
var cnt_images		= 0;
var booklet_loaded  = false;

$('document').ready(function() {
	let mybook_images	= $('#mybook').find('img');
	cnt_images			= mybook_images.length;
	
	mybook_images.each(function(){
		const img 	= $(this);
		const source	= img.data('src');
		cached_images[img.data('index')] = [source,false,img.data('name')];
		image_position[img.data('name')] = img.data('index');
		console.log ('posicion: '+ img.data('index')+ 'nombre: '+ img.data('name'));
	});

	console.log ('hash: '+window.location.hash); 
	var current_page = image_position[window.location.hash.substr(1)]*2+2;
	console.log ('pagina detectada: '+current_page);
	if (isNaN(current_page)){
		current_page = 0;
	};

    document.onreadystatechange = function() {
		if (document.readyState == "complete") {
			$('#loading').show(); //only show loading when the book images have been loaded
			cache_pages(current_page, function() {
				booklet_init(current_page);
			}); 
		}
	};

});

function booklet_init(current_page) {
	const mybook 		= $('#mybook');
	const bttn_next		= $('#next_page_button');
	const bttn_prev		= $('#prev_page_button');

	booklet_loaded  = true;

	console.log('booklet initialized.');
	$('#loading').hide();
	bttn_next.show();
	bttn_prev.show();
	mybook.show().booklet({
		name:               null,                            // name of the booklet to display in the document title bar
		width:              800,                             // container width
		height:             620,                             // container height
		speed:              600,                             // speed of the transition between pages
		direction:          'LTR',                           // direction of the overall content organization, default LTR, left to right, can be RTL for languages which read right to left
		startingPage:       1,                               // index of the first page to be displayed
		easing:             'easeInOutQuad',                 // easing method for complete transition easeInOutQuad
		easeIn:             'easeInQuad',                    // easing method for first half of transition
		easeOut:            'easeOutQuad',                   // easing method for second half of transition

		closed:             true,                           // start with the book "closed", will add empty pages to beginning and end of book
		closedFrontTitle:   null,                            // used with "closed", "menu" and "pageSelector", determines title of blank starting page
		closedFrontChapter: null,                            // used with "closed", "menu" and "chapterSelector", determines chapter name of blank starting page
		closedBackTitle:    null,                            // used with "closed", "menu" and "pageSelector", determines chapter name of blank ending page
		closedBackChapter:  null,                            // used with "closed", "menu" and "chapterSelector", determines chapter name of blank ending page
		covers:             false,                           // used with  "closed", makes first and last pages into covers, without page numbers (if enabled)

		pagePadding:        10,                              // padding for each page wrapper
		pageNumbers:        false,                            // display page numbers on each page

		hovers:             false,                            // enables preview pageturn hover animation, shows a small preview of previous or next page on hover
		overlays:           false,                            // enables navigation using a page sized overlay, when enabled links inside the content will not be clickable
		tabs:               false,                           // adds tabs along the top of the pages
		tabWidth:           60,                              // set the width of the tabs
		tabHeight:          20,                              // set the height of the tabs
		arrows:             false,                           // adds arrows overlayed over the book edges
		cursor:             'pointer',                       // cursor css setting for side bar areas

		hash:               false,                           // enables navigation using a hash string, ex: #/page/1 for page 1, will affect all booklets with 'hash' enabled
		keyboard:           true,                            // enables navigation with arrow keys (left: previous, right: next)
		next:               bttn_next,          			// selector for element to use as click trigger for next page
		prev:               bttn_prev,          			// selector for element to use as click trigger for previous page

		menu:               null,                            // selector for element to use as the menu area, required for 'pageSelector'
		pageSelector:       false,                           // enables navigation with a dropdown menu of pages, requires 'menu'
		chapterSelector:    false,                           // enables navigation with a dropdown menu of chapters, determined by the "rel" attribute, requires 'menu'

		shadows:            true,                            // display shadows on page animations
		shadowTopFwdWidth:  166,                             // shadow width for top forward anim
		shadowTopBackWidth: 166,                             // shadow width for top back anim
		shadowBtmWidth:     50,                              // shadow width for bottom shadow

		start:              construct_pages,                 // callback invoked before each page turn animation
		change:             set_covers,                       // callback invoked after each page turn animation
		create:             on_creation
	});
};  

function on_creation() {
	let current_page = image_position[window.location.hash.substr(1)]*2+2;
	if (isNaN(current_page)){
		current_page = 0;
		set_cover_pages(current_page);
	} else {
		$('#mybook').booklet("gotopage", current_page);
		console.log('cambiando a ' + current_page);
	};
}

function construct_pages(event, data) {
	let current_page = data.index;
	let image_index = current_page/2-1;

	console.log ('page number @ construct: '+current_page + ' | amount of images: '+cnt_images);
	cache_pages(current_page,function(){});
	if (image_index > -1 && image_index < cnt_images) { // set location hash only when it's not the cover page
		window.location.hash = cached_images[image_index][2];		
	} else if (image_index == cnt_images) {
		window.location.hash = '';
	} 
};

function cache_pages(current_page, callback) {
	const start = cache_size*-1;
	const last_page = ((cnt_images+1)*2); // Adds 1 page at the beggining (cover page) and one at the end

	let image_index = current_page/2-1;
	if (image_index == -1) { // if book is closed, then use first image anyways
		image_index = 0
	}
	
	console.log ('current image: '+image_index);
	if (current_page != 0 && current_page != last_page) { // remove closed cover page
		$(".book_wrapper").css('background', 'transparent url(images/bg.png) no-repeat 9px 27px');
		$(".b-wrap-right").css('background', '#2345ae url(images/right_bg.jpg) no-repeat top left');
		$(".b-p2").css('background', '');
		console.log ('open book loaded');
	} 

	//preload cached images in the book,
	//and then call the booklet plugin

	for (i = start; i <= cache_size; i++) {
		const current_image = image_index+i;

		//console.log('Checking image index: '+ current_image);
		if (current_image >= 0 && current_image < cnt_images) { //Check that index is not out of bounds
			if (!cached_images[current_image][1]) { //Check if image has been previously loaded
				const myimage = $("#mybook").find("[data-index='" + (current_image) + "']");
				myimage.attr("src",cached_images[current_image][0]); 

				console.log('image source: '+ cached_images[current_image][0]);
				if (current_image == image_index && !booklet_loaded){
					myimage.load(function()  {
						callback();
					});
				}
				cached_images[current_image][1] = true;
			} 
		}
	}

};

function set_covers(event, data) {
	set_cover_pages(data.index);
}

function set_cover_pages(current_page) {
	//const image_index = mybook.curr/2
	const last_page = ((cnt_images+1)*2); // Adds 1 page at the beggining (cover page) and one at the end	
	
	console.log ('Setting cover pages / '+' Page: '+current_page+' Last page: '+last_page);
	//console.log (mybook);

	if (current_page == 0) {
		$(".book_wrapper").css('background', 'transparent url(images/front_cover.png) no-repeat 9px 27px');
		$(".b-wrap-right").css('background', 'black');
		$(".b-p2").css('background', 'black');
		console.log ('trying to set front cover page to black');
	} else if (current_page == last_page) { 
		$(".book_wrapper").css('background', 'transparent url(images/back_cover.png) no-repeat 9px 27px');
		$(".b-wrap-left").css('background', 'black');

	}

	
}