import React from 'react';
import './recipeitem.css';

const RecipeItem = ({item}) => {
    return (
        <div className="recipe__item-container">
            <div className="recipe__item-img">
                <img src={item.img} alt={item.name}/>
            </div>
            <div className="recipe__item-name">
                <p>Name : {item.name}</p>
            </div>
            <div className="recipe__item-duration">
                <p>Duration : {item.duration} minutes</p>
            </div>
        </div>
    );
};

export default RecipeItem;