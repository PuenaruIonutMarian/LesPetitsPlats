/**
 * Represents a Recipe Card to display recipe information.
 */
export default class RecipeCard {
        /**
     * Creates an instance of RecipeCard.
     * @param {Recipe} recipe - The recipe object to display.
     */
    constructor(recipe) {
        this.recipe = recipe;
    }

    /**
     * Creates the HTML structure for the recipe card and appends it to the card section.
     */
    createCard() {
         // Get the card section element from the DOM
        const cardSection = document.querySelector('.cards_section');

        // Create the HTML content for the recipe card
        const cardContent = `
            <article class="card" data-id=${this.recipe.id}>
                ${
                    this.recipe.time > 0
                        ? ` <p class="card_time">
                            ${
                                this.recipe.time > 60
                                    ? `${Math.floor(this.recipe.time / 60)} h ${this.recipe.time % 60}`
                                    : `${this.recipe.time} min`
                            }
                            </p>`
                        : ''
                }
                <img src="./images/recipes/${this.recipe.image}" alt="${this.recipe.name}">
                <div class="card_infos">
                    <h2>${this.recipe.name}</h2>
                    <div class="card_infos_instructions">
                        <h3>Recette</h3>
                        <p>${this.recipe.description}</p>
                    </div>
                    <div class="card_infos_ingredients">
                        <h3>Ingrédients</h3>
                        <ul>
                            ${this.recipe.ingredients.map(ingredient => `
                                <li>
                                    <span>${ingredient.ingredient}</span>
                                    ${ingredient.quantity ? `<span>${ingredient.quantity} ${ingredient.unit || ''}</span>` : ''}
                                </li>`
                            ).join('')} 
                        </ul>
                    </div>
                </div>
            </article>
        </section>
        `;
        
        // Append the card content to the card section
        cardSection.innerHTML += cardContent;
    }
}

//VAR 1
                    // <div class="card_infos_ingredients">
                    //     <h3>Ingrédients</h3>
                    //     <ul>
                    //         ${this.recipe.ingredients.map(ingredient => {
                    //             if (ingredient.quantity && ingredient.unit) {
                    //                 return `
                    //                     <li>
                    //                         <span>${ingredient.ingredient}</span>
                    //                         <span>${ingredient.quantity} ${ingredient.unit}</span>
                    //                     </li>
                    //                         `;
                    //             } else {
                    //                 return `
                    //                     <li>
                    //                         <span>${ingredient.ingredient}</span>
                    //                     </li>
                    //                         `;
                    //             }
                    //         }).join('')} 
                    //     </ul>
                    // </div>


//VAR 2 
                    // <div class="card_infos_ingredients">
                    //     <h3>Ingrédients</h3>
                    //     <ul>
                    //         ${this.recipe.ingredients.map(ingredient => `
                    //             <li>
                    //                 <span>${ingredient.ingredient}</span>
                    //                 <span>${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ''}</span>
                    //             </li>
                    //         `).join('')} 
                    //     </ul>
                    // </div>

//var 3 

// <div class="card_infos_ingredients">
//                         <h3>Ingrédients</h3>
//                         <ul>
//                             ${this.recipe.ingredients.map(ingredient => {
//                                 if (ingredient.quantity && ingredient.unit) {
//                                     return `
//                                         <li>
//                                             <span>${ingredient.ingredient}</span>
//                                             <span>${ingredient.quantity} ${ingredient.unit}</span>
//                                         </li>
//                                             `;
//                                 }else if(ingredient.quantity && !ingredient.unit){
//                                     return`
//                                         <li>
//                                             <span>${ingredient.ingredient}</span>
//                                             <span>${ingredient.quantity}</span>
//                                         </li> `  
//                                 } else {
//                                     return `
//                                         <li>
//                                             <span>${ingredient.ingredient}</span>
//                                         </li>
//                                             `;
//                                 }
//                             }).join('')} 
//                         </ul>
//                     </div>