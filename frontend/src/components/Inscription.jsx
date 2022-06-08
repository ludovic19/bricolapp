import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "../css/App.css";
import "../css/inscription.css";

const axios = require("axios");
const token = sessionStorage.getItem("token");

export default function Inscription() {
  const push = useNavigate();
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState();
  async function onSubmit(data) {
    setData(data);
    if (data !== undefined) {
      if (data.password === data.confirmation) {
        await axios({
          method: "POST",
          url: "/api/inscription",
          data: data,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            Allow: "POST,GET,OPTIONS",
            Authorization: `token ${token}`, //token d'autorisation pour JWT
          },
        })
          .then((response) => {
            console.log(response);
          })
          .catch((errors) => console.log(errors));
      } else {
        alert("Les mots de passe ne correspondent pas");
      }
    }
    push("/LoginPage");
  }
  console.log(data);

  return (
    <div className="container">
      <h1>Inscription</h1>
      <p> Déjà inscrit? </p>
      <Link to="/LoginPage">
        <span>Connexion</span>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="votre pseudo"
          {...register("pseudo", { required: true })}
        />
        <input
          type="text"
          placeholder="nom"
          {...register("nom", { required: true })}
        />
        <input
          type="text"
          placeholder="prénom"
          {...register("prenom", { required: true })}
        />
        <input
          type="email"
          placeholder="e-mail"
          {...register("mail", { required: true })}
        />
        <input
          type="password"
          placeholder="password"
          {...register("password", { required: true })}
        />
        <input
          type="password"
          placeholder="confirmez votre mot de passe"
          {...register("confirmation", { required: true })}
        />
        <div className="user-accept-input">
          <input
            type="checkbox"
            value="True"
            {...register("checkboxRGPD", { required: true })}
          />
          <label>Acceptez-vous les conditions d'utilisation</label>
          <Link to="/conditionUtilisation">
            <p> CGU </p>
          </Link>
        </div>
        <input className="validation-button" type="submit" value="Valider" />
      </form>
    </div>
  );
}
