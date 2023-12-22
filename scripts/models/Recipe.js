/**
 * Classe représentant une recette.
 */
export default class Recipe {
  /**
   * Crée une instance de la classe Recipe.
   * @param {object} data - Les données à utiliser pour initialiser l'objet Recipe.
   */
  constructor({
    id,
    image,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  }) {
    // Initialise les propriétés de l'objet Recipe avec les données fournies
    this.id = id;
    this.image = image;
    this.name = name;
    this.servings = servings;
    this.ingredients = ingredients;
    this.time = time;
    this.description = description;
    this.appliance = appliance;
    this.ustensils = ustensils;
  }
}
