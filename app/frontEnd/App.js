import React, {Component} from 'react';
import client from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = client('http://localhost:8080');
    this.socket.on('connect', () => console.log('connected'));
    this.socket.on('end_page_load', (data) => console.log(data));
    this.socket.on('new_website_tested', (data) => this.updateList(data));

    this.state = {
      url: '',
      urlsList: []
    }

  }

  updateList = (data) => {
    this.setState((prevState) => ({
      urlsList: prevState.urlsList.concat([data])
    }))
  }

  loadPage = (url) => {
    this.socket.emit('start_page_load', {url});
  }

  updateUrl = ({target}) => {
    this.setState({
      url: target.value
    })
  }

  render () {
    const {url} = this.state;
    return (
      <div>
        <input onChange={this.updateUrl} value={url} />
        <button onClick={() => this.loadPage(url)}>Start Loading</button>
        {urlsList && urlsList.map((url, index) => <li key={index}>{url.address} : {url.load_time}</li>)}
      </div>
    )
  }

}
