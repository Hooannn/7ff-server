import { HttpException } from '@/exceptions/HttpException';
import Category, { ICategory } from '../models/Category';
import { errorStatus } from '@/config';
class CategoriesService {
  private Category = Category;

  public async getAllCategories({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.Category.countDocuments(parseFilter).sort(parseSort);
    const categories = await this.Category.find(parseFilter, null, { limit, skip }).sort(parseSort);
    return { total, categories };
  }

  public async addCategory(reqCategory: ICategory) {
    const { name } = reqCategory;
    const existedCategory = await this.Category.findOne({
      $or: [{ 'name.vi': name.vi }, { 'name.en': name.en }],
    });
    if (existedCategory) throw new HttpException(400, errorStatus.CATEGORY_DUBLICATE_NAME);
    const category = new this.Category(reqCategory);
    await category.save();
    return category;
  }

  public async deleteCategory(categoryId: string) {
    return this.Category.findByIdAndDelete(categoryId);
  }

  public async updateCategory(categoryId: string, category: ICategory) {
    return await this.Category.findOneAndUpdate({ _id: categoryId }, category, { returnOriginal: false });
  }
}

export default CategoriesService;
