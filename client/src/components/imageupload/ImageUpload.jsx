import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload }) => {
	const [image, setImage] = useState(null);

	const handleChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
				onImageUpload(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div>
			<input type='file' accept='image/*' onChange={handleChange} />
			{image && (
				<img
					src={image}
					alt='preview'
					style={{ maxWidth: '200px', maxHeight: '200px' }}
				/>
			)}
		</div>
	);
};

export default ImageUpload;
