import { useHistory } from "react-router-dom";

import EmailIcon from "@material-ui/icons/Email";

export function Homepage({ user, setlogFlag, setuser }) {
  const history = useHistory();
  return (
    <>
      <div id="homepage">
        <h1>Welcome {user ? user.name : ""}</h1>
        <h3>
          {" "}
          <span>
            <EmailIcon />
          </span>{" "}
          {user ? user.email : ""}
        </h3>

        <span
          id="logout"
          onClick={() => {
            history.push("/login");
          }}
        >
          Log out
        </span>
      </div>
    </>
  );
}
