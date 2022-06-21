import { React, Component } from 'react';

export default class NotFound extends Component {
    render() {
      return (
        <div id='NotFound_div'>
            <main>
                <div className="wrap">
                    <h2>Not Found</h2>
                    <p>Sorry! We couldn't find the page you're looking for.</p>
                </div>
            </main>
        </div>
      )
    }
}