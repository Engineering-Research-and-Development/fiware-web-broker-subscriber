import '../App.css';
import React,  {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

function Shop() {

    //EFFECT HOOK
    useEffect(() => {
        fetchItems();
    },[] // <- Queste parentesi quadre vuote significano che useEffect parte quando il componente si monta
    )

    //STATE HOOK
    //useState setta l'inizializzazione dello stato. La scrittura significa:
    //setta state = {items: []}
    //dopo di che, la funzione setItem è associata a quel parametro di stato. Quindi avremo
    //setItems --> this.setState(items : items (linea 4 di fetchItems))
    const [items, setItems] = useState([]) 



    const fetchItems = async () =>{
        const data = await fetch('https://fortnite-api.theapinetwork.com/upcoming/get')
        const items = await data.json()
        console.log(items);
        setItems(items.data)
    }
    return (
        <div className="About">
        <h1>Shop Page</h1>
        {items.map (item => (
            //Su questi vogliamo fare routing dinamico.
            <h5 key={item.itemId}><Link to={`/shop/${item.itemId}`}>{item.item.name}</Link></h5>
        ))}
        </div>
    );
}

export default Shop;