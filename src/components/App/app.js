import React, { Component } from "react";
import axios from "../../util/axios";
import UpLoader from "../Uploader/uploader";
import { Profile } from "../Profile/profile";
import Header from "../Header/header";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "../Profile/otherprofile";
import { FindPeople } from "../FindPeople/FindPeople";
import { FriendsList } from "../Friends/friends";
import { Chat } from "../Chat/chat";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.upLoadImage = this.upLoadImage.bind(this);
        this.upDateBio = this.upDateBio.bind(this);
    }
    async componentDidMount() {
        try {
            let { data } = await axios.get("/api/user");
            this.setState({
                firstname: data.userInfo.firstname,
                lastname: data.userInfo.lastname,
                bio: data.userInfo.bio,
                imgurl: data.userInfo.url,
                id: data.userInfo.id
            });
        } catch (err) {
            console.log("error on the image upload: ", err);
        }
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }
    upLoadImage(image) {
        // console.log("this is my image ", image);
        this.setState({
            imgurl: image,
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }
    upDateBio(upDateBio) {
        this.setState({ bio: upDateBio });
    }
    render() {
        // renders the page only when the content is back
        if (!this.state.firstname) {
            return null;
        }
        return (
            <>
                <BrowserRouter>
                    <>
                        <Header
                            imgurl={this.state.imgurl}
                            toggleModal={this.toggleModal}
                        ></Header>

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    imgurl={this.state.imgurl}
                                    bio={this.state.bio}
                                    id={this.state.id}
                                    upDateBio={this.upDateBio}
                                />
                            )}
                        />
                        {/* can't have the same name as the router from the server */}
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    id={this.state.id}
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                    </>
                    <Route path="/find-people/" component={FindPeople} />
                    <Route path="/friends/" component={FriendsList} />
                    <Route path="/chat" component={Chat} />
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <UpLoader
                        toggleModal={this.toggleModal}
                        upLoadImage={this.upLoadImage}
                    />
                )}
            </>
        );
    }

    //component={OtherProfile}
}
