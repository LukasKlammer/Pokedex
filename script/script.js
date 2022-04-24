// let foundPokemon; // global variable, is needet in many functions
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


/**loads pokemons from the api */
async function loadPokemons() {
    for (let ID = start; ID < stop; ID++) {
        let alreadyLoadetPokemon = allLoadedPokemon.find(pokemon => pokemon['id'] === ID);
        if (ID <= numberOfAllPokemons && alreadyLoadetPokemon == undefined) { // check, if we are at last available pokemon API element and if a pokemon isn't already loadet
            let foundPokemon = await loadPokemonByNameOrID(ID);
            allLoadedPokemon.push(foundPokemon);
        }
    }
}


/**
 * function fetches a single pokemon from the API. You can choose the to load pokemon by his name or ID
 * 
 * @param {string or number} nameOrID name or ID from the pokemon that we want load - API requieres that
 * @returns object found pokekon with all infos
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





/**searches the pokemons that user will load in the array that containes all pokemon names */
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
