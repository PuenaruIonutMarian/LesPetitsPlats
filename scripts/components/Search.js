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

    for (const recipe of filteredRecipes) {
      filteredItems.push(cleanString(recipe.appliance));

      for (const ustensil of recipe.ustensils) {
        filteredItems.push(cleanString(ustensil));
      }

      for (const ingredient of recipe.ingredients) {
        filteredItems.push(cleanString(ingredient.ingredient));
      }
    }

    return filteredItems;
  }


  /**
   * Updates the UI with the filtered recipes.
   * @param {Array} filteredRecipes - The array of recipes to display.
   */
  updateWithFilteredRecipes(filteredRecipes) {

    if (!filteredRecipes.length) {
      this.cardSection.innerHTML = "<p>Aucune recette n'a été trouvée.</p>";
      this.numberOfRecipes.textContent = '';
    } else {
      this.cardSection.innerHTML = '';
      this.numberOfRecipes.textContent = filteredRecipes.length + ' recettes';

      for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = new Recipe(filteredRecipes[i]);
        const templateCard = new RecipeCard(recipe);
        templateCard.createCard();
      }
    }

    const filteredItems = this.extractFilteredItems(filteredRecipes);

    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].updateItems(filteredItems);
    }
  }


  /**
   * Displays recipe cards in the UI.
   * @param {Array} recipes - The array of recipes to display.
   */
  displayRecipesCards(recipes) {
    this.cardSection.innerHTML = '';

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      new RecipeCard(recipe).createCard();
    }
  }


  /**
   * Updates the array of current recipes.
   * @param {Array} filteredRecipes - The array of recipes to set as current.
   */
  updateCurrentRecipes(filteredRecipes) {
    currentRecipes.length = 0;
    for (let i = 0; i < filteredRecipes.length; i++) {
      currentRecipes.push(filteredRecipes[i]);
    }
  }

  /**
   * Sets up the search bar functionality.
   */
searchBar() {
  // Function to reset the content of the search
  const resetContent = () => {
    // Clear the displayed recipes
    this.cardSection.innerHTML = '';
    // Update the counter with the total number of recipes
    this.numberOfRecipes.textContent = this.allRecipes.length + ' recettes';
    // Display all recipes in the card section
    this.displayRecipesCards(this.allRecipes);
    // Update the current recipes with all recipes
    this.updateCurrentRecipes(this.allRecipes);

    // Reset the items in all dropdowns
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = dropdowns[i];
      dropdown.resetItemList();
    }
  };

  // Function to update the content based on the search input
  const updateContent = () => {
    // Get the lowercase value of the search input
    const searchInputValue = this.searchInput.value.toLowerCase();

    // Show or hide the delete button based on the search input length
    if (searchInputValue.length > 0) {
      this.btnDelete.style.display = 'block';
    } else {
      this.btnDelete.style.display = 'none';
    }

    // If search input length is greater than 2, filter recipes
    if (searchInputValue.length > 2) {
      let recipesToFilter;
      // Check if tags are selected, filter by tags, otherwise use all recipes
      if (this.selectedTags.length > 0) {
        recipesToFilter = this.recipesFilteredByTag;
      } else {
        recipesToFilter = this.allRecipes;
      }
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
   * @param {Array} recipes - The array of recipes to filter.
   * @param {string} inputValue - The search input value.
   */


filterRecipesBySearch(recipes, inputValue) {
  const normalizedInputValue = cleanString(inputValue);
  const filteredRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const { description, ingredients, name } = recipe;

    let match = false;

    if (!match && cleanString(name).indexOf(normalizedInputValue) !== -1) {
      match = true;
    } else if (!match) {
      for (let j = 0; j < ingredients.length; j++) {
        const ingredient = ingredients[j].ingredient;
        if (cleanString(ingredient).indexOf(normalizedInputValue) !== -1) {
          match = true;
          break;
        }
      }
    }

    else if (!match && cleanString(description).indexOf(normalizedInputValue) !== -1) {
      match = true;
    }

    //In JavaScript, the else statement doesn't take a condition
    if (match) {
      filteredRecipes.push(recipe);
    }
  }

  this.updateCurrentRecipes(filteredRecipes);
  this.updateWithFilteredRecipes(filteredRecipes);
}


  /**
   * Filters recipes based on the selected tags.
   * @param {Array} recipes - The array of recipes to filter.
   * @param {Array} tags - The array of selected tags.
   */
  filterRecipesByTags(recipes, tags) {
    const normalizedTags = [];

    for (let i = 0; i < tags.length; i++) {
      normalizedTags.push(cleanString(tags[i]));
    }

    if (normalizedTags.length === 0) {
      this.updateCurrentRecipes(recipes);
      this.updateWithFilteredRecipes(recipes);
      return;
    }

    const filteredRecipes = [];

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const { appliance, ustensils, ingredients } = recipe;

      let tagsMatch = true;

      for (let j = 0; j < normalizedTags.length; j++) {
        const tag = normalizedTags[j];

        if (
          cleanString(appliance).indexOf(tag) === -1 &&
          !ustensils.some(ustensil => cleanString(ustensil).indexOf(tag) !== -1) &&
          !ingredients.some(ingredient => cleanString(ingredient.ingredient).indexOf(tag) !== -1)
        ) {
          tagsMatch = false;
          break;
        }
      }

      if (tagsMatch) {
        filteredRecipes.push(recipe);
      }
    }

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
      const normalizedTags = [];
      for (let i = 0; i < tags.length; i++) {
        normalizedTags.push(cleanString(tags[i]));
      }
      const normalizedInputValue = cleanString(inputValue);

      const filteredRecipes = [];
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const { appliance, ustensils, ingredients, name } = recipe;

        let tagsMatch = normalizedTags.length === 0;

        for (let j = 0; j < normalizedTags.length; j++) {
          const tag = normalizedTags[j];
          let tagIncluded = false;

          const itemsToCheck = [cleanString(appliance)];
          for (let k = 0; k < ustensils.length; k++) {
            itemsToCheck.push(cleanString(ustensils[k]));
          }
          for (let k = 0; k < ingredients.length; k++) {
            itemsToCheck.push(cleanString(ingredients[k].ingredient));
          }

          for (let k = 0; k < itemsToCheck.length; k++) {
            const item = itemsToCheck[k];
            if (item.indexOf(tag) !== -1) {
              tagIncluded = true;
              break;
            }
          }

          if (!tagIncluded) {
            tagsMatch = false;
            break;
          }
        }

        let searchMatch = !normalizedInputValue;

        const itemsToCheck = [cleanString(appliance)];
        for (let k = 0; k < ustensils.length; k++) {
          itemsToCheck.push(cleanString(ustensils[k]));
        }
        for (let k = 0; k < ingredients.length; k++) {
          itemsToCheck.push(cleanString(ingredients[k].ingredient));
        }
        itemsToCheck.push(cleanString(name));

        for (let k = 0; k < itemsToCheck.length; k++) {
          const item = itemsToCheck[k];
          if (item.indexOf(normalizedInputValue) !== -1) {
            searchMatch = true;
            break;
          }
        }

        if (tagsMatch && searchMatch) {
          filteredRecipes.push(recipe);
        }
      }

      this.updateCurrentRecipes(filteredRecipes);
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
