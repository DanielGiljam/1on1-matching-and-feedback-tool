import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';
import pageContent from '../pageContent';

// React Component for the schedule view for admins.
export default class AdminSchedules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date,
      schedule: [],
      firstColumn: 'coach',
      allUsers: null,
      editable: false,
    };
    this.fetchTimetable = this.fetchTimetable.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.toggle = this.toggle.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  componentDidMount() {
    this.fetchTimetable();
    this.fetchUsers();
  }

  fetchTimetable() {
    pageContent.fetchData('/timetable', 'GET', { date: this.props.date }).then((response) => {
      this.setState({ schedule: response.schedule });
    });
  }

  saveTimetable() {
    pageContent.fetchData('/timetable', 'POST', { date: this.props.date, schedule: JSON.stringify(this.state.schedule) }).then((response) => {
      console.log(response);
    });
  }

  handleSaveClick() {
    this.toggleEditable(false);
    this.saveTimetable();
  }

  toggleEditable(value) {
    this.setState({ editable: value });
  }

  fetchUsers() {
    pageContent.fetchData('/activeStatuses', 'GET', {}).then((response) => {
      const coaches = response.coaches.filter(user => user.active).map(user => user.name);
      const startups = response.startups.filter(user => user.active).map(user => user.name);
      this.setState({ allUsers: { coaches, startups } });
    });
  }

  toggle(n) {
    this.setState({ firstColumn: n });
  }
  // TODO splits?
  // newValue is new value of cell
  // cellKeys is of form: {leftColumn: either coach or startup, time, cellValue: old value}
  //
  updateValue(newValue, cellKeys) {
    this.setState((oldState) => {
      let oldValue = cellKeys.cellValue;
      if (oldValue === '-') oldValue = null;
      const oldSchedule = oldState.schedule;
      const c = oldState.firstColumn === 'coach';
      const oldCoach = c ? cellKeys.leftColumn : oldValue;
      const oldStartup = c ? oldValue : cellKeys.leftColumn;

      const oldI = oldSchedule.findIndex(o =>
        o.startup === oldStartup && o.coach === oldCoach && o.time === cellKeys.time);
      const newCoach = c ? oldCoach : newValue;
      const newStartup = c ? newValue : oldStartup;
      if (oldI < 0) {
        oldSchedule.push({
          time: cellKeys.time,
          coach: newCoach,
          startup: newStartup,
          duration: oldSchedule[0].duration, // This assumes all have same duration
        });
      } else {
        oldSchedule[oldI] = {
          time: cellKeys.time,
          coach: newCoach,
          startup: newStartup,
          duration: oldSchedule[oldI].duration,
        };
      }
      return { schedule: oldSchedule };
    });
  }

  render() {
    const editButton = this.state.editable ? (
      <button
        className="btn btn-major"
        onClick={this.handleSaveClick}
      >Save changes
      </button>)
      : (
        <button
          className="btn btn-major"
          onClick={() => this.toggleEditable(true)}
        >Edit manually
        </button>);

    return (
      <div>
        <div className="toggle-container">
          <h1>Timetable</h1>
          <h2>{this.state.date}</h2>
          <div className="">
            {editButton}
            <ul className="toggle-ul">
              <li>
                {/* conditionally set active class based on firstColumn */}
                <button
                  className={`toggle-button ${this.state.firstColumn === 'coach' ? 'active' : ''}`}
                  onClick={() => this.toggle('coach')}
                >
                  Coaches
                </button>
              </li>
              <li>
                <button
                  className={`toggle-button ${this.state.firstColumn === 'startup' ? 'active' : ''}`}
                  onClick={() => this.toggle('startup')}
                >
                Startups
                </button>
              </li>
            </ul>
          </div>
        </div>
        {this.state.schedule && this.state.allUsers && <AdminScheduleTable
          schedule={this.state.schedule}
          firstColumn={this.state.firstColumn}
          allUsers={this.state.allUsers}
          editable={this.state.editable}
          onEdit={this.updateValue}
        />}
      </div>
    );
  }
}

AdminSchedules.propTypes = {
  date: PropTypes.string.isRequired,
};
