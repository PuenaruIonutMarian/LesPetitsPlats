import {
  cleanString
} from "../utils/cleanString.js";
import RecipeCard from './RecipeCard.js';
import Tag from './Tag.js';
import Recipe from "../models/Recipe.js";
import {
  dropdowns
} from "../pages/index.js";

class Search {
  constructor(recipes) {
    this.allRecipes = recipes;
    this.recipesFilteredByTag = [];
    this.selectedTags = [];
    this.searchInput = document.querySelector('#search-recipe');
    this.btnDelete = document.querySelector('.header_cta div button');
    this.cardSection = document.querySelector('.card_section');
    this.numberOfRecipes = document.querySelector('.recipes_count');
  }


  extractFilteredItems(filteredRecipes) {
    const filteredItems = [];

    filteredRecipes.forEach(recipe => {
      filteredItems.push(cleanString(recipe.appliance));

      recipe.ustensils.forEach(ustensil => filteredItems.push(cleanString(ustensil)));

      recipe.ingredients.forEach(ingredient => filteredItems.push(cleanString(ingredient.ingredient)));
    });

    return filteredItems;
  }

  updateWithFilteredRecipes(filteredRecipes) {
    const cardSection = document.querySelector('.card_section');
    const numberOfRecipes = document.querySelector('.recipes_count');

    if (!filteredRecipes.length) {
      cardSection.innerHTML = "<p>Aucune recette n'a été trouvée.</p>";
      numberOfRecipes.textContent = ``;
    } else {
      cardSection.innerHTML = "";
      numberOfRecipes.textContent = `${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recette' : 'recettes'}`;

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

  displayRecipesCards(recipes) {
    this.cardSection.innerHTML = '';
    recipes.forEach(recipe => new RecipeCard(recipe).createCard());
  }

  updateCurrentRecipes(filteredRecipes) {
    this.cardSection.innerHTML = '';
    this.numberOfRecipes.textContent = `${filteredRecipes.length} recipes`;
    this.displayRecipesCards(filteredRecipes);
  }

  searchBar() {
    const resetContent = () => {
      this.cardSection.innerHTML = '';
      this.numberOfRecipes.textContent = `${this.allRecipes.length} recipes`;
      this.displayRecipesCards(this.allRecipes);
      this.updateCurrentRecipes(this.allRecipes);
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



  filterRecipesByTags(recipes, tags) {
    const normalizedTags = tags.map(tag => cleanString(tag));

    if (normalizedTags.length === 0) {
      // If no tags selected, reset the content
      this.updateCurrentRecipes(recipes);
      this.updateWithFilteredRecipes(recipes);
      return;
    }
    const filteredRecipes = this.allRecipes.filter(recipe => {
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



  addTag(tagText) {
    if (!this.selectedTags.includes(tagText)) {
      const tag = new Tag(tagText, this);
      tag.createTag();
      this.selectedTags.push(tagText);
      this.filterRecipesByTags(this.allRecipes, this.selectedTags);
    }
  }


  initialize() {
    this.displayRecipesCards(this.allRecipes);
    this.searchBar();
    this.btnDelete.style.display = 'none';
  }
}

export default Search;