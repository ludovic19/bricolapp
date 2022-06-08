import "../css/Carousel.css";
import React from "react";
import AliceCarousel from "react-alice-carousel";


export default function Carousel() {
  const handleDragStart = (e) => e.preventDefault();

  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
    1280: { items: 5 },
  };

  const items = [
    <div onDragStart={handleDragStart}><div class="carousel-item">Uno</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Deux</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Trois</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Quatre</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Deux</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Trois</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Quatre</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Deux</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Trois</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Quatre</div></div>,
    <div onDragStart={handleDragStart}><div class="carousel-item">Cinq</div></div>,
  ];

  return (
    <AliceCarousel mouseTracking disableButtonsControls="true" responsive={responsive}items={items} />
  );
}
