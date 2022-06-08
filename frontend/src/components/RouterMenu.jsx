import { Routes, Route } from "react-router-dom";
import InterestId from "./InterestId";
import LoginPage from "./LoginPage";
import Information from "./Information";
import Question from "./Question";
import MyInterest from "./MyInterest";
import PrivateTchat from "./PrivateTchat";
import Interest from "./Interest";
import ConditionUtilisation from "./ConditionUtilisation";

import Moncompte from "./MonCompte";
import Tchat from "./Tchat";
import ComboBox from "./Interest";
import Inscription from "./Inscription";

//////---page des route pour le chemin des pages-----

export default function RouterMenu() {
  return (
    <Routes>
      <Route path="/Interest" element={<Interest />} />
      <Route path="/Interest/:InterestId" element={<InterestId />} />
      <Route path="/" element={<ComboBox />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/Information" element={<Information />} />
      <Route path="/Question" element={<Question />} />
      <Route path="/MyInterest" element={<MyInterest />} />
      <Route path="/PrivateTchat" element={<PrivateTchat />} />
      <Route path="/Inscription" element={<Inscription />} />
      <Route path="/Moncompte" element={<Moncompte />} />
      <Route path="/ConditionUtilisation" element={<ConditionUtilisation />} />
      <Route
        path="/interest/:InterestId/conversation/:id"
        element={<Tchat />}
      />

    </Routes>
  );
}
