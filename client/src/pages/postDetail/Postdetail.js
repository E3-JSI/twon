import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import Post from "../../components/post/Post";
import { useParams } from 'react-router';
import {styles} from './PostdetailStyle';
import { colors } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery } from 'react-responsive';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router";
import {COLORS} from '../../components/values/colors.js';
//import User from '../../../../api/models/User';

function Postdetail({ classes }) {
  const history = useHistory();
  const {state} = useLocation();
  console.log(state);
  const [selectedValue, setSelectedValue] = useState('0');
  const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)"});
  const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)"});

  const { user: currentUser, dispatch } = useContext(AuthContext);
  const username = useParams().username;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleReadChange = () => {
    axios.put("/users/" + currentUser._id + "/read", { postId: state.myObj._id });
};

  useEffect(() => {
    handleReadChange();
    }, [username])

  return (
    <>
        <Topbar isProfile="true" setSelectedValue={setSelectedValue} style={{ 'margin-top': '-20px' }}/>
        <div className={classes.feed}>
            <div className={classes.feedWrapper}>
            <Link style={{textDecoration: 'none', color: COLORS.textColor}}><ArrowBackIcon onClick={() => history.goBack()}/></Link>
              <Post key={state.myObj._id} post={state.myObj} isDetail={true}/>
            </div>
        </div>
    </>
)
}

export default withStyles(styles)(Postdetail);
