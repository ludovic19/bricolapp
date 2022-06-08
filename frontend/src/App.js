import "./css/App.css";
import React, { useEffect, useState } from "react";
import Load from "./components/Load";
import PrimarySearchAppBar from "./components/Navbar";
import RouterMenu from "./components/RouterMenu";


export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <Load />
      ) : (
        <div >
          <PrimarySearchAppBar />
          <RouterMenu sx={{display : "flex-wrap"}}/>
        </div>
      )}
    </>
  );
}
