const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SearchFiltersService {
  constructor() {
    this.storageKey = 'homefinder_search_filters';
    this.defaultFilters = {
      priceMin: null,
      priceMax: null,
      bedroomsMin: null,
      bathroomsMin: null,
      propertyTypes: [],
      location: '',
      squareFeetMin: null
    };
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? { ...this.defaultFilters, ...JSON.parse(stored) } : { ...this.defaultFilters };
    } catch (error) {
      console.error('Failed to load filters from storage:', error);
      return { ...this.defaultFilters };
    }
  }

  saveToStorage(filters) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save filters to storage:', error);
    }
  }

  async getAll() {
    await delay(100);
    return this.loadFromStorage();
  }

  async save(filters) {
    await delay(150);
    const cleanFilters = { ...this.defaultFilters, ...filters };
    this.saveToStorage(cleanFilters);
    return { ...cleanFilters };
  }

  async reset() {
    await delay(100);
    this.saveToStorage(this.defaultFilters);
    return { ...this.defaultFilters };
  }

  getPropertyTypes() {
    return [
      'House',
      'Apartment',
      'Condo',
      'Townhouse',
      'Single Family',
      'Multi Family',
      'Land',
      'Commercial'
    ];
  }

  getPriceRanges() {
    return [
      { label: 'Under $200K', min: 0, max: 200000 },
      { label: '$200K - $400K', min: 200000, max: 400000 },
      { label: '$400K - $600K', min: 400000, max: 600000 },
      { label: '$600K - $800K', min: 600000, max: 800000 },
      { label: '$800K - $1M', min: 800000, max: 1000000 },
      { label: 'Over $1M', min: 1000000, max: null }
    ];
  }
}

export default new SearchFiltersService();