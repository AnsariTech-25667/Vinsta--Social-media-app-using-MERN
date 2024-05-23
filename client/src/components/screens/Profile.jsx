import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

export default function Profile() {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    // Fetch the user's posts
    fetch('/mypost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        const photoData = result.map(item => ({
          photo: item.photo,
          title: item.title,
          likes: item.likes.length,
          body: item.body
        }));
        setPics(photoData);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img src="https://4.bp.blogspot.com/-cvjeZMIgcJQ/VzD8PkZvO2I/AAAAAAAA_2k/LaSQWXMFG1A1VMm0wSK0MVppDsOGs_s-wCKgB/s1600/doraemon.png" alt="Profile" />
        </div>
        <div className="profile-info">
          <h2>{state ? state.name : 'Loading...'}</h2>
          <h2>{state ? state.email : 'Loading...'}</h2>
          <div className="profile-stats">
            <span>{mypics.length} posts</span>
            <span>{state && state.followers ? state.followers.length : "8"} followers</span>
            <span>{state && state.following ? state.following.length : "5"} followings</span>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item, index) => (
          <div key={index} className="gallery-item">
            <img src={item.photo} alt={`Photo ${index}`} />
            <div className="photo-details">
              <span>{item.likes} Likes</span>
              <span>{item.title}</span>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
