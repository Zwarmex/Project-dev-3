import React, { useEffect, useState } from "react";
import { LoadingSpinner, RecipeItem } from "../../components";
import "./marketpage.css";
// import { Fetch } from 'fetch-plus';


const MarketPage = () => {

  const [items, setItems] = useState([]);

  const fetchItems = async () => 
  {
    const data = await fetch("/marketplace");
    const items = await data.json();
    setItems(items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="recipe__marketplace-container">
      {items.length !== 0 ?
      <>
        <h1>Category</h1>
        <div className="recipe__marketplace-row">
          {items.map((item) => (
            < RecipeItem item={item}/>
          ))}
        </div>
        <h1>Category</h1>
        <div className="recipe__marketplace-row">
          {items.map((item) => (
              < RecipeItem item={item}/>
          ))}
        </div>
        <h1>Category</h1>
        <div className="recipe__marketplace-row">
          {items.map((item) => (
              < RecipeItem item={item}/>
          ))}
        </div>
        <h1>Category</h1>
        <div className="recipe__marketplace-row">
          {items.map((item) => (
              < RecipeItem item={item}/>
          ))}
        </div>
        <h1>Category</h1>
        <div className="recipe__marketplace-row">
          {items.map((item) => (
              < RecipeItem item={item}/>
          ))}
        </div>
      </>
      : 
      <div className="marketplace__no-recipe__container">
        <h1>NO RECIPES...</h1>
        <div className="marketplace__no-recipe__loading-spinner__container">
          <LoadingSpinner />
        </div>
      </div>
      }
      
    </div>
  );
};

export default MarketPage;
