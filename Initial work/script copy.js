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
    let results = allEpisodes.filter(search);
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
     let result =  allEpisodes.filter((episode)=>{ return episode.id == selectEpisode.value});
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
        episodeName = document.createElement("h2"),
        episodeImg = document.createElement("img"),
        episodeCode = "S" + episodeList[i].season.toString().padStart(2,"0") + "E" + episodeList[i].number.toString().padStart(2,"0");
    // adding classes to style the page.
    rootElem.classList.add("container");
    episodeContainer.classList.add("episode");
    episodeName.classList.add("name")
    // preparing the episode component
    episodeName.innerText = `${episodeList[i].name} - ${episodeCode} ` ;
    episodeImg.src = episodeList[i].image.medium;
    episodeContainer.append(episodeName,episodeImg);
    episodeContainer.innerHTML += episodeList[i].summary;
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
function search(episode){
  return (episode.summary.toLowerCase().includes(searchBox.value.toLowerCase()) || episode.name.toLowerCase().includes(searchBox.value.toLowerCase()))
}
window.onload = setup;
