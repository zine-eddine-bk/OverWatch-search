const menubutton=document.getElementById("menubutton");
const menupanel=document.getElementById("menupanel");
const input=document.getElementById("searchinput");
const output=document.getElementById("searchoutput");
const heroicon=document.getElementById("resulticonimg");
const herocard=document.getElementById("herocard");
const herowideimg=document.getElementById("resultwideimg");
const outputname=document.getElementById("heroname");
const outputrole=document.getElementById("herorole");
const outputsubrole=document.getElementById("herosubrole");
const outputdescription=document.getElementById("herodescription");
const outputage=document.getElementById("heroage");
const outputbirthday=document.getElementById("herobirthday");
const outputlocat=document.getElementById("herolocat");
let data=[];
let herodata={};
let herostats=[];

async function fetchAllHeroesDataOnline(){
    try{
        const response = await fetch("https://overfast-api.tekrop.fr/heroes");
        if(response.ok){
            data = await response.json();
            //console.log(data);
        }else{
            throw new Error("Cant fetch All Heroes Data !");
        }
    }
    catch(error){
        console.error(error);
    }
}


async function fetchHeroData(herokey){
    herodata={};
    try{
        const response = await fetch(`https://overfast-api.tekrop.fr/heroes/${herokey}`);
        if(!response.ok) throw new Error(`Cant fetch ${herokey} Data`);
        herodata = await response.json();
        //console.log(herodata);
        return true;
    }
    catch(error){
        console.error(error);
        return false;
    }
}

/*function checkExiste(heroname){
    let isExist=false;
    if(data.length<1) return isExist;
    data.forEach( d =>{
        if(d.name.toLowerCase() === heroname.toLowerCase()) isExist=true;
    });
    return isExist;
}*/

function getindex(heroname){
    if(data.length<1) return -1;
    return data.findIndex( d=> 
        d.name.toLowerCase() === heroname.toLowerCase() );
    
}

async function search(){
    let tosearch = input.value.trim().replace(/\s+/g, " ");
    output.textContent="";
    if(data.length<1){
      output.textContent="Loading heroes, try again in a moment...";
      return;
    }
    if(getindex(tosearch)== -1){
        output.textContent="invalid hero name !!";
        heroicon.hidden=true;
        herocard.hidden=true;
    }else{
        const i=getindex(tosearch);
        const hero_key=data[i].key;
        //console.log(`the hero ${tosearch} index in Data is ${i}`);
        const name=data[i].name;
        const role=data[i].role;
        const subrole=data[i].subrole;
        const portrait=data[i].portrait;
        const isherodatafetched= await fetchHeroData(hero_key);
        if(!isherodatafetched){
            output.textContent="Couldnt load hero informations , pleas try again!";
            return;
        }
        const age=herodata.age;
        const birthday=herodata.birthday;
        const location=herodata.location;
        const description=herodata.description;
        const wideportrait=herodata.backgrounds[1].url;
        heroicon.src=portrait;
        herowideimg.src=wideportrait;
        heroicon.hidden=false;
        herocard.hidden=false;
         //showing results
        outputname.textContent=name;
        outputage.textContent=`Age: ${age}`;
        outputrole.textContent=role;
        outputsubrole.textContent=subrole;
        outputdescription.textContent=description;
        outputbirthday.textContent=`Birthday: ${birthday}`;
        outputlocat.textContent=`Location: ${location}`;
        /*
        console.log(wideportrait);
         console.log(`------------------`);
        console.log(`Name: ${name}`);
        console.log(`Role: ${role}`);
        console.log(`Subrole: ${subrole}`);
        console.log(`Description: ${description}`);
        console.log(`Age: ${age}`);
        console.log(`BirthDay: ${birthday}`);
        console.log(`Locat: ${location}`);
         console.log(`------------------`);
        */
    }
}

input.addEventListener("keydown", event =>{
    if (event.key==="Enter") search();
})

function togglemenu(){
    menupanel.hidden=!menupanel.hidden;
}

document.addEventListener("click", event=>{
    if(event.target!=menubutton && !menupanel.contains(event.target))menupanel.hidden=true;
})

fetchAllHeroesDataOnline();
fetchAllheroesStats();
