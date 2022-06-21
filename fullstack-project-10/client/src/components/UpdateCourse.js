import React, { Component } from 'react';
import withNavigation from '../HOCs/Nav';
import withParameters from '../HOCs/Params';
import Form from './Form';

class UpdateCourse extends Component {
  constructor(props) {
    super();
    let owner = props.context.authenticatedUser;
    this.state = {
      userId: owner.user.id,
      emailAddress: owner.user.emailAddress,
      password: owner.user.password,
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      courseOwnerId: '',
      errors: ''
    }
}
    state = {
        userId: '',
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        emailAddress: '',
        password: '',
        courseOwnerId: '',
        errors: []
      }

      componentDidMount() {
        let { id } = this.props.params;
        if (id) {
          //If id param is in the url, execute getCourse() based on that id
          //Then take that data and set it to state
          //If there is no course, redirect to /NotFound
          //If the course.userId is not equal to the authenticatedUser's id, the user
          //is redirected to /Forbidden
          this.props.context.actions.getCourse(id).then(
            response => {
              if (!response.course) {
                this.props.navigate('/notFound');
              }
              if (response.course.userId !== this.props.context.authenticatedUser.user.id) {
                this.props.navigate('/forbidden');
              } else {
                this.setState({
                  title: response.course.title,
                  description: response.course.description,
                  estimatedTime: response.course.estimatedTime,
                  materialsNeeded: response.course.materialsNeeded,
                  courseOwnerId: response.course.User.id
                });
              }
            })
          }
        }

      componentWillUnmount() {
        this.setState = (state, callback)=>{
            return;
        }
    }


    render() {
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors,
          } = this.state;

          
              let owner = this.props.context.authenticatedUser;

                      //Conditionally rendering error display based on if there are errors present in state
        function ErrorsDisplay() {
          if (errors) {
            let errors_list = errors.map((error, index) => 
              <li key={index} >{error}</li>
            );
         return (
           <div className='validation--errors' >
              <div>
                <h3>Validation Errors</h3>
              <ul>
                {errors_list}
              </ul>
              </div>
           </div>
         )
          }
          return null;
      }

          return (

              
                  <div className="wrap">
                        <ErrorsDisplay errors={errors} />
                      <h2>Update Course</h2>
                      <Form
                          cancel={ this.cancel }
                          errors={ errors }
                          submit={ this.submit }
                          submitButtonText="Update"
                          elements={ () => (
                            //A React fragment to render the form data and capture user input
                              <React.Fragment>
                                
                                      <div className='main--flex'>
                                        <div>
                                          <label htmlFor="courseTitle">Course Title</label>
                                          <input id="courseTitle" name="title" type="text" value={title} onChange={ this.change }/>

                                          <p>By: {owner.user.firstName + ' ' + owner.user.lastName}</p>

                                          <label htmlFor="courseDescription">Course Description</label>
                                          <textarea id="courseDescription" name="description" value={description} onChange={ this.change }></textarea>
                                        </div>
                                        <div>
                                            <label htmlFor="estimatedTime">Estimated Time</label>
                                            <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={ this.change }/>

                                            <label htmlFor="materialsNeeded">Materials Needed</label>
                                            <textarea id="materialsNeeded" name="materialsNeeded" value={materialsNeeded} onChange={ this.change }>
                                            </textarea>
                                        </div>
                                      </div>
                              
                          </React.Fragment>
                          )}/>
                      
                      </div>
                
  
              )
    }

    //Arrow function that captures changes to the input elements and saves that data to state
    change = ( event ) => {
        const name = event.target.name;
        const value = event.target.value;
    
        this.setState(() => {
          return {
            [ name ]: value
          };
        });
      }

    submit = () => {
        const { context } = this.props;
        const courseId = this.props.params.id;
        const { userId, title, description, estimatedTime, materialsNeeded } = this.state;
    
        //Conditional statement to check the validity of the course to be updated
        if (this.props.params.id !== undefined) {
              try {
                //UpdateCourse function from HOCs/Data.js through context
                //Uses data from state which was collected in the Form component
                context.data.updateCourse( courseId, userId, title, description, estimatedTime, materialsNeeded, this.state.emailAddress, this.state.password ).then(
                  errors => {
                    if (errors) {
                      //Any potential errors are set to state and will then be displayed with ErrorsDisplay component
                      this.setState({errors: errors});
                    } else {
                      //If there are no errors, the user is redirected to the page of the course they have just updated
                      this.props.navigate(`/courses/${courseId}`);
                    }
                  }
                );
            } catch(error) {
              this.setState({errors: error});
            }
          

    } else {
      this.props.navigate('/forbidden');
    }
    }
    cancel = () => {
      this.props.navigate('/');
    }
}

export default withNavigation( withParameters( UpdateCourse ) );