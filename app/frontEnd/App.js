import React, {Component} from 'react';
import client from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = client('http://localhost:8080');
    this.socket.on('connect', () => console.log('connected'));
    this.socket.on('end_page_load', (data) => console.log(data));
  }

  loadPage = (url) => {
    this.socket.emit('start_page_load', {url});
  }

  render () {
    return (
      <div>
        <button onClick={() => this.loadPage('http://www.google.com')}>Start Loading</button>
      </div>
    )
  }

}
