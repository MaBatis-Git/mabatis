// MaBâtis — petites interactions communes aux pages
(function(){
  // Adresse qui recevra les demandes. Vide = formulaires pas encore branchés.
  var CONTACT_EMAIL = "";

  document.documentElement.classList.add("js");

  // barre du haut : filet au défilement + menu mobile
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".burger");
  function colle(){ if(nav) nav.classList.toggle("colle", window.scrollY > 8); }
  colle(); window.addEventListener("scroll", colle, {passive:true});
  if(burger) burger.addEventListener("click", function(){
    var o = nav.classList.toggle("ouvert"); burger.setAttribute("aria-expanded", String(o));
  });

  // apparitions au défilement
  var cibles = document.querySelectorAll("[data-vu]");
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("vu"); io.unobserve(e.target); } });
    }, {rootMargin:"0px 0px -8% 0px", threshold:.08});
    cibles.forEach(function(c){ io.observe(c); });
  } else cibles.forEach(function(c){ c.classList.add("vu"); });

  // filtres de la liste des biens
  var filtres = document.querySelector(".filtres");
  if(filtres) filtres.addEventListener("click", function(e){
    var b = e.target.closest("button[data-type]"); if(!b) return;
    filtres.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", String(x===b)); });
    document.querySelectorAll(".bien").forEach(function(c){
      c.hidden = !(b.dataset.type==="tous" || c.dataset.type===b.dataset.type);
    });
  });

  // formulaires
  document.querySelectorAll("form.contact").forEach(function(f){
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var retour = f.querySelector(".retour");
      if(!CONTACT_EMAIL){
        retour.hidden = false;
        retour.textContent = "Le site est en construction : ce formulaire n'est pas encore branché, donc rien n'a été envoyé. Revenez très bientôt.";
        return;
      }
      var lignes = [];
      new FormData(f).forEach(function(v,k){ if(v) lignes.push(k+" : "+v); });
      window.location.href = "mailto:"+CONTACT_EMAIL+"?subject="+encodeURIComponent(f.dataset.sujet||"Demande depuis le site")+"&body="+encodeURIComponent(lignes.join("\n"));
      retour.hidden = false;
      retour.textContent = "Votre messagerie s'ouvre avec le message prêt : il reste à cliquer sur Envoyer.";
    });
  });

  // parallaxe : le fond des sections de matière glisse moins vite que la page, le texte un peu plus vite
  var matieres = [].slice.call(document.querySelectorAll(".matiere"));
  var calme = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(matieres.length && !calme){
    var enAttente = false;
    function parallaxe(){
      enAttente = false;
      var vh = window.innerHeight;
      matieres.forEach(function(m){
        var r = m.getBoundingClientRect();
        if(r.bottom < -100 || r.top > vh + 100) return;
        var p = (r.top + r.height/2 - vh/2) / (vh/2 + r.height/2);   // -1 (sorti en haut) à 1 (pas encore entré)
        if(p < -1) p = -1; else if(p > 1) p = 1;
        m.style.setProperty("--py", (-p * r.height * 0.16).toFixed(1));
        m.style.setProperty("--rx", (p * 3).toFixed(2));
        m.style.setProperty("--ty", (p * 26).toFixed(1));
      });
    }
    function demande(){ if(!enAttente){ enAttente = true; requestAnimationFrame(parallaxe); } }
    window.addEventListener("scroll", demande, {passive:true});
    window.addEventListener("resize", demande);
    parallaxe();
  }

  var an = document.getElementById("annee"); if(an) an.textContent = new Date().getFullYear();
})();
