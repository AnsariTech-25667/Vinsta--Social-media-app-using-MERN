import React, { useState , useEffect} from 'react';

import { useNavigate} from 'react-router-dom';
import M from "materialize-css";
export default function Createpost() {
    const history = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
  
    useEffect(()=>{
        fetch('/createpost', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              title,
              body,
              photo: url // Use the URL obtained from Cloudinary
            }),
          })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.error) {
              M.toast({ html: data.error, classes: 'blue light' });
            } else {
              M.toast({ html: "created post successfully", classes: 'green' });
              history("/");
            }
          })
          .catch((err) => console.error(err));
    } ,[url])
    const postDetails = () => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "vinsta");
      data.append("cloud_name", "dpdtwvpln");
  
      fetch("https://api.cloudinary.com/v1_1/dpdtwvpln/image/upload", {
        method: "post",
        body: data,
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUrl(data.url); 
    })}
  
  return (
    <div className="card input-field" style={{
        margin: "10px auto",
        maxWidth: "700px",
        padding: "20px",
        textAlign: "center"
    }}>
      <input
        type="text"
        placeholder='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        name=""
        id=""
      />
      <input
        type="text"
        placeholder='body'
        value={body}
        onChange={(e) => setBody(e.target.value)}
        name=""
        id=""
      />
      <div className="file-field input-field">
        <div className="btn  waves-effect waves-light #2196f3 blue">
          <span>File</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #2196f3 blue"
        type="submit"
        onClick={() => postDetails()}
        name="action"
      >
        SUBMIT
      </button>
    </div>
  );

}