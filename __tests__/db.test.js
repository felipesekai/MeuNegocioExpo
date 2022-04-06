import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../src/database";
import {app} from '../src/services/firebaseConnect';

describe("firebase db test", () =>{

    // beforeAll(() => {
    //     jest.setTimeout(10000);
    // });

    it("should get user",  () =>{
        var data = null
        try {
            const db = getDatabase();
           
            const userRef =  ref(db, 'users/38t80GlTFuOuIJA9haHbUg0TExB3');
               onValue(userRef, (snapshot) => {
                data = snapshot.val()   ;
                expect("sekai@sekai.com").toBe(data.email);
            
            });
        } catch (error) {
            
        }

      
           

            
        
          
           
        
           
            
    })
})