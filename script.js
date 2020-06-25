//You can edit ALL of the code here
// Global variables
const rootElem = document.getElementById("root");
let searchBox = document.getElementById("search");
const allEpisodes = getAllEpisodes();
const selectEpisode = document.getElementById("allEpisodes");
// first function gets executed as soon as the page is fully loaded.
function setup() {
  makePageForEpisodes(allEpisodes);
  // calling listEpisodes to populate the dropdown select input with options.
  listEpisodes(allEpisodes);
  // adding an event Listener to create a live search feature, using filter method through the array of episodes and utilising the 
  // string includes method inside a custom made function named search
  searchBox.addEventListener("input", () =>{
    let resultNumber = document.getElementById("resultNumber");
    let results = allEpisodes.filter(containsSearchTerm);
    makePageForEpisodes(results);
    resultNumber.innerText = `${results.length} / ${allEpisodes.length}`
    if(searchBox.value.length == 0 ) {
      resultNumber.innerText = "";
    };
  });
  // Adding event for the dropdown selector to show only selected episode.
  selectEpisode.addEventListener("change", ()=>{
    if(selectEpisode.value === "novalue"){
      makePageForEpisodes(allEpisodes);
    } else {
     let result =  allEpisodes.find((episode)=>{ return episode.id == selectEpisode.value});
     makePageForEpisodes(result);
    }
  })
}
// function to display episodes.
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = ""; // Clearing the main container
  for (let i = 0; i < episodeList.length; i++) {
    // declaring variables for each episode.
    let episodeContainer = document.createElement("div"), 
        episodeShadow = document.createElement("div"),
        episodeBody = document.createElement("div"),
        episodeTitle = document.createElement("div"),
        episodeN = document.createElement("div"),
        episodeNameCode = document.createElement("mediuem"),
        episodeImg = document.createElement("img"),
        episodeCode = "S" + episodeList[i].season.toString().padStart(2,"0") + "E" + episodeList[i].number.toString().padStart(2,"0");
    // adding classes to style the page.
    episodeContainer.classList.add("col-md-4");
    episodeShadow.classList.add("card", "mb-4", "shadow-sm");
    episodeImg.classList.add("bd-placeholder-img", "card-img-top");
    episodeBody.classList.add("card-body");
    episodeTitle.classList.add("d-flex", "justify-content-between", "align-items-center");
    episodeN.classList.add("btn-group", "name");
    episodeNameCode.classList.add("text-muted");
    episodeNameCode.id = "episodeNameCode";
    
    episodeTitle.id = "title";
    episodeTitle.append(episodeN,episodeNameCode);
    episodeNameCode.innerText = episodeCode;
    episodeN.innerText = episodeList[i].name ;
    episodeBody.innerHTML = episodeList[i].summary;
    episodeImg.src = episodeList[i].image.medium;
    episodeShadow.append(episodeTitle,episodeImg,episodeBody);
    episodeContainer.append(episodeShadow);
  
    // after the episode is ready it gets added to the main container.
    rootElem.append(episodeContainer);
  }  
}

// function to return episode code and name
function listEpisodes(episodes) {
  for(let i = 0; i<episodes.length; i++){
    let episodeCode = "S" + episodes[i].season.toString().padStart(2,"0") + "E" + episodes[i].number.toString().padStart(2,"0");
    let dropDownOption = document.createElement("option");
    dropDownOption.value = episodes[i].id;
    dropDownOption.innerText = `${episodeCode} - ${episodes[i].name}`; 
    selectEpisode.appendChild(dropDownOption);
  }
}
// this will return true or false based on user input.
function containsSearchTerm(episode){
  return (episode.summary.toLowerCase().includes(searchBox.value.toLowerCase()) || episode.name.toLowerCase().includes(searchBox.value.toLowerCase()))
}
window.onload = setup;
