import React, {useEffect, useState} from 'react';
import axios from 'axios';
import UnhandledError from './UnhandledError';

export default function Courses( props ) {

  const [ courseList, setCourseList ] = useState([ '' ]);
  const [ mistakes, setMistakes ] = useState([]);

  async function loader() {
      try{
        let color = 'brown';
        function getColor(color) {
          color = 'red';
          return color;
        }
        let number = 234;
        
        let number_1 = String(number).slice(0, 1);
        let number_2 = String(number).slice(1, -1);
        let number_3 = String(number).slice(2);
        let exponent = String(number).length;

        console.log(
          number_1 + ' ' + number_2 + ' ' + number_3 + ' ' + exponent
        );
        //Making an axios call to return all the courses' data in the db, then
        //set that data to state
        return(
          await axios.get( `http://localhost:5000/api/courses` ).then(
              response => setCourseList( response.data )
        ));
      } catch( error ) {
        //If there are errors, they are set to state to be displayed later in ServerError Display
        setMistakes(error.response.status + ' ' + error.response.statusText);
      }
  };
    
    //Upon page rendering, loader() function is invoked
    //setCourseList is listed as a dependency to avoid infinite looping behavior
    useEffect( () => { loader() }, [ setCourseList ] );

    function ServerErrorDisplay() {
      if (mistakes !== null) {
        //If there are any errors present in state, display them as <li> items
        //Otherwise, this component isn't displayed
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

    try {
      //If course data is present in state
      if ( courseList ) {
        
        return (
          <div id='Courses_div'>
            {/*Error display renders conditionally*/}
            <ServerErrorDisplay />
            <div className="wrap main--grid">
              {
                courseList.map( ( course, index ) => 
                  <div key={ index }>
                    <a className="course--module course--link" href={ `/courses/${ course.id }` }>
                    <h2 className="course--label">Course</h2>
                    <h3 className="course--title">{ course.title }</h3>
                    </a>
                  </div> )
              }
              <div>
                <a className="course--module course--add--module" href={ '/courses/create' }>
                  <span className="course--add--title">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                      viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                      New Course
                  </span>
                </a>
              </div>
            </div>
          </div>
        )} else {
            return (
              <div id='Courses_div'>
                <div className="wrap main--grid">
                  <div>
                    <a className="course--module course--add--module" href="/courses/create">
                      <span className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                          viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                          New Course
                      </span>
                    </a>
                  </div>   
                </div>
              </div>
            )}
      } catch ( error ) {
          return <UnhandledError error={error.message}/>
        }
  }