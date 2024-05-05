// Keep track of seen and unseen Pokemon
const seenPokemon = new Set();
const unseenPokemon = new Set();

// Initialization and Fetching Pokemon List
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the first 10 Pokemon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const pokemonList = document.getElementById('pokemon_list');
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
});





// function to show the next 10 pokemons when the user scrolls and reaches the bottom of the page
window.onscroll = async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        try {
            // Fetch the next 10 Pokemon
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=10');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const pokemonList = document.getElementById('pokemon_list');
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
};





// Function to display Pokemon details
async function displayPokemonDetails(pokemonName) {
    try {
        // Format the Pokemon name to match the PokeAPI format
        const formattedPokemonName = pokemonName.toLowerCase().trim().replace(/\s/g, '');

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedPokemonName}`);
        if (!response.ok) throw new Error('Pokemon not found');
        const pokemon = await response.json();

        const detailsContainer = document.querySelector('.details');
        if (detailsContainer) {
            detailsContainer.innerHTML = ''; // Clear previous Pokemon details

            // Display Pokemon name
            const nameElement = document.createElement('h2');
            nameElement.textContent = pokemon.name.toUpperCase();
            detailsContainer.appendChild(nameElement);

            // Display Pokemon image
            const imgElement = document.createElement('img');
            imgElement.src = pokemon.sprites.front_default;
            imgElement.alt = pokemon.name;
            detailsContainer.appendChild(imgElement);

            // Display Pokemon weight
            const weightElement = document.createElement('p');
            weightElement.textContent = `Weight: ${pokemon.weight} kg`;
            detailsContainer.appendChild(weightElement);

            // Display Pokemon height
            const heightElement = document.createElement('p');
            heightElement.textContent = `Height: ${pokemon.height} dm`;
            detailsContainer.appendChild(heightElement);

            // Fetch and display Pokemon types and abilities
            const typesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedPokemonName}`);
            const typesData = await typesResponse.json();
            const typesElement = document.createElement('p');
            typesElement.textContent = `Types: ${typesData.types.map(type => type.type.name).join(', ')}`;
            detailsContainer.appendChild(typesElement);

            const abilitiesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedPokemonName}`);
            const abilitiesData = await abilitiesResponse.json();
            const abilitiesElement = document.createElement('p');
            abilitiesElement.textContent = `Abilities: ${abilitiesData.abilities.map(ability => ability.ability.name).join(', ')}`;
            detailsContainer.appendChild(abilitiesElement);

            // Mark the Pokemon as seen
            seenPokemon.add(pokemon.name);
            unseenPokemon.delete(pokemon.name);
        } else {
            console.error('Could not find the .details element on the page.');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Display an error message to the user
        const container = document.querySelector('.text');
        container.innerHTML = `<p>${error.message}</p>`;
    }
}
