import { Model } from '@nozbe/watermelondb'
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Client extends Model {
  static table = 'clients'

  static associations = {
    orders: { type: 'has_many', foreignKey: 'client_id' },
  }

  @text('name') name
  @text('phone') phone

  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}
