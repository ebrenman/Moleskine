var cached_images	= {}; // Initialize an object
const cache_size	= 2;
var cnt_images		= 0;

$('document').ready(function() {
	let mybook_images	= $('#mybook').find('img');
	let loaded			= 0;
	let booklet_loaded  = false;

	cnt_images			= mybook_images.length;
	
	//preload all the images in the book,
	//and then call the booklet plugin

	mybook_images.each(function(){
		const img 	= $(this);
		const source	= img.data('src');
		cached_images[img.data('index')] = [source,false];
	});

	var current_page = Math.floor(window.location.hash.split("/")[2]/2);

	if (isNaN(current_page)){
		current_page = 0;
	};

	cache_pages(current_page, function() {
			booklet_init();
	}); 
          
	;	



});

function booklet_init() {
	const mybook 		= $('#mybook');
	const bttn_next		= $('#next_page_button');
	const bttn_prev		= $('#prev_page_button');

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
		startingPage:       0,                               // index of the first page to be displayed
		easing:             'easeInOutQuad',                 // easing method for complete transition
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

		hash:               true,                           // enables navigation using a hash string, ex: #/page/1 for page 1, will affect all booklets with 'hash' enabled
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

		before:             construct_pages,                    // callback invoked before each page turn animation
		after:              function(){}                     // callback invoked after each page turn animation
	});
	
	Cufon.refresh();
};  

function construct_pages(mybook) {

	cache_pages(mybook.curr/2,function(){});

};

function cache_pages(image_index, callback) {
	const start = cache_size*-1;

	console.log('Current page: '+image_index);	
	console.log ('total images: '+cnt_images);
	console.log ('counter start: '+start);
	
	for (i=start;i<=cache_size;i++) {
		console.log('Checking image index: '+(image_index+i));
		if (image_index+i>=0 && image_index+i<cnt_images) { //Check that index is not out of bounds
			if (!cached_images[image_index+i][1]) { //Check if image has been previously loaded
				$("#mybook").find("[data-index='" + (image_index+i) + "']").attr("src",cached_images[image_index+i][0]); 

				console.log('image source: '+cached_images[image_index+i][0]);
				cached_images[image_index+i][1] = true;
			} 
		}
	}
	callback();

}