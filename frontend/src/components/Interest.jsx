import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../css/Interest.css";

const token = sessionStorage.getItem("token");
const axios = require("axios");

export default function ComboBox() {
  const push = useNavigate();
  const [data, setData] = useState([]);
  const [radio, setRadio] = useState([]);
  const [interest, setInterest] = useState([]);
  const [linkto, setLinkto] = useState("/");
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    await axios({
      method: "POST",
      url: "/api/interestdata",
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
    push(linkto, { state: interest });
  }

  const handleChange = (e) => {
    let checkbox = e.target.value;
    setRadio(checkbox);
  };

  const handleChange2 = (e) => {
    let inter = e.target.value;
    setInterest(inter);
    console.log(inter);
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/interest",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    })
      .then((response) => {
        console.log(response);
        setData(response.data.interest);
      })
      .catch((errors) => console.log(errors));
  }, []);

  useEffect(() => {
    const ternaire =
      radio === "True" ? `/Interest/${interest}` : `/Inscription`;
    setLinkto(ternaire);
  }, [radio, interest]);

  console.log(linkto);

  return (
    <div className="container">
      <h1>Posez votre question à la communauté!</h1>
      <form
        id="form-interest"
        action={linkto}
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
      >
        <select
          {...register("interestSelected", { required: true })}
          onChange={handleChange2}
        >
          <option value="">Choisissez votre centre d'intérêt </option>
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
          placeholder="Indiquez votre surnom ici !"
          {...register("surnom", { required: true })}
        />

        <label>Je souhaite rester anonyme</label>
        <div className="anonym-radio">
          <div>
            <input
              type="radio"
              value="True"
              {...register("checkboxAnonymous")}
              onChange={handleChange}
              name="checkboxAnonymous"
              id="checkYes"
            />
            <label for="checkYes">Oui</label>
          </div>
          <div>
            <input
              type="radio"
              value="False"
              {...register("checkboxAnonymous")}
              onChange={handleChange}
              name="checkboxAnonymous"
              id="checkNo"
            />
            <label for="checkNo">Non</label>
          </div>
        </div> 

        <input className ="validation-button"  type="submit" value="Envoyer"/>
      </form>
    </div>//fermeture div"container"
  );
}