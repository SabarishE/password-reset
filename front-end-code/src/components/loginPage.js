import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";

import HttpsIcon from "@material-ui/icons/Https";
import EmailIcon from "@material-ui/icons/Email";

export function Login({ popup, popupMsg, setLoading, setuser }) {
  const history = useHistory();

  function afterlogin(msg) {
    popup("block");
    popupMsg(msg);
    setLoading(false);
  }

  const handler = (v, e) => {
    console.log("login alert !!!!", v);
    setLoading(true);

    fetch("https://password-reset-task3.herokuapp.com/users/login", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(v)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setuser(data.loggeduser);
        if (data.loggeduser.name) {
          afterlogin("Successful login !!!");
          e.target.reset();
          history.push("/homepage");
        }
      })
      .catch((err) => {
        console.log("err in login !!!", err.message);
        afterlogin("Invalid credentials");
      });
  };

  const { register, handleSubmit } = useForm();
  return (
    <>
      <div id="loginDiv">
        <div className="formDiv">LOGIN</div>
        <form onSubmit={handleSubmit(handler)}>
          <label>
            <span>
              <EmailIcon />
            </span>
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            id="email"
            autoComplete="off"
            required
          ></input>
          <label>
            <span>
              <HttpsIcon />
            </span>
            Password
          </label>
          <input type="password" {...register("password")} required></input>

          <input type="submit" value="Sign In"></input>
        </form>
        <div id="loginFooter">
          {" "}
          <span>
            {" "}
            <Link
              to="/forgot"
              style={{ textDecoration: "none", color: "white" }}
            >
              Forgot Password ?
            </Link>
          </span>
          <span>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "white" }}
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
