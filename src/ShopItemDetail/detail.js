import '../App.css';
import React,  {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';

function ItemDetail() {

    useEffect(()=>{
        fetchItem();
    },[])
    
    const [item, setItem] = useState({})
    const id = useParams()
    
    const fetchItem = async () => {
        const gotItem = await fetch(`https://fortnite-api.theapinetwork.com/item/get?id=${id.id}`)
        const item = await gotItem.json()
        setItem((item.data))
    }

    if (item.item){
        return (
            <div className="ItemDetail">
                <h1>{item.item.name}</h1>
                <img src={item.item.images.background} alt=""></img> 
            </div>
        )
    }
    else{
        return null
    }
    
}

export default ItemDetail;