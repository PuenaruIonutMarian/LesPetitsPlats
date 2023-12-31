
// import { recipes } from '../../data/recipes.js';

// const currentRecipes = [...recipes];
// export default class Dropdown {
//     constructor(name, items) {
//         this.name = name;
//         this.items = items;
//         this.filteredItems = [];
//         this.itemList = null;
//     }

//     createDropdown() {
//         const dropdownContent = `
//                 <div class="dropdown"> 
//                     <button class="dropdown_btn" type="button">
//                         <span>${this.name}</span>
//                         <span class="fa-solid fa-chevron-down" aria-hidden="true"></span>
//                     </button>

//                     <div class="dropdown_content">
//                         <div>
//                             <input tabindex="-1" type="text" id="search-${this.name}" maxlength="12">
//                             <button tabindex="-1"></button>
//                             <label for="search-${this.name}" aria-label="Search by ${this.name}"></label>
//                         </div>
//                         <ul class="dropdown_content_list">
//                             ${this.items.map(item => `<li>${item}</li>`).join('')}
//                         </ul>
//                     </div>
//                 </div>                          
//         `;
//         const dropdownWrapper = document.createElement('div');
//         dropdownWrapper.setAttribute('class', 'dropdown_wrapper');
//         dropdownWrapper.innerHTML = dropdownContent;

//         const inputElement = dropdownWrapper.querySelector(`#search-${this.name}`);
//         this.itemList = dropdownWrapper.querySelectorAll('.dropdown_content_list li');

//         inputElement.addEventListener('input', () => {
//             this.search(normalizeString(inputElement.value));
//             this.toggleDeleteBtn(inputElement);
//         });

//         // this.tagHandler(inputElement);

//         return dropdownWrapper;
//     }

// }
