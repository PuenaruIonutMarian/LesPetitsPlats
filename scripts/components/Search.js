import {
  cleanString
} from "../utils/cleanString.js";
import RecipeCard from './RecipeCard.js';
import Tag from './Tag.js';
import Recipe from "../models/Recipe.js";
import {
  dropdowns, currentRecipes
} from "../pages/index.js";


/**
 * Represents a search functionality for recipes.
 */
class Search {
    /**
   * Creates an instance of Search.
   * @param {Array} recipes - The array of recipes to search through.
   */
  constructor(recipes) {
    this.allRecipes = recipes;
    this.recipesFilteredByTag = [];
    this.selectedTags = [];
    this.searchInput = document.querySelector('#search-recipe');
    this.btnDelete = document.querySelector('.header_cta div button');
    this.cardSection = document.querySelector('.cards_section');
    this.numberOfRecipes = document.querySelector('.recipes_counter');
  }


    /**
   * Extracts unique items from the given recipes.
   * @param {Array} filteredRecipes - The array of recipes to extract items from.
   * @returns {Array} - The array of unique items.
   */
  extractFilteredItems(filteredRecipes) {
    const filteredItems = [];

    filteredRecipes.forEach(recipe => {
      filteredItems.push(cleanString(recipe.appliance));

      recipe.ustensils.forEach(ustensil => filteredItems.push(cleanString(ustensil)));

      recipe.ingredients.forEach(ingredient => filteredItems.push(cleanString(ingredient.ingredient)));
    });

    return filteredItems;
  }


    /**
   * Updates the UI with the filtered recipes.
   * @param {Array} filteredRecipes - The array of recipes to display.
   */
  updateWithFilteredRecipes(filteredRecipes) {

    if (!filteredRecipes.length) {
      this.cardSection.innerHTML = "<p>Aucune recette n'a été trouvée.</p>";
      this.numberOfRecipes.textContent = ``;
    } else {
      this.cardSection.innerHTML = "";
      this.numberOfRecipes.textContent = `${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recette' : 'recettes'}`;

      filteredRecipes
        .map(recipe => new Recipe(recipe))
        .forEach(recipe => {
          const templateCard = new RecipeCard(recipe);
          templateCard.createCard();
        });
    };

    const filteredItems = this.extractFilteredItems(filteredRecipes);

    dropdowns.forEach(dropdown => dropdown.updateItems(filteredItems));
  }


    /**
   * Displays recipe cards in the UI.
   * @param {Array} recipes - The array of recipes to display.
   */
  displayRecipesCards(recipes) {
    this.cardSection.innerHTML = '';
    recipes.forEach(recipe => new RecipeCard(recipe).createCard());
  }


  /**
   * Updates the array of current recipes.
   * @param {Array} filteredRecipes - The array of recipes to set as current.
   */
  updateCurrentRecipes = filteredRecipes => {
  currentRecipes.splice(0,currentRecipes.length, ...filteredRecipes);
  // console.log('all recipes', this.allRecipes) 
  // console.log('current recipes', currentRecipes) 
  // console.log(document.querySelectorAll('.card').length);
  };


    /**
   * Sets up the search bar functionality.
   */
  searchBar() {
    const resetContent = () => {
      this.cardSection.innerHTML = '';
      this.numberOfRecipes.textContent = `${this.allRecipes.length} recipes`;
      this.displayRecipesCards(this.allRecipes);
      this.updateCurrentRecipes(this.allRecipes);
      dropdowns.forEach(dropdown => dropdown.resetItemList());
    };

    const updateContent = () => {
      const searchInputValue = this.searchInput.value.toLowerCase();
      this.btnDelete.style.display = searchInputValue.length > 0 ? 'block' : 'none';

      if (searchInputValue.length > 2) {
        const recipesToFilter = this.selectedTags.length > 0 ? this.recipesFilteredByTag : this.allRecipes;
        this.filterRecipesBySearch(recipesToFilter, searchInputValue);
      }

      if (!this.searchInput.value && this.selectedTags.length > 0) {
        this.filterRecipesByTags(this.allRecipes, this.selectedTags);
      } else if (!this.searchInput.value && this.selectedTags.length === 0) {
        resetContent();
      }
    };

    this.searchInput.addEventListener('input', updateContent);

    this.btnDelete.addEventListener('click', () => {
      this.searchInput.value = '';
      this.btnDelete.style.display = 'none';

      if (this.selectedTags.length > 0) {
        this.filterRecipesByTags(this.allRecipes, this.selectedTags);
      } else if (this.selectedTags.length === 0) {
        resetContent();
      }
    });
  }


    /**
   * Filters recipes based on the search input.
   * @param {Array} recipes - The array of recipes to filter.
   * @param {string} inputValue - The search input value.
   */
  filterRecipesBySearch(recipes, inputValue) {
    const normalizedInputValue = cleanString(inputValue);

    const filteredRecipes = recipes.filter(recipe => {
      const {
        description,
        ingredients,
        name
      } = recipe;

      return (
        cleanString(description).includes(normalizedInputValue) ||
        ingredients.some(ingredient => cleanString(ingredient.ingredient).includes(normalizedInputValue)) ||
        cleanString(name).includes(normalizedInputValue)
      );
    });

    this.updateCurrentRecipes(filteredRecipes);
    this.updateWithFilteredRecipes(filteredRecipes);
  }


  /**
   * Filters recipes based on the selected tags.
   * @param {Array} recipes - The array of recipes to filter.
   * @param {Array} tags - The array of selected tags.
   */
  filterRecipesByTags(recipes, tags) {
    const normalizedTags = tags.map(tag => cleanString(tag));

    if (normalizedTags.length === 0) {
      // If no tags selected, reset the content
      this.updateCurrentRecipes(recipes);
      this.updateWithFilteredRecipes(recipes);
      return;
    }
        // const filteredRecipes = this.allRecipes.filter(recipe => {
    const filteredRecipes = recipes.filter(recipe => {
      const {
        appliance,
        ustensils,
        ingredients,
        name
      } = recipe;

      return (
        normalizedTags.every(tag =>
          cleanString(appliance).includes(tag) ||
          ustensils.some(ustensil => cleanString(ustensil).includes(tag)) ||
          ingredients.some(ingredient => cleanString(ingredient.ingredient).includes(tag))
        )
      );
    });

    this.recipesFilteredByTag = filteredRecipes;
    this.updateCurrentRecipes(filteredRecipes);
    this.updateWithFilteredRecipes(filteredRecipes);
  }


  /**
   * Adds a tag to the selected tags and filters recipes accordingly.
   * @param {string} tagText - The text of the tag to add.
   */
  addTag(tagText) {
    if (!this.selectedTags.includes(tagText)) {
      const tag = new Tag(tagText, this);
      tag.createTag();
      this.selectedTags.push(tagText);
      // this.filterRecipesByTags(this.allRecipes, this.selectedTags);
      this.filterRecipesByTags(currentRecipes, this.selectedTags);
    }
  }

  /**
   * Filters recipes based on tags, input value, or both.
   * @param {Array} recipes - The array of recipes to filter.
   * @param {Array} tags - The array of selected tags.
   * @param {string} inputValue - The search input value.
   */
  filterRecipes = (recipes, tags, inputValue) => {
      const normalizedTags = tags.map(tag => cleanString(tag));
      const normalizedInputValue = cleanString(inputValue);

      const filteredRecipes = recipes.filter(recipe => {
          const { appliance, ustensils, ingredients, name } = recipe;

          const tagsMatch = normalizedTags.length === 0 || normalizedTags.every(tag =>
              [cleanString(appliance), ...ustensils.map(cleanString), ...ingredients.map(ingredient => cleanString(ingredient.ingredient))]
              .some(item => item.includes(tag))
          );

          const searchMatch = !normalizedInputValue || (
              [cleanString(appliance), ...ustensils.map(cleanString), ...ingredients.map(ingredient => cleanString(ingredient.ingredient)), cleanString(name)]
              .some(item => item.includes(normalizedInputValue))
          );

          return tagsMatch && searchMatch;
      });

      // this.updateCurrentRecipes(this.allRecipes);
      this.updateCurrentRecipes(currentRecipes);
      this.updateWithFilteredRecipes(filteredRecipes);
  };


  /**
   * Initializes the search functionality.
   */
  initialize() {
    this.displayRecipesCards(this.allRecipes);
    this.searchBar();
    this.btnDelete.style.display = 'none';
  }
}

export default Search;





