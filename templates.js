function templatePokemon(pokemonID, pokemonName, pokemonImage, pokemonColor) {
    return /*html*/ `
    <div onclick="openPokemon(${pokemonID})" class="pokemon-box" style="background-color: ${pokemonColor}">
        <div class="name-id-box">
            <h1 id="pokemon-name">${pokemonName}</h1>
            <span id="pokemon-id">#${('0' + '0' + pokemonID).slice(-3)}</span>
        </div>
        <div id="pokemon-type-container-${pokemonID}" class="pokemon-type-container">
            <!-- hier rendern wir mit for-Schleife die Typen hinein -->
        </div>
        <img src="${pokemonImage}" alt="">
    </div>
`;
}