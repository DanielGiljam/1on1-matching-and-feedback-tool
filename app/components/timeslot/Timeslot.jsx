import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeslotDrag from './TimeslotDrag';
import TimeslotInput from './TimeslotInput';
import pageContents from '../pageContent';

export function parseMinutes(timeString) {
  if (!timeString.match(/^([0-1]?\d|2[0-3]):[0-5]\d$/)) return false;
  const pieces = timeString.split(':');
  return (parseInt(pieces[0], 10) * 60) + parseInt(pieces[1], 10);
}
export function parseTimeStamp(minutes) {
  if (minutes < 0 || minutes >= 1440) return false;
  const hours = parseInt(minutes / 60, 10);
  let minutesOver = minutes % 60;
  if (minutesOver < 10) minutesOver = `0${minutesOver}`;
  return `${hours}:${minutesOver}`;
}

/* Component for presenting and submitting users availabilities */
class Timeslot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available: {
        start: 0,
        end: 0,
      },
      date: new Date(),
      start: 0,
      end: 0,
      split: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.submitAvailability = this.submitAvailability.bind(this);
    this.askForMoreTime = this.askForMoreTime.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    pageContents.fetchData('/getComingMeetingDay', 'GET', {})
      .then((result) => {
        const start = parseMinutes(new Date(`${result.date}T${result.startTime}`).toTimeString().substr(0, 5));
        const end = parseMinutes(new Date(`${result.date}T${result.endTime}`).toTimeString().substr(0, 5));
        this.setState({
          date: new Date(result.date),
          start,
          end,
          split: result.split,
          available: {
            start: (result.time === null) ? start : parseMinutes(result.time),
            end: (result.duration === null) ? end : parseMinutes(result.time) + result.duration,
          },
        });
      });
  }

  handleChange(to, change) {
    let newStart = this.state.available.start;
    let newEnd = this.state.available.end;
    if (to === 'start') {
      newStart = Math.max(newStart + change, this.state.start);
      newStart = Math.round(Math.min(newStart, newEnd));
    } else if (to === 'end') {
      newEnd = Math.min(newEnd + change, this.state.end);
      newEnd = Math.round(Math.max(newEnd, newStart));
    }
    const newObj = { available: { start: newStart, end: newEnd } };
    this.setState(newObj);
  }

  submitAvailability() {
    let startAvail = Math.round(this.state.available.start / 5) * 5;
    let endAvail = Math.round(this.state.available.end / 5) * 5;
    startAvail = this.askForMoreTime('start', startAvail);
    endAvail = this.askForMoreTime('end', endAvail);
    let startTime = Math.ceil((startAvail - this.state.start) / this.state.split);
    startTime = (startTime * this.state.split) + this.state.start;
    let endTime = Math.floor((endAvail - this.state.start) / this.state.split);
    endTime = (endTime * this.state.split) + this.state.start;
    pageContents.fetchData('/insertAvailability', 'POST', {
      date: this.state.date.toISOString().substr(0, 10),
      start: parseTimeStamp(startTime),
      end: parseTimeStamp(endTime),
    }).then((result) => {
      if (result.status === 'success') this.props.history.push('/main');
    });
  }

  askForMoreTime(type, availability) {
    if (type === 'start') {
      let start = Math.floor((availability - this.state.start) / this.state.split);
      start = (start * this.state.split) + this.state.start;
      const cond1 = availability - start < this.state.split / 2;
      const cond2 = availability - start > 0;
      if (cond1 && cond2) {
        if (confirm(`Could you come ${availability - start} minutes earlier?`)) { // eslint-disable-line
          this.setState({
            available: {
              start,
              end: this.state.available.end,
            },
          });
          return start;
        }
      }
    } else if (type === 'end') {
      let endTime = Math.ceil((availability - this.state.start) / this.state.split);
      endTime = (endTime * this.state.split) + this.state.start;
      const cond1 = endTime - availability < this.state.split / 2;
      const cond2 = endTime - availability > 0;
      if (cond1 && cond2) {
        if (confirm(`Could you stay ${endTime - availability} minutes longer?`)) { // eslint-disable-line
          this.setState({
            available: {
              start: this.state.available.start,
              end: endTime,
            },
          });
          return endTime;
        }
      }
    }
    return availability;
  }

  render() {
    const dateOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    return (
      <div className="timeslot-picker container">
        <link rel="stylesheet" type="text/css" href="app/styles/timeslot_style.css" />
        <p className="date">{this.state.date.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}</p>
        <TimeslotDrag
          start={this.state.start}
          end={this.state.end}
          available={this.state.available}
          onChange={this.handleChange}
          split={this.state.split}
        />
        <TimeslotInput
          available={this.state.available}
          onChange={this.handleChange}
        />
        <button onClick={this.submitAvailability} className="btn btn-lg btn-red">Submit</button>
      </div>
    );
  }
}

Timeslot.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withRouter(Timeslot);
