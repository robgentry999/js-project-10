import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotFound from './NotFound';
import MarkdownToHtml from '../HOCs/Markdown';
import UnhandledError from './UnhandledError';


export default function CourseDetail( props ) {

  //Declaring functions as variables for later use
  const navigate = useNavigate();
  const { id } = useParams();

  //Setting state and setting variables to alter it later
  const [ courseDetails, setCourseDetails ] = useState('');
  const [ courseOwner, setCourseOwner ] = useState('');
  const [ mistakes, setMistakes ] = useState([]);

  //A function that executes upon page load
  async function loader() {
    if ( id ) {
      try{
        return(
          //If the url has an id parameter, the app makes an axios call to a specific course based on
          //the id param, then sets state with the resulting data
          await axios.get( `http://localhost:5000/api/courses/${ id }` ).then(
              response => setCourseDetails( response.data.course )
        ));
      } catch( error ) {
        //If (an) error(s) occur(s), it/they are set to state and then displayed in the ServerErrorDisplay
        //component below
        setMistakes(error.response.status + ' ' + error.response.statusText);
      }
    }
  };

  //Second function to execute upon page load
  async function loader_2() {
    if ( id ) {
    try {
      //Again, if there is a course id then an axios call is made and the resulting
      //course owner data is set to state. Otherwise the user is navigated to /notFound
      await axios.get( `http://localhost:5000/api/courses/${ id }` ).then(
        response => {
          if (!response.data.course) {
            navigate('/notFound');
          } else {
            setCourseOwner( response.data.course.User )}
          }
        )
      } catch( error ) {
        //Errors are set to state and displayed in the ServerErrorDisplay component below
        setMistakes(error.response.status + ' ' + error.response.statusText);
      }
    }
  }

  async function delete_course(id, emailAddress, password) {
    if ( id ) {
      try{
        //Conditional statement checks for a course id, then calls on deleteCourse() through
        //context from HOCs/Data.js, then navigates the user to the home page
          await props.context.actions.deleteCourse(`${id}`, emailAddress, password);
          navigate('/');
      } catch( error ) {
        //If there is an error in this process, the UnhandledError component will be returned instead
        return <UnhandledError error={error.message}/>
      }
    } else {
      //If there is no id present, then the course cannot be found (or doesn't exist), and the
      //NotFound component is returned
      return <NotFound />
    }
  };

  function ServerErrorDisplay() {
    //If there are errors in state, display them as <li> items
    //Otherwise, this component isn't displayed
    if (mistakes !== null) {
      let errors_list = 
        <li key={1} className='error_display'>{mistakes}</li>;
   return (
     <div className='error_display server_error' id='error_display_div'>
        <div className='error_display server_error'>
        <ul className='error_display server_error'>
          {errors_list}
        </ul>
        </div>
     </div>
   )
    }
    return null;
}

  //Functions described above will execute upon the page being rendered
  //'Set' functions are listed as dependencies to stop infinite looping behavior
  useEffect( () => { loader() }, [ setCourseDetails ] );
  useEffect( () => { loader_2() }, [ setCourseOwner ] );
  //Checking for courseOwner data to ensure the course exists
  //Otherwise the user is directed to the NotFound component
  useEffect(()=>{ if ( courseOwner === null || courseOwner === undefined ) {
    navigate('/notFound');
  }
});

  if ( courseOwner !== null || courseOwner !== undefined ) {
    let owner = courseOwner;
    
      try {
        let user = props.context.authenticatedUser;
        //If the user is either unauthenticated, or their id doesn't match the creator of the course
        //They are rendered a version of the component without the 'update' or 'delete' course buttons
        if (user === null || user.user.id !== owner.id) {
          return (
            <div>
            <div className="actions--bar">
              <a className="button button-secondary" href="/">Return to List</a>
            </div>
            <ServerErrorDisplay/>
          <div className="wrap">
            <h2>Course Detail</h2>
              <form>
                <div className="main--flex">

                  <div>
                    <h3 className="course--detail--title">Course</h3>
                    <h4 className="course--name">{ courseDetails.title }</h4>
                    {/*rendering course description w markdown*/}
                    { MarkdownToHtml( `${ courseDetails.description }` ) }                         
                  </div>

                  <div>
                    <h3 className="course--detail--title">Estimated Time</h3>
                    <p>{ courseDetails.estimatedTime }</p>
                    <h3 className="course--detail--title">Materials Needed</h3>
                    <ul className="course--detail--list">
                      {/*rendering course materials w markdown*/}
                      <li className='course--detail--list--item'>{ MarkdownToHtml( `${ courseDetails.materialsNeeded }` ) }</li>
                    </ul>
                  </div>

                </div>
              </form>
            </div>
          </div>
          )
        } else if (user.user.id === owner.id) {
          //If the current user's id is the same as the course creator's id, then the full component
          //will be rendered, with the 'update' and 'delete' course buttons
          return(
              <div>
                <div className="actions--bar">
                  <a className="button" href={ `/courses/${id}/update` }>Update Course</a>
                  <a className="button" onClick={ () => delete_course(id, user.user.emailAddress, user.user.password) }>Delete Course</a>
                  <a className="button button-secondary" href="/">Return to List</a>
                </div>
  
                <div className="wrap">
                  <h2>Course Detail</h2>
                    <form>
                      <div className="main--flex">
  
                        <div>
                          <h3 className="course--detail--title">Course</h3>
                          <h4 className="course--name">{ courseDetails.title }</h4>
                          {/*rendering course description w markdown*/}
                          {MarkdownToHtml( `${ courseDetails.description }` )}                        
                        </div>
  
                        <div>
                          <h3 className="course--detail--title">Estimated Time</h3>
                          <p>{ courseDetails.estimatedTime }</p>
                          <h3 className="course--detail--title">Materials Needed</h3>
                          <ul className="course--detail--list">
                            {/*rendering course materials w markdown*/}
                            <li className='course--detail--list--item'>{ MarkdownToHtml( `${ courseDetails.materialsNeeded }` )}</li>
                          </ul>
                        </div>
  
                      </div>
                    </form>
                  </div>
                </div>
              )
        } 
      } catch(error) {
        return <UnhandledError error={error.message}/>
      }
    } 
  }