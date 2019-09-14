import axios from 'axios'
import {KEY, proxy} from '../config'

export default class Search {
    constructor(query){
        this.query = query
    }

    async getResult() {
        try {
        const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${KEY}&q=${this.query}`);
        this.result = res.data.recipes;
        }
        catch(error) {
            console.log(error)
        }
    }
}