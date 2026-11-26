const menubutton=document.getElementById("menubutton");
const menupanel=document.getElementById("menupanel");
const statsoutput=document.getElementById("statsoutput");
const platformselect=document.getElementById("platformselect");
const gamemodeselect=document.getElementById("gamemodeselect");
const regionselect=document.getElementById("regionselect");
const statstable=document.getElementById("statstable");
const statsbody=document.getElementById("statsbody");
let data=[];
let herostats=[];
let heroicons={};


async function fetchAllheroesStats(platform,gamemode,region){
    herostats=[];
    try{
        const response= await fetch(`https://overfast-api.tekrop.fr/heroes/stats?platform=${platform}&gamemode=${gamemode}&region=${region}`);
        if(response.ok){
            herostats = await response.json();
            console.log(herostats);
        }else{
            throw new Error("Cant fetch All heros stats !");
        }
    }
    catch(error){
        console.error(error);
    }
}

async function fetchHeroIcons(){
    try{
        const response = await fetch("https://overfast-api.tekrop.fr/heroes");
        if(!response.ok) throw new Error("Cant fetch heroes list");
        const list = await response.json();
        list.forEach( hero =>{
            heroicons[hero.key]={ name:hero.name, portrait:hero.portrait };
            //console.log(hero.key);
        });
        //console.log(heroicons);
    }
    catch(error){
        console.error(error);
    }
}

async function getAllHeroStats(){
    statstable.hidden=true;
    statsoutput.textContent="Loading...";
    await fetchHeroIcons();
    await fetchAllheroesStats(platformselect.value,gamemodeselect.value,regionselect.value);
    if(herostats.length<1){
        statsoutput.textContent="Could not load stats , try again !";
        return;
    }
    statsoutput.textContent="";
    showstats();
}

function togglemenu(){
    menupanel.hidden=!menupanel.hidden;
}

document.addEventListener("click", event=>{
    if(event.target!=menubutton && !menupanel.contains(event.target)) menupanel.hidden=true;
})

function createcell(value, colorclass){
    const td=document.createElement("td");
    const text=document.createElement("span");
    text.textContent=`${value ?? "/"}`;
    const bar=document.createElement("div");
    bar.className="bar";
    const fill=document.createElement("div");
    fill.className=colorclass;
    fill.style.width=`${Math.min(value ?? 0, 100)}%`;
    bar.appendChild(fill);
    td.append(text, bar);
    return td;
}

function showstats(){
    statsbody.innerHTML="";
    herostats.forEach( h =>{
        const info=heroicons[h.hero];
        const row=document.createElement("tr");
        const herocell=document.createElement("td");
        herocell.className="herocell";
        if(info?.portrait){
            const img=document.createElement("img");
            img.src=info.portrait;
            img.alt="";
            herocell.appendChild(img);
        }
        const name=document.createElement("span");
        name.textContent=info?.name ?? h.hero ?? "-";
        herocell.appendChild(name);

        row.appendChild(herocell);
        row.appendChild(createcell(h.pickrate, "fillpick"));
        row.appendChild(createcell(h.winrate, "fillwin"));
        row.appendChild(createcell(h.banrate, "fillban"));
        statsbody.appendChild(row);
    });
    statstable.hidden=false;
    arrangtable("descending","Win rate")
    //const tablelength=statstable.rows.length;
    //console.log(`length : ${tablelength}`);
    //let i=30;
    //console.log(`row [${i}] : ${statstable.rows[i]}`)
}

function getvalue(row,line){
    return parseFloat(row.cells[line].textContent) || 0;
}

function swaprows(a,b){
    const newtr = document.createElement("tr");
    a.replaceWith(newtr);
    b.replaceWith(a);
    newtr.replaceWith(b);
}

function arrangtable(type,tableLine){
    statstable.querySelectorAll("th").forEach(x=>{
        if(x.textContent.trim()!==`${tableLine} %`) delete x.dataset.order;
    })
    const line=[...statstable.rows[0].cells].findIndex(x=>x.textContent.trim()===`${tableLine} %`);
    if (line<1) return;
    switch (type){
        case "ascending":
            for(let i=1;i<statstable.rows.length;i++){
                for(let j=i;j<statstable.rows.length;j++){
                    if(getvalue(statstable.rows[j],line)<getvalue(statstable.rows[i],line)){
                       swaprows(statstable.rows[i],statstable.rows[j]);
                    }
                }
            }
            break;
        case "descending":
           for(let i=1;i<statstable.rows.length;i++){
                for(let j=i;j<statstable.rows.length;j++){
                    if(getvalue(statstable.rows[j],line)>getvalue(statstable.rows[i],line)){
                       swaprows(statstable.rows[i],statstable.rows[j]);
                    }
                }
            }
            break;
    }

}

