<?php
$dir    = './pages';
$files1 = scandir($dir,1);
$numItems = count($files1);

echo '<div></div><div></div>'; //Adds an empty page at the beggining to place the cover

$i = 0;
foreach ($files1 as &$file) {
	if (substr($file,0,1) != ".") {
		$image_name = substr($file, 0, strpos($file, '.'));
		echo '<div><img data-src="pages/'.$file.'" data-name= "'.$image_name.'" data-index="'.$i.'" alt=""/></div>';
		if(++$i !==$numItems-2) {
		//	echo "i: ".$i." numitems:".$numItems;
    		echo "<div></div>";
    		
  		}
	}
}
?>