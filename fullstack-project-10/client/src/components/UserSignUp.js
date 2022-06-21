import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
import withNavigation from '../HOCs/Nav';

class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {

    const {
      firstName,
      lastName,
      emailAddress,
      password,
      errors,
    } = this.state;

    function ErrorsDisplay() {
      //Conditionally rendered error display based on errors from Form
      if (errors.length > 0) {
        let errors_list = errors.map((error, index) => 
          <li key={index} className='error_display'>{error}</li>
        );
     return (
       <div className='validation--errors' id='error_display_div'>
          <div className='error_display'>
          <ul className='error_display'>
            {errors_list}
          </ul>
          </div>
       </div>
     )
        } else {
          return null;
        }
  }

    return (
        <div className="form--centered">
          <h2>Sign Up</h2>
          <Form 
            cancel={ this.cancel }
            errors={ errors }
            submit={ this.submit }
            submitButtonText="Sign Up"
            //Render prop to fill in the body of the form and capture user data
            elements={ () => (
              <React.Fragment>
                <label htmlFor='firstName'>
                  First Name
                </label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  value={ firstName } 
                  onChange={ this.change } />
                  <label htmlFor='lastName'>
                  Last Name
                </label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  value={ lastName } 
                  onChange={ this.change } />
                  <label htmlFor='emailAddress'>
                  Email Address
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
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
    );
  }

  //Sets state based on user input before submit
  change = ( event ) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState( () => {
      return {
        [ name ]: value
      };
    });
  }

  submit = () => {
    //Deconstructing variables from props & state and setting them to 'user' variable
    const { context } = this.props;
    const { firstName, lastName, emailAddress, password } = this.state;
    const user = { firstName, lastName, emailAddress, password };

    //Executing createUser function from Data.js using the above 'user' variable
    context.data.createUser( user ).then(
      errors => {
        if ( errors.length ) {
          this.setState({ errors });
        } else {
            context.actions.signIn( emailAddress, password );
            this.props.navigate('/');
        }
      }).catch(err => {
        this.props.navigate( '/error', {err} );
      });
   }

  cancel = () => {
    this.props.navigate( '/' );
  }
}

export default withNavigation( UserSignUp );