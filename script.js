let currentPokemon; // globale Variable, brauchen wir in mehreren Funktionen

async function loadPokemon() {

    for (let i = 1; i < 10; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        console.log(response.ok); // gibt true oder false zurück, nachdem fetch() ausgeführt wurde
        console.log(response.status); // gibt Status-Code zurück, nachdem fetch() ausgeführt wurde (z. B. 404 wenn Tippfehler in url)
        currentPokemon = await response.json();
        console.log(currentPokemon);

        renderPokemonInfo();

    }
    

}


function renderPokemonInfo() {
    let pokemonImage = currentPokemon['sprites']['front_shiny'];
    let pokemonName = currentPokemon['name'];
    let pokemonType = currentPokemon['types'][0]['type']['name'];
    let pokemonID = currentPokemon['id'];

    document.getElementById('pokemons-container').innerHTML += /*html*/ `
        <div class="pokemon-box">
            <span>${pokemonID}</span>
            <img class="pokemon-image" src="${pokemonImage}" alt="">
            <span class="pokemon-name">${pokemonName}</span>
            <div class="pokemon-type-container">
                <div id="pokemon-type">${pokemonType}</div>
            </div>
        </div>

    `;
}


function loadMorePokemon() {
    //TODO: wenn im body ganz unten oder per Knopfdruck 20 Pokemon mehr laden
}
