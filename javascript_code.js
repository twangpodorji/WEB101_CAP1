// Keep track of seen and unseen Pokemon
const seenPokemon = new Set();
const unseenPokemon = new Set();

// Initialization and Fetching Pokemon List
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the first 10 Pokemon
        await fetchAndDisplayPokemon(0, 10);

        // Add event listener for search input
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', async () => {
            const pokemonName = searchInput.value.toLowerCase();
            await displayPokemonDetails(pokemonName);
        });

        // Add event listener for "Seen" button
        const seenButton = document.getElementById('seen_button');
        seenButton.addEventListener('click', () => {
            displayPokemonList(seenPokemon);
        });

        // Add event listener for "Unseen" button
        const unseenButton = document.getElementById('unseen_button');
        unseenButton.addEventListener('click', () => {
            displayPokemonList(unseenPokemon);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Display an error message to the user
        const container = document.querySelector('.text');
        container.innerHTML = `<p>${error.message}</p>`;
    }
});

// Event listener for scroll to bottom
window.addEventListener('scroll', async () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // Fetch and display the next 10 Pokémons
        await fetchAndDisplayPokemon(seenPokemon.size, 10);
    }
});

async function fetchAndDisplayPokemon(offset, limit) {
    try {
        // Fetch the next set of Pokémons
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const pokemonList = document.getElementById('pokemon_list');
        pokemonList.innerHTML = ''; // Clear the existing list

        for (const pokemon of data.results) {
            // Fetch additional details for each Pokemon
            const pokemonDetailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            const pokemonDetail = await pokemonDetailResponse.json();

            // Create a new Pokemon element
            const pokemonElement = document.createElement('div');
            pokemonElement.classList.add('pokemon');

            // Display Pokemon number
            const numberElement = document.createElement('p');
            numberElement.textContent = `#${pokemonDetail.id}`;
            pokemonElement.appendChild(numberElement);

            // Display Pokemon image
            const imgElement = document.createElement('img');
            imgElement.src = pokemonDetail.sprites.front_default;
            imgElement.alt = pokemon.name;
            pokemonElement.appendChild(imgElement);

            // Display Pokemon name
            const nameElement = document.createElement('h3');
            nameElement.textContent = `Name: ${pokemon.name}`;
            pokemonElement.appendChild(nameElement);

            // Display Pokemon weight
            const weightElement = document.createElement('p');
            weightElement.textContent = `Weight: ${pokemonDetail.weight} kg`;
            pokemonElement.appendChild(weightElement);

            // Display Pokemon height
            const heightElement = document.createElement('p');
            heightElement.textContent = `Height: ${pokemonDetail.height} dm`;
            pokemonElement.appendChild(heightElement);

            // Add click event listener to display Pokemon details
            pokemonElement.addEventListener('click', async () => {
                // Hide all Pokemon containers
                const allPokemonContainers = document.querySelectorAll('.pokemon');
                allPokemonContainers.forEach(container => container.style.display = 'none');

                // Mark the Pokemon as seen
                seenPokemon.add(pokemon.name);
                unseenPokemon.delete(pokemon.name);

                // Display Pokemon details
                await displayPokemonDetails(pokemon.name);
            });

            pokemonList.appendChild(pokemonElement);

            // Mark the Pokemon as unseen
            unseenPokemon.add(pokemon.name);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Display an error message to the user
        const container = document.querySelector('.text');
        container.innerHTML = `<p>${error.message}</p>`;
    }
}

async function displayPokemonDetails(pokemonName) {
    try {
        // Format the Pokemon name to match the PokeAPI format
        const formattedPokemonName = pokemonName.toLowerCase().trim().replace(/\s/g, '');

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedPokemonName}`);
        if (!response.ok) throw new Error('Pokemon not found');
        const pokemon = await response.json();

        const pokemonList = document.getElementById('pokemon_list');
        pokemonList.innerHTML = ''; // Clear the existing list

        // Create a new Pokemon element
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');

        // Display Pokemon number
        const numberElement = document.createElement('p');
        numberElement.textContent = `#${pokemon.id}`;
        pokemonElement.appendChild(numberElement);

        // Display Pokemon image
        const imgElement = document.createElement('img');
        imgElement.src = pokemon.sprites.front_default;
        imgElement.alt = pokemon.name;
        pokemonElement.appendChild(imgElement);

        // Display Pokemon name
        const nameElement = document.createElement('h3');
        nameElement.textContent = `Name: ${pokemon.name.toUpperCase()}`;
        pokemonElement.appendChild(nameElement);

        // Display Pokemon weight
        const weightElement = document.createElement('p');
        weightElement.textContent = `Weight: ${pokemon.weight} kg`;
        pokemonElement.appendChild(weightElement);

        // Display Pokemon height
        const heightElement = document.createElement('p');
        heightElement.textContent = `Height: ${pokemon.height} dm`;
        pokemonElement.appendChild(heightElement);

        // Fetch and display Pokemon types and abilities
        const typesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedPokemonName}`);
        const typesData = await typesResponse.json();
        const typesElement = document.createElement('p');
        typesElement.textContent = `Types: ${typesData.types.map(type => type.type.name).join(', ')}`;
        pokemonElement.appendChild(typesElement);

        const abilitiesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedPokemonName}`);
        const abilitiesData = await abilitiesResponse.json();
        const abilitiesElement = document.createElement('p');
        abilitiesElement.textContent = `Abilities: ${abilitiesData.abilities.map(ability => ability.ability.name).join(', ')}`;
        pokemonElement.appendChild(abilitiesElement);

        pokemonList.appendChild(pokemonElement);

        // Mark the Pokemon as seen
        seenPokemon.add(pokemon.name);
        unseenPokemon.delete(pokemon.name);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Display an error message to the user
        const container = document.querySelector('.text');
        container.innerHTML = `<p>${error.message}</p>`;
    }
}

function displayPokemonList(pokemonSet) {
    const pokemonList = document.getElementById('pokemon_list');
    pokemonList.innerHTML = ''; // Clear the existing list

    pokemonSet.forEach(async (pokemonName) => {
        try {
            // Fetch additional details for the Pokemon
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const pokemonDetail = await response.json();

            // Create a new Pokemon element
            const pokemonElement = document.createElement('div');
            pokemonElement.classList.add('pokemon');

            // Display Pokemon number
            const numberElement = document.createElement('p');
            numberElement.textContent = `#${pokemonDetail.id}`;
            pokemonElement.appendChild(numberElement);

            // Display Pokemon image
            const imgElement = document.createElement('img');
            imgElement.src = pokemonDetail.sprites.front_default;
            imgElement.alt = pokemonName;
            pokemonElement.appendChild(imgElement);

            // Display Pokemon name
            const nameElement = document.createElement('h3');
            nameElement.textContent = `Name: ${pokemonName}`;
            pokemonElement.appendChild(nameElement);

            // Display Pokemon weight
            const weightElement = document.createElement('p');
            weightElement.textContent = `Weight: ${pokemonDetail.weight} kg`;
            pokemonElement.appendChild(weightElement);

            // Display Pokemon height
            const heightElement = document.createElement('p');
            heightElement.textContent = `Height: ${pokemonDetail.height} dm`;
            pokemonElement.appendChild(heightElement);

            // Add click event listener to display Pokemon details
            pokemonElement.addEventListener('click', async () => {
                // Hide all Pokemon containers
                const allPokemonContainers = document.querySelectorAll('.pokemon');
                allPokemonContainers.forEach(container => container.style.display = 'none');

                // Display Pokemon details
                await displayPokemonDetails(pokemonName);
            });

            pokemonList.appendChild(pokemonElement);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Display an error message to the user
            const container = document.querySelector('.text');
            container.innerHTML = `<p>${error.message}</p>`;
        }
    });
}

