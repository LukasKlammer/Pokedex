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
        if (i < numberOfAllPokemons) {
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
    renderAboutBox(i);
}


function renderTypes(i) {
    let pokemonTypes = allLoadedPokemon[i]['types'];

    for (let j = 0; j < pokemonTypes.length; j++) {
        const pokemonType = pokemonTypes[j]['type']['name'];
        document.getElementById('type-container').innerHTML += templateType(pokemonType);
    }
}


function renderAboutBox(i) {
    let aboutBox = document.getElementById('about-box');
    let weightInKg = allLoadedPokemon[i]['weight'] / 10; // because API gives weight in hectogram
    let heigtInCm = allLoadedPokemon[i]['height'] * 10; // API gives heigt in decimeters

    aboutBox.innerHTML = /*html*/ `
        <table>
            <tr>
                <td>Height</td>
                <td>${heigtInCm} cm</td>
            </tr>
            <tr>
                <td>Weight</td>
                <td>${weightInKg} kg</td>
            </tr>
            <tr id="abilities-table-row">
                <td>Abilities</td>
                <td id="abilities-box"></td>
            </tr>
        </table>
        <h4>Breeding</h4>
        <table>
            <tr>
                <td>Gender</td>
                <td>männlich, weiblich %</td>
            </tr>
            <tr>
                <td>Egg Groups</td>
                <td>Monster</td>
            </tr>
            <tr>
                <td>Egg Cycle</td>
                <td>Grass</td>
            </tr>
        </table>
    `;

    renderAbilities(i);
}

/**
 * Dies ist ein Test für JsDOC
 * 
 * @param {*integer} i This is the variable of current showed pokemon. 
 */
function renderAbilities(i) {
    let abilitiesBox = document.getElementById('abilities-box');
    let pokemonAbilities = allLoadedPokemon[i]['abilities'];
    let lastAbility; // variable for searching the last ability. Is needet for cut the semicolon at the end of the abilities-list

    if (pokemonAbilities.length > 0) {
            for (let j = 0; j < pokemonAbilities.length; j++) {
                const pokemonAbility = pokemonAbilities[j]['ability']['name'];
                abilitiesBox.innerHTML += /*html*/ `
                <span id="ability_${j}">${pokemonAbility},</span>
            `;
            lastAbility = `ability_${j}`;
        }
        console.log(lastAbility); //TODO: implement .slice method to cancel the last ,

    } else {
        document.getElementById('abilities-table-row').classList.add('d-none'); // if a pokemon hasn't any ability we don't need the table row with this data
    }
}


function favouriteOrUnfavourite(i) {
    alert('not yet implemented');
    let icon = document.getElementById('favourite-icon-detailcard');
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
function renderProperties(choice) {
    //TODO render the box with properties
    //make active the choosen link with javascript
    document.getElementById(choice).classList.add('choose-property-selected');
}