export const getFavorites = () => {
  const favs = localStorage.getItem('favorites');
  return favs ? JSON.parse(favs) : [];
};

export const toggleFavorite = (shopId) => {
  const favs = getFavorites();
  const index = favs.indexOf(shopId);
  let newFavs = [];
  if (index >= 0) {
    newFavs = favs.filter(id => id !== shopId);
  } else {
    newFavs = [...favs, shopId];
  }
  localStorage.setItem('favorites', JSON.stringify(newFavs));
  // Dispatch event so other components can re-render
  window.dispatchEvent(new Event('favoritesChanged'));
  return newFavs;
};

export const isFavorite = (shopId) => {
  return getFavorites().includes(shopId);
};
