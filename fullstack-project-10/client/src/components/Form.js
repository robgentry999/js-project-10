import React from 'react';

export default function Form ( props ) {
  const {
    cancel,
    submit,
    submitButtonText,
    elements,
  } = props;

  function handleSubmit( event ) {
    event.preventDefault();
    //submit() will be defined in whichever component imports the Form component
    submit();
  }

  function handleCancel( event ) {
    event.preventDefault();
    //cancel() will be defined in whichever component imports the Form component
    cancel();
  }

  return (
    <div>
      <form onSubmit={ handleSubmit }>
        {/* Elements are declared in the component importing this one */}
        { elements() }
        <div className="pad-bottom">
          <button className="button" type="submit">{ submitButtonText }</button>
          <button className="button button-secondary" onClick={ handleCancel }>Cancel</button>
        </div>
      </form>
    </div>
  );
}
