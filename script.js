let currentPokemon; // global variable, is needet in many functions
let namesOfAllPokemon = []; // we load at the program-start all names --> needed for the autocomplete input field
let allLoadedPokemon = []; // here we push all the loaded pokemons. that are not all, because we load lazy
let favouritePokemons = [];  // we will push here the pokemons that we like much
let numberOfAllPokemons = 1126; // this number are all available pokemons in the API
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
    loadAllPokemonNames();
    await loadPokemon();
    sortPokemon();
    renderPokemon();
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
    renderPokemon();
}


function renderFavouritePokemons() {
    document.getElementById('pokemons-container').innerHTML = '';
    document.getElementById('pokemons-container').innerHTML = 'Funktion wird noch implementiert'
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


function sortPokemon() {
    allLoadedPokemon = allLoadedPokemon.sort(function (a, b) {
        return a - b
    });
}


/**renders the pokemons, that we have already loaded */
function renderPokemon() {
    let pokemonsContainer = document.getElementById('pokemons-container');
    pokemonsContainer.innerHTML = '';

    for (let i = 0; i < allLoadedPokemon.length; i++) {
        let pokemonID = allLoadedPokemon[i]['id'];
        let pokemonName = allLoadedPokemon[i]['name'];
        let pokemonImage = allLoadedPokemon[i]['sprites']['other']['home']['front_default'];
        let pokemonTypes = allLoadedPokemon[i]['types'];
        let pokemonMainType = allLoadedPokemon[i]['types'][0]['type']['name'];
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
    sortPokemon();
    renderPokemon();
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

    detailCardContainer.innerHTML = templateDetailCard(i, pokemonColor);

    renderTypes(i);
    renderProperties(i, 'about'); // at first load render the pokemon properties "about"
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


function favouriteOrUnfavourite(i) {
    let icon = document.getElementById('favourite-icon-detailcard');
    addToFavourites(i);
    saveInLocalStorage();
    console.log(favouritePokemons);

    // if (favouritePokemons contains pokemon i) {
    //     unfavourite
    //      change icon
    // }
    // else {
    //     favourite
    //      change icon
    // }
}


function addToFavourites(i) {
    let toAddPokemon = allLoadedPokemon[i];
    favouritePokemons.push(toAddPokemon);

}


function removeFromFavourites() {

}


function searchInFavourites() {

}


function searchPokemon() {
    let searchItem = document.getElementById('search-input').value;
}


function hideMagnifyingGlass() {
    document.getElementById('magnifying-glass').classList.add('d-none');
}


function showMagnifyingGlass() {
    document.getElementById('magnifying-glass').classList.remove('d-none');
}


function deleteSearchInput() {
    document.getElementById('search-input').value = '';
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