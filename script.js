//You can edit ALL of the code here
const rootElem = document.getElementById("root");

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  for (let i = 0; i < episodeList.length; i++) {
    let episodeContainer = document.createElement("div"),
        episodeName = document.createElement("h2"),
        episodeImg = document.createElement("img"),
        episodeCode = "S" + episodeList[i].season.toString().padStart(2,"0") + "E" + episodeList[i].number.toString().padStart(2,"0");
    rootElem.classList.add("container");
    episodeContainer.classList.add("episode");
    episodeName.classList.add("name")
    episodeName.innerText = `${episodeList[i].name} - ${episodeCode} ` ;
    episodeImg.src = episodeList[i].image.medium;
    episodeContainer.append(episodeName,episodeImg);
    episodeContainer.innerHTML += episodeList[i].summary;
    rootElem.append(episodeContainer);
  }
  
}

window.onload = setup;
