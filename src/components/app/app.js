import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login';

import './app.css'

import Header from '../header'
import Posts from '../posts'

const API_KEY = '2GcEIlkwfun5MxTFqzSAewqHmw52cay4jjxs';

export default class App extends Component {
    state = [{
        isLoggedIn: false,
        name: ''
    },{
        title: '',
        url: ''

    }];

    gettingPost = async (e) => {
        e.preventDefault();
        const api_url = await fetch(`https://gorest.co.in/public-api/posts?_format=json&access-token=${API_KEY}`);
        const api_photo = await fetch(`https://gorest.co.in/public-api/photos?_format=json&access-token=${API_KEY}`);
        const date_post = await api_url.json();
        const date_photo = await api_photo.json();
        console.log(date_post);
        console.log(date_photo);
        let id = 0;
        this.setState({
            title: date_post.result[id].title,
            url: date_photo.result[id].url,
        });
    };
    

    
    responseFacebook = (response) => {
        this.setState({
            isLoggedIn: true,
            name: response.name
        });
    };

    componentDidMount () { // Установка состояния здесь вызовет повторный рендеринг.
        window.gapi.load('auth2', function() { //load library
            window.gapi.auth2
            .init({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID //.env
            })
            .then(() => console.log('init OK'), () => console.log('init ERROR'))
        });
    };

    singIn = () => {
        const _authOk = (googleUser) => {
            this.setState({
                name: googleUser.getBasicProfile().getName()
            });
        };
        const _authErr = () => console.log('ERROR')

        const GoogleAuth = window.gapi.auth2.getAuthInstance();

        GoogleAuth.signIn(
            {
                scope: 'profile email'
            }
        )
        .then(_authOk, _authErr);
    };

    singOut = () => {
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        GoogleAuth.signOut().then(
            () => {
                this.setState({
                    isLoggedIn: false,
                    name: ''
                    
                })
            }, () => console.log('Sing out ERROR'));
        
    };
    render() {
        
        // let serialState = JSON.stringify(this.state.isLoggedIn); //сериализуем его
        // localStorage.setItem("myKey", serialState); //запишем его в хранилище по ключу "myKey"
        // let returnState = JSON.parse(localStorage.getItem("myKey")) //спарсим его обратно объект
        // console.log(returnState);

        const { name } = this.state;
        let fbContent;
        if(this.state.isLoggedIn && name) {
            fbContent = (
                <div>
                    <h2>Welcome, { name }</h2>
                </div>
            );
        } else {
            fbContent = (
                <FacebookLogin
                appId="2515482901899275"
                autoLoad={false}
                fields="name"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />
            )
        }
        return (
            <div>
                <div className='bg_header'>
                    <div>
                       <Header />
                    </div>
                    <div>
                        { !!name && <p>Welcome, <span>{ name }</span></p>}
                        { !name && fbContent}
                        { !name && <button className="btn-logIn" onClick={ this.singIn }>Login with gMail</button> }
                        { !!name && <button className="btn-logOut" onClick={ this.singOut }>Log Out</button> }
                    </div>
                </div>
                <div>
                    { !!name && <Posts gettingPost={ this.gettingPost } 
                        title={this.state.title}
                        url={this.state.url} />}
                </div>
                
            </div>
        );
    }
}