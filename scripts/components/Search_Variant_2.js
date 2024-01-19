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
    this.cardSection = document.querySelector('.card_section');
    this.numberOfRecipes = document.querySelector('.recipes_count');
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
    const cardSection = document.querySelector('.card_section');
    const numberOfRecipes = document.querySelector('.recipes_count');

    if (!filteredRecipes.length) {
      cardSection.innerHTML = "<p>Aucune recette n'a été trouvée.</p>";
      numberOfRecipes.textContent = '';
    } else {
      cardSection.innerHTML = '';
      numberOfRecipes.textContent = filteredRecipes.length + ' recettes';

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
    const resetContent = () => {
      this.cardSection.innerHTML = '';
      this.numberOfRecipes.textContent = this.allRecipes.length + ' recettes';
      this.displayRecipesCards(this.allRecipes);
      this.updateCurrentRecipes(this.allRecipes);

      for (let i = 0; i < dropdowns.length; i++) {
          const dropdown = dropdowns[i];
          dropdown.resetItemList();
      }
    };

    const updateContent = () => {
      const searchInputValue = this.searchInput.value.toLowerCase();
      this.btnDelete.style.display = searchInputValue.length > 0 ? 'block' : 'none';

      if (searchInputValue.length > 2) {
        let recipesToFilter = this.selectedTags.length > 0 ? this.recipesFilteredByTag : this.allRecipes;
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
    const filteredRecipes = [];

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const { description, ingredients, name } = recipe;

      let match = false;

      if (cleanString(description).indexOf(normalizedInputValue) !== -1) {
        match = true;
      } else {
        for (let j = 0; j < ingredients.length; j++) {
          const ingredient = ingredients[j].ingredient;
          if (cleanString(ingredient).indexOf(normalizedInputValue) !== -1) {
            match = true;
            break;
          }
        }
      }

      if (!match && cleanString(name).indexOf(normalizedInputValue) !== -1) {
        match = true;
      }

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
 filterRecipes(recipes, tags, inputValue) {
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

            const itemsToCheck = [cleanString(appliance), ...ustensils.map(cleanString), ...ingredients.map(ingredient => cleanString(ingredient.ingredient))];

            for (let k = 0; k < itemsToCheck.length; k++) {
                const item = itemsToCheck[k];
                if (item.includes(tag)) {
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

        const itemsToCheck = [cleanString(appliance), ...ustensils.map(cleanString), ...ingredients.map(ingredient => cleanString(ingredient.ingredient)), cleanString(name)];

        for (let k = 0; k < itemsToCheck.length; k++) {
            const item = itemsToCheck[k];
            if (item.includes(normalizedInputValue)) {
                searchMatch = true;
                break;
            }
        }

        if (tagsMatch && searchMatch) {
            filteredRecipes.push(recipe);
        }
    }

    this.updateCurrentRecipes(currentRecipes);
    this.updateWithFilteredRecipes(filteredRecipes);
}

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
