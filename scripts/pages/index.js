import { recipes } from '../../data/recipes.js';
import Dropdown from '../components/Dropdown.js';
import { openCloseDropdown } from '../utils/dropdownEvent.js';
import Search from '../components/Search.js';
// import Search from '../components/Search_Variant_2.js';
import { dropdownValues } from '../utils/dropdownValues.js';


/**
 * Represents the array of all recipes.
 * @type {Array}
 */
export const allRecipes = recipes;


/**
 * Represents the array of current recipes.
 * Uses spread operator to create a similar array as allRecipes but modifications to one array won't affect the other one.
 * @type {Array}
 */
export const currentRecipes = [...allRecipes];//spread operator to create an similar array as allRecipes but like this the modifications to one array won't affect the other one

/**
 * Represents the array of selected tags.
 * @type {Array}
 */
export const selectedTags = [];

/**
 * Represents the array of dropdown instances.
 * @type {Array}
 */
export const dropdowns = [];

/**
 * Represents the search instance.
 * @type {Search}
 */
export const search = new Search(allRecipes,selectedTags);


/**
 * Displays the dropdown section with filters.
 */
export const displayDropdownSection = () => {
  const numberOfRecipes = document.querySelector('.recipes_counter');
  numberOfRecipes.textContent = `${allRecipes.length} recettes`;

    // Creating dropdowns for Ingredients, Appareils, and Ustensiles
  dropdowns.push(new Dropdown('Ingrédients', dropdownValues(allRecipes).ingredients, search));
  dropdowns.push(new Dropdown('Appareils', dropdownValues(allRecipes).appliances, search));
  dropdowns.push(new Dropdown('Ustensiles', dropdownValues(allRecipes).ustensils, search));

  const filterSection = document.querySelector('.filters_section');

  // Inserting dropdowns into the filter section
  dropdowns.forEach(dropdown => filterSection.insertBefore(dropdown.createDropdown(), numberOfRecipes));

  openCloseDropdown();
  search.searchBar();
};


/**
 * Initializes the application.
 */
export const initialize = () => {
  displayDropdownSection();
  search.displayRecipesCards(allRecipes);
  
};

initialize();
