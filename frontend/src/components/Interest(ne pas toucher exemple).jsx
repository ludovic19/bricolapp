import React, { useState, useEffect } from "react";
import SOCKET_URI from "../contexte/contexte-socketio";
import io from "socket.io-client";
import { useForm } from "react-hook-form";
const token = sessionStorage.getItem("token");
const axios = require("axios");

export default function ComboBox() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => setSelected(data);

  useEffect(() => {
    axios({
      method: "GET",
      url: "/interest",
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

  let socket = null;
  useEffect(() => {
    socket = io(SOCKET_URI, {
      extraHeaders: {
        Authorization: "Bearer " + token, //token d'autorisation pour JWT
      },
    });
    socket.on("connect", () => {
      console.log("conected");
    });
    socket.send("interestdata", selected);
  }, [SOCKET_URI]);

  return (
    <div>
      <p>Posez votre question à la communauté!</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("interestSelected", { required: true })}>
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
          placeholder="Posez votre surnom ici !"
          {...register("surnom", { required: true })}
        />
        <input
          type="checkbox"
          value="True"
          {...register("checkboxAnonymous")}
        />
        <label>Je souhaite rester anonyme</label>
        <input type="submit" value="Je me lance!" />
      </form>
    </div>
  );
}
