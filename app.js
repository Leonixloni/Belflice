const $=s=>document.querySelector(s);
let root=null, nodeMap=new Map(), parentMap=new Map(), expanded=new Set(["life"]), selectedId="life";
const kindLabels={ancestor:"WSPÓLNY PRZODEK",domain:"DOMENA",kingdom:"DUŻA GRUPA",group:"LINIA EWOLUCYJNA",species:"GATUNEK / PRZYKŁAD",event:"EWOLUCYJNE ZDARZENIE"};
const icons={ancestor:"✳",domain:"◉",kingdom:"❋",group:"⌘",species:"✦",event:"↔"};
function indexTree(node,parent=null,path=[]){nodeMap.set(node.id,node);parentMap.set(node.id,{parent,path});const next=[...path,node];(node.children||[]).forEach(c=>indexTree(c,node,next))}
function descendants(n){return [n,...(n.children||[]).flatMap(descendants)]}
function renderNode(node){
 const li=document.createElement("li");li.className="tree-item";
 const row=document.createElement("button");row.className=`node kind-${node.kind||"group"}${node.id===selectedId?" selected":""}`;row.dataset.id=node.id;
 const has=!!(node.children&&node.children.length);
 const toggle=document.createElement("span");toggle.className="node-toggle";toggle.textContent=has?(expanded.has(node.id)?"−":"+"):"";row.append(toggle);
 const dot=document.createElement("span");dot.className="node-dot";row.append(dot);
 const name=document.createElement("span");name.className="node-name";name.textContent=node.name;row.append(name);
 if(node.age){const age=document.createElement("small");age.textContent=node.age.replace(" temu","");row.append(age)}
 row.addEventListener("click",()=>{selectNode(node.id);if(has){if(expanded.has(node.id))expanded.delete(node.id);else expanded.add(node.id);renderTree()}});
 li.append(row);
 if(has&&expanded.has(node.id)){const ul=document.createElement("ul");ul.className="tree-list";node.children.forEach(c=>ul.append(renderNode(c)));li.append(ul)}
 return li
}
function renderTree(){const canvas=$("#treeCanvas");canvas.replaceChildren();const rootDiv=document.createElement("div");rootDiv.className="tree-root";const ul=document.createElement("ul");ul.className="tree-list root-list";ul.append(renderNode(root));rootDiv.append(ul);canvas.append(rootDiv)}
function selectNode(id){const node=nodeMap.get(id);if(!node)return;selectedId=id;$("#detailIcon").textContent=icons[node.kind]||"✳";$("#detailType").textContent=kindLabels[node.kind]||"LINIA EWOLUCYJNA";$("#detailName").textContent=node.name;$("#detailLatin").textContent=node.latin||"Klasyfikacja w uproszczeniu";$("#detailDescription").textContent=node.description||"Ta karta przedstawia wybraną linię ewolucyjną. Szczegółowe relacje i daty mogą być nadal badane.";$("#detailAge").textContent=node.age||"Nie ustalono jednej daty";$("#treeStatus").textContent=node.name;
 const meta=parentMap.get(id);const crumbs=$("#breadcrumbs");crumbs.replaceChildren();meta.path.forEach((p,i)=>{if(i===meta.path.length-1)return;const b=document.createElement("button");b.className="crumb";b.textContent=p.name;b.title="Pokaż "+p.name;b.onclick=()=>{selectNode(p.id);expanded.add(p.id);renderTree()};crumbs.append(b)});
 const children=$("#childrenList");children.replaceChildren();if(node.children?.length){const h=document.createElement("h4");h.textContent="DALSZE GAŁĘZIE";children.append(h);node.children.forEach(c=>{const b=document.createElement("button");b.className="child-link";b.innerHTML=`<span></span><span>↗</span>`;b.firstChild.textContent=c.name;b.onclick=()=>{expanded.add(node.id);selectNode(c.id);expanded.add(c.id);renderTree()};children.append(b)})}
 $("#focusBtn").onclick=()=>focusBranch(id);renderTree()
}
function focusBranch(id){const n=nodeMap.get(id);expanded=new Set(descendants(n).filter(x=>x.children?.length).map(x=>x.id));expanded.add(id);selectNode(id);renderTree();$("#treeCanvas").scrollTop=0;$("#treeStatus").textContent="Gałąź: "+n.name}
function expandAll(){expanded=new Set([...nodeMap.values()].filter(n=>n.children?.length).map(n=>n.id));renderTree()}
function collapseAll(){expanded=new Set(["life"]);renderTree()}
function search(q){const box=$("#searchResults");box.replaceChildren();if(!q.trim()){box.hidden=true;return}const results=[...nodeMap.values()].filter(n=>(n.name+" "+(n.latin||"")).toLowerCase().includes(q.toLowerCase())).slice(0,12);box.hidden=false;if(!results.length){const d=document.createElement("div");d.className="search-result";d.textContent="Nie znaleziono — spróbuj innej nazwy.";box.append(d);return}results.forEach(n=>{const b=document.createElement("button");b.className="search-result";b.textContent=n.name;const sm=document.createElement("small");sm.textContent=n.latin||kindLabels[n.kind];b.append(sm);b.onclick=()=>{const meta=parentMap.get(n.id);expanded=new Set(meta.path.filter(p=>p.children?.length).map(p=>p.id));expanded.add(n.id);selectNode(n.id);renderTree();box.hidden=true;$("#searchInput").value="";$("#treeCanvas").scrollTop=0};box.append(b)})}
fetch("data/tree.json").then(r=>{if(!r.ok)throw Error("Nie udało się wczytać danych");return r.json()}).then(data=>{root=data;indexTree(root);renderTree();selectNode("life")}).catch(err=>{$("#treeCanvas").textContent="Nie udało się wczytać drzewa. Uruchom stronę przez GitHub Pages albo lokalny serwer, aby przeglądarka mogła odczytać data/tree.json.";console.error(err)});
$("#searchInput").addEventListener("input",e=>search(e.target.value));
document.querySelectorAll("[data-jump]").forEach(b=>b.addEventListener("click",()=>{const id=b.dataset.jump;const meta=parentMap.get(id);if(!meta)return;expanded=new Set(meta.path.filter(p=>p.children?.length).map(p=>p.id));expanded.add(id);selectNode(id);renderTree();$("#treeCanvas").scrollTop=0}));
$("#expandBtn").addEventListener("click",expandAll);$("#collapseBtn").addEventListener("click",collapseAll);$("#resetBtn").addEventListener("click",()=>{expanded=new Set(["life"]);selectNode("life");renderTree();$("#explorer").scrollIntoView({behavior:"smooth"})});
