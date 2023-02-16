import React from 'react';
import './loadingspinner.css';

const LoadingSpinner = () => {
	return (
		<div className='loading-spinner__container'>
			<div className='loading-spinner__content'>{4 >= 3}</div>
		</div>
	);
};

export default LoadingSpinner;
