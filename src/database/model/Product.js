import { Model } from '@nozbe/watermelondb'
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Product extends Model {
  static table = 'products'

  @text('name') name
  @field('price') price

  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}
