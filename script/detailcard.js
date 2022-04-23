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
        const baseStatName = pokemonStats[i]['stat']['name'];
        const baseStatValue = pokemonStats[i]['base_stat'];
        const percentage = (baseStatValue/255) * 100; // in my recherche i found that max. value for baseStats is 255  https://bulbapedia.bulbagarden.net/wiki/Base_stats#:~:text=A%20species'%20base%20stats%20range,Pok%C3%A9mon%20species%20has%20in%20battle.
        propertiesBox.innerHTML += templateBaseStats(baseStatName, baseStatValue, percentage);
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