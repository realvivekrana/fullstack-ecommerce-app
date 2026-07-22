class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword', 'minPrice', 'maxPrice'];
    excludedFields.forEach((field) => delete queryObj[field]);

    this.query = this.query.find(queryObj);

    // Handle price range explicitly (avoids relying on bracket-notation query
    // string parsing, which Express 5 no longer does by default)
    if (this.queryString.minPrice || this.queryString.maxPrice) {
      const priceFilter = {};
      if (this.queryString.minPrice) priceFilter.$gte = Number(this.queryString.minPrice);
      if (this.queryString.maxPrice) priceFilter.$lte = Number(this.queryString.maxPrice);
      this.query = this.query.find({ price: priceFilter });
    }

    return this;
  }

  search() {
    if (this.queryString.keyword) {
      this.query = this.query.find({
        $or: [
          { name: { $regex: this.queryString.keyword, $options: 'i' } },
          { category: { $regex: this.queryString.keyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortMap = {
        'price-asc': 'price',
        'price-desc': '-price',
        rating: '-rating',
        newest: '-createdAt',
      };
      const sortBy = sortMap[this.queryString.sort] || this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;