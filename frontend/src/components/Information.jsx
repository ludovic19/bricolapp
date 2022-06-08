import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "../css/Information.css"

const axios = require("axios");
const token = sessionStorage.getItem("token");

export default function Information() {
  const [datas, setDatas] = useState([]);
  const { register, handleSubmit } = useForm();
  let mail = useLocation().state;
  

  const handleClick = () => {};

  async function onSubmit(data) {
    await axios({
      method: "POST",
      url: "/api/information",
      data: {
        surnom: data.pseudo,
        nom: data.nom,
        prenom: data.prenom,
        mail: mail,
        password: data.password,
      },
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
  }
  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/information",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Allow: "POST,GET,OPTIONS",
      },
    })
      .then((response) => {
        console.log(response);
        setDatas(response);
      })

      .catch((errors) => console.log(errors));
  });
  console.log(datas)
  return (
    <React.Fragment>
      <h1>mes informations</h1>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder={datas} {...register("pseudo", { required: true })}
          />
          <input
            type="text"
            placeholder={datas} {...register("nom", { required: true })}
          />
          <input
            type="text"
            placeholder={datas} {...register("prenom", { required: true })}
          />

          <input
            type="password"
            placeholder="password"
            {...register("password", { required: true })}
          />
          
            <Link to="/Interest" className="delete-link">
              <FontAwesomeIcon icon={faTrash} size="2x"/>
              <p>Supprimer mon compte</p>
            </Link>
          
          <input className="validation-button" type="submit" value="modifier" />
        </form>
      </div>
    </React.Fragment>
  );

}
