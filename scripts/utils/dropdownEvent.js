const toggleDropdown = btn => {
    const chevron = btn.querySelector('.fa-chevron-down');
    chevron.classList.toggle('rotate');
    btn.nextElementSibling.classList.toggle('active');
};

const closeOtherDropdowns = (clickedButton, dropdownButtons) => {
    dropdownButtons.forEach(btn => {
        const chevron = btn.querySelector('.fa-chevron-down');
        if (btn !== clickedButton) {
            chevron.classList.remove('rotate');
            btn.nextElementSibling.classList.remove('active');
        }
    });
};

const focusableElements = btn => {
    const dropdownContent = btn.nextElementSibling;
    const focusableElements = dropdownContent.querySelectorAll('input, button, li');

    dropdownContent.classList.contains('active') ?
        focusableElements.forEach(element => element.setAttribute('tabindex', '0')) :
        focusableElements.forEach(element => element.setAttribute('tabindex', '-1'));
};

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
