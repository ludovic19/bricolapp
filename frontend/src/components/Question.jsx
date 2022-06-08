import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Carousel from "./Carousel";
import InterestId from "./InterestId";
import "../css/question.css";

///--------------------page Mes questions-----//

const axios = require("axios").default;

export default function Question() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => setSelected(data);
  // -----------------ajouter le carousel ------------------------------


  return (
    <>
      <h1>poser ma question</h1>
      <form className ="container" onSubmit={handleSubmit(onSubmit)}>
        <select className="question-interest" {...register("interestSelected", { required: true })}>
          <option value="">Choissisez votre centre d'intérêt </option>
          {data.map((interest, i) => {
            return (
              <option key={i} value={interest}>
                {interest}
              </option>
            );  
          })}
        </select>
        <input
          type="text"
          placeholder="Posez votre question ici !"
          {...register("questions", { required: true })}
        />
        <input
          type="text"
          placeholder="choisissez votre centre d'interêt !"
          {...register("questions", { required: true })}
        />

        <input className="validation-button" type="submit" value="Envoyer"/>
      </form>
      <div className="carousel-body">
        <Carousel />
      </div>
    </>
  );
}
