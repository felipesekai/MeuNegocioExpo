import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './model/schema'
import Client from './model/Client'
import Product from './model/Product'
import Order from './model/Order'
import OrderProduct from './model/OrderProduct'

const adapter = new SQLiteAdapter({
  schema: mySchema,
  // (You might want to comment out it in development purposes)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true, /* Platform.OS === 'ios' */
  // (optional, but you should implement this method)
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  }
})

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Client,
    Product,
    Order,
    OrderProduct
  ],
})

