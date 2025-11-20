import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class OrderProduct extends Model {
  static table = 'order_products'
  static associations = {
    orders: { type: 'belongs_to', key: 'order_id' },
    products: { type: 'belongs_to', key: 'product_id' },
  }

  @field('quantity') quantity
  @relation('orders', 'order_id') order
  @relation('products', 'product_id') product
}
