// Fabrique les 4 pages du site à partir d'un seul gabarit (en-tête et pied de page communs).
// Lancer : node outils/construire.js   (depuis le dossier "site")
const fs=require("fs"),path=require("path");
const SITE=path.join(__dirname,"..");

// ---------- croquis au crayon (images découpées par outils/preparer-croquis.ps1) ----------
const img=n=>`<img class="ico" src="img/croquis/${n}.png" alt="" loading="lazy">`;
const I={maison:img("maison"),loupe:img("loupe"),liens:img("poignee"),camera:img("camera"),ondes:img("megaphone"),oeil:img("oeil"),agenda:img("agenda"),
  feuille:img("feuille"),cube:img("cube"),terrain:img("terrain"),grange:img("grange"),euro:img("piece"),montre:img("horloge")};
const fl=`<span class="fl" aria-hidden="true">→</span>`;

// ---------- gabarit ----------
// couche de fond des sections de matière : vidéo pour l'herbe, bande qui défile pour la pierre et le bois
const FOND={herbe:'<div class="fond" aria-hidden="true"><video class="boucle" autoplay muted loop playsinline preload="auto" poster="img/herbe.jpg" src="img/herbe.mp4"></video><video class="boucle" muted playsinline preload="auto" src="img/herbe.mp4" style="opacity:0"></video></div>',
  pierre:'<div class="fond" aria-hidden="true"><div class="bande"></div></div>',bois:'<div class="fond" aria-hidden="true"><div class="bande"></div></div>'};
const avecFonds=html=>html.replace(/<section class="matiere (herbe|pierre|bois)([^"]*)">/g,(m,n)=>m+"\n  "+FOND[n]);

function page({fichier,titre,desc,actif,corps}){
  corps=avecFonds(corps);
  const lien=(h,t)=>`<a href="${h}"${actif===h?' aria-current="page"':""}>${t}</a>`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titre}</title>
<meta name="description" content="${desc}">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,700&display=swap">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="nav">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="MaBâtis, accueil"><img src="img/logo.png" alt="MaBâtis" width="1080" height="520"></a>
    <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <nav aria-label="Navigation principale">
      ${lien("vendre.html","Vendre")}
      ${lien("acheter.html","Acheter")}
      ${lien("partenaires.html","Partenaires")}
      <a class="btn noir" href="${fichier==="index.html"?"vendre.html#contact":"#contact"}">Nous écrire</a>
    </nav>
  </div>
</header>
<main>
${corps}
</main>
<footer>
  <div class="wrap">
    <div class="haut">
      <img src="img/logo-clair.png" alt="MaBâtis" width="1080" height="520">
      <ul>
        <li><a href="vendre.html">Je vends mon bien</a></li>
        <li><a href="acheter.html">Je cherche un bien</a></li>
        <li><a href="partenaires.html">Agences et agents immobiliers</a></li>
      </ul>
      <p class="sur">Ariège, Pyrénées</p>
    </div>
    <p class="legal">MaBâtis n'est pas une agence immobilière. Nous mettons en avant des biens et mettons en relation vendeurs, acheteurs et professionnels. Les mandats, les visites, la négociation et la vente sont réalisés par nos partenaires titulaires de la carte professionnelle. © <span id="annee"></span> MaBâtis.</p>
  </div>
</footer>
<script src="js/main.js"></script>
</body>
</html>
`}

const formulaire=(sujet,champs,bouton)=>`<form class="contact" data-sujet="${sujet}" novalidate>
${champs}
  <button class="btn tout" type="submit" style="justify-self:start">${bouton} ${fl}</button>
  <p class="retour" role="status" hidden></p>
  <small>Vos coordonnées servent uniquement à vous répondre.</small>
</form>`;
const champ=(id,label,type="text",extra="")=>`  <label for="${id}">${label}<input id="${id}" name="${label}" type="${type}" ${extra}></label>`;
const choix=(id,label,opts,cls="")=>`  <label for="${id}"${cls?` class="${cls}"`:""}>${label}<select id="${id}" name="${label}">${opts.map(o=>`<option>${o}</option>`).join("")}</select></label>`;
const zone=(id,label,ph)=>`  <label for="${id}" class="tout">${label}<textarea id="${id}" name="${label}" placeholder="${ph}"></textarea></label>`;

// ---------- cartes « biens » (vides pour l'instant) ----------
const biens=`<div class="grille g3">
  ${[["terrain","Terrains",I.terrain,"Constructibles, agricoles ou de loisir."],["grange","Granges",I.grange,"À transformer, à rénover ou à garder dans leur jus."],["maison","Maisons",I.maison,"De village, de montagne, avec ou sans travaux."]]
    .map(([t,n,i,d],k)=>`<article class="bien" data-type="${t}" data-vu style="--d:${k*.08}s"><div class="vue">${i}</div><div class="txt"><span class="etiquette">bientôt</span><h3>${n}</h3><p>${d}</p></div></article>`).join("\n  ")}
</div>`;

// =====================================================================
// ACCUEIL
// =====================================================================
const accueil=`
<section class="heros">
  <div class="wrap">
    <p class="sur" data-vu>Ariège, Pyrénées</p>
    <h1 data-vu style="--d:.05s">Vendre ou trouver une bâtisse, <em class="b"><span class="trait">sans attendre</span></em> des mois<span class="carre"></span></h1>
    <p class="chapo" data-vu style="--d:.12s">MaBâtis montre les maisons, les granges et les terrains du coin avec de vraies images. Les acheteurs arrivent en sachant déjà ce qu'ils viennent voir.</p>
    <div class="boutons" data-vu style="--d:.18s">
      <a class="btn" href="vendre.html">Je vends mon bien ${fl}</a>
      <a class="btn contour" href="acheter.html">Je cherche un bien</a>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="portes">
      <a class="porte" href="vendre.html" data-vu>${I.maison}<h3>Je veux vendre mon bien</h3><p>On le filme, on le montre partout, et on vous amène des visiteurs vraiment intéressés.</p><span class="va">Voir comment ${fl}</span></a>
      <a class="porte" href="acheter.html" data-vu style="--d:.08s">${I.loupe}<h3>Je cherche un bien</h3><p>Photos, vidéo, dimensions : faites-vous une idée précise avant de prendre la route.</p><span class="va">Voir les biens ${fl}</span></a>
      <a class="porte noire" href="partenaires.html" data-vu style="--d:.16s">${I.liens}<h3>Je suis agence ou agent immobilier</h3><p>On vous apporte des vendeurs et des acheteurs déjà préparés. Vous gardez la vente.</p><span class="va">Travailler ensemble ${fl}</span></a>
    </div>
  </div>
</section>

<section class="papier">
  <div class="wrap deux">
    <div class="colle-haut" data-vu>
      <p class="sur">Comment ça marche</p>
      <h2>Trois étapes, et votre bien est <em class="b">vu</em>.</h2>
      <p class="chapo">Un panneau « à vendre » attend qu'on passe devant. Nous, on va chercher les acheteurs là où ils sont.</p>
    </div>
    <div class="etapes">
      <div class="etape" data-vu><h3>On filme votre bien</h3><p>Photos et vidéo de l'intérieur, de l'extérieur et des alentours. Les visites en 3D arrivent bientôt.</p></div>
      <div class="etape" data-vu><h3>On le montre aux bonnes personnes</h3><p>Sur ce site, sur les réseaux et en publicité ciblée, auprès de gens qui cherchent ce type de bien dans la région.</p></div>
      <div class="etape" data-vu><h3>Les visites se font avec une agence partenaire</h3><p>Quand un acheteur est prêt, une agence ou un agent immobilier partenaire prend le relais pour la visite et la vente.</p></div>
    </div>
  </div>
</section>

<section class="matiere pierre">
  <div class="wrap">
    <p class="sur" data-vu>Notre idée</p>
    <h2 data-vu style="--d:.06s">Une bâtisse, ça se montre. Pas juste un panneau au bord de la route.</h2>
    <p data-vu style="--d:.12s">La pierre, le bois, la vue, la lumière dans la grange : c'est ça qui donne envie de venir. Alors on le filme, et on le fait voir.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="entete" data-vu>
      <p class="sur">Les biens</p>
      <h2>Les premiers biens arrivent.</h2>
      <p class="chapo">On démarre. Les terrains, granges et maisons que l'on nous confie apparaîtront ici, avec leurs images et leur prix.</p>
    </div>
    ${biens}
  </div>
</section>

<section class="matiere herbe centre">
  <div class="wrap">
    <h2 data-vu>Un terrain, une grange, une maison&nbsp;? Parlons-en.</h2>
    <p data-vu style="--d:.06s">Dites-nous ce que vous avez à vendre ou ce que vous cherchez. On vous répond simplement, entre voisins.</p>
    <div class="boutons" data-vu style="--d:.12s"><a class="btn" href="vendre.html#contact">J'ai un bien à vendre ${fl}</a><a class="btn blanc" href="acheter.html#contact">Je cherche un bien</a></div>
  </div>
</section>`;

// =====================================================================
// VENDRE
// =====================================================================
const vendre=`
<section class="heros large">
  <div class="wrap">
    <p class="sur" data-vu>Vous vendez</p>
    <h1 data-vu style="--d:.05s">Votre bien mérite mieux qu'un <em class="b"><span class="trait">panneau</span></em><span class="carre"></span></h1>
    <p class="chapo" data-vu style="--d:.12s">En zone rurale, une maison reste souvent plus de quatre mois en vente. On raccourcit ça en montrant vraiment votre bien, et en vous amenant des visiteurs qui l'ont déjà vu en images.</p>
    <div class="boutons" data-vu style="--d:.18s"><a class="btn" href="#contact">Parler de mon bien ${fl}</a><a class="btn contour" href="#methode">Voir la méthode</a></div>
  </div>
</section>

<section class="papier">
  <div class="wrap">
    <div class="entete" data-vu><p class="sur">Ce qu'on fait pour vous</p><h2>Plus vite, parce que mieux <em class="b">montré</em>.</h2></div>
    <div class="grille g4">
      <div class="carte" data-vu>${I.camera}<h3>De vraies images</h3><p>Photos et vidéo soignées de chaque pièce, de l'extérieur et du coin. Bientôt la visite en 3D.</p></div>
      <div class="carte" data-vu style="--d:.06s">${I.ondes}<h3>Une diffusion active</h3><p>Site, réseaux sociaux, publicité ciblée : on va chercher les acheteurs au lieu de les attendre.</p></div>
      <div class="carte" data-vu style="--d:.12s">${I.oeil}<h3>Des visiteurs préparés</h3><p>Ils ont vu l'intérieur, la taille des pièces, les travaux à prévoir. Ceux qui viennent sont vraiment intéressés.</p></div>
      <div class="carte" data-vu style="--d:.18s">${I.agenda}<h3>Un suivi clair</h3><p>Vous savez combien de personnes ont vu votre bien et qui vient le visiter.</p></div>
    </div>
  </div>
</section>

<section id="methode">
  <div class="wrap deux">
    <div class="colle-haut" data-vu>
      <p class="sur">La méthode</p>
      <h2>De la première discussion à la visite.</h2>
      <p class="chapo">Vous restez propriétaire de toutes les décisions. On s'occupe de faire connaître votre bien.</p>
    </div>
    <div class="etapes">
      <div class="etape" data-vu><h3>On en parle</h3><p>Un appel ou un café sur place : votre bien, votre prix, votre délai.</p></div>
      <div class="etape" data-vu><h3>Vous nous autorisez à le filmer</h3><p>Un accord écrit sur le droit à l'image du bien. C'est ce qui nous permet de le montrer partout.</p></div>
      <div class="etape" data-vu><h3>On tourne et on diffuse</h3><p>Photos, vidéo, annonce sur le site, publications et publicité auprès des bons acheteurs.</p></div>
      <div class="etape" data-vu><h3>Les visites commencent</h3><p>Une agence ou un agent immobilier partenaire organise les visites et s'occupe de la vente jusqu'au notaire.</p></div>
    </div>
  </div>
</section>

<section class="matiere pierre">
  <div class="wrap">
    <p class="sur" data-vu>Notre engagement</p>
    <h2 data-vu style="--d:.06s">Un nombre minimum de visites, fixé ensemble dès le départ.</h2>
    <p data-vu style="--d:.12s">On ne peut pas promettre une date de vente. On s'engage sur ce qui dépend de nous : amener des personnes intéressées voir votre bien, dans un délai convenu avec vous.</p>
  </div>
</section>

<section class="papier">
  <div class="wrap grille g2">
    <div class="carte" data-vu>${I.euro}<h3>Combien ça coûte&nbsp;?</h3><p>Rien de plus pour vous. Nous sommes rémunérés par l'agence partenaire, sur ses honoraires, uniquement si la vente se fait.</p></div>
    <div class="carte" data-vu style="--d:.08s">${I.montre}<h3>Et si mon bien est déjà en agence&nbsp;?</h3><p>Dites-le-nous. Selon votre mandat, on peut travailler avec votre agence pour donner plus de visibilité à votre bien.</p></div>
  </div>
</section>

<section id="contact">
  <div class="wrap deux">
    <div class="colle-haut" data-vu><p class="sur">On s'appelle&nbsp;?</p><h2>Parlez-nous de votre bien.</h2><p class="chapo">Quelques lignes suffisent. On vous rappelle pour en discuter, sans engagement.</p></div>
    <div data-vu>${formulaire("Je veux vendre mon bien",[
      champ("v-nom","Nom","text",'autocomplete="name" required'),champ("v-tel","Téléphone","tel",'autocomplete="tel"'),
      champ("v-mail","E-mail","email",'autocomplete="email"'),champ("v-commune","Commune du bien"),
      choix("v-type","Type de bien",["Maison","Grange","Terrain","Autre"]),choix("v-delai","Délai souhaité",["Dès que possible","Dans les 6 mois","Je me renseigne"]),
      zone("v-msg","Votre bien en quelques mots","Surface, état, prix espéré, déjà en agence ou non…")].join("\n"),"Envoyer")}</div>
  </div>
</section>`;

// =====================================================================
// ACHETER
// =====================================================================
const acheter=`
<section class="heros large">
  <div class="wrap">
    <p class="sur" data-vu>Vous cherchez</p>
    <h1 data-vu style="--d:.05s">Visitez <em class="b"><span class="trait">avant</span></em> de vous déplacer<span class="carre"></span></h1>
    <p class="chapo" data-vu style="--d:.12s">Terrains, granges, maisons à rénover en Ariège. Pour chaque bien : des photos, une vidéo et les dimensions, pour savoir si ça vaut la route.</p>
    <div class="boutons" data-vu style="--d:.18s"><a class="btn" href="#biens">Voir les biens ${fl}</a><a class="btn contour" href="#contact">Être prévenu des nouveautés</a></div>
  </div>
</section>

<section class="papier">
  <div class="wrap">
    <div class="entete" data-vu><p class="sur">Ce que vous y gagnez</p><h2>Une vue d'ensemble, <em class="b">tout de suite</em>.</h2></div>
    <div class="grille g3">
      <div class="carte" data-vu>${I.oeil}<h3>Vous voyez tout</h3><p>L'intérieur, l'extérieur, les alentours : pas de mauvaise surprise en arrivant.</p></div>
      <div class="carte" data-vu style="--d:.06s">${I.feuille}<h3>Les vraies informations</h3><p>Taille des pièces, état du bâti, travaux à prévoir, prix. Ce qu'on sait, on le dit.</p></div>
      <div class="carte" data-vu style="--d:.12s">${I.cube}<h3>Bientôt en 3D</h3><p>Vous pourrez vous promener dans le bien depuis votre téléphone, pièce par pièce.</p></div>
    </div>
  </div>
</section>

<section id="biens">
  <div class="wrap">
    <div class="entete" data-vu><p class="sur">Les biens</p><h2>Les premiers biens arrivent.</h2><p class="chapo">On démarre tout juste. Laissez-nous ce que vous cherchez plus bas : vous serez prévenu dès qu'un bien correspond.</p></div>
    <div class="filtres" role="group" aria-label="Filtrer par type de bien" data-vu>
      <button data-type="tous" aria-pressed="true">Tous</button><button data-type="terrain" aria-pressed="false">Terrains</button><button data-type="grange" aria-pressed="false">Granges</button><button data-type="maison" aria-pressed="false">Maisons</button>
    </div>
    ${biens}
  </div>
</section>

<section class="matiere bois">
  <div class="wrap">
    <p class="sur" data-vu>Du coin</p>
    <h2 data-vu style="--d:.06s">Des bâtisses avec une histoire, et de la place pour la vôtre.</h2>
    <p data-vu style="--d:.12s">On connaît les villages, les vallées et les chemins. Posez-nous vos questions sur le secteur, on vous dira ce qu'on en sait.</p>
  </div>
</section>

<section id="contact" class="papier">
  <div class="wrap deux">
    <div class="colle-haut" data-vu><p class="sur">Votre recherche</p><h2>Dites-nous ce que vous cherchez.</h2><p class="chapo">On vous écrit dès qu'un bien correspond, avant même qu'il soit publié partout.</p></div>
    <div data-vu>${formulaire("Je cherche un bien",[
      champ("a-nom","Nom","text",'autocomplete="name" required'),champ("a-mail","E-mail","email",'autocomplete="email" required'),
      champ("a-tel","Téléphone","tel",'autocomplete="tel"'),choix("a-type","Type de bien",["Peu importe","Maison","Grange","Terrain"]),
      choix("a-budget","Budget",["Moins de 50 000 €","50 000 à 100 000 €","100 000 à 200 000 €","Plus de 200 000 €"]),champ("a-secteur","Secteur souhaité"),
      zone("a-msg","Votre projet","Résidence principale, maison de vacances, rénovation, terrain pour construire…")].join("\n"),"Me prévenir")}</div>
  </div>
</section>`;

// =====================================================================
// PARTENAIRES
// =====================================================================
const partenaires=`
<section class="heros large">
  <div class="wrap">
    <p class="sur" data-vu>Agences et agents immobiliers</p>
    <h1 data-vu style="--d:.05s">Des vendeurs et des acheteurs, <em class="b"><span class="trait">déjà préparés</span></em><span class="carre"></span></h1>
    <p class="chapo" data-vu style="--d:.12s">MaBâtis est apporteur d'affaires en Ariège. On trouve les biens, on les filme, on attire les acheteurs. Vous gardez le mandat, les visites et la vente.</p>
    <div class="boutons" data-vu style="--d:.18s"><a class="btn" href="#contact">Discuter d'un partenariat ${fl}</a></div>
  </div>
</section>

<section class="papier">
  <div class="wrap">
    <div class="entete" data-vu><p class="sur">Ce qu'on vous apporte</p><h2>Moins de temps perdu, plus de <em class="b">vrais</em> rendez-vous.</h2></div>
    <div class="grille g4">
      <div class="carte" data-vu>${I.maison}<h3>Des vendeurs</h3><p>Des propriétaires rencontrés sur le terrain, avec leur projet, leur prix et leur délai déjà discutés.</p></div>
      <div class="carte" data-vu style="--d:.06s">${I.camera}<h3>Le contenu</h3><p>Photos et vidéo du bien, prêtes à diffuser, avec l'accord écrit du propriétaire.</p></div>
      <div class="carte" data-vu style="--d:.12s">${I.oeil}<h3>Des acheteurs</h3><p>Des personnes qui ont déjà vu le bien en images et dont on connaît le budget et le projet.</p></div>
      <div class="carte" data-vu style="--d:.18s">${I.agenda}<h3>Des rendez-vous</h3><p>On vous met en relation au bon moment, quand la personne est prête à visiter.</p></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap deux">
    <div class="colle-haut" data-vu><p class="sur">Le cadre</p><h2>Simple, écrit, et chacun son métier.</h2><p class="chapo">Vous êtes titulaire de la carte professionnelle : la transaction, c'est vous. Nous, on amène l'affaire.</p></div>
    <div class="etapes">
      <div class="etape" data-vu><h3>Un contrat d'apport d'affaires</h3><p>Signé avant le premier contact transmis : qui apporte quoi, et comment chaque apport est tracé.</p></div>
      <div class="etape" data-vu><h3>On vous transmet le contact</h3><p>Vendeur ou acheteur, avec tout ce qu'on sait déjà de son projet.</p></div>
      <div class="etape" data-vu><h3>Vous menez la vente</h3><p>Mandat, visites, négociation, compromis : tout reste entre vos mains.</p></div>
      <div class="etape" data-vu><h3>Rémunération à la vente uniquement</h3><p>Une part de vos honoraires, convenue à l'avance, versée seulement si la vente est signée.</p></div>
    </div>
  </div>
</section>

<section class="matiere herbe centre">
  <div class="wrap">
    <h2 data-vu>Agence installée ou agent indépendant&nbsp;: on travaille avec les deux.</h2>
    <p data-vu style="--d:.06s">Ce qui compte pour nous : des gens sérieux, joignables, qui connaissent le terrain.</p>
  </div>
</section>

<section id="contact" class="papier">
  <div class="wrap deux">
    <div class="colle-haut" data-vu><p class="sur">Parlons-en</p><h2>Travaillons ensemble.</h2><p class="chapo">Dites-nous où vous exercez et comment vous travaillez. On vous rappelle pour en discuter.</p></div>
    <div data-vu>${formulaire("Partenariat professionnel",[
      champ("p-nom","Nom","text",'autocomplete="name" required'),champ("p-agence","Agence ou réseau","text",'autocomplete="organization"'),
      champ("p-tel","Téléphone","tel",'autocomplete="tel"'),champ("p-mail","E-mail","email",'autocomplete="email"'),
      choix("p-statut","Vous êtes",["Agence immobilière","Agent indépendant avec carte T","Agent commercial (mandataire)","Autre"]),champ("p-secteur","Secteur d'activité"),
      zone("p-msg","Votre message","Types de biens, secteur, façon de travailler…")].join("\n"),"Envoyer")}</div>
  </div>
</section>`;

const PAGES=[
  {fichier:"index.html",titre:"MaBâtis",desc:"Vendre ou trouver une maison, une grange ou un terrain en Ariège, avec de vraies images et des visiteurs déjà préparés.",actif:"",corps:accueil},
  {fichier:"vendre.html",titre:"Vendre mon bien · MaBâtis",desc:"Faites connaître votre maison, grange ou terrain en Ariège : photos, vidéo, diffusion active et visiteurs vraiment intéressés.",actif:"vendre.html",corps:vendre},
  {fichier:"acheter.html",titre:"Trouver un bien · MaBâtis",desc:"Terrains, granges et maisons en Ariège, à découvrir en images avant de vous déplacer.",actif:"acheter.html",corps:acheter},
  {fichier:"partenaires.html",titre:"Agences et agents · MaBâtis",desc:"MaBâtis, apporteur d'affaires en Ariège : des vendeurs et des acheteurs préparés pour les agences et agents immobiliers.",actif:"partenaires.html",corps:partenaires}
];
for(const p of PAGES)fs.writeFileSync(path.join(SITE,p.fichier),page(p));
fs.writeFileSync(path.join(SITE,"img","favicon.svg"),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0A160F"/><path d="M14 40 32 20l18 20" fill="none" stroke="#1FBE1F" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
console.log("pages créées :",PAGES.map(p=>p.fichier).join(", "));
