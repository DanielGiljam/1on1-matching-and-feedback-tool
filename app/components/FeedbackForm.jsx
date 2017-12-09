import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import RadioInput from './RadioInput';
import InfoCard from './InfoCard';


export default class FeedbackForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choices: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(index, value) {
    this.setState((oldState) => {
      const newChoices = oldState.choices.slice(0);
      newChoices[index] = value;
      return { choices: newChoices };
    });
  }

  handleSubmit() {
    this.props.onSubmit(this.props.info.name, this.state.choices);
  }


  render() {
    const radioInputs = this.props.questions.map(obj =>
      (<RadioInput
        key={`Q_${obj.index}`}
        id={`Q_${obj.index}`}
        name={`Q_${obj.index}`}
        index={obj.index}
        options={obj.options}
        question={obj.question}
        onChange={this.handleChange}
      />
      ));
    return (
      <div className="container-fluid">
        <h1>Give Feedback</h1>
        <InfoCard info={this.props.info} />
        <form className="radiobuttons form-inline">
          {radioInputs}
        </form>
        <Button className="btn btn-lg ffbutton-red" onClick={this.handleSubmit} text="Done" />
      </div>
    );
  }
}

FeedbackForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  info: PropTypes.shape({
    name: PropTypes.string,
    image_src: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  questions: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    question: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.number),
  })).isRequired,
};
