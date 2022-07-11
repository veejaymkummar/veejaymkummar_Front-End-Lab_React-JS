import axios from 'axios';
import IItem from '../models/iItems';
const baseURL = process.env.REACT_APP_BASE_URL;

const getItems = async () =>{
    const reponse = await axios.get<IItem[]>(`${baseURL}/items`);
    return reponse.data;
}
const addExpenseItem = async( item : Omit<IItem, 'id'>) =>
{
    const response = await axios.post<IItem>(`${baseURL}/items`, item,{
        headers:{
            'Content-Type':'application/json'
        }
    })
    return response.data;
}
export{getItems, addExpenseItem};