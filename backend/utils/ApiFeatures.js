export default class ApiFeatures {
  constructor(querry, querryStr) {
    this.querry = querry;
    this.querryStr = querryStr;
  }
  search() {
    const keyword = this.querryStr.keyword
      ? {
          name: {
            $regex: this.querryStr.keyword,
            $option: "i",
          },
        }
      : {};
    console.log(keyword);
    this.querry.find({ ...keyword });
    return this;
  }
}
