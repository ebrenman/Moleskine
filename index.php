<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <?php include_once "./header.php"; ?>
    <body>
		<div class="book_wrapper">
			<a id="next_page_button"></a>
			<a id="prev_page_button"></a>
			<div id="loading" class="loading" style="display:none;"></div>
			<div id="mybook" style="display:none;">
				<div class="b-load">
					<?php include_once "./load_book.php"; ?>
				</div>
			</div>
		</div>
        <script src="./booklet_config.js" type="text/javascript"></script>
    </body>
</html>