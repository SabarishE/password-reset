import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import AccountBoxIcon from "@material-ui/icons/AccountBox";
import HttpsIcon from "@material-ui/icons/Https";
import EmailIcon from "@material-ui/icons/Email";

export function Register({ popup, popupMsg, setLoading }) {
  const history = useHistory();

  const { register, handleSubmit } = useForm();

  function afterlogin(msg) {
    popup("block");
    popupMsg(msg);
    setLoading(false);
  }

  const handler = (v, e) => {
    console.log("registration alert >>>>", v);
    setLoading(true);

    //-----checking for existing email id -------

    fetch(
      `https://password-reset-task3.herokuapp.com/users/emailcheck/${v.email}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.check) {
          afterlogin("Email id already exists");
        } else {
          register();
        }
      })
      .catch((err) => console.log("error in check>>>", err));

    //-----sign up with unique email id -------

    function register() {
      setLoading(true);
      fetch("https://password-reset-task3.herokuapp.com/users/signup", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(v)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("-----SUCCESSFULL REGISTRATION------", data);

          if (data.newuser.name) {
            afterlogin("Registration success !!!");
            history.push("/login");
            e.target.reset();
          }
        })
        .catch((err) => {
          console.log("err in registration !!!", err.message);

          afterlogin("Error in Registration");
        });
    }
  };

  return (
    <>
      <div id="registerDiv">
        <div className="formDiv">REGISTER</div>
        <form onSubmit={handleSubmit(handler)}>
          <label>
            <span>
              <AccountBoxIcon />
            </span>
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            autoComplete="off"
            required
          ></input>
          <label>
            {" "}
            <span>
              <EmailIcon />
            </span>
            Email
          </label>
          <input
            type="email"
            {...register("email")}
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

          <input type="submit" value="Sign Up"></input>
        </form>
      </div>
    </>
  );
}
