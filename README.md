# Site MaBâtis

Site vitrine de MaBâtis (Ariège) : accueil, vendre, acheter, partenaires.
En ligne sur https://mabatis.netlify.app

## Comment c'est fait

- `outils/construire.js` fabrique les 4 pages `.html` à partir d'un seul gabarit. **Les textes se modifient dans ce fichier**, pas dans les `.html`.
- `css/style.css` : tout le style.
- `js/main.js` : menu, apparitions au défilement, parallaxe, filtres, formulaires.
- `img/` : logo, textures, vidéo de l'herbe, pictos au crayon (`img/croquis/`).
- `outils/publier.js` prépare le dossier `_en-ligne/` qui est mis en ligne.

## Voir le site sur son ordinateur

Il faut Node.js (https://nodejs.org).

```bash
node outils/construire.js
```

```bash
node outils/serveur.js
```

Puis ouvrir http://localhost:4173

## Travailler à deux

1. Avant de commencer, récupérer le travail de l'autre :

```bash
git pull
```

2. Modifier, puis reconstruire les pages et vérifier en local :

```bash
node outils/construire.js
```

3. Envoyer ses modifications :

```bash
git add -A
```

```bash
git commit -m "Ce que j'ai changé"
```

```bash
git push
```

Une fois Netlify relié au dépôt GitHub, chaque `git push` met le site en ligne tout seul en une ou deux minutes.

Si `git push` est refusé, c'est que l'autre a envoyé quelque chose entre-temps : refaire `git pull`, puis `git push`.

## Ce qui n'est pas dans le dépôt

- `textures-source/` : les fichiers d'origine des textures et des planches de pictos (trop lourds).
- Les clés et outils de génération d'images (muapi) restent sur le PC de Nathan.
