import React from 'react';
import pointImg from '../../imgs/piste2.png';
import defaultImg from '../../imgs/coach_placeholder.png';
import pageContent from '../pageContent';

// component for displaying users' upcoming meetings and their timetable
export default class Usertimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // array of objects containing data about distinct meetings
      // {endTime, image, name, startTime}
      timetable: undefined,
      // meeting date as 'YYYY-MM-DD'
      date: undefined,
    };
  }

  componentDidMount() {
    this.fetchTimetable();
  }

  fetchTimetable() {
    pageContent.fetchData('/userMeetings', 'GET', {})
      .then((response) => {
        this.setState({
          timetable: response.meetings,
          date: response.date,
        });
      });
  }

  render() {
    if (this.state.timetable === undefined) return null;
    if (this.state.timetable.length === 0) {
      return <p className="empty-content-text">No scheduled meetings</p>;
    }
    const data = this.state.timetable.sort((a, b) => a.startTime - b.startTime);
    // add breaks if exist
    for (let i = 0; i < data.length - 1; i += 1) {
      if (data[i].endTime < data[i + 1].startTime) {
        data.splice(i + 1, 0, {
          startTime: data[i].endTime,
          endTime: data[i + 1].startTime,
          name: 'BREAK',
        });
      }
    }
    return (
      <div>
        <div className="timetable-header-style">{this.state.date.split('-').reverse().join('.')}</div>
        {this.state.timetable.map(b => (
          <div id="figure" key={b.name}>
            <div>
              {/* only show image if name !== 'BREAK' */}
              {b.name !== 'BREAK' && <img className="timetable-list-avatar" src={b.image || defaultImg} alt="" />}
              <figcaption className="timetable-name-style">{b.name}</figcaption>
              <div className="timetable-text-style">
                {b.startTime.substr(0, 5)} - {b.endTime.substr(0, 5)}
              </div>
            </div>
            <img src={pointImg} alt="" className="timetable-divider" />
          </div>
        ))}
      </div>
    );
  }
}
