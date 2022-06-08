import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InterestId from "./InterestId";
import Carousel from "./Carousel";


////------Mes centre d’interet--------------------------------



const axios = require("axios").default;

export default function Question() {
  const { register, handleSubmit } = useForm();
  const [selected, setSelected] = useState([]);
  const onSubmit = (data) => setSelected(data);
  return (
    <React.Fragment>
        <h1>Mes centres d’interêt</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="créer votre centre d'interêt !"
            {...register("questions", { required: true })} />
          
          <input className="validation-button" type="submit" value="Créer" />
        </form>
        <div className="carousel-body">
          <Carousel />
        </div>
    </React.Fragment>
// ajouter le caroussel

        );
}
