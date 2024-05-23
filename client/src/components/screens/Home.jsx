import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
export default function Home() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch('/allpost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likePost = (id) => {
    fetch('/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postId,
        text
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const updatedData = data.filter((item) => item._id !== postId);
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  return (
    <div className="home">
      {data.map((item) => (
        <div className="card home-card" key={item._id}>
          <h6 style={{display:"flex" ,justifyContent:"space-between"}}>
            <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.name} </Link>{item.postedBy._id==state._id &&<i className="material-icons" onClick={() => deletePost(item._id)}>delete</i>}</h6> {/* Display the name of the poster */}
          <h5>{item.title}</h5>
          <div className="card-image">
            <img src={item.photo} alt={item.title} />
          </div>
          <div className="card-container">
            <i className="material-icons" onClick={() => likePost(item._id)}>favorite</i>
            {item.likes.includes(state._id)
              ? <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
              : <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>}
            <h6>{item.likes.length} likes</h6>
            <h6>{item.title}</h6>
            <p>{item.body}</p>
            {item.comments.map((comment, index) => (
              <div key={index} className="comment">
                <span className="comment-user">{comment.postedBy.name}: </span>
                <span className="comment-text">{comment.text}</span>
              </div>
            ))}
            <form onSubmit={(e) => {
              e.preventDefault();
              makeComment(e.target[0].value, item._id);
            }}>
              <input type="text" placeholder="add comment" name="" id="" />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
