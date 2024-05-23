import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import M from "materialize-css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        password: password,
        email: email
      })
    })
    .then(res => res.json())
    .then(data => {if(data.error){
      M.toast({html: data.error , classes:"blue light"})}
      else{
        M.toast({html: data.message , classes:"green"})
        navigate("/signin") 
      }
    })
    .catch(err => console.error(err)); // Handle any errors
  }

  return (
    <div>
      <div className="card auth-card input-field">
        <h2>Vinsta</h2>
        <input type="text" placeholder="Name" name="name" id="name"
          value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Enter Email" name="email" id="email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" name="password" id="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
          <br></br><br></br>
        <button className="btn waves-effect waves-light #2196f3 blue" type="submit" onClick={() => PostData()}>Signup</button>
        <h5>
          <Link to="/signin">Already have an account?</Link>
        </h5>
      </div>
    </div>
  );
}
