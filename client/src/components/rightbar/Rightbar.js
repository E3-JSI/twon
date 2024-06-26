import React from 'react';
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './rightbarStyle'

function Rightbar({ user, classes }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState([]
    //currentUser.followings.includes(user?.id)
  );

  useEffect(() => {
        setFollowed(currentUser.followings.includes(user._id));
      }, [currentUser.followings, user]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/allUsers/" + user._id, {headers: { 'auth-token': token }});
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  /*const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };*/

  const HomeRightbar = () => {
    return (
      <>
        <h4 className={classes.rightbarTitle}>Followers</h4>
        <ul className={classes.rightbarFriendList}>
          {friends.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {/*user.username !== currentUser.username && (
          <button className={classes.rightbarFollowButton} onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )*/}
        <h4 className={classes.rightbarTitle}>User information</h4>
        <div className={classes.rightbarInfo}>
          <div className={classes.rightbarInfoItem}>
            <span className={classes.rightbarInfoKey}>City:</span>
            <span className={classes.rightbarInfoValue}>{user.city}</span>
          </div>
          <div className={classes.rightbarInfoItem}>
            <span className={classes.rightbarInfoKey}>From:</span>
            <span className={classes.rightbarInfoValue}>{user.from}</span>
          </div>
          <div className={classes.rightbarInfoItem}>
            <span className={classes.rightbarInfoKey}>Relationship:</span>
            <span className={classes.rightbarInfoValue}>
            {user.relationship}
            </span>
          </div>
        </div>
        <h4 className={classes.rightbarTitle}>FOLLOWINGS</h4>
        <div className={classes.rightbarFollowings}>
          {friends.map((friend) => (
            <Link
            reloadDocument={true}
              key={friend._id}
              to={"/profile/" + friend.username}
              className={classes.linkToFriendProfile}
              
            >
              <div className={classes.rightbarFollowing}>
                <img
                  src={friend.profilePicture? PF + friend.profilePicture: PF+'person/noAvatar.png'
                  }
                  alt=""
                  className={classes.rightbarFollowingImg}
                />
                <span className={classes.rightbarFollowingName}>{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className={classes.rightbar}>
      <div className={classes.rightbarWrapper}>
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

export default withStyles(styles)(Rightbar);