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
    await loadAllPokemonNames(); // loads all names, required for autocomplete field
    await loadPokemons(); // loads a part of the pokemon API
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


/**renders the home screen with all pokemons that we have already loadet */
function renderHomeScreen() {
    document.getElementById('pokemons-container').innerHTML = '';
    renderPokemon(allLoadedPokemon);
}

/**renders all pokemons that are in folder favourite pokemons */
function renderFavouritePokemons() {
    document.getElementById('pokemons-container').innerHTML = '';
    renderPokemon(favouritePokemons);
    allowLoadNextPokemons = false; // disables loading next pokemons, needet because we are at the bottom of the site
}


function renderSearchedPokemon() {
    let foundPokemon = getSearchedPokemon();
    // renderPokemon(foundPokemon);
}

/**loads pokemons from the api */
async function loadPokemons() {
    for (let ID = start; ID < stop; ID++) {
        let alreadyLoadetPokemon = allLoadedPokemon.find(pokemon => pokemon['id'] === ID);
        if (ID <= numberOfAllPokemons && alreadyLoadetPokemon == undefined) { // check, if we are at last available pokemon API element and if a pokemon isn't already loadet
            let foundPokemon = await loadPokemonByNameOrID(ID);
            allLoadedPokemon.push(foundPokemon);
        }
    }
    console.log(allLoadedPokemon);
}


/**
 * function fetches a single pokemon from the API. You can choose the to load pokemon by his name or ID
 * 
 * @param {string or number} nameOrID 
 * @returns object
 */
async function loadPokemonByNameOrID(nameOrID) {
    let url = `https://pokeapi.co/api/v2/pokemon/${nameOrID}`;
    let response = await fetch(url);
    foundPokemon = await response.json();
    return foundPokemon;
}


/**
 * sorts the array with the pokemons
 * 
 * @param {object} pokemons overgiven array with pokemons
 */
function sortPokemons(pokemons) {
    pokemons = pokemons.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    }); // Sortiertes Array

}


/**
 * renders the pokemon-cards, for example in home screen or favourites
 * 
 * @param {Object[]} toRenderPokemons the array with the pokemons, that we would render
 */
function renderPokemon(toRenderPokemons) {
    let pokemonsContainer = document.getElementById('pokemons-container');
    pokemonsContainer.innerHTML = '';
    sortPokemons(toRenderPokemons);

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


/**
 * renders the boxes with the types
 * 
 * @param {number} pokemonID 
 * @param {Object[]} pokemonTypes 
 */
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

/**loads the next 20 pokemons */
async function loadMorePokemon() {
    start += 20;
    stop += 20;
    await loadPokemons();
    renderPokemon(allLoadedPokemon);
}


/**function opens a specific pokemon (overlay) */
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


/**
 * renders the detail-card from a pokemon
 * 
 * @param {div} detailCardContainer the container, that we fill with innerHTML syntax
 * @param {number} ID from the to render pokemon
 */
async function renderDetailCard(detailCardContainer, ID) {
    await loadPokemonIfMissing(ID);
    let pokemon = allLoadedPokemon.find(pokemon => pokemon['id'] === ID);
    let type = pokemon['types'][0]['type']['name'];
    let pokemonColor = colors[type];
    detailCardContainer.innerHTML = templateDetailCard(pokemon, pokemonColor, ID);
    renderFavouriteIcon(ID);
    renderTypes(pokemon);
    renderProperties(ID, 'about'); // at first load render the pokemon properties "about"
}


async function loadPokemonIfMissing(ID) {
    let pokemon = allLoadedPokemon.find(pokemon => pokemon['id'] === ID);
    if (pokemon == undefined) { // load this pokemon, if it isn't already loadet
        let pokemon = await loadPokemonByNameOrID(ID);
        allLoadedPokemon.push(pokemon);
    }
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


function renderTypes(pokemon) {
    let pokemonTypes = pokemon['types'];

    for (let i = 0; i < pokemonTypes.length; i++) {
        const pokemonType = pokemonTypes[i]['type']['name'];
        document.getElementById('type-container').innerHTML += templateType(pokemonType);
    }
}


/**renders the properties in the pokemon detail card */
function renderProperties(ID, choice) {
    let pokemon = allLoadedPokemon.find(pokemon => pokemon['id'] === ID);
    let propertiesBox = document.getElementById('properties-box');
    propertiesBox.innerHTML = '';

    if (choice == 'about') {
        renderAboutBox(pokemon, propertiesBox);
        document.getElementById('about').classList.add('navigation-active');
    }
    else if (choice == 'basestats') {
        renderBaseStats(pokemon, propertiesBox);
    }
    else if (choice == 'evolution') {
        renderEvolution(pokemon, propertiesBox);
    }
    else if (choice == 'moves') {
        renderMoves(pokemon, propertiesBox);
    }

}


function renderAboutBox(pokemon, propertiesBox) {
    let heigtInCm = pokemon['height'] * 10; // API gives heigt in decimeters
    let weightInKg = pokemon['weight'] / 10; // because API gives weight in hectogram

    propertiesBox.innerHTML = templateAboutBox(heigtInCm, weightInKg);

    renderAbilities(pokemon);
}


/**
 * renders the abilities of one pokemon in the detail card
 * 
 * @param {object} pokemon This is the the current pokemon
 */
function renderAbilities(pokemon) {
    let abilitiesBox = document.getElementById('abilities-box');
    let pokemonAbilities = pokemon['abilities'];
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


function renderBaseStats(pokemon, propertiesBox) {
    let pokemonStats = pokemon['stats'];
    for (let i = 0; i < pokemonStats.length; i++) {
        const pokemonStatName = pokemonStats[i]['stat']['name'];
        const pokemonStat = pokemonStats[i]['base_stat'];
        propertiesBox.innerHTML += templateBaseStats(pokemonStatName, pokemonStat);
    }
}


/**
 * function decides, if by click on the heart icon a pokemon should be favourite or unfavourite
 * 
 * @param {number} ID  from the pokemon that we would make favourite or unfavourite
 */
function favouriteOrUnfavourite(ID) {
    let positionOfFavouritePokemon = arrayPositionFavouritePokemon(ID);
    let pokemon = allLoadedPokemon.find(pokemon => pokemon['id'] === ID)

    if (positionOfFavouritePokemon == -1) {
        addToFavourites(pokemon);
    }
    else {
        removeFromFavourites(positionOfFavouritePokemon);
    }
    renderFavouriteIcon(ID);
    saveInLocalStorage();
}


/**
 * searches a pokemon in the array favouritePokemons
 * 
 * @param {number} ID from the pokemon that we would find
 * @returns {number} returns the position of the pokemon in the favouritePokemons-array
 */
function arrayPositionFavouritePokemon(ID) {
    let positionInArray = favouritePokemons.findIndex(favPokemon => favPokemon['id'] === ID);
    return positionInArray;
}


function addToFavourites(pokemon) {
    favouritePokemons.push(pokemon);
}


function removeFromFavourites(positionOfFavouritePokemon) {
    favouritePokemons.splice(positionOfFavouritePokemon, 1);
}


/**searches the pokemons that user will load */
async function getSearchedPokemon() {
    let searchInput = document.getElementById('myInput').value;
    let foundPokemonNames = namesOfAllPokemon.filter(pokemon => pokemon.includes(searchInput));
    loadSearchedPokemons(foundPokemonNames);
}


/**
 * loads the pokemons that are found by searching by name
 * 
 * @param {array} pokemonNames all names of pokemons that should be rendered
 */
async function loadSearchedPokemons(pokemonNames) {
    let foundPokemons = [];

    for (let i = 0; i < pokemonNames.length; i++) {
        let pokemonName = pokemonNames[i];
        let foundPokemon = await loadPokemonByNameOrID(pokemonName);
        foundPokemons.push(foundPokemon);
    }
    renderPokemon(foundPokemons);
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


/**
 * this function changes the underline of the navigation links in the detail card
 * 
 * @param {string} clickedElement name of clicked link
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
