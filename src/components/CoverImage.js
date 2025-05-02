import React from 'react';

const CoverImage = ({ cover, altText }) => {
  // Si no se pasa cover, muestra una imagen por defecto
  const imageSrc = cover || '/covers/default.png'; // Ruta a la imagen por defecto

  return <img src={imageSrc} alt={altText} className="coverImage" />;
};

export default CoverImage;