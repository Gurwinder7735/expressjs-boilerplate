module.exports = {
  getPaginatedResults: async (
    {
      model,
      page = 1,
      limit = 10,
      where,
      attributes,
      includeOptions = [],
      otherOptions
    }
  ) => {
    return new Promise((resolve, reject) => {
      const currentPage = Number(page); // Current page number
      const nextPage = currentPage + 1; // Calculate next page number
      const prevPage = currentPage - 1; // Calculate previous page number
      const offset = currentPage * limit - limit;

      model
        .findAndCountAll({
          include: includeOptions,
          limit: Number(limit),
          offset: offset,
          attributes,
          where,
          ...otherOptions,
        })
        .then((results) => {
          const totalPages = Math.ceil(results.count / limit);
          const hasNextPage = nextPage <= totalPages;
          const hasPrevPage = prevPage >= 1;

          resolve({
            data: results.rows,
            totalItems: results.count,
            currentPage: currentPage,
            totalPages: totalPages,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage,
          });
        })
        .catch((err) => reject(err));
    });
  },

  getChatEventName: (name) => {
    return `${process.env.CHAT_EVENT}-${name}`;
  }
}