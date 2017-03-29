import React, {Component} from 'react';
import client from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = client('http://localhost:8080');
    this.socket.on('connect', () => console.log('connected'));
  }

  render () {
    return <div></div>
  }

}
