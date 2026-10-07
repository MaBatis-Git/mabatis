// Prépare le dossier à mettre en ligne : uniquement les pages, le style, le script et les images.
// Lancer : node outils/publier.js   (Netlify le lance tout seul à chaque envoi sur GitHub)
const fs=require("fs"),path=require("path");
const SITE=path.join(__dirname,".."),OUT=path.join(SITE,"_en-ligne");
// copie récursive faite à la main : fs.cpSync plante sous Windows quand le chemin contient un accent
function copie(src,dst){
  if(fs.statSync(src).isDirectory()){fs.mkdirSync(dst,{recursive:true});for(const f of fs.readdirSync(src))copie(path.join(src,f),path.join(dst,f))}
  else fs.copyFileSync(src,dst);
}
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT);
for(const f of fs.readdirSync(SITE))if(f.endsWith(".html"))copie(path.join(SITE,f),path.join(OUT,f));
for(const d of ["css","js","img"])copie(path.join(SITE,d),path.join(OUT,d));
console.log("dossier prêt :",OUT);
