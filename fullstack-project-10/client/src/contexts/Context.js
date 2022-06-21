import React, { Component } from 'react';
import Data from '../HOCs/Data';
import Cookies from 'js-cookie';

export const Context = React.createContext(); 

export class Provider extends Component {
  
  constructor() {
    super();
    this.data = new Data();
    //Fetching cookie and setting it to state
    //If there is no cookie, null is returned
    this.cookie = Cookies.get( 'authenticatedUser' );
    this.state = {
      authenticatedUser : this.cookie ? JSON.parse( this.cookie ) : null,
      course: null, error: null
    };
  }

  

  state = {
    authenticatedUser: null,
    course: null,
    error: null
  }

  render() {
    const { authenticatedUser, error } = this.state;
    const value = {
      authenticatedUser,
      error,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        updateCourse: this.updateCourse,
        deleteCourse: this.deleteCourse,
        createCourse: this.createCourse,
        getCourse: this.getCourse
      }
    }

    return (
      <Context.Provider value={ value }>
        { this.props.children }
      </Context.Provider>  
    );
  }

  signIn = async ( emailAddress, password ) => {
    //Fetching user data
    const user = await this.data.getUser( emailAddress, password );
    
    if ( user !== null ) {
      this.setState(() => {
        //If not null, set authenticatedUser
        return {
          authenticatedUser: user
        };
      });
      user.user.password = password;
      //Set user credentials and save to a cookie
      Cookies.set( 'authenticatedUser', JSON.stringify( user ), { expires: 1 } );
    }
    return user;
  }

  signOut = () => {
    try {
      //Remove user from state, delete cookie
      this.setState(()=> {
        return {
          authenticatedUser: null }
        });
      Cookies.remove( 'authenticatedUser' );
    } catch (error) {
      console.log(error.message)
    }
  }

  getCourse = async(id) => {
    try {
      //Fetching course data based on course id
      let course = await this.data.getCourse(id);
      return course;
    } catch(error) {
      this.setState({
        error
      });
    }

    
  }

  deleteCourse = async (courseId, emailAddress, password) => {
    //Double checking for authenticatedUser
    if ( this.state.authenticatedUser !== null) {
      try {
        await this.data.deleteCourse(courseId, emailAddress, password);
      } catch(error) {
        console.log(error.message)
      }
    }
  }

  updateCourse = async (courseId, userId, title, description, estimatedTime, materialsNeeded, emailAddress, password) => {
    //Checking for authenticatedUser
    if ( this.state.authenticatedUser.user.emailAddress !== null) {
      try {
        await this.data.updateCourse({
          courseId, userId, title, description, estimatedTime, materialsNeeded, emailAddress, password
        });
      } catch(error) {
        return error;
      }
    }
}

  createCourse = async (userId, title, description, estimatedTime, materialsNeeded, emailAddress, password) => {
    //Checking for authenticatedUser
    if ( this.state.authenticatedUser.user.emailAddress !== null) {
      try {
        await this.data.createCourse({
          userId, title, description, estimatedTime, materialsNeeded, emailAddress, password
        });
      } catch(error) {
        return error;
      }
    }
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param { class } Component - A React component.
 * @returns { function } A higher-order component.
 */

export default function withContext( Component ) {
  return function ContextComponent( props ) {
    return (
      <Context.Consumer>
        { context => <Component { ...props } context={ context } />}
      </Context.Consumer>
    );
  }
}