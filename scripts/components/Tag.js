/**
 * Represents a tag in the user interface.
 */
export default class Tag {
      /**
     * Creates an instance of Tag.
     * @param {string} name - The name of the tag.
     * @param {Search} searchInstance - The search instance associated with the tag.
     */
  constructor(name, searchInstance) {
    this.name = name;
    this.searchInstance = searchInstance; 
  }

    /**
     * Creates a tag element and appends it to the tag section in the UI.
     * @returns {HTMLElement} - The created tag element.
     */
    createTag() {
        // Get the tag section element from the DOM
        const tagSection = document.querySelector('.tag_section');

        // Create a new div element for the tag
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <h3>${this.name}</h3>
            <button></button>
        `;

        // Get the button element inside the tag
        const tagBtn = tag.querySelector('button');
        tagBtn.addEventListener('click', () => this.removeTag());

        // Append the tag to the tag section
        tagSection.appendChild(tag);

        return tag;
    }

    /**
     * Removes the tag from the UI and updates the search based on the remaining selected tags.
     */
    removeTag() {
      // Get the current input value from the search input
      const inputValue = document.querySelector('#search-recipe').value;
      // Find the closest parent tag element
      const tag = event.target.closest('.tag');
      if (tag) {
        // Remove leading and trailing spaces from the tag name
        const tagName = tag.querySelector('h3').textContent.trim();
        // Remove the tag from the selected tags array in the search instance
        this.searchInstance.selectedTags.splice(this.searchInstance.selectedTags.indexOf(tagName), 1);

        // Check if there are still selected tags
        if (this.searchInstance.selectedTags.length > 0) {
          // Filter recipes based on the remaining selected tags
          this.searchInstance.filterRecipes(this.searchInstance.allRecipes, this.searchInstance.selectedTags, inputValue);
        } else {
          // If no tags are selected, reset the content
          this.searchInstance.filterRecipes(this.searchInstance.allRecipes, [], inputValue);
          // this.searchInstance.filterRecipesBySearch(this.searchInstance.allRecipes, inputValue);
        }

        // Remove the tag from the UI
        tag.remove();
      }
    }

}
