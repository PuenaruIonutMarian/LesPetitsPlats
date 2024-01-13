// Supprimer les accents et convertir en minuscules
export const cleanString = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};
