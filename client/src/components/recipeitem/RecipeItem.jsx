import React from 'react';
import './recipeitem.css';

const RecipeItem = ({item}) => {
    console.log(item);
    return (
        <div className="recipe__item-container">
            <div className="recipe__item-img">
            </div>
            <div className="recipe__item-name">
                <p>Nom : {item.name}</p>
            </div>
            <div className="recipe__item-duration">
                <p>Durée : {item.duration} minutes</p>
            </div>
        </div>
    );
};

export default RecipeItem;