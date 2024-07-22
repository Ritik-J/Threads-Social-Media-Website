import { useState } from "react";
import Login from "../Components/Login";
import SignupCard from "../Components/Signup";

export const AuthPages = () => {
  const [signup, setSignup] = useState(false);

  const toggleSignup = () => {
    setSignup((prev) => !prev);
  };

  const toggleLoginCard = () => {
    setSignup((prev) => !prev);
  };

  return (
    <div>
      {signup ? (
        <SignupCard toggleLogin={toggleLoginCard} />
      ) : (
        <Login toggle={toggleSignup} />
      )}
    </div>
  );
};
