import React, { Component } from 'react';
import withNavigation from '../HOCs/Nav';
import Form from './Form';

class CreateCourse extends Component {
    
    state = {
        userId: '',
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        emailAddress: '',
        password: '',
        errors: [],
      }

      componentDidMount() {
        if (this.props.context.authenticatedUser === null) {
          this.props.navigate('/signIn');
        } else {
          let owner = this.props.context.authenticatedUser
          this.setState({
              userId: owner.user.id,
              emailAddress: owner.user.emailAddress,
              password: owner.user.password,
              title: '',
              description: '',
              estimatedTime: '',
              materialsNeeded: '',
              errors: null
          })
        }
      }

    render(props) {
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
                
                    <h2>Create Course</h2>
                    
                    {/* Calling on the Form component and setting variables */}
                    <Form
                        cancel={ this.cancel }
                        errors={ errors }
                        submit={ this.submit }
                        submitButtonText="Create"

                        /* Using a react fragment to return a form element and capture values
                            to be input by the user */
                        elements={ () => (
                          
                            <React.Fragment>
                              <ErrorsDisplay errors={this.state.errors}/>
                                <div className="main--flex">
                                
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
    
        //Arrow function to capture any changes in the input fields of the form element
        //and set them to state
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
        const { userId, title, description, estimatedTime, materialsNeeded, emailAddress, password } = this.state;
        
        //Declaring both course and credentials as their own objects based on values from state
        const course = { userId, title, description, estimatedTime, materialsNeeded, emailAddress, password };
        const credentials = { emailAddress, password };

          try {
            //Calling createCourse() from HOCs/Data.js through context
            //Then setting any potential errors to state
            context.data.createCourse( course, credentials ).then(errors=>{
              if (errors) {
                this.setState({errors: errors})
              }
              //If there are no errors, the course is created and the user is redirected to the homepage
              else {
                this.props.navigate('/');
              }
            });
            
       } catch(error) {
          this.setState({errors: error})
          }
    
    }

  cancel = () => {
    this.props.navigate('/');
  }

}

export default withNavigation( CreateCourse );