import Recipe from '../models/Recipe.js';
import RecipeCard from '../templates/Card.js';
import { recipes } from '../../data/recipes.js';


const recipesContainer = document.getElementById('recipes-container');

const displayRecipesCards = (recipesToDisplay) => {
    recipesContainer.innerHTML = ''; // suprime les cartes existantes

    recipesToDisplay
        .map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const templateCard = new RecipeCard(recipe);
            templateCard.createCard();
        });
};

const resetDisplay = () => {
    displayRecipesCards(recipes);
};

// Function for searching
const searchRecipes = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    // Boutton CLEAR 
        const btnDelete = document.querySelector('.header_cta div button');
        btnDelete.style.display = lowerCaseSearchTerm.length > 0 ? 'block' : 'none';


        btnDelete.addEventListener('click', () => {
        searchedItem.value = '';
        resetDisplay();
        btnDelete.style.display = 'none';});
    ////////

    if (!lowerCaseSearchTerm) {
        resetDisplay();
        return;
    }



    const filteredRecipes = recipes.filter(recipe => {
        const { name, description, ingredients } = new Recipe(recipe);

        // Check if the search term is present in the description, name, or ingredients
        return (
            name.toLowerCase().includes(lowerCaseSearchTerm) ||
            description.toLowerCase().includes(lowerCaseSearchTerm) ||
            ingredients.some(ingredient => {
                const ingredientString = String(ingredient);
                return ingredientString.toLowerCase().includes(lowerCaseSearchTerm);
            })
        );
    });

    displayRecipesCards(filteredRecipes);
};


// Eventlistener - pour chercher la recette 
const searchedItem = document.querySelector('#search-recipe');
//on cherche ou click et pas ou input/search parce que j'ai personalize le clear-button 'X' 
//dans le HTML l'input est fixe ou type=text a la place du search pour ca
searchedItem.addEventListener("click", () => {
    const inputValue = searchedItem.value;
    searchRecipes(inputValue);
});


// Initial display of all recipes
resetDisplay();


