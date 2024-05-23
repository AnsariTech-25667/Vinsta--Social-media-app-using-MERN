import React, { useState , useContext } from 'react';
import { Link  , useNavigate} from 'react-router-dom';
import { UserContext } from '../../App';
import M from "materialize-css";

export default function Login() {
  const {state, dispatch} = useContext(UserContext)
  const history =useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const PostData = () => {
    console.log(email ,password)
    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: 'blue light' });
        } else {
          localStorage.setItem("jwt" ,  data.token)
          localStorage.setItem("user" , JSON.stringify(data.user))
          dispatch({type:"USER" , payload:data.user})
          M.toast({ html: "signed in successfully", classes: 'green' });
          history("/")
        }
      })
      .catch((err) => console.error(err)); // Handle any errors
  };

  return (
    <div>
      <div className="card auth-card input-field">
        <h2>Vinsta</h2>
        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /> <br />
        <button
          className="btn waves-effect waves-light #2196f3 blue"
          type="submit"
          name="action"
          onClick={PostData} 
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account?</Link>
        </h5>
      </div>
    </div>
  );
}
