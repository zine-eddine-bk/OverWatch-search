const menubutton=document.getElementById("menubutton");
const menupanel=document.getElementById("menupanel");
const statsoutput=document.getElementById("statsoutput");
const platformselect=document.getElementById("platformselect");
const gamemodeselect=document.getElementById("gamemodeselect");
const regionselect=document.getElementById("regionselect");
let data=[];
let herostats=[];


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

async function getAllHeroStats(){
    statsoutput.textcontent="Loading...";
    await fetchAllheroesStats(platformselect.value,gamemodeselect.value,regionselect.value);
    if(herostats.length<1){
        statsoutput.textContent="Could not load stats , try again !";
        return;
    }
    statsoutput.textContent=JSON.stringify(herostats,null,2);
}

function togglemenu(){
    menupanel.hidden=!menupanel.hidden;
}

document.addEventListener("click", event=>{
    if(event.target!=menubutton && !menupanel.contains(event.target))menupanel.hidden=true;
})