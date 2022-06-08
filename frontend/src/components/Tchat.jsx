import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import "../css/Tchat.css";
import Send from "../send.png";
import { useLocation, useNavigate } from "react-router-dom";
import { get, useForm } from "react-hook-form";
import { StyleSheet, css } from "aphrodite";
import { io } from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
const token = sessionStorage.getItem("token");
const urls = "http://127.0.0.1:5000/img";
const axios = require("axios");

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Input = styled("input")({
  display: "none",
});

export default function Tchat() {
  console.log(useLocation());
  const surnom = useLocation().state.surnom;
  const invite = useLocation().state.invite;
  const { register, handleSubmit } = useForm();
  const [datas, setDatas] = useState([]);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(true);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const push = useNavigate();
  const [deltext, setDeltext] = useState("");
  const [getmessage, setGetmessage] = useState([]);

  const url = document.location.href.split("/")[6];
  useEffect(() => {
    axios({
      method: "POST",
      url: "/api/tchating",
      data: { url: url },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Allow: "POST,GET,OPTIONS",
        Authorization: `token ${token}`, //token d'autorisation pour JWT
      },
    })
      .then((response) => {
        setGetmessage(response.data.data);
      })
      .catch((errors) => console.log(errors));
  }, [url, getmessage]);

  useEffect(() => {
    for (const [key, value] of Object.entries(datas)) {
      if (key === "message") {
        setMessage(value);
      }
      if (key === "files") {
        if (value.length > 0) {
          setName(value[0].name);
          setType(value[0].type);
        }
      }
    }
  }, [datas, message, name, type]);
  console.log(name, type);
  let myList = [];
  const onSubmit = (data) => {
    tchatdiv();
    console.log(data);
    setDatas(data);
    const socket = io.connect("ws://127.0.0.1:5000/", {
      transports: ["websocket", "polling"],
      header: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5000/",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Authorization: "Bearer " + token, //token d'autorisation pour JWT
      },
    });
    socket.emit("tchat", {
      surnom: surnom,
      invite: invite,
      url: url,
      message: data.message,
      namefile: name,
      typefile: type,
    });
    socket.on("deltext", (data) => {
      console.log(data);
      setDeltext(data.data);
    });
    socket.disconnect();
    setTimeout(() => {
      document.getElementById("id-form").reset();
    }, 1000);

    myList.push(getmessage);
    let element = document.getElementsByClassName("tchat-messagerie");
    element.scrollTop = element.scrollHeight;
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClick = (e) => {
    if (checked === true) {
      push("/");
      //   Mettre en place dans la db qu'il soit deconnecté
    }
  };

  const style = StyleSheet.create({
    heading: {
      backgroundColor: "yellow",
      color: "black",
    },
  });

  const styletern = (auteur) => {
    const ternaire = auteur === invite ? "right" : "left";
    return ternaire;
  };

  const ternaireimg = (image) => {
    const tern =
      image === "" ? (
        <span></span>
      ) : (
        <img src={url + "/" + image} alt="upload user" />
      );
    return tern;
  };
  console.log(getmessage);
  console.log("message", message);
  function tchatdiv() {
    if (getmessage !== []) {
      const chatBubbles = getmessage.map((obj, i = 0) => (
        <div
          className={`bubble-container bubble-container-${styletern}`}
          key={i}
        >
          <div
            key={i++}
            className={`talk-bubble tri-right round ${styletern}-in`}
          >
            <Avatar alt={item[6]} src="/static/images/avatar/1.jpg" />
            <div class="talkauthor">{obj[6]}</div>
            <div class="talktext">{obj[2]}</div>
            <div>{ternaireimg(item[5])}</div>
            <div>{item[1]}</div>
          </div>
        </div>
      ));

      return <div id="tchat-messagerie">{chatBubbles}</div>;
    } else {
      axios({
        method: "POST",
        url: "/api/firsttchating",
        data: { url: url },
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
  }

  function divternaire() {
    const ternaire2 = msgperso !== [] ? tchatdiv() : <p>AUCUN MESSAGE</p>;
    return ternaire2;
  }

  return (
    <div className="tchat-container">
      <h1>Echangez en direct</h1>
      <div className="tchat-header">
        <div className="tchat-child1">
          {tchatdiv()}
          <div className="tchat-envoi">
            <form
              className="tchat-form"
              id="id-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <textarea
                placeholder="Votre message"
                {...register("message", { required: true })}
              />
              <p>{deltext}</p>
              <div>
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    {...register("files")}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="tchat-child2">
        <Card>
          <div className="tchat-admin">
            <Stack direction="row" spacing={2}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </StyledBadge>
              <Typography variant="p">Remy Sharp</Typography>
            </Stack>
          </div>
        </Card>
      </div>

      <div className="tchat-envoi">
        <form
          className="tchat-form"
          id="id-form"
          onSubmit={handleSubmit(OnSubmit)}
        >
          <Button
            color="primary"
            variant="outlined"
            onClick={handleClick}
            sx={{
              borderColor: "#38726C",
              color: "#38726C",
              fontWeight: "bold",
            }}
          >
            Quitter la discussion
          </Button>
          <Button
            color="primary"
            variant="outlined"
            sx={{
              borderColor: "#38726C",
              color: "#38726C",
              fontWeight: "bold",
            }}
          >
            Discussion privée
          </Button>
          <textarea
            placeholder="Votre message"
            {...register("message", { required: true })}
          />
          <div>
            <label htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                {...register("files")}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                sx={{ color: "#38726C" }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <IconButton type="submit" sx={{ color: "#38726C" }}>
              <SendIcon />
            </IconButton>
          </div>
        </form>
      </div>
    </div>
  );
}
//-------------page de tchat-(Interface de conversation)---------------
