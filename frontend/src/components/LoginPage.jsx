import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../css/Login.css";
import "../css/App.css";
import { useNavigate } from "react-router-dom";
const token = sessionStorage.getItem("token");
const axios = require("axios");

//////page login-----------------------------
async function Axiosstep (data) {
 if (data !== undefined) {
    await axios({
      method: "POST",
      url: "/loginpage",
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
}}

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [msg, setMsg] = useState([]);

  const push = useNavigate();
 const onSubmit = (data) => {
    setData(data);
    Axiosstep(data)
    const alerte =
      msg == "Bad username or password"
        ? alert("Bad username or password")
        : push("/MonCompte", { state: data.mail });
    return alerte;
  }
  console.log(data);
  useEffect(() => {
    data.map(function (a) {
      setMsg(a.data.msg);
    });
  }, []);

  return (
    <div className="container">
      <h1>connexion</h1>
      <form className="forms" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="mail"
          placeholder="e-mail"
          {...register("mail", { required: true })}
        />
        <input
          type="password"
          placeholder="password"
          {...register("password", { required: true })}
        />
        <input className ="validation-button"  type="submit" value="Envoyer"/>
      </form>
    </div>
  );
}
