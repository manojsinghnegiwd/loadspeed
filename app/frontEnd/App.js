import React, {Component} from 'react';
import client from 'socket.io-client';
import {getUrls} from './utils';
import {Row, Col, FormInput, InputGroup, Button, Spinner, Alert} from 'elemental';
import {UrlList} from './components';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = client('http://localhost:7000');
    this.socket.on('connect', () => console.log('connected'));
    this.socket.on('end_page_load', this.endLoadPage);
    this.socket.on('new_website_tested', this.newUrlAdded);

    this.state = {
      url: '',
      urlsList: [],
      err: '',
      FetchedUrl: {},
      calculating: false,
      total_count: 0
    }

  }

  componentWillMount () {
    this.getUrls();
  }

  getUrls = () => {
    getUrls()
      .then(res => this.updateList(res.data.urls))
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
        FetchedUrl: {}
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

  endLoadPage = (FetchedUrl) => {
    this.updateCalculating(false);
    this.setState({
      FetchedUrl
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
    const {url, urlsList, calculating, err, FetchedUrl, total_count} = this.state;
    return (
      <div style={style.container}>
        <Col>
          <Row>
            <Col sm="1/4"></Col>
            <Col sm="1/2">
              <h2>{total_count} tested so far... </h2>
              <InputGroup>
                <InputGroup.Section grow>
                  <FormInput autoFocus onChange={this.updateUrl} value={url} type="text" placeholder="Test your webpage speed" />
                </InputGroup.Section>
                <InputGroup.Section>
                  <Button type="primary" onClick={() => this.loadPage(url)}>{ calculating ? <Spinner type="inverted" /> : 'Load'}</Button>
                </InputGroup.Section>
              </InputGroup>
              {err ? <Alert type="danger"><strong>Error:</strong> {err}</Alert> : null}
              {FetchedUrl.address ? <Alert type="success"><span>
                Load time for <strong>{FetchedUrl.address}</strong> is <strong>{FetchedUrl.load_time / 1000} seconds </strong>
              </span> </Alert> : null}
              {urlsList && urlsList.length > 0 ? <UrlList urls={urlsList} /> : null}
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
  }
}
