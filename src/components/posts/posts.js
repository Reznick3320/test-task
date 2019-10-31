import React, { Component } from 'react';
import './posts.css'

export default class Posts extends Component {
    render() {
        return(
            <div className="posts">
                <form onSubmit={this.props.gettingPost}>
                    <div>
                        <button className='btn-posts'>Click me!</button>
                    </div>
                        <img src={this.props.url} />
                        {this.props.title}
                </form>
            </div>
        );
    }
}