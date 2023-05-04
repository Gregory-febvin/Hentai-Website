<?php
// Spécifiez le chemin du répertoire contenant les images
$dir = "sauce";

// Fonction récursive pour récupérer toutes les images
function getImages($dir) {
  $result = array();
  $files = scandir($dir);
  foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
      $path = $dir.'/'.$file;
      if (is_dir($path)) {
        $result = array_merge($result, getImages($path));
      } else {
        if (preg_match("/\.(jpg|jpeg|png|gif)$/", $file)) {
          $result[] = $path;
        }
      }
    }
  }
  return $result;
}

// Récupérez toutes les images dans le répertoire et ses sous-dossiers
$images = getImages($dir);

// Affichez le code HTML pour afficher chaque image
foreach ($images as $image) {
  echo '<img src="'.$image.'" alt="'.basename($image).'" style="height: 20%; width: 20%;">';
}
?>