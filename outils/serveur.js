// Petit serveur local pour voir le site : node outils/serveur.js puis http://localhost:4173
const http=require("http"),fs=require("fs"),path=require("path");
const RACINE=path.join(__dirname,"..");
const TYPES={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".webp":"image/webp",".mp4":"video/mp4",".ico":"image/x-icon"};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split("?")[0]);if(p.endsWith("/"))p+="index.html";
  const f=path.join(RACINE,path.normalize(p));
  if(!f.startsWith(RACINE)){res.writeHead(403);return res.end()}
  fs.readFile(f,(e,d)=>{if(e){res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});return res.end("Introuvable")}
    res.writeHead(200,{"Content-Type":TYPES[path.extname(f).toLowerCase()]||"application/octet-stream","Cache-Control":"no-store"});res.end(d)});
}).listen(process.env.PORT||4173,()=>console.log("Site MaBâtis : http://localhost:"+(process.env.PORT||4173)));
