import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from './1796NumberswithScratch.png';
import { Form, Dropdown } from 'react-bootstrap';
import AllianceStation from './AllianceStationGuide.png';
import GeneratorSwitch from './generatorswitch.png';
import Counter from './Counter.js';
import PenaltyCounter from './PenaltyCounter.js';
import StopWatch from './StopWatch.js';
import { Prompt } from 'react-router-dom';
import { AuthContext } from '../contexts/auth_context';

class MatchContent extends Component {
  static contextType = AuthContext;

  state = {
    retrieved: '',
    competition: 'Invalid',
    competitionKey: 'Invalid',
    markForFollowUp: false,
    formStage: 0,
    validatedStage0: true,
    validatedStage1: true,
    validatedStage2: true,
    validatedStage3: true,
    validatedStage4: true,
    validStage0: false,
    validStage1: false,
    validStage2: false,
    validStage3: false,
    validStage4: false,
    widthSize: '',
    heightSize: '',
    matchTypes: [
      { id: 1, name: 'Quals', key: 'qm' },
      { id: 2, name: 'Quarters', key: 'qf' },
      { id: 3, name: 'Semis', key: 'sf' },
      { id: 4, name: 'Finals', key: 'f' }
    ],
    matchTypeLabel: 'Quals',
    matchTypeKey: 'qm',
    scout: this.context.user.username,
    matchNum1: '',
    matchNum2: '',
    allianceStation: 'Choose...',
    autoTeam: true,
    teamNum: '',
    autoPowerCells: 0,
    startingPositions: [
      { id: 1, label: 'Left' },
      { id: 2, label: 'Center' },
      { id: 3, label: 'Right' }
    ],
    startingPosition: '',
    crossLineOptions: [
      { id: 1, label: 'Yes' },
      { id: 2, label: 'No' }
    ],
    crossLine: '',
    autoScored: [
      { id: 1, label: 'Bottom', value: 0, min: 0, max: 12 },
      { id: 2, label: 'Outer', value: 0, min: 0, max: 12 },
      { id: 3, label: 'Inner', value: 0, min: 0, max: 12 }
    ],
    autoComments: '',
    teleopScored: [
      { id: 1, label: 'Bottom', value: 0, min: 0, max: 200 },
      { id: 2, label: 'Outer', value: 0, min: 0, max: 200 },
      { id: 3, label: 'Inner', value: 0, min: 0, max: 200 }
    ],
    rotationOptions: [
      { id: 1, label: 'Yes' },
      { id: 2, label: 'No' },
      { id: 3, label: 'Unsuccessful attempt' }
    ],
    rotationControl: '',
    rotationTimer: 0,
    oldRotationTimer: '',
    positionOptions: [
      { id: 1, label: 'Yes' },
      { id: 2, label: 'No' },
      { id: 3, label: 'Unsuccessful attempt' }
    ],
    positionControl: '',
    positionTimer: 0,
    oldPositionTimer: '',
    endGameOptions: [
      { id: 1, label: 'Hang' },
      { id: 2, label: 'Park' },
      { id: 3, label: 'None' }
    ],
    endGame: '',
    endGameTimer: 0,
    oldEndGameTimer: '',
    climbOptions: [
      { id: 1, label: 'By themselves' },
      { id: 2, label: 'Buddy Climb' },
      { id: 3, label: 'Assisted Climb' },
      { id: 4, label: 'Triple Climb' }
    ],
    climb: '',
    levelOptions: [
      { id: 1, label: 'Indirect' },
      { id: 2, label: 'Direct' },
      { id: 3, label: 'No' }
    ],
    level: '',
    levelPosition: 0,
    communicationOptions: [
      { id: 1, label: 'Yes' },
      { id: 2, label: 'No' }
    ],
    communication: '',
    breakOptions: [
      { id: 1, label: 'Yes' },
      { id: 2, label: 'No' }
    ],
    break: '',
    negatives: [
      { id: 1, label: 'Penalties', value: 0, min: 0, max: 600 },
      { id: 2, label: 'Yellow Card', value: 0, min: 0, max: 1 },
      { id: 3, label: 'Red Card', value: 0, min: 0, max: 1 }
    ],
    reflectionComments: '',
    submitting: false
  };

  componentDidMount() {
    window.onbeforeunload = function() {
      return '';
    };
    if (this.props.match.path === '/matches/:competition') {
      fetch('/competitions')
        .then(response => response.json())
        .then(data => {
          this.setState({ retrieved: 'valid' });
          data.competitions.map(c => {
            if (c.shortname === this.props.match.params.competition) {
              this.setState({ competition: c.shortname });
              this.setState({ competitionKey: c.bluekey });
            }
          });
        });
    } else {
      fetch(
        `/api/competitions/${this.props.match.params.competition}/team/${this.props.match.params.team}/matchNum/${this.props.match.params.matchNum}/matchData`
      )
        .then(response => response.json())
        .then(data => {
          if (
            data.matchFormData.length === 0 &&
            data.matchFormData[0].report_status !== 'NOT STARTED'
          ) {
            this.setState({ retrieved: 'invalid' });
          } else {
            this.setState({ retrieved: 'valid' });
            const existingData = data.matchFormData[0];
            this.setState({ competition: existingData.short_name });
            this.setState({
              markForFollowUp:
                existingData.report_status === 'Done' ? false : true
            });
            this.setState({ scout: existingData.scout_name });
            this.setState({ competitionKey: existingData.blue_key });
            let matchNum = existingData.match_num.split('_');
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
            this.setState({ allianceStation: existingData.alliance_station });
            this.setState({ autoTeam: existingData.auto_team });
            this.setState({ teamNum: existingData.team_num });
            this.setState({ autoPowerCells: existingData.auto_power_cells });
            this.setState({ startingPosition: existingData.starting_position });
            this.setState({ crossLine: existingData.cross_line });
            this.setState({ autoScored: existingData.auto_scored });
            this.setState({ autoComments: existingData.auto_comments });
            this.setState({ teleopScored: existingData.teleop_scored });
            this.setState({ rotationControl: existingData.rotation_control });
            this.setState({ rotationTimer: existingData.rotation_timer });
            this.setState({
              oldRotationTimer:
                (
                  '0' +
                  (Math.floor(existingData.rotation_timer / 60000) % 60)
                ).slice(-2) +
                ':' +
                (
                  '0' +
                  (Math.floor(existingData.rotation_timer / 1000) % 60)
                ).slice(-2) +
                ':' +
                (
                  '0' +
                  (Math.floor(existingData.rotation_timer / 10) % 100)
                ).slice(-2)
            });
            this.setState({ positionControl: existingData.position_control });
            this.setState({ positionTimer: existingData.position_timer });
            this.setState({
              oldPositionTimer:
                (
                  '0' +
                  (Math.floor(existingData.position_timer / 60000) % 60)
                ).slice(-2) +
                ':' +
                (
                  '0' +
                  (Math.floor(existingData.position_timer / 1000) % 60)
                ).slice(-2) +
                ':' +
                (
                  '0' +
                  (Math.floor(existingData.position_timer / 10) % 100)
                ).slice(-2)
            });
            this.setState({ endGame: existingData.end_game });
            this.setState({ endGameTimer: existingData.end_game_timer });
            this.setState({
              oldEndGameTimer:
                (
                  '0' +
                  (Math.floor(existingData.end_game_timer / 60000) % 60)
                ).slice(-2) +
                ':' +
                (
                  '0' +
                  (Math.floor(existingData.end_game_timer / 1000) % 60)
                ).slice(-2) +
                ':' +
                (
                  '0' +
                  (Math.floor(existingData.end_game_timer / 10) % 100)
                ).slice(-2)
            });
            this.setState({ climb: existingData.climb });
            this.setState({ level: existingData.level });
            this.setState({ levelPosition: existingData.level_position });
            this.setState({ communication: existingData.communication });
            this.setState({ break: existingData.break });
            this.setState({ negatives: existingData.negatives });
            this.setState({
              reflectionComments: existingData.reflection_comments
            });
          }
        })
        .then(() => {
          this.checkStage0();
          this.checkStage1();
          this.checkStage2();
          this.checkStage3();
          this.checkStage4();
        })
        .catch(error => {
          console.log('Error:', error);
        });
    }
    this.setState({
      widthSize: window.innerWidth <= 760 ? '90%' : '50%'
    });
    this.setState({ heightSize: window.innerHeight + 'px' });
  }

  changeStage = stage => {
    this.setState({ formStage: stage }, () => {
      window.scrollTo(0, 0);
    });
  };

  checkStage0() {
    if (
      this.state.matchNum1 !== '' &&
      this.state.teamNum !== '' &&
      this.state.allianceStation !== 'Choose...'
    ) {
      if (this.state.matchTypeKey !== 'qm') {
        if (this.state.matchNum2 !== '') {
          this.setState({ validStage0: true });
        } else {
          this.setState({ validStage0: false });
        }
      } else {
        this.setState({ validStage0: true });
      }
    } else {
      this.setState({ validStage0: false });
    }
  }

  changeMatchType = (key, event) => {
    this.setState({ matchTypeKey: key }, () => {
      if (this.state.matchTypeKey === 'qm') {
        this.setState({ matchNum2: '' });
      }
      this.getTeamNumber();
    });
    this.setState({ matchTypeLabel: event.target.innerHTML });
    this.checkStage0();
  };

  handleMatchNum1 = event => {
    this.setState({ matchNum1: event.target.value }, () => {
      if (this.state.autoTeam) {
        this.getTeamNumber();
      }
      this.checkStage0();
    });
  };

  handleMatchNum2 = event => {
    this.setState({ matchNum2: event.target.value }, () => {
      if (this.state.autoTeam) {
        this.getTeamNumber();
      }
      this.checkStage0();
    });
  };

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
        if (this.state.allianceStation === 'Red Station 1') {
          this.setState(
            {
              teamNum: data.alliances.red.team_keys[0].substring(3)
            },
            () => {
              this.checkStage0();
            }
          );
        } else if (this.state.allianceStation === 'Red Station 2') {
          this.setState(
            {
              teamNum: data.alliances.red.team_keys[1].substring(3)
            },
            () => {
              this.checkStage0();
            }
          );
        } else if (this.state.allianceStation === 'Red Station 3') {
          this.setState(
            {
              teamNum: data.alliances.red.team_keys[2].substring(3)
            },
            () => {
              this.checkStage0();
            }
          );
        } else if (this.state.allianceStation === 'Blue Station 1') {
          this.setState(
            {
              teamNum: data.alliances.blue.team_keys[0].substring(3)
            },
            () => {
              this.checkStage0();
            }
          );
        } else if (this.state.allianceStation === 'Blue Station 2') {
          this.setState(
            {
              teamNum: data.alliances.blue.team_keys[1].substring(3)
            },
            () => {
              this.checkStage0();
            }
          );
        } else if (this.state.allianceStation === 'Blue Station 3') {
          this.setState(
            {
              teamNum: data.alliances.blue.team_keys[2].substring(3)
            },
            () => {
              this.checkStage0();
            }
          );
        }
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ teamNum: '' }, () => {
          this.checkStage0();
        });
      });
  };

  handleStationChange = event => {
    this.setState({ allianceStation: event.target.value }, () => {
      if (this.state.allianceStation === 'Choose...') {
        this.setState({ matchNum1: '' });
        this.setState({ matchNum2: '' });
        this.setState({ autoTeam: true });
        this.setState({ teamNum: '' }, () => {
          this.checkStage0();
        });
      } else {
        this.getTeamNumber();
      }
    });
  };

  handleModeSwitch = event => {
    this.setState({ autoTeam: !this.state.autoTeam }, () => {
      if (this.state.autoTeam) {
        this.getTeamNumber();
      }
    });
  };

  handleTeamNum = event => {
    this.setState({ teamNum: event.target.value }, () => {
      this.checkStage0();
    });
  };

  handleStage0Increment = event => {
    this.setState({ formStage: 1 }, () => {
      window.scrollTo(0, 0);
    });
  };

  checkStage1() {
    if (this.state.startingPosition !== '' && this.state.crossLine !== '') {
      this.setState({ validStage1: true });
    } else {
      this.setState({ validStage1: false });
    }
  }

  handleSliderAutoCells = event => {
    this.setState({ autoPowerCells: event.target.value });
  };

  handlePositionChange = position => {
    this.setState({ startingPosition: position.label }, () => {
      this.checkStage1();
    });
  };

  handleCrossLineChange = option => {
    this.setState({ crossLine: option.label }, () => {
      this.checkStage1();
    });
  };

  handleAutoGoalIncrement = goal => {
    const autoGoals = [...this.state.autoScored];
    const index = autoGoals.indexOf(goal);
    autoGoals[index] = { ...goal };
    if (autoGoals[index].value === autoGoals[index].max) {
    } else {
      autoGoals[index].value = autoGoals[index].value + 1;
    }
    this.setState({ autoScored: autoGoals });
  };

  handleAutoGoalDecrement = goal => {
    const autoGoals = [...this.state.autoScored];
    const index = autoGoals.indexOf(goal);
    autoGoals[index] = { ...goal };
    if (autoGoals[index].value === autoGoals[index].min) {
    } else {
      autoGoals[index].value = autoGoals[index].value - 1;
    }
    this.setState({ autoScored: autoGoals });
  };

  handleAutoComment = event => {
    this.setState({ autoComments: event.target.value });
  };

  handleStage1Increment = event => {
    this.setState({ formStage: 2 }, () => {
      window.scrollTo(0, 0);
    });
  };

  handleStage1Decrement = event => {
    this.setState({ formStage: 0 }, () => {
      window.scrollTo(0, 0);
    });
  };

  checkStage2() {
    if (
      this.state.rotationControl !== '' &&
      this.state.positionControl !== ''
    ) {
      this.setState({ validStage2: true });
    } else {
      this.setState({ validStage2: false });
    }
  }

  handleTeleopGoalIncrement = goal => {
    const teleopGoals = [...this.state.teleopScored];
    const index = teleopGoals.indexOf(goal);
    teleopGoals[index] = { ...goal };
    if (teleopGoals[index].value === teleopGoals[index].max) {
    } else {
      teleopGoals[index].value = teleopGoals[index].value + 1;
    }
    this.setState({ teleopScored: teleopGoals });
  };

  handleTeleopGoalDecrement = goal => {
    const teleopGoals = [...this.state.teleopScored];
    const index = teleopGoals.indexOf(goal);
    teleopGoals[index] = { ...goal };
    if (teleopGoals[index].value === teleopGoals[index].min) {
    } else {
      teleopGoals[index].value = teleopGoals[index].value - 1;
    }
    this.setState({ teleopScored: teleopGoals });
  };

  handleRotationControlTimer = time => {
    this.setState({ rotationTimer: time });
  };

  handleRotationControl = option => {
    this.setState({ rotationControl: option.label }, () => {
      this.checkStage2();
    });
  };

  handlePositionControlTimer = time => {
    this.setState({ positionTimer: time });
  };

  handlePositionControl = option => {
    this.setState({ positionControl: option.label }, () => {
      this.checkStage2();
    });
  };

  handleStage2Increment = event => {
    this.setState({ formStage: 3 }, () => {
      window.scrollTo(0, 0);
    });
  };

  handleStage2Decrement = event => {
    this.setState({ formStage: 1 }, () => {
      window.scrollTo(0, 0);
    });
  };

  checkStage3() {
    if (this.state.endGame !== '') {
      if (this.state.endGame === 'Hang') {
        if (this.state.climb !== '' && this.state.level !== '') {
          this.setState({ validStage3: true });
        } else {
          this.setState({ validStage3: false });
        }
      } else {
        this.setState({ validStage3: true });
      }
    } else {
      this.setState({ validStage3: false });
    }
  }

  handleEndGameTimer = time => {
    this.setState({ endGameTimer: time });
  };

  handleEndGame = option => {
    this.setState({ endGame: option.label }, () => {
      this.checkStage3();
    });
  };

  handleClimb = option => {
    this.setState({ climb: option.label }, () => {
      this.checkStage3();
    });
  };

  handleLevel = option => {
    this.setState({ level: option.label }, () => {
      this.checkStage3();
    });
  };

  handleLevelChange = event => {
    this.setState({ levelPosition: event.target.value });
  };

  handleStage3Increment = event => {
    this.setState({ formStage: 4 }, () => {
      window.scrollTo(0, 0);
    });
  };

  handleStage3Decrement = event => {
    this.setState({ formStage: 2 }, () => {
      window.scrollTo(0, 0);
    });
  };

  checkStage4() {
    if (this.state.communication !== '' && this.state.break !== '') {
      this.setState({ validStage4: true });
    } else {
      this.setState({ validStage4: false });
    }
  }

  handleCommunication = option => {
    this.setState({ communication: option.label }, () => {
      this.checkStage4();
    });
  };

  handleBreak = option => {
    this.setState({ break: option.label }, () => {
      this.checkStage4();
    });
  };

  handleNegativeIncrement = negative => {
    const negativePoints = [...this.state.negatives];
    const index = negativePoints.indexOf(negative);
    negativePoints[index] = { ...negative };
    if (negativePoints[index].value === negativePoints[index].max) {
    } else {
      if (negativePoints[index].label === 'Penalties') {
        if (negativePoints[index].value + 3 > negativePoints[index].max) {
        } else {
          negativePoints[index].value = negativePoints[index].value + 3;
        }
      } else {
        negativePoints[index].value = negativePoints[index].value + 1;
      }
    }
    this.setState({ negatives: negativePoints });
  };

  handleNegativeDecrement = negative => {
    const negativePoints = [...this.state.negatives];
    const index = negativePoints.indexOf(negative);
    negativePoints[index] = { ...negative };
    if (negativePoints[index].value === negativePoints[index].min) {
    } else {
      if (negativePoints[index].label === 'Penalties') {
        if (negativePoints[index].value - 3 < negativePoints[index].min) {
        } else {
          negativePoints[index].value = negativePoints[index].value - 3;
        }
      } else {
        negativePoints[index].value = negativePoints[index].value - 1;
      }
    }
    this.setState({ negatives: negativePoints });
  };

  handleNegativeLargerIncrement = negative => {
    const negativePoints = [...this.state.negatives];
    const index = negativePoints.indexOf(negative);
    negativePoints[index] = { ...negative };
    if (
      negativePoints[index].value === negativePoints[index].max ||
      negativePoints[index].value + 15 > negativePoints[index].max
    ) {
    } else {
      negativePoints[index].value = negativePoints[index].value + 15;
    }
    this.setState({ negatives: negativePoints });
  };

  handleNegativeLargerDecrement = negative => {
    const negativePoints = [...this.state.negatives];
    const index = negativePoints.indexOf(negative);
    negativePoints[index] = { ...negative };
    if (negativePoints[index].value === negativePoints[index].min) {
    } else {
      if (negativePoints[index].value - 15 < negativePoints[index].min) {
      } else {
        negativePoints[index].value = negativePoints[index].value - 15;
      }
    }
    this.setState({ negatives: negativePoints });
  };

  handleReflectionComment = event => {
    this.setState({ reflectionComments: event.target.value });
  };

  handleFollowUp = () => {
    this.setState({ markForFollowUp: !this.state.markForFollowUp });
  };

  handleStage4Decrement = event => {
    this.setState({ formStage: 3 }, () => {
      window.scrollTo(0, 0);
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (
      (this.state.validStage0 &&
        this.state.validStage1 &&
        this.state.validStage2 &&
        this.state.validStage3 &&
        this.state.validStage4) ||
      (this.state.validStage0 && this.state.markForFollowUp)
    ) {
      if (window.confirm("Press 'OK' to confirm submit")) {
        const data = {
          competition: this.state.competition,
          teamNum: this.state.teamNum,
          matchNum:
            this.state.matchTypeKey === 'qm'
              ? this.state.matchTypeKey + '_' + this.state.matchNum1
              : this.state.matchTypeKey +
                '_' +
                this.state.matchNum1 +
                '_' +
                this.state.matchNum2,
          scoutName: this.state.scout,
          reportStatus: this.state.markForFollowUp ? 'Follow Up' : 'Done',
          allianceStation: this.state.allianceStation,
          autoTeam: this.state.autoTeam,
          autoPowerCells: this.state.autoPowerCells,
          startingPosition: this.state.startingPosition,
          crossLine: this.state.crossLine,
          autoScored: JSON.stringify(this.state.autoScored),
          autoComments: this.state.autoComments,
          teleopScored: JSON.stringify(this.state.teleopScored),
          rotationControl: this.state.rotationControl,
          rotationTimer:
            this.state.rotationControl === 'No' ? 0 : this.state.rotationTimer,
          positionControl: this.state.positionControl,
          positionTimer:
            this.state.positionControl === 'No' ? 0 : this.state.positionTimer,
          endGame: this.state.endGame,
          endGameTimer:
            this.state.endGame === 'Hang' ? this.state.endGameTimer : 0,
          climb: this.state.endGame === 'Hang' ? this.state.climb : '',
          level: this.state.endGame === 'Hang' ? this.state.level : '',
          levelPosition:
            this.state.endGame === 'Hang' ? this.state.levelPosition : 0,
          communication: this.state.communication,
          break: this.state.break,
          negatives: JSON.stringify(this.state.negatives),
          reflectionComments: this.state.reflectionComments
        };
        fetch('/api/submitMatchForm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            if (data.message === 'Submitted') {
              this.setState({ submitting: true });
              this.props.history.push('/matches');
            } else {
              alert(data.message);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
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
          <h1 className='pt-4'>Invalid match form request</h1>
        </div>
      );
    } else {
      if (this.state.formStage === 0) {
        return (
          <div
            className='div-main'
            style={{ minHeight: this.state.heightSize }}
          >
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
              <div>
                <span
                  onClick={() => this.changeStage(0)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 0 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage0
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  1
                </span>
                <span
                  onClick={() => this.changeStage(1)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 1 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage1
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  2
                </span>
                <span
                  onClick={() => this.changeStage(2)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 2 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage2
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  3
                </span>
                <span
                  onClick={() => this.changeStage(3)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 3 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage3
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  4
                </span>
                <span
                  onClick={() => this.changeStage(4)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 4 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage4
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  5
                </span>
              </div>
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
                      fontSize: '110%'
                    }}
                  >
                    Alliance Station:
                  </Form.Label>
                </Form.Group>
                <Form.Group style={{ width: '80%', marginLeft: '2%' }} as={Row}>
                  <Form.Control
                    style={{
                      background: 'none',
                      fontFamily: 'Helvetica, Arial'
                    }}
                    className='mb-1'
                    as='select'
                    onChange={this.handleStationChange}
                    value={this.state.allianceStation}
                  >
                    <option>Choose...</option>
                    <option>Red Station 1</option>
                    <option>Red Station 2</option>
                    <option>Red Station 3</option>
                    <option>Blue Station 1</option>
                    <option>Blue Station 2</option>
                    <option>Blue Station 3</option>
                  </Form.Control>
                </Form.Group>
                {this.state.allianceStation !== 'Choose...' ? (
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
                        isValid={
                          this.state.validatedStage0 &&
                          this.state.matchNum1 !== ''
                        }
                        isInvalid={
                          this.state.validatedStage0 &&
                          this.state.matchNum1 === ''
                        }
                        className='mb-1'
                        style={{
                          background: 'none',
                          fontFamily: 'Helvetica, Arial',
                          marginLeft: '2%',
                          display: 'inline-block',
                          width:
                            this.state.matchTypeKey === 'qm' ? '50%' : '25%'
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
                              this.state.validatedStage0 &&
                              this.state.matchTypeKey !== 'qm' &&
                              this.state.matchNum2 !== ''
                            }
                            isInvalid={
                              this.state.validatedStage0 &&
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
                        Team Number:
                      </Form.Label>
                    </Form.Group>
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
                      {this.state.autoTeam ? (
                        <Form.Label
                          className='mb-1'
                          style={{
                            fontFamily: 'Helvetica, Arial',
                            fontSize: '110%'
                          }}
                          onChange={this.checkStage0}
                        >
                          {this.state.teamNum}
                        </Form.Label>
                      ) : (
                        <Form.Control
                          value={this.state.teamNum}
                          autoComplete='off'
                          type='number'
                          max={9999}
                          min={1}
                          placeholder='Team Number'
                          onChange={this.handleTeamNum}
                          isValid={
                            this.state.validatedStage0 &&
                            this.state.teamNum !== ''
                          }
                          isInvalid={
                            this.state.validatedStage0 &&
                            this.state.teamNum === ''
                          }
                          className='mb-1'
                          style={{
                            background: 'none',
                            fontFamily: 'Helvetica, Arial'
                          }}
                        />
                      )}
                    </Form.Group>
                  </React.Fragment>
                ) : null}
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
              </div>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginRight: '8%'
                }}
                onClick={this.handleStage0Increment}
                className='btn-lg'
              >
                Next
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '8%'
                }}
                onClick={this.handleSubmit}
                className='btn-lg'
              >
                Submit
              </Button>
            </div>
          </div>
        );
      } else if (this.state.formStage === 1) {
        return (
          <div
            className='div-main'
            style={{ minHeight: this.state.heightSize }}
          >
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
              <div>
                <span
                  onClick={() => this.changeStage(0)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 0 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage0
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  1
                </span>
                <span
                  onClick={() => this.changeStage(1)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 1 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage1
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  2
                </span>
                <span
                  onClick={() => this.changeStage(2)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 2 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage2
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  3
                </span>
                <span
                  onClick={() => this.changeStage(3)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 3 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage3
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  4
                </span>
                <span
                  onClick={() => this.changeStage(4)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 4 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage4
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  5
                </span>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%'
                    }}
                  >
                    {'Pre-Loaded Power Cells: ' + this.state.autoPowerCells}
                  </Form.Label>
                </Form.Group>
                <input
                  min={0}
                  max={3}
                  step={1}
                  className='slidercell'
                  value={this.state.autoPowerCells}
                  onChange={this.handleSliderAutoCells}
                  type='range'
                />
              </div>
              <div className='div-form'>
                <img
                  alt='Guide'
                  src={AllianceStation}
                  style={{
                    width: '100%',
                    marginTop: '20px',
                    marginBottom: '20px'
                  }}
                />
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%'
                    }}
                  >
                    Starting Position:
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  as={Row}
                  className='mb-3'
                >
                  {this.state.startingPositions.map(position => (
                    <Form.Check
                      style={{ fontFamily: 'Helvetica, Arial' }}
                      isInvalid={
                        this.state.validatedStage1 &&
                        this.state.startingPosition === ''
                      }
                      isValid={
                        this.state.validatedStage1 &&
                        this.state.startingPosition !== ''
                      }
                      inline
                      custom
                      label={position.label}
                      type='radio'
                      onChange={() => this.handlePositionChange(position)}
                      checked={this.state.startingPosition === position.label}
                      id={'position' + position.id}
                      key={'position' + position.id}
                    />
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Did the robot cross the initiation line?
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  as={Row}
                  className='mb-3'
                >
                  {this.state.crossLineOptions.map(option => (
                    <Form.Check
                      style={{ fontFamily: 'Helvetica, Arial' }}
                      isInvalid={
                        this.state.validatedStage1 &&
                        this.state.crossLine === ''
                      }
                      isValid={
                        this.state.validatedStage1 &&
                        this.state.crossLine !== ''
                      }
                      inline
                      custom
                      label={option.label}
                      type='radio'
                      onChange={() => this.handleCrossLineChange(option)}
                      checked={this.state.crossLine === option.label}
                      id={'cross' + option.id}
                      key={'cross' + option.id}
                    />
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Power Cells Scored in Auto:
                  </Form.Label>
                </Form.Group>
                <Form.Group style={{ width: '100%' }}>
                  {this.state.autoScored.map(goal => (
                    <Form.Row
                      className='mb-2 justify-content-center'
                      key={'autoGoalRow' + goal.id}
                    >
                      <Counter
                        minWidth='170px'
                        count={goal.value}
                        margin={'3px 0px 0px 0px'}
                        colon=': '
                        onIncrement={() => this.handleAutoGoalIncrement(goal)}
                        onDecrement={() => this.handleAutoGoalDecrement(goal)}
                        label={goal.label}
                        disabled={false}
                        dynamic={goal.value === 0}
                        size='xs'
                        marginRight='0px'
                        id={'autoGoal' + goal.id}
                        key={'autoGoal' + goal.id}
                      />
                    </Form.Row>
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Auto Comments:
                  </Form.Label>
                </Form.Group>
                <div
                  style={{
                    display: 'inline-block',
                    width: '80%',
                    marginTop: '5px'
                  }}
                >
                  <Form.Group>
                    <Form.Control
                      value={this.state.autoComments}
                      as='textarea'
                      type='text'
                      placeholder='Comments concerning auto'
                      onChange={this.handleAutoComment}
                      rows='3'
                      style={{
                        background: 'none',
                        fontFamily: 'Helvetica, Arial'
                      }}
                    />
                  </Form.Group>
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
              </div>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginRight: '4%'
                }}
                onClick={this.handleStage1Decrement}
                className='btn-lg'
              >
                Back
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  marginRight: '4%'
                }}
                onClick={this.handleStage1Increment}
                className='btn-lg'
              >
                Next
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%'
                }}
                onClick={this.handleSubmit}
                className='btn-lg'
              >
                Submit
              </Button>
            </div>
          </div>
        );
      } else if (this.state.formStage === 2) {
        return (
          <div
            className='div-main'
            style={{ minHeight: this.state.heightSize }}
          >
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
              <div>
                <span
                  onClick={() => this.changeStage(0)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 0 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage0
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  1
                </span>
                <span
                  onClick={() => this.changeStage(1)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 1 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage1
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  2
                </span>
                <span
                  onClick={() => this.changeStage(2)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 2 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage2
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  3
                </span>
                <span
                  onClick={() => this.changeStage(3)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 3 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage3
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  4
                </span>
                <span
                  onClick={() => this.changeStage(4)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 4 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage4
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  5
                </span>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Power Cells Scored in Teleop:
                  </Form.Label>
                </Form.Group>
                <Form.Group style={{ width: '100%' }}>
                  {this.state.teleopScored.map(goal => (
                    <Form.Row
                      className='mb-2 justify-content-center'
                      key={'teleopGoalRow' + goal.id}
                    >
                      <Counter
                        minWidth='170px'
                        count={goal.value}
                        margin={'3px 0px 0px 0px'}
                        colon=': '
                        onIncrement={() => this.handleTeleopGoalIncrement(goal)}
                        onDecrement={() => this.handleTeleopGoalDecrement(goal)}
                        label={goal.label}
                        disabled={false}
                        dynamic={goal.value === 0}
                        size='xs'
                        marginRight='0px'
                        id={'teleopGoal' + goal.id}
                        key={'teleopGoal' + goal.id}
                      />
                    </Form.Row>
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-0'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%'
                    }}
                  >
                    Rotation Control:
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  as={Row}
                >
                  <Form.Label
                    className='mb-0'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '90%'
                    }}
                  >
                    Last Rotation Time: {this.state.oldRotationTimer}
                  </Form.Label>
                </Form.Group>
                <StopWatch
                  value={this.state.rotationTimer}
                  parentCallback={this.handleRotationControlTimer}
                />
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  className='mb-3'
                >
                  {this.state.rotationOptions.map(option => (
                    <Form.Row key={'rotationRow' + option.id} className='mb-2'>
                      <Form.Check
                        style={{
                          fontFamily: 'Helvetica, Arial',
                          textAlign: 'left'
                        }}
                        isInvalid={
                          this.state.validatedStage2 &&
                          this.state.rotationControl === ''
                        }
                        isValid={
                          this.state.validatedStage2 &&
                          this.state.rotationControl !== ''
                        }
                        inline
                        custom
                        label={option.label}
                        type='radio'
                        onChange={() => this.handleRotationControl(option)}
                        checked={this.state.rotationControl === option.label}
                        id={'rotationOption' + option.id}
                        key={'rotationOption' + option.id}
                      />
                    </Form.Row>
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-0'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%'
                    }}
                  >
                    Position Control:
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  as={Row}
                >
                  <Form.Label
                    className='mb-0'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '90%'
                    }}
                  >
                    Last Position Time: {this.state.oldPositionTimer}
                  </Form.Label>
                </Form.Group>
                <StopWatch
                  value={this.state.positionTimer}
                  parentCallback={this.handlePositionControlTimer}
                />
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  className='mb-3'
                >
                  {this.state.positionOptions.map(option => (
                    <Form.Row key={'positionRow' + option.id} className='mb-2'>
                      <Form.Check
                        style={{
                          fontFamily: 'Helvetica, Arial',
                          textAlign: 'left'
                        }}
                        isInvalid={
                          this.state.validatedStage2 &&
                          this.state.positionControl === ''
                        }
                        isValid={
                          this.state.validatedStage2 &&
                          this.state.positionControl !== ''
                        }
                        inline
                        custom
                        label={option.label}
                        type='radio'
                        onChange={() => this.handlePositionControl(option)}
                        checked={this.state.positionControl === option.label}
                        id={'positionOption' + option.id}
                        key={'positionOption' + option.id}
                      />
                    </Form.Row>
                  ))}
                </Form.Group>
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
              </div>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginRight: '4%'
                }}
                onClick={this.handleStage2Decrement}
                className='btn-lg'
              >
                Back
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  marginRight: '4%'
                }}
                onClick={this.handleStage2Increment}
                className='btn-lg'
              >
                Next
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%'
                }}
                onClick={this.handleSubmit}
                className='btn-lg'
              >
                Submit
              </Button>
            </div>
          </div>
        );
      } else if (this.state.formStage === 3) {
        return (
          <div
            className='div-main'
            style={{ minHeight: this.state.heightSize }}
          >
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
              <div>
                <span
                  onClick={() => this.changeStage(0)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 0 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage0
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  1
                </span>
                <span
                  onClick={() => this.changeStage(1)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 1 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage1
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  2
                </span>
                <span
                  onClick={() => this.changeStage(2)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 2 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage2
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  3
                </span>
                <span
                  onClick={() => this.changeStage(3)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 3 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage3
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  4
                </span>
                <span
                  onClick={() => this.changeStage(4)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 4 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage4
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  5
                </span>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-0'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%'
                    }}
                  >
                    Did the robot hang or park?
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  as={Row}
                >
                  <Form.Label
                    className='mb-0'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '90%'
                    }}
                  >
                    Last End Game Time: {this.state.oldEndGameTimer}
                  </Form.Label>
                </Form.Group>
                <StopWatch
                  value={this.state.endGameTimer}
                  parentCallback={this.handleEndGameTimer}
                />
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  className='mb-3'
                >
                  {this.state.endGameOptions.map(option => (
                    <Form.Row key={'endGameRow' + option.id} className='mb-2'>
                      <Form.Check
                        style={{
                          fontFamily: 'Helvetica, Arial',
                          textAlign: 'left'
                        }}
                        isInvalid={
                          this.state.validatedStage3 &&
                          this.state.endGame === ''
                        }
                        isValid={
                          this.state.validatedStage3 &&
                          this.state.endGame !== ''
                        }
                        inline
                        custom
                        label={option.label}
                        type='radio'
                        onChange={() => this.handleEndGame(option)}
                        checked={this.state.endGame === option.label}
                        id={'endGameOption' + option.id}
                        key={'endGameOption' + option.id}
                      />
                    </Form.Row>
                  ))}
                </Form.Group>
                {this.state.endGame !== 'Hang' ? (
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
                ) : null}
              </div>
              {this.state.endGame === 'Hang' ? (
                <React.Fragment>
                  <div className='div-form'>
                    <Form.Group
                      style={{ width: '80%', marginLeft: '1%' }}
                      as={Row}
                    >
                      <Form.Label
                        className='mb-0'
                        style={{
                          fontFamily: 'Helvetica, Arial',
                          fontSize: '110%'
                        }}
                      >
                        How did the robot hang?
                      </Form.Label>
                    </Form.Group>
                    <Form.Group
                      style={{ width: '100%', marginLeft: '2%' }}
                      className='mb-3'
                    >
                      {this.state.climbOptions.map(option => (
                        <Form.Row key={'climbRow' + option.id} className='mb-2'>
                          <Form.Check
                            style={{
                              fontFamily: 'Helvetica, Arial',
                              textAlign: 'left'
                            }}
                            isInvalid={
                              this.state.validatedStage3 &&
                              this.state.climb === ''
                            }
                            isValid={
                              this.state.validatedStage3 &&
                              this.state.climb !== ''
                            }
                            inline
                            custom
                            label={option.label}
                            type='radio'
                            onChange={() => this.handleClimb(option)}
                            checked={this.state.climb === option.label}
                            id={'climbOption' + option.id}
                            key={'climbOption' + option.id}
                          />
                        </Form.Row>
                      ))}
                    </Form.Group>
                    {this.state.climb !== '' &&
                    this.state.climb !== 'Assisted Climb' ? (
                      <React.Fragment>
                        <Form.Group
                          style={{ width: '80%', marginLeft: '1%' }}
                          as={Row}
                        >
                          <Form.Label
                            className='mb-0'
                            style={{
                              fontFamily: 'Helvetica, Arial',
                              fontSize: '110%'
                            }}
                          >
                            Where did it hang?
                          </Form.Label>
                        </Form.Group>
                        <div>{this.state.levelPosition}</div>
                        <input
                          min={0}
                          max={2}
                          step={0.125}
                          className='sliderlevel'
                          value={this.state.levelPosition}
                          onChange={this.handleLevelChange}
                          type='range'
                        />
                      </React.Fragment>
                    ) : null}
                  </div>
                  <div className='div-form'>
                    <Form.Group
                      style={{ width: '80%', marginLeft: '1%' }}
                      as={Row}
                    >
                      <Form.Label
                        className='mb-0'
                        style={{
                          fontFamily: 'Helvetica, Arial',
                          fontSize: '110%'
                        }}
                      >
                        How did the robot level?
                      </Form.Label>
                    </Form.Group>
                    <Form.Group
                      style={{ width: '100%', marginLeft: '2%' }}
                      className='mb-3'
                    >
                      {this.state.levelOptions.map(option => (
                        <Form.Row key={'levelRow' + option.id} className='mb-2'>
                          <Form.Check
                            style={{
                              fontFamily: 'Helvetica, Arial',
                              textAlign: 'left'
                            }}
                            isInvalid={
                              this.state.validatedStage3 &&
                              this.state.level === ''
                            }
                            isValid={
                              this.state.validatedStage3 &&
                              this.state.level !== ''
                            }
                            inline
                            custom
                            label={option.label}
                            type='radio'
                            onChange={() => this.handleLevel(option)}
                            checked={this.state.level === option.label}
                            id={'levelOption' + option.id}
                            key={'levelOption' + option.id}
                          />
                        </Form.Row>
                      ))}
                    </Form.Group>
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
                  </div>
                </React.Fragment>
              ) : null}
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginRight: '4%'
                }}
                onClick={this.handleStage3Decrement}
                className='btn-lg'
              >
                Back
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  marginRight: '4%'
                }}
                onClick={this.handleStage3Increment}
                className='btn-lg'
              >
                Next
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%'
                }}
                onClick={this.handleSubmit}
                className='btn-lg'
              >
                Submit
              </Button>
            </div>
          </div>
        );
      } else if (this.state.formStage === 4) {
        return (
          <div
            className='div-main'
            style={{ minHeight: this.state.heightSize }}
          >
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
              <div>
                <span
                  onClick={() => this.changeStage(0)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 0 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage0
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  1
                </span>
                <span
                  onClick={() => this.changeStage(1)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 1 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage1
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  2
                </span>
                <span
                  onClick={() => this.changeStage(2)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 2 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage2
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  3
                </span>
                <span
                  onClick={() => this.changeStage(3)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 3 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage3
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  4
                </span>
                <span
                  onClick={() => this.changeStage(4)}
                  className='dot'
                  style={{
                    borderColor:
                      this.state.formStage === 4 ? 'black' : 'transparent',
                    backgroundColor: this.state.validStage4
                      ? '#57c24f'
                      : '#d4463b'
                  }}
                >
                  5
                </span>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Did the robot lose communication at any time?
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  as={Row}
                  className='mb-3'
                >
                  {this.state.communicationOptions.map(option => (
                    <Form.Check
                      style={{ fontFamily: 'Helvetica, Arial' }}
                      isInvalid={
                        this.state.validatedStage4 &&
                        this.state.communication === ''
                      }
                      isValid={
                        this.state.validatedStage4 &&
                        this.state.communication !== ''
                      }
                      inline
                      custom
                      label={option.label}
                      type='radio'
                      onChange={() => this.handleCommunication(option)}
                      checked={this.state.communication === option.label}
                      id={'communication' + option.id}
                      key={'communication' + option.id}
                    />
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Did the robot break during the match?
                  </Form.Label>
                </Form.Group>
                <Form.Group
                  style={{ width: '100%', marginLeft: '2%' }}
                  as={Row}
                  className='mb-3'
                >
                  {this.state.breakOptions.map(option => (
                    <Form.Check
                      style={{ fontFamily: 'Helvetica, Arial' }}
                      isInvalid={
                        this.state.validatedStage4 && this.state.break === ''
                      }
                      isValid={
                        this.state.validatedStage4 && this.state.break !== ''
                      }
                      inline
                      custom
                      label={option.label}
                      type='radio'
                      onChange={() => this.handleBreak(option)}
                      checked={this.state.break === option.label}
                      id={'break' + option.id}
                      key={'break' + option.id}
                    />
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Penalties/Yellow Cards/Red Cards:
                  </Form.Label>
                </Form.Group>
                <Form.Group style={{ width: '100%' }}>
                  {this.state.negatives.map(negative => (
                    <Form.Row
                      className='mb-2 justify-content-center'
                      key={'negativeRow' + negative.id}
                    >
                      {negative.label === 'Penalties' ? (
                        <PenaltyCounter
                          // maxWidth='1000px'
                          minWidth='170px'
                          count={negative.value}
                          margin={'3px 0px 0px 0px'}
                          colon=': '
                          onIncrement={() =>
                            this.handleNegativeIncrement(negative)
                          }
                          onDecrement={() =>
                            this.handleNegativeDecrement(negative)
                          }
                          onIncrementLarger={() =>
                            this.handleNegativeLargerIncrement(negative)
                          }
                          onDecrementLarger={() =>
                            this.handleNegativeLargerDecrement(negative)
                          }
                          label={negative.label}
                          disabled={false}
                          dynamic={negative.value === 0}
                          size='xs'
                          marginRight='0px'
                          id={'negative' + negative.id}
                          key={'negative' + negative.id}
                        />
                      ) : (
                        <Counter
                          minWidth='170px'
                          count={negative.value}
                          margin={'3px 0px 0px 0px'}
                          colon=': '
                          onIncrement={() =>
                            this.handleNegativeIncrement(negative)
                          }
                          onDecrement={() =>
                            this.handleNegativeDecrement(negative)
                          }
                          label={negative.label}
                          disabled={false}
                          dynamic={negative.value === 0}
                          size='xs'
                          marginRight='0px'
                          id={'negative' + negative.id}
                          key={'negative' + negative.id}
                        />
                      )}
                    </Form.Row>
                  ))}
                </Form.Group>
              </div>
              <div className='div-form'>
                <Form.Group style={{ width: '80%', marginLeft: '1%' }} as={Row}>
                  <Form.Label
                    className='mb-1'
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%',
                      textAlign: 'left'
                    }}
                  >
                    Ending Comments:
                  </Form.Label>
                </Form.Group>
                <div
                  style={{
                    display: 'inline-block',
                    width: '80%',
                    marginTop: '5px'
                  }}
                >
                  <Form.Group>
                    <Form.Control
                      value={this.state.reflectionComments}
                      as='textarea'
                      type='text'
                      placeholder='Any ending comments'
                      onChange={this.handleReflectionComment}
                      rows='3'
                      style={{
                        background: 'none',
                        fontFamily: 'Helvetica, Arial'
                      }}
                    />
                  </Form.Group>
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
              </div>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginRight: '8%'
                }}
                onClick={this.handleStage4Decrement}
                className='btn-lg'
              >
                Back
              </Button>
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '8%'
                }}
                onClick={this.handleSubmit}
                className='btn-lg'
              >
                Submit
              </Button>
            </div>
          </div>
        );
      }
    }
  }
}

export default MatchContent;
