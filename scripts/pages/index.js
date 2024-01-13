import { recipes } from '../../data/recipes.js';
import Dropdown from '../components/Dropdown.js';
import { openCloseDropdown } from '../utils/dropdownEvent.js';
import Search from '../components/Search.js';
import { dropdownValues } from '../utils/dropdownValues.js';


export const allRecipes = recipes;
export const selectedTags = [];
export const dropdowns = [];
export const search = new Search(allRecipes,selectedTags);

export const displayDropdownSection = () => {
  const numberOfRecipes = document.querySelector('.recipes_count');
  numberOfRecipes.textContent = `${allRecipes.length} recettes`;

  dropdowns.push(new Dropdown('Ingrédients', dropdownValues(allRecipes).ingredients, search));
  dropdowns.push(new Dropdown('Appareils', dropdownValues(allRecipes).appliances, search));
  dropdowns.push(new Dropdown('Ustensiles', dropdownValues(allRecipes).ustensils, search));

  const filterSection = document.querySelector('.filter_section');
  dropdowns.forEach(dropdown => filterSection.insertBefore(dropdown.createDropdown(), numberOfRecipes));

  openCloseDropdown();
  search.searchBar();
};



export const initialize = () => {
  displayDropdownSection();
  search.displayRecipesCards(allRecipes);
  
};

initialize();
