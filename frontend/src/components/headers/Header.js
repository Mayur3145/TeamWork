import React, {
    useState,
    useRef,
    useEffect,
    useContext,
    useCallback,
} from "react";
import _ from "lodash";
import logo from "../../static/img/Slice2.png";
import SearchModal from "../modals/SearchModal";
import ProfilePic from "../boards/ProfilePic";
import { Link } from "react-router-dom";
import useAxiosGet from "../../hooks/useAxiosGet";
import useBlurSetState from "../../hooks/useBlurSetState";
import { handleBackgroundBrightness } from "../../static/js/util";
import globalContext from "../../context/globalContext";
import NotificationsModal from "../modals/NotificationsModal";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Header = (props) => {

    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


    const { authUser, board } = useContext(globalContext);

    const [searchQuery, setSearchQuery] = useState(""); //This variable keeps track of what to show in the search bar
    const [backendQuery, setBackendQuery] = useState(""); //This variable is used to query the backend, debounced
    const delayedQuery = useCallback(
        _.debounce((q) => setBackendQuery(q), 500),
        []
    );
    const [showSearch, setShowSearch] = useState(false);
    const searchElem = useRef(null);
    const [showNotifications, setShowNotifications] = useState(false);
    useBlurSetState(".label-modal", showNotifications, setShowNotifications);

    useEffect(() => {
        if (searchQuery !== "") setShowSearch(true);
        else if (searchQuery === "" && showSearch) setShowSearch(false);
    }, [searchQuery]);

    const { data: notifications, setData: setNotifications } = useAxiosGet(
        "/notifications/"
    );

    const onBoardPage = props.location.pathname.split("/")[1] === "b";
    const [isBackgroundDark, setIsBackgroundDark] = useState(false);
    useEffect(handleBackgroundBrightness(board, setIsBackgroundDark), [board]);

    return (
        <>
            <header
                className={`header${
                    isBackgroundDark && onBoardPage
                        ? " header--transparent"
                        : ""
                }`}
            >
                <div className="header__section">
                    <ul className="header__list">
                        <li className="header__li">
                            <a>
                                <i className="fab fa-trello"></i> Boards
                            </a>
                        </li>
                        <li
                            className={`header__li header__li--search${
                                searchQuery !== "" ? " header__li--active" : ""
                            }`}
                            ref={searchElem}
                        >
                            <i className="far fa-search"></i>{" "}
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    delayedQuery(e.target.value);
                                }}
                            />
                        </li>
                    </ul>
                </div>
                <div className="header__section">
                    <Link to="/">
                        <img className="header__logo" src={logo} />
                    </Link>
                </div>
                {/* ()=>{window.localStorage.clear();window.location.replace("http://localhost:3000/login")} */}
                
                <div className="header__section">
                    
                    <ul className="header__list">
                    <Button variant="contained" onClick={handleClickOpen}>logout</Button>
                    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{width:'400px'}}>
          {"Do you want to log out"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={()=>{window.localStorage.clear();window.location.replace("http://localhost:3000/login")}} variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
                        <li className="header__li header__li--profile">
                            <ProfilePic user={authUser} large={true} />
                            Hello, {authUser.full_name.replace(/ .*/, "")}
                        </li>
                        <li className="header__li header__li--notifications">
                            <button onClick={() => setShowNotifications(true)}>
                                <i className="fal fa-bell"></i>
                            </button>
                            {(notifications || []).find(
                                (notification) => notification.unread == true
                            ) && <div className="header__unread"></div>}
                        </li>
                        
                    </ul>
                </div>
                <div className="out-of-focus"></div>
            </header>
            {showSearch && (
                <SearchModal
                    backendQuery={backendQuery}
                    searchElem={searchElem}
                    setShowModal={setShowSearch}
                />
            )}
            {showNotifications && (
                <NotificationsModal
                    setShowModal={setShowNotifications}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />
            )}
        </>
    );
};

export default Header;
