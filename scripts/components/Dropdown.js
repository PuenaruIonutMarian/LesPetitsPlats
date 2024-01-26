import {
    cleanString
} from '../utils/cleanString.js';

/**
 * Dropdown class represents a dropdown menu with filtering and search functionality.
 */
export default class Dropdown {
        /**
     * Creates an instance of Dropdown.
     * @param {string} name - The name of the dropdown.
     * @param {string[]} items - The list of items in the dropdown.
     * @param {Search} searchInstance - An instance of the Search class for tag handling.
     */
    constructor(name, items, searchInstance) {
        this.name = name;
        this.items = items;
        this.filteredItems = [];
        this.itemList = null;
        this.searchInstance = searchInstance;

        
    }

        /**
     * Creates the HTML structure for the dropdown and sets up event listeners.
     * @returns {HTMLElement} - The HTML element representing the dropdown.
     */
    createDropdown() {
        const dropdownContent = `
                <div class="dropdown"> 
                    <button class="dropdown_btn" type="button">
                        <span>${this.name}</span>
                        <span class="fa-solid fa-chevron-down" aria-hidden="true"></span>
                    </button>

                    <div class="dropdown_content">
                        <div>
                            <input tabindex="-1" type="text" id="search-${this.name}" maxlength="12">
                            <button tabindex="-1"></button>
                            <label for="search-${this.name}" aria-label="Search by ${this.name}"></label>
                        </div>
                        <ul class="dropdown_content_list">
                            ${this.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>                          
        `;
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.setAttribute('class', 'dropdown_wrapper');
        dropdownWrapper.innerHTML = dropdownContent;

        const inputElement = dropdownWrapper.querySelector(`#search-${this.name}`);
        this.itemList = dropdownWrapper.querySelectorAll('.dropdown_content_list li');


        inputElement.addEventListener('input', () => {
            this.search(cleanString(inputElement.value));
            this.toggleDeleteBtn(inputElement);
        });

        this.tagHandler(inputElement);

        return dropdownWrapper;
    }


    /**
     * Updates the displayed items in the dropdown based on the filtered items.
     * @param {string[]} filteredItems - The filtered items to be displayed.
     * @param {string} [_inputValue] - The input value from the search.
     * @param {string[]} [match] - The matching items for the input value.
     */
    updateItems(filteredItems, _inputValue, match) {
        this.filteredItems = filteredItems;

        this.itemList.forEach(item => (item.style.display = 'none'));

        let items = match ? match : this.filteredItems;

        items.forEach(itemText => {
            const itemElement = [...this.itemList].find(
                (item) => cleanString(item.textContent) === cleanString(itemText)
            );
            if (itemElement) itemElement.style.display = 'block';
        });
    }


    /**
     * Searches for items that match the input value and updates the displayed items.
     * @param {string} inputValue - The input value for searching.
     */
    search(inputValue) {
        const itemsToSearch = !this.filteredItems.length ? this.items : this.filteredItems;

        const match = itemsToSearch.filter(item => {
            const normalizedItem = cleanString(item);
            return normalizedItem.includes(inputValue);
        });

        this.updateItems(this.filteredItems, inputValue, match)
    }


    /**
     * Resets the displayed item list in the dropdown.
     */
    resetItemList() {
        this.itemList.forEach((item) => (item.style.display = 'block'));
        this.filteredItems = [];
    }


        /**
     * Toggles the visibility of the delete button based on the input value.
     * @param {HTMLInputElement} inputElement - The input element of the dropdown.
     */
    toggleDeleteBtn(inputElement) {
        const btnDelete = inputElement.nextElementSibling;
        const inputValue = inputElement.value;
        inputValue.length > 0 ? (btnDelete.style.display = 'block') : (btnDelete.style.display = 'none');

        btnDelete.addEventListener('click', () => {
            inputElement.value = '';
            btnDelete.style.display = 'none';

            const itemsToReset = !this.filteredItems.length ? this.items : this.filteredItems;
            
            this.updateItems(itemsToReset, inputValue, null);

        });
    }


     /**
     * Handles click and Enter key events on dropdown items to add tags.
     * @param {HTMLInputElement} inputElement - The input element of the dropdown.
     */
    tagHandler(inputElement) {
        this.itemList.forEach((item) => {
            item.addEventListener('click', () => {
                this.searchInstance.addTag(item.textContent);
                inputElement.value = '';
            });

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.searchInstance.addTag(item.textContent);
                inputElement.value = '';
            });
        });
    }

}