import Recipe from '../models/Recipe.js';
import RecipeCard from '../templates/Card.js';
import { recipes } from '../../data/recipes.js';

const allRecipes = recipes;
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
    displayRecipesCards(allRecipes);
};


// Function for searching
const searchRecipes = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    // Boutton CLEAR 
    removeInput(lowerCaseSearchTerm);

    if (!lowerCaseSearchTerm) {
        resetDisplay();
        return;
    }

    const filteredRecipes = filterRecipes(allRecipes, lowerCaseSearchTerm);
    displayRecipes(filteredRecipes);
};

// Function to filter recipes based on the search term
const filterRecipes = (allRecipes, searchTerm) => {
    return allRecipes.filter(recipe => {
        const { name, ingredients } = new Recipe(recipe);

        // Check if the search term is present in the name or ingredients
        return (
            name.toLowerCase().includes(searchTerm) ||
            ingredients.some(ingredient => {
                const ingredientString = String(ingredient);
                return ingredientString.toLowerCase().includes(searchTerm);
            })
        );
    });
};

// Function to display the filtered recipes
const displayRecipes = (filteredRecipes) => {
    displayRecipesCards(filteredRecipes);
};




//function to remove the inserted word in the main input field
const removeInput = (phrase)=>{
        const btnDelete = document.querySelector('.header_cta div button');
        btnDelete.style.display = phrase.length > 0 ? 'block' : 'none';


        btnDelete.addEventListener('click', () => {
        searchedItem.value = '';
        resetDisplay();
        btnDelete.style.display = 'none';});};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////DROPDOWN AREA/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function pour creer des listes uniques
export const extractUniqueProperties = recipes => {
    const uniqueProperties = {
        ingredients: new Set(),
        appareils: new Set(),
        ustensils: new Set()
    };

    const addPropertyToSet = (propertySet, value) => {
        if (value) {
            propertySet.add(value.toLowerCase());
        }
    };

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => addPropertyToSet(uniqueProperties.ingredients, ingredient.ingredient));
        addPropertyToSet(uniqueProperties.appareils, recipe.appliance);
        recipe.ustensils.forEach(ustensil => addPropertyToSet(uniqueProperties.ustensils, ustensil));
    });


    //Object.entries prend l'objet uniqueProperties et le convertit en un tableau de paires Key - value (key - set).
    const propertiesArray = Object.fromEntries(Object.entries(uniqueProperties)
    //map itère et transforme l'ensemble de valeurs en un tableau en utilisant Array.from(set), puis trie alphabétiquement le tableau avec .sort()
        .map(([property, set]) => [property, Array.from(set).sort()])
    );
    // console.log(propertiesArray);
    // console.log(Object.entries(uniqueProperties));


    //     // Ensemble set en tableau et trie par ordre alphabétique
    // const propertiesArray = {};
    // for (const property in uniqueProperties) {
    //     propertiesArray[property] = Array.from(uniqueProperties[property]).sort();
    // }

    return propertiesArray;
};




// Call the function to extract unique properties
const uniqueProperties = extractUniqueProperties(allRecipes);

// Function to generate a dropdown menu based on the extracted properties
const generateDropdownMenu = (property, items) => {
    const dropdownToggle = document.getElementById(property);
    const dropdownMenu = dropdownToggle.nextElementSibling;

    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a class="dropdown-item" href="#">${item}</a>`;
        dropdownMenu.appendChild(listItem);
    });
};

// Generate dropdown menus for ingredients, appareils (formerly appliances), and ustensils
generateDropdownMenu('ingredients', uniqueProperties.ingredients);
generateDropdownMenu('appareils', uniqueProperties.appareils); 
generateDropdownMenu('ustensiles', uniqueProperties.ustensils);






// EVENT Listener for click on option
const toggleIcon = document.querySelectorAll('.dropdown-toggle');

toggleIcon.forEach(btn => {
    btn.addEventListener('click', event => {
        const targetButton = event.currentTarget;
        const icon = targetButton.querySelector('svg');
        icon.classList.toggle('rotate');
    });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////END OF DROPDOWN AREA///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




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


