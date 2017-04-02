import React, {Component} from 'react';
import client from 'socket.io-client';
import {getUrls, socket_port, host_url} from './utils';
import {Row, Col, FormInput, InputGroup, Button, Spinner, Alert, Card} from 'elemental';
import {UrlList} from './components';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = client(`${host_url}:${socket_port}`);
    this.socket.on('connect', () => console.log('connected'));
    this.socket.on('end_page_load', this.endLoadPage);
    this.socket.on('new_website_tested', this.newUrlAdded);

    this.state = {
      url: '',
      urlsList: [],
      err: '',
      fetchedUrl: {},
      calculating: false,
      total_count: 0,
      fetching: false
    }

  }

  componentWillMount () {
    this.getUrls();
  }

  updateFetching = (fetching) => {
    this.setState({
      fetching
    })
  }

  getUrls = () => {
    this.updateFetching(true);
    getUrls()
      .then(res => {
        let {total_count, urls} = res.data;
        this.setState({
          total_count
        })
        this.updateList(urls)
        this.updateFetching(false);
      })
  }

  newUrlAdded = (data) => {

    const {new_url, total_count} = data;

    this.setState({
      total_count
    })

    this.updateList(new_url, true);
  }

  updateList = (data, new_link) => {
    let {urlsList} = this.state;

    if(!(data instanceof Array)) {
      data = [data];
    }

    if(new_link) {
      data = data.map((url) => ({...url, new: true}));
    }

    urlsList.splice(0, 0, ...data);

    if(urlsList.length > 9) {
      urlsList.splice(10, urlsList.length - 10)
    }

    this.setState({
      urlsList
    })
  }

  clearMsg = () => {
      this.setState({
        err: '',
        fetchedUrl: {}
      })
  }

  loadPage = (url) => {
    this.clearMsg();
    if(!url && !url.trim()) {
      this.setState({
        err: "Url can't be empty"
      })
      return;
    }
    this.updateCalculating(true);
    this.socket.emit('start_page_load', {url});
  }

  clearUrl = () => {
    this.setState({
      url: ''
    })
  }

  endLoadPage = (fetchedUrl) => {
    this.updateCalculating(false);
    this.clearUrl();
    this.setState({
      fetchedUrl
    })
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
    const {url, urlsList, calculating, err, fetchedUrl, total_count, fetching} = this.state;
    return (
      <div style={style.container}>
        <Col>
          <Row>
            <Col sm="1/4"></Col>
            <Col sm="1/2">
              {total_count ? <h2 className="poppins">{total_count} tested so far... </h2>: null}
              <InputGroup>
                <InputGroup.Section grow>
                  <FormInput disabled={calculating} autoFocus onChange={this.updateUrl} value={url} type="text" placeholder="Test your webpage speed" />
                </InputGroup.Section>
                <InputGroup.Section>
                  <Button type="primary" onClick={() => this.loadPage(url)}>{ calculating ? <Spinner type="inverted" /> : 'Load'}</Button>
                </InputGroup.Section>
              </InputGroup>
              {err ? <Alert type="danger"><strong>Error:</strong> {err}</Alert> : null}
              {fetchedUrl.address ? <Alert type="success"><span>
                Load time for <strong>{fetchedUrl.address}</strong> is <strong>{fetchedUrl.load_time / 1000} seconds </strong>
              </span> </Alert> : null}
              {fetching ? <div style={style.centerChildren}>
                <Spinner size="md" type="primary" />
              </div> : null}
              {urlsList && urlsList.length > 0 ? <UrlList urls={urlsList} /> : null}
              <Card>
                <div style={{textAlign: 'center'}}>
                  Made by <strong><a href="http://www.manojsinghnegi.com/">Manoj Singh Negi</a></strong> with React, Socket.io, Rethinkdb & Node.JS
                  <br />
                  <br />
                  <a target="_blank" href="https://github.com/manojsinghnegiwd/loadspeed">
                    <strong>Fork this project on github</strong>
                  </a>
                </div>
              </Card>
            </Col>
            <Col sm="1/4"></Col>
          </Row>
        </Col>
      </div>
    )
  }

}

let style = {
  container: {
    padding: 50
  },
  centerChildren: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  }
}
