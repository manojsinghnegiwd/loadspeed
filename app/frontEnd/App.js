import React, {Component} from 'react';
import client from 'socket.io-client';
import {getUrls} from './utils';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = client('http://localhost:7000');
    this.socket.on('connect', () => console.log('connected'));
    this.socket.on('end_page_load', (data) => this.updateCalculating(false));
    this.socket.on('new_website_tested', (data) => this.updateList(data));

    this.state = {
      url: '',
      urlsList: [],
      calculating: false
    }

  }

  componentWillMount () {
    this.getUrls();
  }

  getUrls = () => {
    getUrls()
      .then(res => this.updateList(res.data.urls))
  }

  updateList = (data) => {
    this.setState((prevState) => ({
      urlsList: prevState.urlsList.concat(data)
    }))
  }

  loadPage = (url) => {
    this.updateCalculating(true);
    this.socket.emit('start_page_load', {url});
  }

  updateUrl = ({target}) => {
    this.setState({
      url: target.value
    })
  }

  updateCalculating = (flag) => {
    this.setState({
      calculating: flag
    })
  }

  render () {
    const {url, urlsList, calculating} = this.state;
    return (
      <div>
        <input onChange={this.updateUrl} value={url} />
        <button onClick={() => this.loadPage(url)}>Start Loading</button>
        {calculating ? <p>loading</p> : null}
        {urlsList && urlsList.map((url, index) => <li key={index}>{url.address} : {url.load_time}</li>)}
      </div>
    )
  }

}
