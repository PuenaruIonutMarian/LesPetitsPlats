
import Recipe from '../models/Recipe.js';
import RecipeCard from '../utils/Card.js';
import { recipes } from '../../data/recipes.js';

export const displayRecipesCards = () => {
    recipes
        .map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const templateCard = new RecipeCard(recipe);
            templateCard.createCard();
        })
};


displayRecipesCards();


console.log(recipes.length);