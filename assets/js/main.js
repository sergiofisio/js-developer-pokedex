const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonLists = [];

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map(type => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
    for (const pokemon of pokemons) {
      pokemonLists.push(pokemon);
    }

    const pokemonItems = pokemonList.querySelectorAll(".pokemon");
    pokemonItems.forEach(pokemonItem => {
      console.log(pokemonItem);
      pokemonItem.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        const closeBtn = "./assets/closeBtn.svg";
        const pokemonId = pokemonItem.dataset.pokemonId;
        console.log(pokemonId);
        const clickedPokemon = pokemonLists.find(
          pokemon => Number(pokemon.number) === Number(pokemonId)
        );
        const pokemonContent = document.querySelector(".pokemonContent");
        const getDiv = document.querySelector(".pokemonData");
        if (getDiv) {
          getDiv.remove();
        }
        console.log(clickedPokemon);
        pokemonList.classList.add("minify");
        const div = document.createElement("div");
        const img = document.createElement("img");
        const btnClose = document.createElement("img");
        const name = document.createElement("h1");
        div.classList.add("pokemonData", clickedPokemon.type);
        pokemonContent.append(div);
        div.append(btnClose, img);
        btnClose.src = closeBtn;
        btnClose.classList.add("btnClose");
        btnClose.addEventListener("click", () => {
          pokemonList.classList.remove("minify");
          div.remove();
        });
        img.src = clickedPokemon.photo;
        div.append(name);
        name.classList.add("name");
        name.textContent = clickedPokemon.name;
        const divTypes = document.createElement("div");
        clickedPokemon.types.forEach(type => {
          const pokemonType = document.createElement("h2");
          div.append(divTypes);
          divTypes.append(pokemonType);
          pokemonType.classList.add(type);
          pokemonType.textContent = type;
        });
        const divAllStats = document.createElement("div");
        divAllStats.classList.add("divAllStats");
        clickedPokemon.stats.forEach(statsInfo => {
          const divStats = document.createElement("div");
          divStats.classList.add("divStats");
          div.append(divAllStats);
          divAllStats.append(divStats);
          const baseStatus = document.createElement("h3");
          const statusValue = document.createElement("h3");
          divStats.append(baseStatus, statusValue);
          baseStatus.textContent = `${statsInfo.stat.name}:`;
          statusValue.textContent = `${statsInfo.base_stat}`;
        });
        const weight = document.createElement("h3");
        const height = document.createElement("h3");
        div.append(weight, height);
        height.textContent = `Altura: ${clickedPokemon.height}cm`;
        weight.textContent = `Peso: ${clickedPokemon.weight}g`;
      });
    });
  });
}


loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})