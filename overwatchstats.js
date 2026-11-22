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

fetchHeroIcons();

async function getAllHeroStats(){
    statstable.hidden=true;
    statsoutput.textContent="Loading...";
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
    if(event.target!=menubutton && !menupanel.contains(event.target))menupanel.hidden=true;
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
}