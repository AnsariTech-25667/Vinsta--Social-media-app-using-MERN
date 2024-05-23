import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  const [showFollow, setShowFollow] = useState(
    state ? !state.following?.includes(userid) : true
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/user/${userid}`, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
        });
        if (response.ok) {
          const result = await response.json();
          setProfile(result);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [userid, state]);

  const followUser = () => {
    fetch('/follow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({ type: "UPDATE", payload: { following: data.following , followers:data.followers } });
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState)=>{
          return{
            ...prevState,
            user:{
              ...prevState.user,
              followers:[...prevState.user.followers,data._id]
            }
          }
        })
        setShowFollow(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({ type: "UPDATE", payload: { following: data.following , followers:data.followers } });
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState)=>{
          return{
            ...prevState,
            user:{
              ...prevState.user,
              followers:[...prevState.user.followers,data._id]
            }
          }
        })
        setShowFollow(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "1000px", margin: "0px auto" }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: "18px 0px ",
              borderBottom: "1px solid grey"
            }}
          >
            <div>
              <img
                style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                src="https://4.bp.blogspot.com/-cvjeZMIgcJQ/VzD8PkZvO2I/AAAAAAAA_2k/LaSQWXMFG1A1VMm0wSK0MVppDsOGs_s-wCKgB/s1600/doraemon.png"
                alt=""
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h4>{userProfile.user.email}</h4>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}
              >
                <h5>{userProfile.posts.length} Posts</h5>
                <h5>{userProfile.user.followers.length} followers</h5>
                <h5>{userProfile.user.following.length} followings</h5>
              </div>
              {showFollow ? (
                <button
                  className="btn waves-effect waves-light #2196f3 blue"
                  type="submit"
                  name="action"
                  onClick={followUser}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #f44336 red"
                  type="submit"
                  name="action"
                  onClick={unfollowUser}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item, index) => (
              <div
                key={index}
                style={{ display: 'inline-block', width: '33.33%', padding: '8px' }}
              >
                <img
                  className='item'
                  src={item.photo}
                  style={{ width: "250px" }}
                  alt={`Photo ${index}`}
                />
                <p>{item.likes.length} Likes . {item.title}</p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );}
