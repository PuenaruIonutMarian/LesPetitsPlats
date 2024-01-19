/**
 * Toggles the dropdown visibility and rotates the chevron icon.
 * @param {HTMLElement} btn - The dropdown button element.
 */
const toggleDropdown = btn => {
    const chevron = btn.querySelector('.fa-chevron-down');
    chevron.classList.toggle('rotate');
    btn.nextElementSibling.classList.toggle('active');
};


/**
 * Closes other dropdowns when a dropdown button is clicked.
 * @param {HTMLElement} clickedButton - The clicked dropdown button.
 * @param {NodeList} dropdownButtons - NodeList of all dropdown buttons.
 */
const closeOtherDropdowns = (clickedButton, dropdownButtons) => {
    dropdownButtons.forEach(btn => {
        const chevron = btn.querySelector('.fa-chevron-down');
        if (btn !== clickedButton) {
            chevron.classList.remove('rotate');
            btn.nextElementSibling.classList.remove('active');
        }
    });
};


/**
 * Sets the tabindex attribute for focusable elements based on the dropdown's state.
 * @param {HTMLElement} btn - The dropdown button element.
 */
const focusableElements = btn => {
    const dropdownContent = btn.nextElementSibling;
    const focusableElements = dropdownContent.querySelectorAll('input, button, li');

    dropdownContent.classList.contains('active') ?
        focusableElements.forEach(element => element.setAttribute('tabindex', '0')) :
        focusableElements.forEach(element => element.setAttribute('tabindex', '-1'));
};


/**
 * Adds event listeners to dropdown buttons for toggling dropdowns.
 */
export const openCloseDropdown = () => {
    const dropdownButtons = document.querySelectorAll('.dropdown_btn');

    dropdownButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleDropdown(btn);
            closeOtherDropdowns(btn, dropdownButtons);
            focusableElements(btn);
        });
    });
};
