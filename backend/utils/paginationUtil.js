// utils/paginationUtil.js

/**
 * Utility function for pagination.
 * 
 * @param {Object} model - Mongoose model to query.
 * @param {Object} query - Query filter for fetching records.
 * @param {Number} page - Current page number (default: 1).
 * @param {Number} limit - Number of records per page (default: 10).
 * @returns {Object} - Paginated result with data and pagination metadata.
 */
const paginate = async (model, query = {}, page = 1, limit = 10) => {
    try {
      // Pagination logic
      const skip = (page - 1) * limit;
      const data = await model.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ created_at: -1 })  // Sort by created_at or other field
        .lean(); // Use lean() for better performance (returns plain JS objects)
  
      // Count the total number of records that match the query (without pagination)
      const totalRecords = await model.countDocuments(query);
  
      // Pagination metadata
      const pagination = {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        perPage: limit,
      };
  
      return { data, pagination };
    } catch (err) {
      console.error(err);
      throw new Error('Pagination error');
    }
  };
  
  module.exports = { paginate };
  