import { React, Component } from 'react';
import withNavigation from '../HOCs/Nav';

class Error extends Component {
    render() {
        let mistake;
        if (this.props.errors) {
            mistake = [this.props.errors];
        } else {
            mistake = 'Oops! Something went wrong'
    }
      return (
          <div id='Error_div'>
            <div className="wrap">
                <h2>Error</h2>
                {mistake}
            </div>
        </div>
      )
    }
}

export default withNavigation(Error);