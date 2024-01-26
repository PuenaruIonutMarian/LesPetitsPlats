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
   * Extracts unique items from the given recipes. The final purpose of this method is updating dropdown menus.
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
   * It dynamically generates and displays recipe cards in the HTML document based on the filtered recipes. It also updates dropdown menus with the filtered items.
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
   *This method updates the currentRecipes array with the recipes provided in the filteredRecipes array. It clears the current content of currentRecipes using splice and replaces it with the content of filteredRecipes.
   * Updates the array of current recipes.
   * @param {Array} filteredRecipes - The array of recipes to set as current.
   */
  updateCurrentRecipes = filteredRecipes => {
  currentRecipes.splice(0,currentRecipes.length, ...filteredRecipes);
  };


    /**
   * Sets up the search bar functionality.
   * The searchBar method sets up event listeners for the search input and delete button, allowing the user to interact with the search functionality. 
   * It dynamically updates the content based on the search input and selected tags.
   */
  searchBar() {
    // Function to reset the content of the search
    const resetContent = () => {
      // Clear the displayed recipes
      this.cardSection.innerHTML = '';
      // Update the counter with the total number of recipes
      this.numberOfRecipes.textContent = `${this.allRecipes.length} recipes`;
      // Display all recipes in the card section
      this.displayRecipesCards(this.allRecipes);
      // Update the current recipes with all recipes
      this.updateCurrentRecipes(this.allRecipes);
      // Reset the items in all dropdowns
      dropdowns.forEach(dropdown => dropdown.resetItemList());
    };

    // Function to update the content based on the search input
    const updateContent = () => {
      // Get the lowercase value of the search input
      const searchInputValue = this.searchInput.value.toLowerCase();
      // Show or hide the delete button based on the search input length
      this.btnDelete.style.display = searchInputValue.length > 0 ? 'block' : 'none';

      // If search input length is greater than 2, filter recipes
      if (searchInputValue.length > 2) {
        // Check if tags are selected, filter by tags, otherwise use all recipes
        const recipesToFilter = this.selectedTags.length > 0 ? this.recipesFilteredByTag : this.allRecipes;
        this.filterRecipesBySearch(recipesToFilter, searchInputValue);
      }

      // If search input is empty and tags are selected, filter by tags
      else if (!this.searchInput.value && this.selectedTags.length > 0) {
        this.filterRecipesByTags(this.allRecipes, this.selectedTags);
      }

      // If search input is empty and no tags selected, reset content
      else if (!this.searchInput.value && this.selectedTags.length === 0) {
        resetContent();
      }
    };

    // Event listener for input changes to trigger content update
    this.searchInput.addEventListener('input', updateContent);

    // Event listener for delete button click to clear search input
    this.btnDelete.addEventListener('click', () => {
      // Clear search input value
      this.searchInput.value = '';
      // Hide the delete button
      this.btnDelete.style.display = 'none';

      // If tags are selected, filter by tags, otherwise reset content
      if (this.selectedTags.length > 0) {
        this.filterRecipesByTags(this.allRecipes, this.selectedTags);
      } else if (this.selectedTags.length === 0) {
        resetContent();
      }
    });
  }



    /**
   * Filters recipes based on the search input.
   *  It normalizes the input value, applies the filter, and then updates the current recipes and the UI using the updateCurrentRecipes and updateWithFilteredRecipes methods.
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
   * It normalizes the tags, applies the filter, and updates the current recipes and the UI.
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
   * Adds a tag to the selected tags, creates a corresponding UI element (Tag), and then filters recipes based on the updated set of selected tags.
   * @param {string} tagText - The text of the tag to add.
   */
  addTag(tagText) {
    if (!this.selectedTags.includes(tagText)) {
      const tag = new Tag(tagText, this);
      tag.createTag();
      this.selectedTags.push(tagText);
      this.filterRecipesByTags(currentRecipes, this.selectedTags);
    }
  }

  /**
   * Filters recipes based on tags, input value, or both.
   * It checks for matches in the recipes array based on the normalized tags and input value. The filtered recipes are then updated using the updateCurrentRecipes method, and the UI is updated with the filtered recipes using the updateWithFilteredRecipes method.
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


      this.updateCurrentRecipes(filteredRecipes);
      this.updateWithFilteredRecipes(filteredRecipes);
  };


  /**
   * Initializes the search functionality.
   * It displays the initial set of recipe cards, sets up the search bar event listeners, and hides the delete button.
   */
  initialize() {
    this.displayRecipesCards(this.allRecipes);
    this.searchBar();
    this.btnDelete.style.display = 'none';
  }
}

export default Search;
