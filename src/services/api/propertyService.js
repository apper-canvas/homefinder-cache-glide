import propertyData from '../mockData/property.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    this.data = [...propertyData];
  }

  async getAll(filters = {}) {
    await delay(300);
    let filteredData = [...this.data];

    // Apply filters
    if (filters.priceMin) {
      filteredData = filteredData.filter(property => property.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filteredData = filteredData.filter(property => property.price <= filters.priceMax);
    }
    if (filters.bedroomsMin) {
      filteredData = filteredData.filter(property => property.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filteredData = filteredData.filter(property => property.bathrooms >= filters.bathroomsMin);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filteredData = filteredData.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      );
    }
    if (filters.location) {
      filteredData = filteredData.filter(property => 
        property.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.address.state.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.address.street.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.squareFeetMin) {
      filteredData = filteredData.filter(property => property.squareFeet >= filters.squareFeetMin);
    }

    return filteredData;
  }

  async getById(id) {
    await delay(200);
    const property = this.data.find(item => item.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  }

  async getFeatured() {
    await delay(250);
    return this.data.filter(property => property.featured).slice(0, 6);
  }

  async create(property) {
    await delay(400);
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newProperty);
    return { ...newProperty };
  }

  async update(id, data) {
    await delay(350);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    this.data[index] = { ...this.data[index], ...data };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new PropertyService();