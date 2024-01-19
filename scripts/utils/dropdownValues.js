/**
 * Extracts unique values for ingredients, appliances, and ustensils from an array of recipes.
 * @param {Array} recipes - The array of recipes.
 * @returns {Object} - An object containing arrays of unique values for each property (ingredients, appliances, ustensils).
 */
export const dropdownValues = recipes => {
    // Initialize sets to store unique values for each property.
    const uniqueSets = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set()
    };

    /**
     * Adds a value to the specified set in the uniqueSets object.
     * @param {Set} propertySet - The set for a specific property.
     * @param {string} value - The value to add to the set.
     */
    const addValueToSet = (propertySet, value) => propertySet.add(value.toLowerCase()) ;

    // Iterate through each recipe to populate uniqueSets.
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => addValueToSet(uniqueSets.ingredients, ingredient.ingredient));
        addValueToSet(uniqueSets.appliances, recipe.appliance);
        recipe.ustensils.forEach(ustensil => addValueToSet(uniqueSets.ustensils, ustensil));
    });

    // Use Object.entries to create an array of key-value pairs (property - set).
    const propertiesArray = Object.fromEntries(Object.entries(uniqueSets)
    // Map and transform each set into a sorted array of values.
        .map(([property, set]) => [property, Array.from(set).sort()])
    );

    return propertiesArray;
};