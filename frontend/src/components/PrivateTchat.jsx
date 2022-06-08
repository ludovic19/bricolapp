import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../css/PrivateTchat.css"


const axios = require("axios").default;

export default function Question() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => setSelected(data);

  ////----Création de groupe de discussion--------

  return (
    
      <>
       <h1>Création nouvelle 
     discussion privée !</h1>
    <form className ="container" onSubmit={handleSubmit(onSubmit)}>
    <input
        type="text"
        placeholder="donnez un nom à votre groupe"
        {...register("questions", { required: true })}/>
      
      <select {...register("interestSelected", { required: true })}>
        <option value="" placeholder="contacts"  label="choisissez vos contacts">Choissisez votre contacts </option>
        {data.map((interest, i) => {
          return (
            <option key={i} value={interest}>
              {interest}
            </option>
          );
        })}
      </select>
        
      
      
      <input className ="validation-button"  type="submit" value="Valider"/>
    </form>
    </>
  );
}
