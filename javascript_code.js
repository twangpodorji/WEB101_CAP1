// lets built a javascript code that fetches the first 200 pokemon from the pokeapi and displays them on the page
document.addEventListener('DOMContentLoaded', async () => { // Wait for the DOM to be fully loaded 
     try {
         const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200'); // Fetch the first 200 Pokemon
         if (!response.ok) throw new Error('Network response was not ok');
         const data = await response.json();
 
         const pokemonList = document.getElementById('pokemon_list');
         for (const pokemon of data.results) {
             const pokemonDetailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
             const pokemonDetail = await pokemonDetailResponse.json();
 
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
 
             pokemonList.appendChild(pokemonElement);
         }
     } catch (error) {
         console.error('There was a problem with the fetch operation:', error);
     }
 });
 
 