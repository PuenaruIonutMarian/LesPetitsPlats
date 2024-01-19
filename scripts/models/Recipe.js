/**
 * Represents a Recipe object.
 */
export default class Recipe {
      /**
   * Creates an instance of Recipe.
   * @param {Object} data - The data object containing recipe information.
   */
    constructor(data) {
        this.id = data.id
        this.image = data.image
        this.name = data.name
        this.servings = data.servings
        this.ingredients = data.ingredients
        this.time = data.time
        this.description = data.description
        this.appliance = data.appliance
        this.ustensils = data.ustensils
    }
}