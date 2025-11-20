import { Model } from '@nozbe/watermelondb'
import { field, text, relation, children, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Order extends Model {
  static table = 'orders'
  static associations = {
    order_products: { type: 'has_many', foreignKey: 'order_id' },
  }

  @text('status') status
  @relation('clients', 'client_id') client

  @children('order_products') products

  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}
