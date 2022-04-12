let currentPokemon; // global variable, is needet in many functions
let namesOfAllPokemon = [];
let allPokemon = [];
let start = 1;
let stop = 21;

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


function init() {
    loadAllPokemonNames();
    loadPokemon();
}

/**loads all Pokemon-Names. Over 1000 Names. Pushs them in an array. Necessary for autocomplete-input-field */
async function loadAllPokemonNames() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let response = await fetch(url);
    let pokemons = await response.json();
    for (let i = 0; i < pokemons['results'].length; i++) {
        singlePokemonName = pokemons['results'][i]['name'];
        namesOfAllPokemon.push(singlePokemonName);
    }
}


function renderHomeScreen() {
    document.getElementById('pokemons-container').innerHTML = '';
    start = 1;  // könnte man vielleicht bereits geladene Dateien rendern? Cache?
    stop = 21;
    loadPokemon();
}


function renderFavouritePokemons() {
    document.getElementById('pokemons-container').innerHTML = '';
    document.getElementById('pokemons-container').innerHTML = 'Funktion wird noch implementiert'
}

async function loadPokemon() {
    for (let i = start; i < stop; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        renderPokemon();
    }
}


function renderPokemon() {
    let pokemonID = currentPokemon['id'];
    let pokemonName = currentPokemon['name'];
    let pokemonImage = currentPokemon['sprites']['front_shiny'];
    let pokemonTypes = currentPokemon['types'];
    let pokemonMainType = currentPokemon['types'][0]['type']['name'];
    let pokemonColor = colors[pokemonMainType];

    let pokemonsContainer = document.getElementById('pokemons-container');

    pokemonsContainer.innerHTML += templatePokemon(pokemonID, pokemonName, pokemonImage, pokemonColor);
    renderPokemonTypes(pokemonID, pokemonTypes);
}


function renderPokemonTypes(pokemonID, pokemonTypes) {
    for (let j = 0; j < pokemonTypes.length; j++) {
        const pokemonType = pokemonTypes[j]['type']['name'];
        document.getElementById(`pokemon-type-container-${pokemonID}`).innerHTML += /*html*/ `
            <span class="type">${pokemonType}</span>
        `;
    }

}

/**when you are near the bottom of Site --> load more Pokemons */
function lazyLoading() {
    if ((window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight) {
        loadMorePokemon();
    }
}


function loadMorePokemon() {
    start += 20;
    stop += 20;
    loadPokemon();
}


function openPokemon(i) {
    alert('noch nicht implementiert - Nummer: ' + i);
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