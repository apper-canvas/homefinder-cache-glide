import { toast } from 'react-toastify';

class FavoritesService {
  constructor() {
    this.tableName = 'favorite';
    this.fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'property_id', 'saved_at'
    ];
  }

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: this.fields,
        orderBy: [{ FieldName: "saved_at", SortType: "DESC" }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data) {
        return [];
      }

      return response.data.map(favorite => ({
        id: favorite.Id,
        propertyId: favorite.property_id?.toString(),
        savedAt: favorite.saved_at
      }));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  }

  async getById(propertyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: this.fields,
        where: [{
          FieldName: "property_id",
          Operator: "ExactMatch",
          Values: [parseInt(propertyId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        throw new Error('Favorite not found');
      }

      const favorite = response.data[0];
      return {
        id: favorite.Id,
        propertyId: favorite.property_id?.toString(),
        savedAt: favorite.saved_at
      };
    } catch (error) {
      console.error(`Error fetching favorite for property ${propertyId}:`, error);
      throw error;
    }
  }

  async isFavorite(propertyId) {
    try {
      const favorite = await this.getById(propertyId);
      return !!favorite;
    } catch (error) {
      // Not found means not a favorite
      return false;
    }
  }

  async create(propertyId) {
    try {
      // Check if already exists
      const isFav = await this.isFavorite(propertyId);
      if (isFav) {
        const existing = await this.getById(propertyId);
        return existing;
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const favoriteData = {
        property_id: parseInt(propertyId),
        saved_at: new Date().toISOString()
      };

      const params = { records: [favoriteData] };
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
          console.error(`Failed to create favorite:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to add to favorites');
        }
        
        if (successfulRecords.length > 0) {
          const created = successfulRecords[0].data;
          return {
            id: created.Id,
            propertyId: created.property_id?.toString(),
            savedAt: created.saved_at
          };
        }
      }
    } catch (error) {
      console.error("Error creating favorite:", error);
      throw error;
    }
  }

  async delete(propertyId) {
    try {
      // First find the favorite record
      const favorite = await this.getById(propertyId);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { RecordIds: [favorite.id] };
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
          console.error(`Failed to delete favorite:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to remove from favorites');
        }
        
        return successfulDeletions.length > 0 ? favorite : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error deleting favorite:", error);
      throw error;
    }
  }

  async toggle(propertyId) {
    try {
      const isFav = await this.isFavorite(propertyId);
      if (isFav) {
        return await this.delete(propertyId);
      } else {
        return await this.create(propertyId);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }
}

export default new FavoritesService();