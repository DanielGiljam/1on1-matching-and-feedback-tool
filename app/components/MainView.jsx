import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import pageContent from './pageContent';
import LandingPage from './LandingPage';


// This is the class that shows the whole page content after login
// Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.changeContent = this.changeContent.bind(this);
    const contents = pageContent.getContent(this.props.type);
    this.state = {
      current: (
        <div>
          <h1>Welcome, {this.props.type}</h1>
          <LandingPage />
        </div>),
      contentMap: contents.content,
      labels: contents.labels,
    };
  }


  changeContent(key) {
    const view = this.state.contentMap[key];
    this.setState({ current: view });
  }

  render() {
    return (
      <div>
        <Menu
          onChange={this.changeContent}
          logoff={this.props.logoff}
          content={this.state.labels}
        />
        <div id="mainContainer">
          {this.state.current}
        </div>
      </div>
    );
  }
}

MainView.propTypes = {
  type: PropTypes.string.isRequired,
  logoff: PropTypes.func.isRequired,
};
