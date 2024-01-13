export const dropdownValues = recipes => {
    const uniqueSets = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set()
    };

    const addValueToSet = (propertySet, value) => propertySet.add(value.toLowerCase()) ;

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => addValueToSet(uniqueSets.ingredients, ingredient.ingredient));
        addValueToSet(uniqueSets.appliances, recipe.appliance);
        recipe.ustensils.forEach(ustensil => addValueToSet(uniqueSets.ustensils, ustensil));
    });

    //Object.entries prend l'objet uniqueSets pour creer un tableau de paires Key - value (key - set).
    const propertiesArray = Object.fromEntries(Object.entries(uniqueSets)
    //map itère et transforme l'ensemble de valeurs en un tableau en utilisant Array.from(set), puis trie alphabétiquement le tableau avec .sort()
        .map(([property, set]) => [property, Array.from(set).sort()])
    );

    return propertiesArray;
};