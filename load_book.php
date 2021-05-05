<?php
$dir    = './pages';
$files1 = scandir($dir,1);
$numItems = count($files1);
$i = 0;
foreach ($files1 as &$file) {
	if (substr($file,0,1) != ".") {
		echo '<div><img data-src="pages/'.$file.'" data-index="'.$i.'" alt=""/></div>';
		if(++$i !==$numItems-2) {
		//	echo "i: ".$i." numitems:".$numItems;
    		echo "<div></div>";
  		}
	}
}
?>