let currentPokemon; // global variable, is needet in many functions
let allLoadedPokemon = []; // here we push all the loaded pokemons. that are not all, because we load lazy
let favouritePokemons = [];  // we will push here the pokemons that we like much
let numberOfAllPokemons = 1126; // this number are all available pokemons in the API
let namesOfAllPokemon = []; // we load at the program-start all names --> needed for the autocomplete input field
let start = 1;
let stop = 21;
let allowLoadNextPokemons = false;

let colors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
}


async function init() {
    loadFromLocalStorage();
    await loadAllPokemonNames();
    await loadPokemon();
    sortPokemon(allLoadedPokemon);
    renderPokemon(allLoadedPokemon);
    autocomplete(document.getElementById("myInput"), namesOfAllPokemon);
}


/**loads all Pokemon-Names. Over 1000 Names. Pushs them in an array. Necessary for autocomplete-input-field */
async function loadAllPokemonNames() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${numberOfAllPokemons}`;
    let response = await fetch(url);
    let pokemons = await response.json();
    for (let i = 0; i < pokemons['results'].length; i++) {
        singlePokemonName = pokemons['results'][i]['name'];
        namesOfAllPokemon.push(singlePokemonName);
    }
}


function renderHomeScreen() {
    document.getElementById('pokemons-container').innerHTML = '';
    renderPokemon(allLoadedPokemon);
}


function renderFavouritePokemons() {
    document.getElementById('pokemons-container').innerHTML = '';
    renderPokemon(favouritePokemons);
    allowLoadNextPokemons = false;
}


function renderSearchedPokemon() {
    let foundPokemon = getSearchedPokemons();
    // renderPokemon(foundPokemon);
}


async function loadPokemon() {
    for (let i = start; i < stop; i++) {
        if (i <= numberOfAllPokemons) { // check, if we are at last available pokemon API element
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            let response = await fetch(url);
            currentPokemon = await response.json();
            allLoadedPokemon.push(currentPokemon);
        }
    }
    console.log(allLoadedPokemon);
}


function sortPokemon(toSortPokemon) {
    toSortPokemon = toSortPokemon.sort(function (a, b) {
        return a - b
    });
}


/**renders the pokemons, that we have already loaded */
function renderPokemon(toRenderPokemons) {
    let pokemonsContainer = document.getElementById('pokemons-container');
    pokemonsContainer.innerHTML = '';

    for (let i = 0; i < toRenderPokemons.length; i++) {
        let pokemonID = toRenderPokemons[i]['id'];
        let pokemonName = toRenderPokemons[i]['name'];
        let pokemonImage = toRenderPokemons[i]['sprites']['other']['home']['front_default'];
        let pokemonTypes = toRenderPokemons[i]['types'];
        let pokemonMainType = toRenderPokemons[i]['types'][0]['type']['name'];
        let pokemonColor = colors[pokemonMainType];

        pokemonsContainer.innerHTML += templatePokemon(i, pokemonID, pokemonName, pokemonImage, pokemonColor);
        renderPokemonTypes(pokemonID, pokemonTypes);
    }
    allowLoadNextPokemons = true; // after the rendering of all pokemon it is possible to load next pokemon
}


function renderPokemonTypes(pokemonID, pokemonTypes) {
    for (let j = 0; j < pokemonTypes.length; j++) {
        const pokemonType = pokemonTypes[j]['type']['name'];
        document.getElementById(`pokemon-type-container-${pokemonID}`).innerHTML += templateType(pokemonType);
    }
}


/**when you are near the bottom of Site --> load more Pokemons */
function lazyLoading() {
    if ((window.innerHeight + window.scrollY + 300) >= document.body.offsetHeight && allowLoadNextPokemons) {
        allowLoadNextPokemons = false;
        loadMorePokemon();
    }
}


async function loadMorePokemon() {
    start += 20;
    stop += 20;
    await loadPokemon();
    sortPokemon(allLoadedPokemon);
    renderPokemon(allLoadedPokemon);
}


function openPokemon(i) {
    openOverlay();
    let detailCardContainer = document.getElementById('pokemon-detail-card'); // brings the whole card to a variable
    detailCardContainer.addEventListener("click", stopEvent, false); // adds a event listener: when someone clicks the funktion stopEvent will be called
    renderDetailCard(detailCardContainer, i);
}


/**prevents closing the overlay clicking on the pokemon detail card */
function stopEvent(ev) {
    ev.stopPropagation();
}


function renderDetailCard(detailCardContainer, i) {
    let pokemonColor = colors[allLoadedPokemon[i]['types'][0]['type']['name']];
    let ID = allLoadedPokemon[i]['id'];

    detailCardContainer.innerHTML = templateDetailCard(i, pokemonColor, ID);
    renderFavouriteIcon(ID);
    renderTypes(i);
    renderProperties(i, 'about'); // at first load render the pokemon properties "about"
}


function renderFavouriteIcon(ID) {
    let positionOfFavouritePokemon = arrayPositionFavouritePokemon(ID);
    let icon = document.getElementById('favourite-icon-detailcard');

    if (positionOfFavouritePokemon == -1) {  // if the Pokemon isn't part of the favourites
        icon.src = 'img/baseline_favorite_border_white_48dp.png';
    }
    else {
        icon.src = 'img/baseline_favorite_red_48dp.png';
    }
}


function renderTypes(i) {
    let pokemonTypes = allLoadedPokemon[i]['types'];

    for (let j = 0; j < pokemonTypes.length; j++) {
        const pokemonType = pokemonTypes[j]['type']['name'];
        document.getElementById('type-container').innerHTML += templateType(pokemonType);
    }
}


function renderAboutBox(i, propertiesBox) {
    let heigtInCm = allLoadedPokemon[i]['height'] * 10; // API gives heigt in decimeters
    let weightInKg = allLoadedPokemon[i]['weight'] / 10; // because API gives weight in hectogram

    propertiesBox.innerHTML = templateAboutBox(heigtInCm, weightInKg);

    renderAbilities(i);
}


/**
 * renders the abilities of one pokemon in the detail card
 * 
 * @param {integer} i This is the variable of current showed pokemon. 
 */
function renderAbilities(i) {
    let abilitiesBox = document.getElementById('abilities-box');
    let pokemonAbilities = allLoadedPokemon[i]['abilities'];
    let lastAbilityID; // variable for searching the last ability. Is needet to remove the semicolon at the end of the abilities-list

    if (pokemonAbilities.length > 0) {
        for (let j = 0; j < pokemonAbilities.length; j++) {
            const pokemonAbility = pokemonAbilities[j]['ability']['name'];
            abilitiesBox.innerHTML += templateAbilities(j, pokemonAbility);
            lastAbilityID = `ability_${j}`;
        }
        document.getElementById(lastAbilityID).innerHTML = document.getElementById(lastAbilityID).innerHTML.slice(0, -1); // removes the semicolon at last ability
    } else {
        document.getElementById('abilities-table-row').classList.add('d-none'); // if a pokemon hasn't any ability we don't need the table row with this data
    }
}


function renderBaseStats(i, propertiesBox) {
    propertiesBox.innerHTML = templateBaseStats();
}


function renderEvolution(i, propertiesBox) {
    propertiesBox.innerHTML = templateEvolution();
}


function renderMoves(i, propertiesBox) {
    propertiesBox.innerHTML = templateMoves();
}


function favouriteOrUnfavourite(i, ID) {
    let positionOfFavouritePokemon = arrayPositionFavouritePokemon(ID);

    if (positionOfFavouritePokemon == -1) {
        addToFavourites(i);
    }
    else {
        removeFromFavourites(positionOfFavouritePokemon);
    }
    sortPokemon(favouritePokemons); // TODO: check sort function
    renderFavouriteIcon(ID);
    saveInLocalStorage();
}


function arrayPositionFavouritePokemon(ID) {
    let positionInArray = -1; // -1 is the symbol if we don't find a Pokemon in Favourites

    for (let j = 0; j < favouritePokemons.length; j++) {
        if (favouritePokemons[j]['id'] == ID) {
            positionInArray = j;
        }
    }
    return positionInArray;
}


function addToFavourites(i, icon) {
    let toAddPokemon = allLoadedPokemon[i];
    favouritePokemons.push(toAddPokemon);
}


function removeFromFavourites(positionOfFavouritePokemon, icon) {
    favouritePokemons.splice(positionOfFavouritePokemon, 1);
}


async function getSearchedPokemons() {
    let searchInput = document.getElementById('myInput').value;
    let foundPokemonNames = namesOfAllPokemon.filter(pokemon => pokemon.includes(searchInput));
    console.log(foundPokemonNames);

}


function hideMagnifyingGlass() {
    document.getElementById('magnifying-glass').classList.add('d-none');
}


function showMagnifyingGlass() {
    document.getElementById('magnifying-glass').classList.remove('d-none');
}


function deleteSearchInput() {
    document.getElementById('myInput').value = '';
}


function closeOverlay() {
    document.getElementById('pokemon-detail-card').innerHTML = '';
    document.getElementById('overlay').classList.add('d-none');
}


function openOverlay() {
    document.getElementById('overlay').classList.remove('d-none');
}


/**renders the properties in the pokemon detail card */
function renderProperties(i, choice) {

    let propertiesBox = document.getElementById('properties-box');
    propertiesBox.innerHTML = '';

    if (choice == 'about') {
        renderAboutBox(i, propertiesBox);
        document.getElementById('about').classList.add('navigation-active');
    }
    else if (choice == 'basestats') {
        renderBaseStats(i, propertiesBox);
    }
    else if (choice == 'evolution') {
        renderEvolution(i, propertiesBox);
    }
    else if (choice == 'moves') {
        renderMoves(i, propertiesBox);
    }

}

/**
 * this function changes the underline of the navigation links in the detail card
 * 
 * @param {} clickedElement this variable comes from the html part (this)
 */
function changeNavigation(clickedElement) {
    const links = document.getElementsByClassName('navigation-link')
    for (const link of links) {
        link.classList.remove('navigation-active')
    }
    clickedElement.classList.add('navigation-active')
}


function saveInLocalStorage() {
    let favouritePokemonsAsText = JSON.stringify(favouritePokemons);
    localStorage.setItem('favourites', favouritePokemonsAsText);
}


function loadFromLocalStorage() {
    let favouritePokemonsAsText = localStorage.getItem('favourites');
    if (favouritePokemonsAsText) {
        favouritePokemons = JSON.parse(favouritePokemonsAsText);
    }
}


function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }