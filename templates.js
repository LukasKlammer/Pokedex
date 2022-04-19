function templatePokemon(i, pokemonID, pokemonName, pokemonImage, pokemonColor) {
    return /*html*/ `
    <div onclick="openPokemon(${i})" class="pokemon-box" style="background-color: ${pokemonColor}">
        <div class="name-id-box">
            <h1 id="pokemon-name">${pokemonName}</h1>
            <span class="pokemon-id" id="pokemon-id">#${('0' + '0' + pokemonID).slice(-3)}</span>
        </div>
        <div id="pokemon-type-container-${pokemonID}" class="pokemon-type-container">
            <!-- hier rendern wir mit for-Schleife die Typen hinein -->
        </div>
        <img src="${pokemonImage}" alt="">
    </div>
`;
}


function templateType(pokemonType) {
    return  /*html*/ `
    <p class="type">${pokemonType}</p>
`;
}


function templateDetailCard(i, pokemonColor) {
    return /*html*/ `
        <div id="pokemon-detail-card">
            <div class="pokemon-detail-card-top" style="background-color: ${pokemonColor}">
                <div class="arrow-and-heart">
                    <img src="img/arrow-back.png" onclick="closeOverlay()" alt="closeArrow">
                    <img id='favourite-icon-detailcard' src="img/baseline_favorite_border_white_48dp.png" onclick="favouriteOrUnfavourite(${i}, ${allLoadedPokemon[i]['id']})">
                </div>
                <div class="name-types-id-box">
                    <div class="name-types-box">
                        <h1>
                            ${allLoadedPokemon[i]['name']}
                        </h1>
                        <div id="type-container">
                            <!-- here we render with for all the types -->
                        </div>
                    </div>
                    <span class="pokemon-id">
                        #${('0' + '0' + allLoadedPokemon[i]['id']).slice(-3)}
                    </span>
                </div>
            </div>
            <div class="pokemon-detail-card-bottom">
                <div class="pokemon-image-box">
                    <img class="pokemon-image" src="${allLoadedPokemon[i]['sprites']['other']['home']['front_default']}" alt="pokemonimage">
                </div>
                <div class="choose-properties">
                    <h4 class="navigation-link" id="about" onclick="renderProperties(${i}, 'about'); changeNavigation(this)">about</h4>
                    <h4 class="navigation-link" id="basestats" onclick="renderProperties(${i}, 'basestats'); changeNavigation(this)">basestats</h4>
                    <h4 class="navigation-link" id="evolution" onclick="renderProperties(${i}, 'evolution'); changeNavigation(this)">evolution</h4>
                    <h4 class="navigation-link" id="moves" onclick="renderProperties(${i}, 'moves'); changeNavigation(this)">moves</h4>
                </div>
                <div id="properties-box">
                    <!-- rendered with an own function -->
                </div>
            </div>
        </div>
    </div>
    `;
}


function templateAboutBox(heigtInCm, weightInKg) {
    return /*html*/ `
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
    `;
}


function templateAbilities(j, pokemonAbility) {
    return /*html*/ `
        <span id="ability_${j}">${pokemonAbility},</span>
    `;
}


function templateBaseStats() {
    return /*html*/ `
        <span>BaseStats zu implementieren (TODO)</span>
    `;
}


function templateEvolution() {
    return /*html*/ `
        <span>Evolution zu implementieren (TODO)</span>
    `;
}


function templateMoves() {
    return /*html*/ `
        <span>Moves zu implementieren (TODO)</span>
    `;
}