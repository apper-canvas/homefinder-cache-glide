import { toast } from 'react-toastify';

class PropertyService {
  constructor() {
    this.tableName = 'property';
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'price', 'address_street', 'address_city', 'address_state', 
      'address_zip_code', 'address_country', 'bedrooms', 'bathrooms', 
      'square_feet', 'property_type', 'images', 'description', 'amenities',
      'coordinates_lat', 'coordinates_lng', 'year_built', 'status', 'featured'
    ];
  }

  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const where = [];
      
      // Apply filters
      if (filters.priceMin) {
        where.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }
      if (filters.priceMax) {
        where.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }
      if (filters.bedroomsMin) {
        where.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedroomsMin]
        });
      }
      if (filters.bathroomsMin) {
        where.push({
          FieldName: "bathrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathroomsMin]
        });
      }
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        where.push({
          FieldName: "property_type",
          Operator: "Contains",
          Values: filters.propertyTypes
        });
      }
      if (filters.location) {
        where.push({
          FieldName: "address_city",
          Operator: "Contains",
          Values: [filters.location]
        });
      }
      if (filters.squareFeetMin) {
        where.push({
          FieldName: "square_feet",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.squareFeetMin]
        });
      }

      const params = {
        Fields: this.fields,
        where: where.length > 0 ? where : undefined,
        orderBy: [{ FieldName: "CreatedOn", SortType: "DESC" }],
        PagingInfo: { Limit: 50, Offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(property => ({
        id: property.Id?.toString(),
        title: property.title || property.Name,
        price: property.price,
        address: {
          street: property.address_street,
          city: property.address_city,
          state: property.address_state,
          zipCode: property.address_zip_code,
          country: property.address_country
        },
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        propertyType: property.property_type,
        images: property.images ? property.images.split(',').map(img => img.trim()) : [],
        description: property.description,
        amenities: property.amenities ? property.amenities.split(',').map(amenity => amenity.trim()) : [],
        coordinates: {
          lat: property.coordinates_lat,
          lng: property.coordinates_lng
        },
        yearBuilt: property.year_built,
        status: property.status,
        featured: property.featured
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { fields: this.fields };
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error('Property not found');
      }

      const property = response.data;
      return {
        id: property.Id?.toString(),
        title: property.title || property.Name,
        price: property.price,
        address: {
          street: property.address_street,
          city: property.address_city,
          state: property.address_state,
          zipCode: property.address_zip_code,
          country: property.address_country
        },
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        propertyType: property.property_type,
        images: property.images ? property.images.split(',').map(img => img.trim()) : [],
        description: property.description,
        amenities: property.amenities ? property.amenities.split(',').map(amenity => amenity.trim()) : [],
        coordinates: {
          lat: property.coordinates_lat,
          lng: property.coordinates_lng
        },
        yearBuilt: property.year_built,
        status: property.status,
        featured: property.featured
      };
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  }

  async getFeatured() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: this.fields,
        where: [{
          FieldName: "featured",
          Operator: "ExactMatch",
          Values: [true]
        }],
        PagingInfo: { Limit: 6, Offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data) {
        return [];
      }

      return response.data.map(property => ({
        id: property.Id?.toString(),
        title: property.title || property.Name,
        price: property.price,
        address: {
          street: property.address_street,
          city: property.address_city,
          state: property.address_state,
          zipCode: property.address_zip_code,
          country: property.address_country
        },
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        propertyType: property.property_type,
        images: property.images ? property.images.split(',').map(img => img.trim()) : [],
        description: property.description,
        amenities: property.amenities ? property.amenities.split(',').map(amenity => amenity.trim()) : [],
        coordinates: {
          lat: property.coordinates_lat,
          lng: property.coordinates_lng
        },
        yearBuilt: property.year_built,
        status: property.status,
        featured: property.featured
      }));
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      throw error;
    }
  }

  async create(property) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const propertyData = {
        title: property.title,
        price: property.price,
        address_street: property.address?.street,
        address_city: property.address?.city,
        address_state: property.address?.state,
        address_zip_code: property.address?.zipCode,
        address_country: property.address?.country,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_feet: property.squareFeet,
        property_type: property.propertyType,
        images: Array.isArray(property.images) ? property.images.join(', ') : property.images,
        description: property.description,
        amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : property.amenities,
        coordinates_lat: property.coordinates?.lat,
        coordinates_lng: property.coordinates?.lng,
        year_built: property.yearBuilt,
        status: property.status,
        featured: property.featured || false
      };

      const params = { records: [propertyData] };
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create property:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create property');
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            id: created.Id?.toString(),
            title: created.title,
            price: created.price,
            address: {
              street: created.address_street,
              city: created.address_city,
              state: created.address_state,
              zipCode: created.address_zip_code,
              country: created.address_country
            },
            bedrooms: created.bedrooms,
            bathrooms: created.bathrooms,
            squareFeet: created.square_feet,
            propertyType: created.property_type,
            images: created.images ? created.images.split(',').map(img => img.trim()) : [],
            description: created.description,
            amenities: created.amenities ? created.amenities.split(',').map(amenity => amenity.trim()) : [],
            coordinates: {
              lat: created.coordinates_lat,
              lng: created.coordinates_lng
            },
            yearBuilt: created.year_built,
            status: created.status,
            featured: created.featured
          };
        }
      }
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.address?.street !== undefined && { address_street: data.address.street }),
        ...(data.address?.city !== undefined && { address_city: data.address.city }),
        ...(data.address?.state !== undefined && { address_state: data.address.state }),
        ...(data.address?.zipCode !== undefined && { address_zip_code: data.address.zipCode }),
        ...(data.address?.country !== undefined && { address_country: data.address.country }),
        ...(data.bedrooms !== undefined && { bedrooms: data.bedrooms }),
        ...(data.bathrooms !== undefined && { bathrooms: data.bathrooms }),
        ...(data.squareFeet !== undefined && { square_feet: data.squareFeet }),
        ...(data.propertyType !== undefined && { property_type: data.propertyType }),
        ...(data.images !== undefined && { images: Array.isArray(data.images) ? data.images.join(', ') : data.images }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.amenities !== undefined && { amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : data.amenities }),
        ...(data.coordinates?.lat !== undefined && { coordinates_lat: data.coordinates.lat }),
        ...(data.coordinates?.lng !== undefined && { coordinates_lng: data.coordinates.lng }),
        ...(data.yearBuilt !== undefined && { year_built: data.yearBuilt }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.featured !== undefined && { featured: data.featured })
      };

      const params = { records: [updateData] };
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update property:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update property');
        }
        
        if (successfulUpdates.length > 0) {
          const updated = successfulUpdates[0].data;
          return {
            id: updated.Id?.toString(),
            title: updated.title,
            price: updated.price,
            address: {
              street: updated.address_street,
              city: updated.address_city,
              state: updated.address_state,
              zipCode: updated.address_zip_code,
              country: updated.address_country
            },
            bedrooms: updated.bedrooms,
            bathrooms: updated.bathrooms,
            squareFeet: updated.square_feet,
            propertyType: updated.property_type,
            images: updated.images ? updated.images.split(',').map(img => img.trim()) : [],
            description: updated.description,
            amenities: updated.amenities ? updated.amenities.split(',').map(amenity => amenity.trim()) : [],
            coordinates: {
              lat: updated.coordinates_lat,
              lng: updated.coordinates_lng
            },
            yearBuilt: updated.year_built,
            status: updated.status,
            featured: updated.featured
          };
        }
      }
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete property:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete property');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }
}

export default new PropertyService();