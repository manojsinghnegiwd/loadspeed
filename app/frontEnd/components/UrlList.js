import React, {Component} from 'react';

export default class UrlList extends Component {
  render () {
    const urls = this.props;
    console.log(urls);
    return (
      <div>
        <h3>Recently tested webpages</h3>
      </div>
    )
  }
}
