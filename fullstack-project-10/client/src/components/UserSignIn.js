import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
import withNavigation from '../HOCs/Nav';

class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    function ErrorsDisplay() {
      //Captures potential form errors and displays them as <li> items
      //Otherwise it isn't rendered
      if (errors.length > 0) {
        let errors_list = 
          <li className='error_display'>{errors}</li>
        ;
     return (
       <div className='validation--errors' id='error_display_div'>
          <div className='error_display'>
          <ul className='error_display'>
            {errors_list}
          </ul>
          </div>
       </div>
     )
      }
      return null;
  }

    return (
        <div className="form--centered">
          <h2>Sign In</h2>
          <Form 
            cancel={ this.cancel }
            errors={ errors }
            submit={ this.submit }
            submitButtonText="Sign In"
            //Render props to fill in the body of the form
            //Form will capture user input
            elements={ () => (
              <React.Fragment>
                <label
                  htmlFor='emailAddress'>Email Address
                </label>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={ emailAddress } 
                  onChange={ this.change } />
                  <label htmlFor='password'>
                    Password
                  </label>
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={ password } 
                  onChange={ this.change } />          
                  <ErrorsDisplay />      
              </React.Fragment>
            )} />
          <p>
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
          </p>
        </div>
    );
  }

  //Sets user input to state as it's typed, before submit
  change = ( event ) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [ name ]: value
      };
    });
  }

  //Function to submit the form based on signIn() from ./context, and user data from state
  submit = () => {
    const { context } = this.props;
    const { emailAddress, password } = this.state;

      //Checking for emailAddress value
      if ( emailAddress === '' || emailAddress === undefined || emailAddress === null ) {
          this.setState({
            errors:  ['Please enter your email address'] 
          });
        } else {
          this.setState({
              emailAddress: emailAddress
        });
          
        //Checking for password value
      if (password === '' || password === undefined || password === null) {
          this.setState({
            errors: ['Please enter your password']
          });
        } else {
          this.setState({
              password: password
        });

        //Signing in once emailAddress and password are provided
        context.actions.signIn( emailAddress, password );
          //Navigate to previous page when signed in
          this.props.navigate( '/' );
        }
      }
    };

  cancel = () => {
    this.props.navigate( '/' );
  }
}

export default withNavigation( UserSignIn );