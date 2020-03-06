import React, { Component } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from './1796NumberswithScratch.png';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  selectFilter,
  numberFilter,
  textFilter
} from 'react-bootstrap-table2-filter';
import './PitContent.css';
import { AuthContext } from '../contexts/auth_context';

const statusSelectOptions = {
  'Follow Up': 'Follow Up',
  Done: 'Done'
};
const scoutSelectOptions = {
  Edit: 'Edit',
  Fix: 'FIx'
};

class MatchReportList extends Component {
  static contextType = AuthContext;

  state = {
    widthSize: '',
    heightSize: '',
    competition: '',
    competitions: [],
    columns: [
      { dataField: 'matchid', text: 'Match ID', hidden: true },
      {
        headerStyle: {
          width: '20%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'teamnum',
        text: 'Team',
        filter: textFilter({
          autoComplete: 'off',
          type: 'number',
          className: 'customtextbar'
        })
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'alteredMatchNum',
        text: 'Match',
        filter: textFilter({
          className: 'customtextbar'
        })
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'scoutname',
        text: 'Scouter',
        filter: textFilter({
          className: 'customtextbar',
          autoComplete: 'off'
        })
      },
      {
        headerStyle: {
          width: '20%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'reportstatus',
        text: 'Status',
        formatter: cell => statusSelectOptions[cell],
        filter: selectFilter({
          options: statusSelectOptions
        }),
        hidden: true
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'buttonValue',
        text: 'Scout',
        filter: selectFilter({
          options: statusSelectOptions
        }),
        filterValue: (cell, row) => row.reportstatus
      }
    ],
    drivingColumns: [
      { dataField: 'matchid', text: 'Match ID', hidden: true },
      {
        headerStyle: {
          width: '20%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'teamnum',
        text: 'Team',
        filter: textFilter({
          autoComplete: 'off',
          type: 'number',
          className: 'customtextbar'
        })
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'alteredMatchNum',
        text: 'Match',
        filter: textFilter({
          className: 'customtextbar'
        })
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'scout_name_super_driving',
        text: 'Scouter',
        filter: textFilter({
          className: 'customtextbar',
          autoComplete: 'off'
        })
      },
      {
        headerStyle: {
          width: '20%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'report_status_super_driving',
        text: 'Status',
        formatter: cell => statusSelectOptions[cell],
        filter: selectFilter({
          options: statusSelectOptions
        }),
        hidden: true
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'buttonValue',
        text: 'Scout',
        filter: selectFilter({
          options: statusSelectOptions
        }),
        filterValue: (cell, row) => row.report_status_super_driving
      }
    ],
    defenseColumns: [
      { dataField: 'matchid', text: 'Match ID', hidden: true },
      {
        headerStyle: {
          width: '20%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'teamnum',
        text: 'Team',
        filter: textFilter({
          autoComplete: 'off',
          type: 'number',
          className: 'customtextbar'
        })
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'alteredMatchNum',
        text: 'Match',
        filter: textFilter({
          className: 'customtextbar'
        })
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'scout_name_super_defense',
        text: 'Scouter',
        filter: textFilter({
          className: 'customtextbar',
          autoComplete: 'off'
        })
      },
      {
        headerStyle: {
          width: '20%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'report_status_super_defense',
        text: 'Status',
        formatter: cell => statusSelectOptions[cell],
        filter: selectFilter({
          options: statusSelectOptions
        }),
        hidden: true
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'buttonValue',
        text: 'Scout',
        filter: selectFilter({
          options: statusSelectOptions
        }),
        filterValue: (cell, row) => row.report_status_super_defense
      }
    ],
    matches: [],
    drivingMatches: [],
    defenseMatches: [],
    matchType: 'normal'
  };

  extractLists(data) {
    let preFilterMatchList = data.matchList;
    let preFilterDrivingList = data.matchList;
    let preFilterDefenseList = data.matchList;
    let matchList = preFilterMatchList.filter(team => {
      return team.reportstatus === 'Follow Up' || team.reportstatus === 'Done';
    });
    let drivingList = preFilterDrivingList.filter(team => {
      return (
        team.report_status_super_driving === 'Follow Up' ||
        team.report_status_super_driving === 'Done'
      );
    });
    let defenseList = preFilterDefenseList.filter(team => {
      return (
        team.report_status_super_defense === 'Follow Up' ||
        team.report_status_super_defense === 'Done'
      );
    });
    matchList.sort((a, b) => {
      if (a.matchnum.split('_')[0] === 'qm') {
        if (b.matchnum.split('_')[0] === 'qm') {
          return a.matchnum.split('_')[1] - b.matchnum.split('_')[1];
        } else {
          return -1;
        }
      } else if (a.matchnum.split('_')[0] === 'qf') {
        if (b.matchnum.split('_')[0] === 'qf') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (b.matchnum.split('_')[0] === 'qm') {
            return 1;
          } else {
            return -1;
          }
        }
      } else if (a.matchnum.split('_')[0] === 'sf') {
        if (b.matchnum.split('_')[0] === 'sf') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (
            b.matchnum.split('_')[0] === 'qm' ||
            b.matchnum.split('_')[0] === 'qf'
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      } else if (a.matchnum.split('_')[0] === 'f') {
        if (b.matchnum.split('_')[0] === 'f') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (
            b.matchnum.split('_')[0] === 'qm' ||
            b.matchnum.split('_')[0] === 'qf' ||
            b.matchnum.split('_')[0] === 'sf'
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      }
    });
    matchList.sort((a, b) => a.teamnum - b.teamnum);
    matchList.map(row => {
      let buttonLabel;
      let newMatchNum;
      if (row.matchnum.split('_')[0] === 'qm') {
        newMatchNum = 'Qual ' + row.matchnum.split('_')[1];
      } else if (row.matchnum.split('_')[0] === 'qf') {
        newMatchNum =
          'Quarter-Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      } else if (row.matchnum.split('_')[0] === 'sf') {
        newMatchNum =
          'Semi-Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      } else if (row.matchnum.split('_')[0] === 'f') {
        newMatchNum =
          'Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      }
      row.alteredMatchNum = newMatchNum;
      if (row.reportstatus === 'Follow Up') {
        buttonLabel = 'Fix';
      } else if (row.reportstatus === 'Done') {
        buttonLabel = 'Edit';
      }
      row.buttonValue = (
        <Link to={`matches/${row.short_name}/${row.teamnum}/${row.matchnum}`}>
          <Button
            variant='success'
            style={{
              fontSize: '100%',
              boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
              border: '1px solid black'
            }}
          >
            {buttonLabel}
          </Button>
        </Link>
      );
    });
    this.setState({ matches: matchList });
    drivingList.sort((a, b) => {
      if (a.matchnum.split('_')[0] === 'qm') {
        if (b.matchnum.split('_')[0] === 'qm') {
          return a.matchnum.split('_')[1] - b.matchnum.split('_')[1];
        } else {
          return -1;
        }
      } else if (a.matchnum.split('_')[0] === 'qf') {
        if (b.matchnum.split('_')[0] === 'qf') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (b.matchnum.split('_')[0] === 'qm') {
            return 1;
          } else {
            return -1;
          }
        }
      } else if (a.matchnum.split('_')[0] === 'sf') {
        if (b.matchnum.split('_')[0] === 'sf') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (
            b.matchnum.split('_')[0] === 'qm' ||
            b.matchnum.split('_')[0] === 'qf'
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      } else if (a.matchnum.split('_')[0] === 'f') {
        if (b.matchnum.split('_')[0] === 'f') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (
            b.matchnum.split('_')[0] === 'qm' ||
            b.matchnum.split('_')[0] === 'qf' ||
            b.matchnum.split('_')[0] === 'sf'
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      }
    });
    drivingList.sort((a, b) => a.teamnum - b.teamnum);
    drivingList.map(row => {
      let buttonLabel;
      let newMatchNum;
      if (row.matchnum.split('_')[0] === 'qm') {
        newMatchNum = 'Qual ' + row.matchnum.split('_')[1];
      } else if (row.matchnum.split('_')[0] === 'qf') {
        newMatchNum =
          'Quarter-Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      } else if (row.matchnum.split('_')[0] === 'sf') {
        newMatchNum =
          'Semi-Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      } else if (row.matchnum.split('_')[0] === 'f') {
        newMatchNum =
          'Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      }
      row.alteredMatchNum = newMatchNum;
      if (row.report_status_super_driving === 'Follow Up') {
        buttonLabel = 'Fix';
      } else if (row.report_status_super_driving === 'Done') {
        buttonLabel = 'Edit';
      }
      row.buttonValue = (
        <Link
          to={`supers/driving/${row.short_name}/${row.matchnum}/${row.alliance_color}`}
        >
          <Button
            variant='success'
            style={{
              fontSize: '100%',
              boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
              border: '1px solid black'
            }}
          >
            {buttonLabel}
          </Button>
        </Link>
      );
    });
    this.setState({ drivingMatches: drivingList });
    defenseList.sort((a, b) => {
      if (a.matchnum.split('_')[0] === 'qm') {
        if (b.matchnum.split('_')[0] === 'qm') {
          return a.matchnum.split('_')[1] - b.matchnum.split('_')[1];
        } else {
          return -1;
        }
      } else if (a.matchnum.split('_')[0] === 'qf') {
        if (b.matchnum.split('_')[0] === 'qf') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (b.matchnum.split('_')[0] === 'qm') {
            return 1;
          } else {
            return -1;
          }
        }
      } else if (a.matchnum.split('_')[0] === 'sf') {
        if (b.matchnum.split('_')[0] === 'sf') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (
            b.matchnum.split('_')[0] === 'qm' ||
            b.matchnum.split('_')[0] === 'qf'
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      } else if (a.matchnum.split('_')[0] === 'f') {
        if (b.matchnum.split('_')[0] === 'f') {
          return (
            a.matchnum.split('_')[1] +
            a.matchnum.split('_')[2] -
            (b.matchnum.split('_')[1] + b.matchnum.split('_')[2])
          );
        } else {
          if (
            b.matchnum.split('_')[0] === 'qm' ||
            b.matchnum.split('_')[0] === 'qf' ||
            b.matchnum.split('_')[0] === 'sf'
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      }
    });
    defenseList.sort((a, b) => a.teamnum - b.teamnum);
    defenseList.map(row => {
      let buttonLabel;
      let newMatchNum;
      if (row.matchnum.split('_')[0] === 'qm') {
        newMatchNum = 'Qual ' + row.matchnum.split('_')[1];
      } else if (row.matchnum.split('_')[0] === 'qf') {
        newMatchNum =
          'Quarter-Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      } else if (row.matchnum.split('_')[0] === 'sf') {
        newMatchNum =
          'Semi-Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      } else if (row.matchnum.split('_')[0] === 'f') {
        newMatchNum =
          'Final ' +
          row.matchnum.split('_')[1] +
          '-' +
          row.matchnum.split('_')[2];
      }
      row.alteredMatchNum = newMatchNum;
      if (row.report_status_super_defense === 'Follow Up') {
        buttonLabel = 'Fix';
      } else if (row.report_status_super_defense === 'Done') {
        buttonLabel = 'Edit';
      }
      row.buttonValue = (
        <Link
          to={`supers/defense/${row.short_name}/${row.matchnum}/${row.alliance_color}`}
        >
          <Button
            variant='success'
            style={{
              fontSize: '100%',
              boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
              border: '1px solid black'
            }}
          >
            {buttonLabel}
          </Button>
        </Link>
      );
    });
    this.setState({ defenseMatches: defenseList });
  }

  getMatchReportListForCompetition = competition => {
    this.setState({ competition: competition });
    fetch(`/api/competitions/${competition}/matches`)
      .then(response => response.json())
      .then(data => {
        this.extractLists(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  componentDidMount() {
    window.onbeforeunload = null;
    fetch('/competitions')
      .then(response => response.json())
      .then(data => {
        this.setState({ competitions: data.competitions });
        data.competitions.map(c => {
          if (c.iscurrent) {
            this.setState({ competition: c.shortname });
          }
        });
      })
      .then(() => {
        fetch(`/api/competitions/${this.state.competition}/matches`)
          .then(response => response.json())
          .then(data => {
            this.extractLists(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    this.setState({
      widthSize: window.innerWidth <= 760 ? '90%' : '50%'
    });
    this.setState({ heightSize: window.innerHeight + 'px' });
  }

  changeToNormal = () => {
    this.setState({ matchType: 'normal' }, () => {
      this.getMatchReportListForCompetition(this.state.competition);
    });
  };

  changeToDriving = () => {
    this.setState({ matchType: 'driving' }, () => {
      this.getMatchReportListForCompetition(this.state.competition);
    });
  };

  changeToDefense = () => {
    this.setState({ matchType: 'defense' }, () => {
      this.getMatchReportListForCompetition(this.state.competition);
    });
  };

  render() {
    const competitionItems = this.state.competitions.map(competition => (
      <Dropdown.Item
        eventKey={competition.shortname}
        value={competition.competitionid}
        key={competition.competitionid}
        style={{ fontFamily: 'Helvetica, Arial' }}
      >
        {competition.shortname}
      </Dropdown.Item>
    ));

    if (this.state.competition === '') {
      return null;
    }
    return (
      <div className='div-main' style={{ minHeight: this.state.heightSize }}>
        <div className='justify-content-center'>
          <img
            alt='Logo'
            src={Logo}
            style={{
              width: this.state.widthSize === '90%' ? '70%' : '30%',
              marginTop: '20px',
              marginLeft: '10px'
            }}
          />
        </div>
        <div style={{ width: this.state.widthSize }} className='div-second'>
          <div className='div-form'>
            <Form.Group
              style={{
                width: '100%',
                margin: '0 auto',
                marginBottom: '10px'
              }}
              as={Row}
            >
              <Form.Label
                className='mb-1'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  fontSize: '110%',
                  margin: '0 auto'
                }}
              >
                Competition:
              </Form.Label>
            </Form.Group>
            <Dropdown
              style={{
                marginBottom: '10px'
              }}
              focusFirstItemOnShow={false}
              onSelect={this.getMatchReportListForCompetition}
            >
              <Dropdown.Toggle
                variant='success'
                id='dropdown-basic'
                style={{ fontFamily: 'Helvetica, Arial', textAlign: 'center' }}
                size='lg'
              >
                {this.state.competition}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ minWidth: '3%' }}>
                {competitionItems}
              </Dropdown.Menu>
            </Dropdown>
            <div>
              <Button
                variant='dark'
                type='btn'
                onClick={() =>
                  this.getMatchReportListForCompetition(this.state.competition)
                }
                className='btn-xs'
                style={{ fontFamily: 'Helvetica, Arial' }}
              >
                Refresh
              </Button>
            </div>
            {this.context.isLoggedIn === true && (
              <div>
                <Link to={'matches/' + this.state.competition}>
                  <Button
                    variant='success'
                    type='btn'
                    className='btn-xs mt-2'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      boxShadow:
                        '-3px 3px black, -2px 2px black, -1px 1px black',
                      border: '1px solid black'
                    }}
                  >
                    New Match Form
                  </Button>
                </Link>
              </div>
            )}
            {this.context.isLoggedIn === true && (
              <div>
                <Link to={'supers/driving/' + this.state.competition}>
                  <Button
                    variant='success'
                    type='btn'
                    className='btn-xs mt-2'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      boxShadow:
                        '-3px 3px black, -2px 2px black, -1px 1px black',
                      border: '1px solid black'
                    }}
                  >
                    New Driving Form
                  </Button>
                </Link>
              </div>
            )}
            {this.context.isLoggedIn === true && (
              <div>
                <Link to={'supers/defense/' + this.state.competition}>
                  <Button
                    variant='success'
                    type='btn'
                    className='btn-xs mt-2'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      boxShadow:
                        '-3px 3px black, -2px 2px black, -1px 1px black',
                      border: '1px solid black'
                    }}
                  >
                    New Defense Form
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <Button
              size='xs'
              onClick={this.changeToNormal}
              variant={
                this.state.matchType === 'normal'
                  ? 'success'
                  : 'outline-success'
              }
              style={{ display: 'inline-block', marginRight: '2%' }}
            >
              Match Form
            </Button>
            <Button
              size='xs'
              onClick={this.changeToDriving}
              variant={
                this.state.matchType === 'driving'
                  ? 'success'
                  : 'outline-success'
              }
              style={{
                display: 'inline-block',
                marginLeft: '2%',
                marginRight: '2%'
              }}
            >
              Driving Form
            </Button>
            <Button
              size='xs'
              onClick={this.changeToDefense}
              variant={
                this.state.matchType === 'defense'
                  ? 'success'
                  : 'outline-success'
              }
              style={{ display: 'inline-block', marginLeft: '2%' }}
            >
              Defense Form
            </Button>
          </div>
        </div>
        {this.state.matchType === 'normal' ? (
          <BootstrapTable
            striped
            hover
            keyField='matchid'
            //rowStyle={this.state.style}
            bordered
            bootstrap4
            data={this.state.matches}
            columns={this.state.columns}
            filter={filterFactory()}
          />
        ) : null}
        {this.state.matchType === 'driving' ? (
          <BootstrapTable
            striped
            hover
            keyField='matchid'
            //rowStyle={this.state.style}
            bordered
            bootstrap4
            data={this.state.drivingMatches}
            columns={this.state.drivingColumns}
            filter={filterFactory()}
          />
        ) : null}
        {this.state.matchType === 'defense' ? (
          <BootstrapTable
            striped
            hover
            keyField='matchid'
            //rowStyle={this.state.style}
            bordered
            bootstrap4
            data={this.state.defenseMatches}
            columns={this.state.defenseColumns}
            filter={filterFactory()}
          />
        ) : null}
      </div>
    );
  }
}

export default MatchReportList;
