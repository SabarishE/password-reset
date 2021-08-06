import "./styles.css";
import { useState } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import { Login } from "./components/loginPage";
import { Register } from "./components/registerPage";
import { ForgotPwdForm } from "./components/forgotPasswordForm";
import { PasswordResetForm } from "./components/resetPasswordForm";
import { Homepage } from "./components/homepage";

import ClipLoader from "react-spinners/ClipLoader";
import VpnLockIcon from "@material-ui/icons/VpnLock";

export default function App() {
  let [loading, setLoading] = useState(false);
  const [user, setuser] = useState({});
  const [popUp, setpopUp] = useState("popup message");
  const [popOut, setpopOut] = useState("none");

  return (
    <>
      <div
        className="App"
        style={{
          filter: popOut === "block" ? "grayscale(70%)" : "grayscale(0)",

          backgroundImage: `url(${require("./images/prfbg.jpg").default})`
        }}
      >
        <Router>
          <div id="header">
            <div>
              {" "}
              <span>
                <VpnLockIcon />
              </span>
              PASSWORD RESET FLOW
            </div>

            <div id="loadingDiv">
              <ClipLoader color={"white"} loading={loading} size={45} />
            </div>
          </div>
          <div></div>
          <Switch>
            <Route path="/login">
              <Login
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
                setuser={setuser}
              />
            </Route>
            <Route path="/register">
              <Register
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>
            <Route path="/forgot">
              <ForgotPwdForm
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>
            <Route path="/reset">
              <PasswordResetForm
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
              />
            </Route>
            <Route path="/homepage">
              <Homepage
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
                user={user}
              />
            </Route>

            <Route path="*">
              <Login
                popup={setpopOut}
                popupMsg={setpopUp}
                setLoading={setLoading}
                setuser={setuser}
              />
            </Route>
          </Switch>
        </Router>
      </div>

      <div id="popup" style={{ display: popOut }}>
        <button
          onClick={() => {
            setpopOut("none");
          }}
        >
          X
        </button>
        <br></br>
        <span>{popUp}</span>
      </div>
      <div></div>
    </>
  );
}
