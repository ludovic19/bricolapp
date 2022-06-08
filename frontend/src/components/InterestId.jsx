import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Link, useLocation } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import icontchat from "../icontchat.png";
import "../css/InterestID.css";
import axiosCancel from "axios-cancel";

const axios = require("axios");
const token = sessionStorage.getItem("token");

//-------------Interface question dans centre d’interêt---------------------------------

export default function InterestId() {
  const [datas, setDatas] = useState([]);
  const [invite, setInvite] = useState("");
  const [taille, setTaille] = useState([]);
  const location = useLocation();
  let myListData = [];

  const handleChange = (e) => {
    let pseudo = e.target.value;
    setInvite(pseudo);
  };

  const handleClick = (e) => {
    axios({
      method: "POST",
      url: "/api/interestidsurnom",
      data: { invite: invite, question: datas.question },
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
  };

  const urlinterest = { url: location.state };

  function ternaires(i) {
    const user = { surnom: datas.surnom[i], invite: invite };
    if (invite === "" || datas.surnom[i] === "") {
      return <p>Veuillez insérer votre pseudo pour accéder au tchat</p>;
    } else {
      return (
        <button>
          <Link
            to={
              "/interest/" +
              urlinterest.url +
              "/conversation/" +
              datas.idquestion[i]
            }
            state={user}
            onClick={handleClick}
          >
            <img src={icontchat} className="icontchat" alt="icone-tchat" />
          </Link>
        </button>
      );
    }
  }

  useEffect(() => {
    axios({
      method: "POST",
      url: "/api/interestidpost",
      data: urlinterest,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Allow: "POST,GET,OPTIONS",
        Authorization: `token ${token}`, //token d'autorisation pour JWT
      },
    })
      .then((response) => {
        console.log(response.data);
        setDatas(response.data);
        setTaille((s) => response.data.taille);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }, [invite, urlinterest]);

  function Dataelement() {
    if (datas === undefined) {
      console.log("undefined");
      return <p>En Chargement</p>;
    } else {
      for (let i = 0; i < taille; i++) {
        myListData.push(
          <Box key={i} sx={{ minWidth: 275 }}>
            <Card
              className="interest-card"
              variant="outlined"
              sx={{ boxShadow: 2 }}
            >
              <React.Fragment>
                <CardContent>
                  <Typography variant="p" className="user-info" component="div">
                    {datas.surnom[i]}
                  </Typography>
                  <Typography variant="p"  className="user-info" component="div">
                    {datas.date[i]}
                  </Typography>
                  <Typography variant="p" component="div">
                    <div className="user-info">Question:</div>
                    <div className="user-question">{datas.question[i]}
                    </div>
                  </Typography>
                </CardContent>
                <div className="guest-username">
                  <TextField id="outlined-basic" inputProps={{ style: { color: "#38726C"}}} required onChange={handleChange} label="votre pseudo d'invité" variant="outlined" />
                  <div>{ternaires(i)}</div>
                </div>
              </React.Fragment>
            </Card>
          </Box>
        );
      }
    }
  }

  Dataelement();
  return (
    <div>
      <h1>
        Echangez sur le centre d'intérêt: <span>{urlinterest.url}</span>
      </h1>
      {myListData.map((element) => {
        return element;
      })}
    </div>
  );
}
