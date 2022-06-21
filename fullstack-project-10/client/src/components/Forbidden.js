import { React, Component } from 'react';


export default class Forbidden extends Component {
    render() {
      return (
          <div id='Forbidden_div'>
            <div className="wrap">
                <h2>Forbidden</h2>
                <p>Oh oh! You can't access this page.</p>
            </div>
        </div>
      )
    }
}