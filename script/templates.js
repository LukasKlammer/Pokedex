function templatePokemon(i, pokemonID, pokemonName, pokemonImage, pokemonColor) {
    return /*html*/ `
    <div onclick="openPokemon(${pokemonID}, '${pokemonName}')" class="pokemon-box" style="background-color: ${pokemonColor}">
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


function templateDetailCard(pokemon, pokemonColor, ID) {
    return /*html*/ `
        <div id="pokemon-detail-card">
            <div class="pokemon-detail-card-top" style="background-color: ${pokemonColor}">
                <div class="arrow-and-heart">
                    <img src="img/arrow-back.png" onclick="closeOverlay()" alt="closeArrow">
                    <img id='favourite-icon-detailcard' src="" onclick="favouriteOrUnfavourite(${ID})">
                </div>
                <div class="name-types-id-box">
                    <div class="name-types-box">
                        <h1>
                            ${pokemon['name']}
                        </h1>
                        <div id="type-container">
                            <!-- here we render with for all the types -->
                        </div>
                    </div>
                    <span class="pokemon-id">
                        #${('0' + '0' + ID).slice(-3)}
                    </span>
                </div>
            </div>
            <div class="pokemon-detail-card-bottom">
                <div class="pokemon-image-box">
                    <img class="pokemon-image" src="${pokemon['sprites']['other']['home']['front_default']}" alt="pokemonimage">
                </div>
                <div class="choose-properties">
                    <h4 class="navigation-link" id="about" onclick="renderProperties(${ID}, 'about'); changeNavigation(this)">about</h4>
                    <h4 class="navigation-link" id="basestats" onclick="renderProperties(${ID}, 'basestats'); changeNavigation(this)">basestats</h4>
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


function templateBaseStats(baseStatName, baseStatValue, percentage) {
    return /*html*/ `
    <div class="pokemon-stat">
        <span class="pokemon-stat-name">
            ${baseStatName}
        </span>
        <div class="progress">
            <div class="progress-bar" id="progress-bar-${baseStatName}" role="progressbar" style="width: ${percentage}%">
                ${baseStatValue}
            </div>
        </div>
        <span>
            255
        </span>
    </div>
`;
}