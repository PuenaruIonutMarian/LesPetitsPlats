import { selectedTags, search } from '../pages/index.js';

// Tag.js
export default class Tag {
  constructor(name, searchInstance) {
    this.name = name;
    this.searchInstance = searchInstance; 
  }


    createTag() {
        const tagSection = document.querySelector('.tag_section');
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <h3>${this.name}</h3>
            <button></button>
        `;

        const tagBtn = tag.querySelector('button');
        tagBtn.addEventListener('click', () => this.removeTag());

        tagSection.appendChild(tag);

        return tag;
    }


  removeTag() {
    const inputValue = document.querySelector('#search-recipe').value;
    const tag = event.target.closest('.tag');
    if (tag) {
      // Remove leading and trailing spaces from the tag name
      const tagName = tag.querySelector('h3').textContent.trim();
      console.log('Removing tag:', tagName);
      this.searchInstance.selectedTags.splice(this.searchInstance.selectedTags.indexOf(tagName), 1);

      // Check if there are still selected tags
      if (this.searchInstance.selectedTags.length > 0) {
        this.searchInstance.filterRecipesByTags(this.searchInstance.allRecipes, this.searchInstance.selectedTags, inputValue);
      } else {
        // If no tags are selected, reset the content
        this.searchInstance.filterRecipesByTags(this.searchInstance.allRecipes, [], inputValue);
      }

      tag.remove();
    }
  }

}
