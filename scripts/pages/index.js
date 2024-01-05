import Recipe from '../models/Recipe.js';
import RecipeCard from '../templates/Card.js';
import { recipes } from '../../data/recipes.js';

const allRecipes = recipes;
const recipesContainer = document.getElementById('recipes-container');
const recipesCounter = document.querySelector('.recipes_count');


//////////////////////////FUNCTION DISPLAY RECIPES
const displayRecipesCards = (recipesToDisplay) => {
    recipesContainer.innerHTML = ''; // suprime les cartes existantes

    recipesToDisplay
        .map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const templateCard = new RecipeCard(recipe);
            templateCard.createCard();
        });

    // afiche le numero des recettes ou le message     
    const numberOfRecipes = countRecipes();
    numberOfRecipes === 0
        ? (recipesContainer.innerHTML = "<p>Aucune recette n'a été trouvée.</p>",
        recipesCounter.innerHTML = '')
        : (recipesCounter.innerHTML = `${numberOfRecipes} recettes`);

};


/////////////////////////////////RESET DISPLAY
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

        // Display tags XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
    const tagSection = document.querySelector('.tag_section');
    tagSection.innerHTML = '';
    selectedTags.forEach(tagName => createTag(tagName));
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
        listItem.innerHTML = `<a class="dropdown-item" href="#" data-property="${property}">${item}</a>`;

        dropdownMenu.appendChild(listItem);

        // pour creer le tag 
        listItem.addEventListener('click', handleDropdownItemClick);

    });
};



// Event listener for click on dropdown item
const handleDropdownItemClick = (event) => {
    console.log('Full Event:', event);
  const targetItem = event.currentTarget;
  console.log(targetItem); 
  const itemName = targetItem.textContent.trim();

  console.log('Item Name:', itemName);

  // Call createTag function when a dropdown item is clicked
  createTag(itemName);
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




////////////////////Create / Remove tag button

let selectedTags = [];


// Modify createTag function
const createTag = ( name) => {
    const tagSection = document.querySelector('.tag_section');
    const tag = `
        <div class="tag">
            <h3>${name}</h3>
            <button></button>
        </div>
    `;
    tagSection.innerHTML += tag;

    // Add the name to the selectedTags array with the corresponding property
    selectedTags.push({  name: name.toLowerCase() });

    const tagBtn = tagSection.querySelectorAll('button');
    tagBtn.forEach(btn => btn.addEventListener('click', removeTag));

    return tag;
};



// removeTag function
const removeTag = (event) => {
    const tag = event.target.closest('.tag');
    const tagName = tag.textContent.trim();
    
    // Remove the tag from the selectedTags array
    selectedTags = selectedTags.filter(tagData => tagData.name !== tagName.toLowerCase());

    // Add your logic to filter recipes based on the selected tags and update the display
    const inputValue = searchedItem.value;
    filterRecipes(allRecipes, selectedTags, inputValue);
    
    tag.remove();
};





///test

const handleInputChange = (property) => (event) => {
    const inputValue = event.target.value;
    // Add your logic here based on the input value and property
    console.log(`${property} Input Changed:`, inputValue);
};

// Ingredients Input
const ingredientsInput = document.getElementById('ingredients-search-input');
ingredientsInput.addEventListener('input', handleInputChange('Ingredients'));

// Appareils Input
const appareilsInput = document.getElementById('appareils-search-input');
appareilsInput.addEventListener('input', handleInputChange('Appareils'));

// Ustensiles Input
const ustensilesInput = document.getElementById('ustensiles-search-input');
ustensilesInput.addEventListener('input', handleInputChange('Ustensiles'));


///////////////////////COUNTER

const countRecipes = () => {
    const recipeCards = recipesContainer.querySelectorAll('.card');
    return recipeCards.length;
};


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


