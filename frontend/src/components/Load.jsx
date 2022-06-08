import React from "react";
import ReactLoadings from "react-loading";
import Logo from "../LogoBricolApp.png";
import "../css/Load.css";


//------------PAGE DE CHARGEMENT(PRMIER ACCUEIL)-------



export default function Load() {
  return (
    <div className="loading-elements">
      <img src={Logo} alt="logo" className="logo" />
      <ReactLoadings type="spinningBubbles" color="#38726C" />
      <h1 className="loading-title">Bienvenu dans Bricol'App</h1>
    </div>
  );
}
