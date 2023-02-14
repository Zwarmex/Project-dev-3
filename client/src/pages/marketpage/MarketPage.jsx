import React, { useEffect, useState } from "react";
import "./marketpage.css";

const MarketPage = () => {
  useEffect(() => {
    fetchItems();
  }, []);

  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const data = await fetch("/marketplace");
    const items = await data.json();
    setItems(items);
  };

  return (
    <div className="recipe__marketplace-container">
      {items.map((item) => (
        <div className="recipe__marketplace-item">
          <p>Nom : {item.name}</p>
          <p>Durée : {item.duration} minutes</p>
          <p>Instructions :{item.intructions}</p>
        </div>
      ))}
    </div>
  );
};

export default MarketPage;
