class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  searchFeature() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filterFeature() {
    const querryCopy = { ...this.queryStr };
    //removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    // console.log(querryCopy);
    delete querryCopy.keyword;
    delete querryCopy.page;
    delete querryCopy.limit;
    // removeFields.forEach((element) => {
    //   delete querryCopy[element];
    // });
    // console.log(querryCopy);
    this.query = this.query.find(querryCopy);
    return this;
  }
  paginationFeature(resultsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
