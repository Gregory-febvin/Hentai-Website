const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const port = 3000; // spécifiez le port de votre choix
const imagePath = 'sauce'; // spécifiez le chemin vers votre répertoire d'images
const imagesPerPage = 10; // spécifiez le nombre d'images à afficher par page

// Fonction récursive pour récupérer tous les noms de fichiers d'images dans un répertoire et ses sous-dossiers
function getImageNamesRecursive(dir) {
  let result = [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      result = result.concat(getImageNamesRecursive(filePath));
    } else if (/\.(jpg|jpeg|png|gif)$/.test(file)) {
      result.push(path.relative(imagePath, filePath));
    }
  });
  return result;
}

// Route pour afficher les images paginées
app.use(express.static(imagePath));

app.get('/', (req, res) => {
  // Récupérez tous les noms de fichiers d'images dans le répertoire et ses sous-dossiers
  const imageNames = getImageNamesRecursive(imagePath);

  // Déterminez le numéro de page à afficher à partir de la requête HTTP
  const page = parseInt(req.query.page) || 1;

  // Calculez l'indice de début et l'indice de fin pour la page actuelle
  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  // Sélectionnez les noms de fichiers d'images pour la page actuelle
  const pageImageNames = imageNames.slice(startIndex, endIndex);

  // Calculez le nombre total de pages
  const numPages = Math.ceil(imageNames.length / imagesPerPage);

  // Construisez le code HTML pour les images
  let html = '';
  pageImageNames.forEach((imageName) => {
    html += `<img src="${imageName}" alt="${imageName}" style="width: 300px;height: 300px;" loading="lazy">`;
  });

  // Ajoutez des liens vers les pages précédentes et suivantes
  if (page > 1) {
    html = `<a href="?page=${page - 1}">Page précédente</a><br>` + html;
  }
  if (page < numPages) {
    html += `<br><a href="?page=${page + 1}">Page suivante</a>`;
  }

  res.send(html);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
