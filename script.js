let currentPokemon; // globale Variable, brauchen wir in mehreren Funktionen
let namesOfAllPokemon = [];
let start = 1;
let stop = 21;

function init() {
    loadAllPokemonNames();
    loadPokemon();
}

/**lädt mit eigener Abfrage alle Namen der Pokemons. Über 1000 Namen. Pusht sie ein eigenes Array. Nötig für autocomplete im input Feld */
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
    let pokemonImage = currentPokemon['sprites']['front_shiny'];
    let pokemonName = currentPokemon['name'];
    let pokemonTypes = currentPokemon['types'];
    let pokemonID = currentPokemon['id'];
    let pokemonsContainer = document.getElementById('pokemons-container');

    pokemonsContainer.innerHTML += templatePokemon(pokemonID, pokemonName, pokemonImage);
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