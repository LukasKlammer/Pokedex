let foundPokemon; // global variable, is needet in many functions
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
    let foundPokemon = getSearchedPokemon();
    // renderPokemon(foundPokemon);
}


async function loadPokemon() {
    for (let i = start; i < stop; i++) {
        if (i <= numberOfAllPokemons) { // check, if we are at last available pokemon API element
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            let response = await fetch(url);
            foundPokemon = await response.json();
            allLoadedPokemon.push(foundPokemon);
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


function openPokemon(ID, name) {
    openOverlay();
    let detailCardContainer = document.getElementById('pokemon-detail-card'); // brings the whole card to a variable
    detailCardContainer.addEventListener("click", stopEvent, false); // adds a event listener: when someone clicks the funktion stopEvent will be called
    renderDetailCard(detailCardContainer, ID, name);
}


/**prevents closing the overlay clicking on the pokemon detail card */
function stopEvent(ev) {
    ev.stopPropagation();
}


async function renderDetailCard(detailCardContainer, ID, name) {
    let i = ID - 1;
    if (allLoadedPokemon[i] == undefined) { // load this pokemon, if it isn't already loadet
        let foundPokemon = await loadPokemonByName(name);
        allLoadedPokemon[i] = foundPokemon;
    }
    let pokemonColor = colors[allLoadedPokemon[i]['types'][0]['type']['name']];
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


async function getSearchedPokemon() {
    let searchInput = document.getElementById('myInput').value;
    let foundPokemonNames = namesOfAllPokemon.filter(pokemon => pokemon.includes(searchInput));
    console.log(foundPokemonNames);
    loadSearchedPokemons(foundPokemonNames);
}


async function loadSearchedPokemons(pokemonNames) {
    let foundPokemons = [];

    for (let i = 0; i < pokemonNames.length; i++) {
        let pokemonName = pokemonNames[i];
        let foundPokemon = await loadPokemonByName(pokemonName);
        foundPokemons.push(foundPokemon);
    }
    console.log(foundPokemons);
    renderPokemon(foundPokemons);
}


async function loadPokemonByName(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    foundPokemon = await response.json();
    return foundPokemon;
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
