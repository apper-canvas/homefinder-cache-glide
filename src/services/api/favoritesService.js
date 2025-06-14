const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FavoritesService {
  constructor() {
    this.storageKey = 'homefinder_favorites';
    this.data = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load favorites from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save favorites to storage:', error);
    }
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const favorite = this.data.find(item => item.propertyId === id);
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    return { ...favorite };
  }

  async isFavorite(propertyId) {
    await delay(100);
    return this.data.some(item => item.propertyId === propertyId);
  }

  async create(propertyId) {
    await delay(250);
    const existing = this.data.find(item => item.propertyId === propertyId);
    if (existing) {
      return { ...existing };
    }
    
    const newFavorite = {
      propertyId,
      savedAt: new Date().toISOString()
    };
    
    this.data.push(newFavorite);
    this.saveToStorage();
    return { ...newFavorite };
  }

  async delete(propertyId) {
    await delay(200);
    const index = this.data.findIndex(item => item.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    this.saveToStorage();
    return { ...deleted };
  }

  async toggle(propertyId) {
    const isFav = await this.isFavorite(propertyId);
    if (isFav) {
      return await this.delete(propertyId);
    } else {
      return await this.create(propertyId);
    }
  }
}

export default new FavoritesService();