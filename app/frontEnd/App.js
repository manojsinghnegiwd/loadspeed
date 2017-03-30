import React, {Component} from 'react';
import client from 'socket.io-client';
import {getUrls} from './utils';
import {Row, Col, FormInput, InputGroup, Button, Spinner} from 'elemental';
import {UrlList} from './components';

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
    let {urlsList} = this.state;

    if(!(data instanceof Array)) {
      data = [data];
    }

    urlsList.splice(0, 0, ...data);

    if(urlsList.length > 9) {
      urlsList.splice(10, urlsList.length - 10)
    }

    this.setState({
      urlsList
    })
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
        <Col>
          <Row>
            <Col sm="1/3"></Col>
            <Col sm="1/3">
              <InputGroup>
                <InputGroup.Section grow>
                  <FormInput autoFocus onChange={this.updateUrl} value={url} type="text" placeholder="Test your webpage speed" />
                </InputGroup.Section>
                <InputGroup.Section>
                  <Button type="primary" onClick={() => this.loadPage(url)}>{ calculating ? <Spinner type="inverted" /> : 'Load'}</Button>
                </InputGroup.Section>
              </InputGroup>
              <hr />
              <UrlList urls={urlsList} />
            </Col>
            <Col sm="1/3"></Col>
          </Row>
        </Col>
      </div>
    )
  }

}
