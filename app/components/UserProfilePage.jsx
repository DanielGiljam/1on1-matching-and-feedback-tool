import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserProfile from './UserProfile';
import EditUserProfile from './EditUserProfile';
import pageContent from './pageContent';

class UserProfilePage extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.handleModifyClick = this.handleModifyClick.bind(this);

    // Initialize the state as empty.
    this.state = {
      userType: '',
      name: '',
      description: '',
      linkedIn: '',
      credentials: [],
      canModify: false,
      titles: [],
      modifying: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id === prevProps.id) return;
    this.fetchData();
  }

  fetchData() {
    let params = {};
    if (typeof this.props.id !== 'undefined') params = { userId: this.props.id };
    pageContent.fetchData('/profile', 'get', params)
      .then((responseJSON) => {
        console.log(responseJSON);
        this.setState({
          userType: responseJSON.type,
          name: responseJSON.name,
          description: responseJSON.description,
          linkedIn: responseJSON.linkedIn,
          credentials: responseJSON.credentials,
          canModify: responseJSON.canModify,
          titles: [responseJSON.company],
        });
      });
  }

  handleModifyClick() {
    this.setState({ modifying: true });
  }

  render() {
    if (this.state.modifying) {
      return (
        <EditUserProfile
          type={this.state.userType}
          id={this.props.id}
          name={this.state.name}
          description={this.state.description}
          linkedIn={this.state.linkedIn}
          credentials={this.state.credentials}
          titles={this.state.titles}
        />
      );
    }
    return (
      <div>
        <UserProfile
          type={this.state.userType}
          name={this.state.name}
          description={this.state.description}
          linkedIn={this.state.linkedIn}
          credentials={this.state.credentials}
          canModify={this.state.canModify}
          titles={this.state.titles}
          onModifyClick={this.handleModifyClick}
        />
      </div>
    );
  }
}

UserProfilePage.propTypes = {
  id: PropTypes.string,
};

UserProfilePage.defaultProps = {
  id: undefined,
};

export default UserProfilePage;
