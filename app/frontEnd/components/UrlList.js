import React, {Component} from 'react';
import {Table, Card} from 'elemental';

export default class UrlList extends Component {
  render () {
    const {urls} = this.props;
    return (
      <div>
        <Card>
          <div className="lead" style={style.heading}>
            Recently Tested (Top 10)
          </div>
          <Table>
            <colgroup>
              <col width="80%" />
              <col width="20%" />
            </colgroup>
            <thead>
          		<tr>
          			<th>Webpage</th>
          			<th>Load Time</th>
          		</tr>
          	</thead>
            <tbody>
          		{
                urls.map((url, index) => {
                  return (
                    <tr key={index}>
                			<td>{url.address}</td>
                			<td>{url.load_time/1000}s</td>
                		</tr>
                  )
                })
              }
          	</tbody>
          </Table>
        </Card>
      </div>
    )
  }
}

const style = {
  heading: {
    marginTop: 0
  }
}
