import React, { Component, Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Logo from './1796NumberswithScratch.png';
import { Prompt } from 'react-router-dom';
import { AuthContext } from '../contexts/auth_context';
import { Form, Dropdown } from 'react-bootstrap';
import { ReactSortable, Sortable, MultiDrag, Swap } from 'react-sortablejs';

Sortable.mount(new Swap());

class DefenseContent extends Component {
  static contextType = AuthContext;

  state = {
    retrieved: '',
    submitting: false,
    competition: 'Invalid',
    competitionKey: 'Invalid',
    autoTeam: true,
    markForFollowUp: false,
    widthSize: '',
    heightSize: '',
    scout: this.context.user.username,
    matchNum: '',
    allianceColor: '',
    dataType: 'driving',
    teams: [],
    allianceColorOptions: [
      { id: 1, label: 'Red' },
      { id: 2, label: 'Blue' }
    ],
    matchTypes: [
      { id: 1, name: 'Quals', key: 'qm' },
      { id: 2, name: 'Quarters', key: 'qf' },
      { id: 3, name: 'Semis', key: 'sf' },
      { id: 4, name: 'Finals', key: 'f' }
    ],
    matchTypeLabel: 'Quals',
    matchTypeKey: 'qm',
    matchNum1: '',
    matchNum2: '',
    teamNum1: '',
    teamNum2: '',
    teamNum3: '',
    pinningDefense: [0, 0, 0],
    knockDefense: [0, 0, 0],
    blockDefense: [0, 0, 0],
    superComments1: '',
    superComments2: '',
    superComments3: ''
  };

  componentDidMount() {
    window.onbeforeunload = function() {
      return '';
    };
    if (this.props.match.path === '/supers/defense/:competition') {
      fetch('/competitions')
        .then(response => response.json())
        .then(data => {
          data.competitions.map(c => {
            if (c.shortname === this.props.match.params.competition) {
              this.setState({ competition: c.shortname }, () => {
                this.setState({ retrieved: 'valid' });
              });
              this.setState({ competitionKey: c.bluekey });
            }
          });
        });
    } else {
      fetch(
        `/api/competitions/${this.props.match.params.competition}/matchNum/${this.props.match.params.matchNum}/allianceColor/${this.props.match.params.allianceColor}/defenseData`
      )
        .then(response => response.json())
        .then(data => {
          if (
            data.matchData.length !== 3 &&
            data.matchData[0].report_status_super_defense !== 'NOT STARTED'
          ) {
            this.setState({ retrieved: 'invalid' });
          } else {
            this.setState({ allianceColor: data.matchData[0].alliance_color });
            this.setState({
              markForFollowUp:
                data.matchData[0].report_status_super_defense === 'Done'
                  ? false
                  : true
            });
            this.setState({
              scout: data.matchData[0].scout_name_super_defense
            });
            this.setState({ competition: data.matchData[0].short_name });
            this.setState({ competitionKey: data.matchData[0].blue_key });
            this.setState({
              autoTeam: data.matchData[0].auto_team_super_defense
            });
            let matchNum = data.matchData[0].match_num.split('_');
            if (matchNum[0] === 'qm') {
              this.setState({ matchTypeKey: 'qm' });
              this.setState({ matchTypeLabel: 'Quals' });
              this.setState({ matchNum1: matchNum[1] });
            } else if (matchNum[0] === 'qf') {
              this.setState({ matchTypeKey: 'qf' });
              this.setState({ matchTypeLabel: 'Quarters' });
              this.setState({ matchNum1: matchNum[1] });
              this.setState({ matchNum2: matchNum[2] });
            } else if (matchNum[0] === 'sf') {
              this.setState({ matchTypeKey: 'qf' });
              this.setState({ matchTypeLabel: 'Semis' });
              this.setState({ matchNum1: matchNum[1] });
              this.setState({ matchNum2: matchNum[2] });
            } else if (matchNum[0] === 'f') {
              this.setState({ matchTypeKey: 'f' });
              this.setState({ matchTypeLabel: 'Finals' });
              this.setState({ matchNum1: matchNum[1] });
              this.setState({ matchNum2: matchNum[2] });
            }
            data.matchData.forEach(team => {
              let obj = { id: team.team_order_defense, teamNum: team.team_num };

              let newPinningDefense = this.state.pinningDefense;
              let newKnockDefense = this.state.knockDefense;
              let newBlockDefense = this.state.blockDefense;
              newPinningDefense[team.team_order_defense] = team.pinning_defense;
              newKnockDefense[team.team_order_defense] = team.knock_defense;
              newBlockDefense[team.team_order_defense] = team.block_defense;
              this.setState({ pinningDefense: newPinningDefense });
              this.setState({ knockDefense: newKnockDefense });
              this.setState({ blockDefense: newBlockDefense });

              if (team.team_order_defense === 0) {
                this.setState({ teamNum1: team.team_num });
                this.setState({ superComments1: team.super_comments_defense });
              } else if (team.team_order_defense === 1) {
                this.setState({ teamNum2: team.team_num });
                this.setState({ superComments2: team.super_comments_defense });
              } else {
                this.setState({ teamNum3: team.team_num });
                this.setState({ superComments3: team.super_comments_defense });
              }
            });
            this.setState({ retrieved: 'valid' });
          }
        });
    }
    this.setState({
      widthSize: window.innerWidth <= 760 ? '90%' : '50%'
    });
    this.setState({ heightSize: window.innerHeight + 'px' });
  }

  getTeamNumber = () => {
    fetch(
      `https://www.thebluealliance.com/api/v3/match/2020${
        this.state.competitionKey
      }_${this.state.matchTypeKey}${
        this.state.matchTypeKey === 'qm'
          ? this.state.matchNum1
          : this.state.matchNum1 + 'm' + this.state.matchNum2
      }?X-TBA-Auth-Key=VcTpa99nIEsT44AsrzSXFzdlS7efZ1wWCrnkMMFyBWQ3tXbp0KFRHSJTLhx96ukP`
    )
      .then(response => response.json())
      .then(data => {
        let teams = [];
        if (this.state.allianceColor === 'Red') {
          teams.push(data.alliances.red.team_keys[0].substring(3));
          teams.push(data.alliances.red.team_keys[1].substring(3));
          teams.push(data.alliances.red.team_keys[2].substring(3));
        } else if (this.state.allianceColor === 'Blue') {
          teams.push(data.alliances.blue.team_keys[0].substring(3));
          teams.push(data.alliances.blue.team_keys[1].substring(3));
          teams.push(data.alliances.blue.team_keys[2].substring(3));
        }
        this.setState({ teamNum1: teams[0] });
        this.setState({ teamNum2: teams[1] });
        this.setState({ teamNum3: teams[2] });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ teamNum1: '' });
        this.setState({ teamNum2: '' });
        this.setState({ teamNum3: '' });
      });
  };

  changeMatchType = (key, event) => {
    this.setState({ matchTypeKey: key }, () => {
      if (this.state.matchTypeKey === 'qm') {
        this.setState({ matchNum2: '' });
      }
      if (this.state.autoTeam) {
        this.getTeamNumber();
      }
    });
    this.setState({ matchTypeLabel: event.target.innerHTML });
  };

  handleModeSwitch = event => {
    this.setState({ autoTeam: !this.state.autoTeam }, () => {
      if (this.state.autoTeam) {
        this.getTeamNumber();
      }
    });
  };

  handleMatchNum1 = event => {
    this.setState({ matchNum1: event.target.value }, () => {
      if (this.state.autoTeam) {
        this.getTeamNumber();
      }
    });
  };

  handleMatchNum2 = event => {
    this.setState({ matchNum2: event.target.value }, () => {
      if (this.state.autoTeam) {
        this.getTeamNumber();
      }
    });
  };

  handleTeamNum1 = event => {
    this.setState({ teamNum1: event.target.value });
  };

  handleTeamNum2 = event => {
    this.setState({ teamNum2: event.target.value });
  };

  handleTeamNum3 = event => {
    this.setState({ teamNum3: event.target.value });
  };

  handleAllianceColor = option => {
    this.setState({ allianceColor: option.label }, () => {
      this.getTeamNumber();
    });
  };

  handleFollowUp = () => {
    this.setState({ markForFollowUp: !this.state.markForFollowUp });
  };

  handlePinningDefense = (event, index) => {
    let newPinningDefense = this.state.pinningDefense;
    newPinningDefense[index] = event.target.value;
    this.setState({ pinningDefense: newPinningDefense });
  };

  handleKnockDefense = (event, index) => {
    let newKnockDefense = this.state.knockDefense;
    newKnockDefense[index] = event.target.value;
    this.setState({ knockDefense: newKnockDefense });
  };

  handleBlockDefense = (event, index) => {
    let newBlockDefense = this.state.blockDefense;
    newBlockDefense[index] = event.target.value;
    this.setState({ blockDefense: newBlockDefense });
  };

  handleSuperComments1 = event => {
    this.setState({ superComments1: event.target.value });
  };

  handleSuperComments2 = event => {
    this.setState({ superComments2: event.target.value });
  };

  handleSuperComments3 = event => {
    this.setState({ superComments3: event.target.value });
  };

  validateForm() {
    if (
      ((this.state.matchTypeKey === 'qm' && this.state.matchNum1 !== '') ||
        (this.state.matchTypeKey !== 'qm' &&
          this.state.matchNum1 !== '' &&
          this.state.matchNum2 !== '')) &&
      this.state.teamNum1 !== '' &&
      this.state.teamNum2 !== '' &&
      this.state.teamNum3 !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  //TODO: Add express route and wire up the database update
  handleSubmit = event => {
    let valid = [];
    if (this.validateForm()) {
      const dataTeam1 = {
        competition: this.state.competition,
        matchNum:
          this.state.matchTypeKey === 'qm'
            ? this.state.matchTypeKey + '_' + this.state.matchNum1
            : this.state.matchTypeKey +
              '_' +
              this.state.matchNum1 +
              '_' +
              this.state.matchNum2,
        teamNum: this.state.teamNum1,
        teamOrder: 0,
        allianceColor: this.state.allianceColor,
        scoutName: this.state.scout,
        reportStatus: this.state.markForFollowUp ? 'Follow Up' : 'Done',
        autoTeam: this.state.autoTeam,
        pinningDefense: this.state.pinningDefense[0],
        knockDefense: this.state.knockDefense[0],
        blockDefense: this.state.blockDefense[0],
        superComments: this.state.superComments1
      };

      const dataTeam2 = {
        competition: this.state.competition,
        matchNum:
          this.state.matchTypeKey === 'qm'
            ? this.state.matchTypeKey + '_' + this.state.matchNum1
            : this.state.matchTypeKey +
              '_' +
              this.state.matchNum1 +
              '_' +
              this.state.matchNum2,
        teamNum: this.state.teamNum2,
        teamOrder: 1,
        allianceColor: this.state.allianceColor,
        scoutName: this.state.scout,
        reportStatus: this.state.markForFollowUp ? 'Follow Up' : 'Done',
        autoTeam: this.state.autoTeam,
        pinningDefense: this.state.pinningDefense[1],
        knockDefense: this.state.knockDefense[1],
        blockDefense: this.state.blockDefense[1],
        superComments: this.state.superComments2
      };

      const dataTeam3 = {
        competition: this.state.competition,
        matchNum:
          this.state.matchTypeKey === 'qm'
            ? this.state.matchTypeKey + '_' + this.state.matchNum1
            : this.state.matchTypeKey +
              '_' +
              this.state.matchNum1 +
              '_' +
              this.state.matchNum2,
        teamNum: this.state.teamNum3,
        teamOrder: 2,
        allianceColor: this.state.allianceColor,
        scoutName: this.state.scout,
        reportStatus: this.state.markForFollowUp ? 'Follow Up' : 'Done',
        autoTeam: this.state.autoTeam,
        pinningDefense: this.state.pinningDefense[2],
        knockDefense: this.state.knockDefense[2],
        blockDefense: this.state.blockDefense[2],
        superComments: this.state.superComments3
      };

      fetch('/api/submitDefenseForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataTeam1)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Submitted') {
            valid.push(true);
            if (valid[0] && valid[1] && valid[2]) {
              this.setState({ submitting: true });
              this.props.history.push('/matches');
            }
          } else {
            alert(data.message + ' ' + this.state.teamNum1);
          }
        })
        .catch(error => {
          console.error('Error', error);
        });

      fetch('/api/submitDefenseForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataTeam2)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Submitted') {
            valid.push(true);
            if (valid[0] && valid[1] && valid[2]) {
              this.setState({ submitting: true });
              this.props.history.push('/matches');
            }
          } else {
            alert(data.message + ' ' + this.state.teamNum2);
          }
        })
        .catch(error => {
          console.error('Error', error);
        });

      fetch('/api/submitDefenseForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataTeam3)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Submitted') {
            valid.push(true);
            if (valid[0] && valid[1] && valid[2]) {
              this.setState({ submitting: true });
              this.props.history.push('/matches');
            }
          } else {
            alert(data.message + ' ' + this.state.teamNum3);
          }
        })
        .catch(error => {
          console.error('Error', error);
        });
    }
  };

  render() {
    const matchTypes = this.state.matchTypes.map(type => (
      <Dropdown.Item
        eventKey={type.key}
        key={type.id}
        style={{ fontFamily: 'Helvetica, Arial' }}
      >
        {type.name}
      </Dropdown.Item>
    ));

    if (this.state.retrieved === '') {
      return null;
    } else if (this.state.retrieved === 'invalid') {
      return (
        <div className='div-main' style={{ minHeight: this.state.heightSize }}>
          <h1 className='pt-4'>Invalid super form request</h1>
        </div>
      );
    } else if (this.state.retrieved === 'valid') {
      return (
        <div className='div-main' style={{ minHeight: this.state.heightSize }}>
          <Prompt
            when={!this.state.submitting}
            message='Are you sure you want to leave?'
          />
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
              <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                <Form.Label
                  className='mb-2'
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    fontSize: '100%'
                  }}
                >
                  Competition: {this.state.competition}
                </Form.Label>
              </Form.Group>
              <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                <Form.Label
                  className='mb-2'
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    fontSize: '100%'
                  }}
                >
                  Scouter: {this.state.scout}
                </Form.Label>
              </Form.Group>
              <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                <Form.Label
                  className='mb-1'
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    fontSize: '110%',
                    textAlign: 'left'
                  }}
                >
                  Alliance:
                </Form.Label>
              </Form.Group>
              <Form.Group
                style={{ width: '100%', marginLeft: '2%' }}
                as={Row}
                className='mb-3'
              >
                {this.state.allianceColorOptions.map(option => (
                  <Form.Check
                    style={{ fontFamily: 'Helvetica, Arial' }}
                    isInvalid={this.state.allianceColor === ''}
                    inline
                    custom
                    label={option.label}
                    type='radio'
                    onChange={() => this.handleAllianceColor(option)}
                    checked={this.state.allianceColor === option.label}
                    id={'alliance' + option.id}
                    key={'alliance' + option.id}
                  />
                ))}
              </Form.Group>
              {this.state.allianceColor !== '' ? (
                <React.Fragment>
                  <Form.Group
                    style={{ width: '80%', marginLeft: '1%' }}
                    as={Row}
                  >
                    <Form.Label
                      className='mb-1'
                      style={{
                        fontFamily: 'Helvetica, Arial',
                        fontSize: '110%'
                      }}
                    >
                      Match Number:
                    </Form.Label>
                  </Form.Group>
                  <div style={{ marginLeft: '-6%' }}>
                    <Dropdown
                      style={{
                        marginBottom: '10px',
                        display: 'inline-block'
                      }}
                      focusFirstItemOnShow={false}
                      onSelect={this.changeMatchType}
                    >
                      <Dropdown.Toggle
                        style={{
                          fontFamily: 'Helvetica, Arial',
                          textAlign: 'center'
                        }}
                        size='xs'
                        variant='success'
                        id='dropdown-basic'
                      >
                        {this.state.matchTypeLabel}
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ minWidth: '3%' }}>
                        {matchTypes}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                      value={this.state.matchNum1}
                      autoComplete='off'
                      type='number'
                      max={200}
                      min={1}
                      placeholder='Match Number'
                      onChange={this.handleMatchNum1}
                      isValid={this.state.matchNum1 !== ''}
                      isInvalid={this.state.matchNum1 === ''}
                      className='mb-1'
                      style={{
                        background: 'none',
                        fontFamily: 'Helvetica, Arial',
                        marginLeft: '2%',
                        display: 'inline-block',
                        width: this.state.matchTypeKey === 'qm' ? '50%' : '25%'
                      }}
                    />
                    {this.state.matchTypeKey !== 'qm' ? (
                      <React.Fragment>
                        <span>-</span>
                        <Form.Control
                          value={this.state.matchNum2}
                          autoComplete='off'
                          type='number'
                          max={200}
                          min={1}
                          placeholder='Match Number'
                          onChange={this.handleMatchNum2}
                          isValid={
                            this.state.matchTypeKey !== 'qm' &&
                            this.state.matchNum2 !== ''
                          }
                          isInvalid={
                            this.state.matchTypeKey !== 'qm' &&
                            this.state.matchNum2 === ''
                          }
                          className='mb-1'
                          style={{
                            background: 'none',
                            fontFamily: 'Helvetica, Arial',
                            display: 'inline-block',
                            width: '25%'
                          }}
                        />
                      </React.Fragment>
                    ) : null}
                  </div>
                  <Form.Group
                    style={{ width: '80%', marginLeft: '2%' }}
                    as={Row}
                  >
                    <Form.Check
                      checked={!this.state.autoTeam}
                      onChange={this.handleModeSwitch}
                      type='switch'
                      label={this.state.autoTeam ? 'Automatic' : 'Manual'}
                      id='switchMode'
                      style={{
                        fontFamily: 'Helvetica, Arial',
                        fontSize: '110%'
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    style={{ width: '80%', marginLeft: '2%' }}
                    as={Row}
                  >
                    {this.state.autoTeam ? null : (
                      <React.Fragment>
                        <Form.Control
                          value={this.state.teamNum1}
                          autoComplete='off'
                          type='number'
                          max={9999}
                          min={1}
                          placeholder='Team Number 1'
                          onChange={this.handleTeamNum1}
                          isInvalid={this.state.teamNum1 === ''}
                          className='mb-1'
                          style={{
                            background: 'none',
                            fontFamily: 'Helvetica, Arial'
                          }}
                        />
                        <Form.Control
                          value={this.state.teamNum2}
                          autoComplete='off'
                          type='number'
                          max={9999}
                          min={1}
                          placeholder='Team Number 2'
                          onChange={this.handleTeamNum2}
                          isInvalid={this.state.teamNum2 === ''}
                          className='mb-1'
                          style={{
                            background: 'none',
                            fontFamily: 'Helvetica, Arial'
                          }}
                        />
                        <Form.Control
                          value={this.state.teamNum3}
                          autoComplete='off'
                          type='number'
                          max={9999}
                          min={1}
                          placeholder='Team Number 3'
                          onChange={this.handleTeamNum3}
                          isInvalid={this.state.teamNum3 === ''}
                          className='mb-1'
                          style={{
                            background: 'none',
                            fontFamily: 'Helvetica, Arial'
                          }}
                        />
                      </React.Fragment>
                    )}
                  </Form.Group>
                </React.Fragment>
              ) : null}
            </div>
            {this.state.teamNum1 !== '' &&
            this.state.teamNum2 !== '' &&
            this.state.teamNum3 !== '' ? (
              <React.Fragment>
                <div className='div-form'>
                  <div
                    style={{
                      textAlign: 'start',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      marginBottom: '10px'
                    }}
                  >
                    Team: {this.state.teamNum1}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Pinning: {this.state.pinningDefense[0]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.pinningDefense[0]}
                    onChange={event => this.handlePinningDefense(event, 0)}
                    type='range'
                  />
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Knocking: {this.state.knockDefense[0]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.knockDefense[0]}
                    onChange={event => this.handleKnockDefense(event, 0)}
                    type='range'
                  />
                  <div
                    style={{
                      textAlign: 'center  ',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Blocking: {this.state.blockDefense[0]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.blockDefense[0]}
                    onChange={event => this.handleBlockDefense(event, 0)}
                    type='range'
                  />
                  <div
                    style={{
                      display: 'inline-block',
                      width: '80%',
                      marginTop: '10px'
                    }}
                  >
                    <Form.Group>
                      <Form.Control
                        value={this.state.superComments1}
                        as='textarea'
                        type='text'
                        placeholder='Comments...'
                        onChange={this.handleSuperComments1}
                        rows='3'
                        style={{
                          background: 'none',
                          fontFamily: 'Helvetica, Arial'
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className='div-form'>
                  <div
                    style={{
                      textAlign: 'start',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      marginBottom: '10px'
                    }}
                  >
                    Team: {this.state.teamNum2}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Pinning: {this.state.pinningDefense[1]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.pinningDefense[1]}
                    onChange={event => this.handlePinningDefense(event, 1)}
                    type='range'
                  />
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Knocking: {this.state.knockDefense[1]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.knockDefense[1]}
                    onChange={event => this.handleKnockDefense(event, 1)}
                    type='range'
                  />
                  <div
                    style={{
                      textAlign: 'center  ',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Blocking: {this.state.blockDefense[1]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.blockDefense[1]}
                    onChange={event => this.handleBlockDefense(event, 1)}
                    type='range'
                  />
                  <div
                    style={{
                      display: 'inline-block',
                      width: '80%',
                      marginTop: '10px'
                    }}
                  >
                    <Form.Group>
                      <Form.Control
                        value={this.state.superComments2}
                        as='textarea'
                        type='text'
                        placeholder='Comments...'
                        onChange={this.handleSuperComments2}
                        rows='3'
                        style={{
                          background: 'none',
                          fontFamily: 'Helvetica, Arial'
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className='div-form'>
                  <div
                    style={{
                      textAlign: 'start',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      marginBottom: '10px'
                    }}
                  >
                    Team: {this.state.teamNum3}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Pinning: {this.state.pinningDefense[2]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.pinningDefense[2]}
                    onChange={event => this.handlePinningDefense(event, 2)}
                    type='range'
                  />
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Knocking: {this.state.knockDefense[2]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.knockDefense[2]}
                    onChange={event => this.handleKnockDefense(event, 2)}
                    type='range'
                  />
                  <div
                    style={{
                      textAlign: 'center  ',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '100%'
                    }}
                  >
                    Blocking: {this.state.blockDefense[2]}
                  </div>
                  <input
                    style={{
                      marginTop: '15px',
                      marginBottom: '20px',
                      width: '75%'
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className='slidercell'
                    value={this.state.blockDefense[2]}
                    onChange={event => this.handleBlockDefense(event, 2)}
                    type='range'
                  />
                  <div
                    style={{
                      display: 'inline-block',
                      width: '80%',
                      marginTop: '10px'
                    }}
                  >
                    <Form.Group>
                      <Form.Control
                        value={this.state.superComments3}
                        as='textarea'
                        type='text'
                        placeholder='Comments...'
                        onChange={this.handleSuperComments3}
                        rows='3'
                        style={{
                          background: 'none',
                          fontFamily: 'Helvetica, Arial'
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>
                <Form.Check
                  onChange={this.handleFollowUp}
                  checked={this.state.markForFollowUp}
                  custom
                  style={{
                    fontSize: '100%',
                    fontFamily: 'Helvetica, Arial'
                  }}
                  type='checkbox'
                  label='Mark for follow up'
                  id='followUp'
                />
                <Button
                  variant='success'
                  type='btn'
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                    border: '1px solid black',
                    marginTop: '10px'
                  }}
                  onClick={this.handleSubmit}
                  className='btn-lg'
                >
                  Submit
                </Button>
              </React.Fragment>
            ) : null}
          </div>
        </div>
      );
    }
  }
}

export default DefenseContent;
