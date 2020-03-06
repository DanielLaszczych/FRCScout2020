import React, { Component, Fragment } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Logo from './1796NumberswithScratch.png';
import { Prompt } from 'react-router-dom';
import { AuthContext } from '../contexts/auth_context';
import { Form, Dropdown } from 'react-bootstrap';
import { ReactSortable, Sortable, MultiDrag, Swap } from 'react-sortablejs';

Sortable.mount(new Swap());

class DrivingContent extends Component {
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
    speedListTier0: [
      { id: 0, teamNum: '' },
      { id: 1, teamNum: '' },
      { id: 2, teamNum: '' }
    ],
    speedListTier1: [],
    speedListTier2: [],
    speedListTier3: [],
    agilityListTier0: [
      { id: 0, teamNum: '' },
      { id: 1, teamNum: '' },
      { id: 2, teamNum: '' }
    ],
    agilityListTier1: [],
    agilityListTier2: [],
    agilityListTier3: [],
    counterListTier0: [
      { id: 0, teamNum: '' },
      { id: 1, teamNum: '' },
      { id: 2, teamNum: '' }
    ],
    counterListTier1: [],
    counterListTier2: [],
    counterListTier3: [],
    superComments1: '',
    superComments2: '',
    superComments3: ''
  };

  componentDidMount() {
    window.onbeforeunload = function() {
      return '';
    };
    if (this.props.match.path === '/supers/driving/:competition') {
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
        `/api/competitions/${this.props.match.params.competition}/matchNum/${this.props.match.params.matchNum}/allianceColor/${this.props.match.params.allianceColor}/drivingData`
      )
        .then(response => response.json())
        .then(data => {
          if (
            data.matchData.length !== 3 &&
            data.matchData[0].report_status_super_driving !== 'NOT STARTED'
          ) {
            this.setState({ retrieved: 'invalid' });
          } else {
            let newSpeedListTier0 = [];
            let newSpeedListTier1 = [];
            let newSpeedListTier2 = [];
            let newSpeedListTier3 = [];
            let newAgilityListTier0 = [];
            let newAgilityListTier1 = [];
            let newAgilityListTier2 = [];
            let newAgilityListTier3 = [];
            let newCounterListTier0 = [];
            let newCounterListTier1 = [];
            let newCounterListTier2 = [];
            let newCounterListTier3 = [];
            this.setState({ allianceColor: data.matchData[0].alliance_color });
            this.setState({
              markForFollowUp:
                data.matchData[0].report_status_super_driving === 'Done'
                  ? false
                  : true
            });
            this.setState({
              scout: data.matchData[0].scout_name_super_driving
            });
            this.setState({ competition: data.matchData[0].short_name });
            this.setState({ competitionKey: data.matchData[0].blue_key });
            this.setState({
              autoTeam: data.matchData[0].auto_team_super_driving
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
              let obj = { id: team.team_order_driving, teamNum: team.team_num };

              if (team.team_order_driving === 0) {
                this.setState({ teamNum1: team.team_num });
                this.setState({ superComments1: team.super_comments_driving });
              } else if (team.team_order_driving === 1) {
                this.setState({ teamNum2: team.team_num });
                this.setState({ superComments2: team.super_comments_driving });
              } else {
                this.setState({ teamNum3: team.team_num });
                this.setState({ superComments3: team.super_comments_driving });
              }

              if (team.speed === 0) {
                newSpeedListTier0.push(obj);
              } else if (team.speed === 1) {
                newSpeedListTier1.push(obj);
              } else if (team.speed === 2) {
                newSpeedListTier2.push(obj);
              } else if (team.speed === 3) {
                newSpeedListTier3.push(obj);
              }

              if (team.agility === 0) {
                newAgilityListTier0.push(obj);
              } else if (team.agility === 1) {
                newAgilityListTier1.push(obj);
              } else if (team.agility === 2) {
                newAgilityListTier2.push(obj);
              } else if (team.agility === 3) {
                newAgilityListTier3.push(obj);
              }

              if (team.counter_defense === 0) {
                newCounterListTier0.push(obj);
              } else if (team.counter_defense === 1) {
                newCounterListTier1.push(obj);
              } else if (team.counter_defense === 2) {
                newCounterListTier2.push(obj);
              } else if (team.counter_defense === 3) {
                newCounterListTier3.push(obj);
              }
            });
            this.setState({ speedListTier0: newSpeedListTier0 });
            this.setState({ speedListTier1: newSpeedListTier1 });
            this.setState({ speedListTier2: newSpeedListTier2 });
            this.setState({ speedListTier3: newSpeedListTier3 });
            this.setState({ agilityListTier0: newAgilityListTier0 });
            this.setState({ agilityListTier1: newAgilityListTier1 });
            this.setState({ agilityListTier2: newAgilityListTier2 });
            this.setState({ agilityListTier3: newAgilityListTier3 });
            this.setState({ counterListTier0: newCounterListTier0 });
            this.setState({ counterListTier1: newCounterListTier1 });
            this.setState({ counterListTier2: newCounterListTier2 });
            this.setState({ counterListTier3: newCounterListTier3 });
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
        let newSpeedListTier0 = this.state.speedListTier0.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newSpeedListTier1 = this.state.speedListTier1.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newSpeedListTier2 = this.state.speedListTier2.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newSpeedListTier3 = this.state.speedListTier3.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newAgilityListTier0 = this.state.agilityListTier0.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newAgilityListTier1 = this.state.agilityListTier1.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newAgilityListTier2 = this.state.agilityListTier2.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newAgilityListTier3 = this.state.agilityListTier3.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newCounterListTier0 = this.state.counterListTier0.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newCounterListTier1 = this.state.counterListTier1.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newCounterListTier2 = this.state.counterListTier2.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        let newCounterListTier3 = this.state.counterListTier3.map(element => {
          element.teamNum = teams[element.id];
          return element;
        });
        this.setState({ teamNum1: teams[0] });
        this.setState({ teamNum2: teams[1] });
        this.setState({ teamNum3: teams[2] });
        this.setState({ speedListTier0: newSpeedListTier0 });
        this.setState({ speedListTier1: newSpeedListTier1 });
        this.setState({ speedListTier2: newSpeedListTier2 });
        this.setState({ speedListTier3: newSpeedListTier3 });
        this.setState({ agilityListTier0: newAgilityListTier0 });
        this.setState({ agilityListTier1: newAgilityListTier1 });
        this.setState({ agilityListTier2: newAgilityListTier2 });
        this.setState({ agilityListTier3: newAgilityListTier3 });
        this.setState({ counterListTier0: newCounterListTier0 });
        this.setState({ counterListTier1: newCounterListTier1 });
        this.setState({ counterListTier2: newCounterListTier2 });
        this.setState({ counterListTier3: newCounterListTier3 });
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
    this.setState({ teamNum1: event.target.value }, () => {
      let newSpeedListTier0 = this.state.speedListTier0.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newSpeedListTier1 = this.state.speedListTier1.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newSpeedListTier2 = this.state.speedListTier2.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newSpeedListTier3 = this.state.speedListTier3.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newAgilityListTier0 = this.state.agilityListTier0.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newAgilityListTier1 = this.state.agilityListTier1.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newAgilityListTier2 = this.state.agilityListTier2.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newAgilityListTier3 = this.state.agilityListTier3.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newCounterListTier0 = this.state.counterListTier0.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newCounterListTier1 = this.state.counterListTier1.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newCounterListTier2 = this.state.counterListTier2.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      let newCounterListTier3 = this.state.counterListTier3.map(element => {
        if (element.id === 0) {
          element.teamNum = this.state.teamNum1;
        }
        return element;
      });
      this.setState({ speedListTier0: newSpeedListTier0 });
      this.setState({ speedListTier1: newSpeedListTier1 });
      this.setState({ speedListTier2: newSpeedListTier2 });
      this.setState({ speedListTier3: newSpeedListTier3 });
      this.setState({ agilityListTier0: newAgilityListTier0 });
      this.setState({ agilityListTier1: newAgilityListTier1 });
      this.setState({ agilityListTier2: newAgilityListTier2 });
      this.setState({ agilityListTier3: newAgilityListTier3 });
      this.setState({ counterListTier0: newCounterListTier0 });
      this.setState({ counterListTier1: newCounterListTier1 });
      this.setState({ counterListTier2: newCounterListTier2 });
      this.setState({ counterListTier3: newCounterListTier3 });
    });
  };

  handleTeamNum2 = event => {
    this.setState({ teamNum2: event.target.value }, () => {
      let newSpeedListTier0 = this.state.speedListTier0.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newSpeedListTier1 = this.state.speedListTier1.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newSpeedListTier2 = this.state.speedListTier2.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newSpeedListTier3 = this.state.speedListTier3.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newAgilityListTier0 = this.state.agilityListTier0.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newAgilityListTier1 = this.state.agilityListTier1.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newAgilityListTier2 = this.state.agilityListTier2.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newAgilityListTier3 = this.state.agilityListTier3.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newCounterListTier0 = this.state.counterListTier0.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newCounterListTier1 = this.state.counterListTier1.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newCounterListTier2 = this.state.counterListTier2.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      let newCounterListTier3 = this.state.counterListTier3.map(element => {
        if (element.id === 1) {
          element.teamNum = this.state.teamNum2;
        }
        return element;
      });
      this.setState({ speedListTier0: newSpeedListTier0 });
      this.setState({ speedListTier1: newSpeedListTier1 });
      this.setState({ speedListTier2: newSpeedListTier2 });
      this.setState({ speedListTier3: newSpeedListTier3 });
      this.setState({ agilityListTier0: newAgilityListTier0 });
      this.setState({ agilityListTier1: newAgilityListTier1 });
      this.setState({ agilityListTier2: newAgilityListTier2 });
      this.setState({ agilityListTier3: newAgilityListTier3 });
      this.setState({ counterListTier0: newCounterListTier0 });
      this.setState({ counterListTier1: newCounterListTier1 });
      this.setState({ counterListTier2: newCounterListTier2 });
      this.setState({ counterListTier3: newCounterListTier3 });
    });
  };

  handleTeamNum3 = event => {
    this.setState({ teamNum3: event.target.value }, () => {
      let newSpeedListTier0 = this.state.speedListTier0.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newSpeedListTier1 = this.state.speedListTier1.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newSpeedListTier2 = this.state.speedListTier2.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newSpeedListTier3 = this.state.speedListTier3.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newAgilityListTier0 = this.state.agilityListTier0.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newAgilityListTier1 = this.state.agilityListTier1.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newAgilityListTier2 = this.state.agilityListTier2.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newAgilityListTier3 = this.state.agilityListTier3.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newCounterListTier0 = this.state.counterListTier0.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newCounterListTier1 = this.state.counterListTier1.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newCounterListTier2 = this.state.counterListTier2.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      let newCounterListTier3 = this.state.counterListTier3.map(element => {
        if (element.id === 2) {
          element.teamNum = this.state.teamNum3;
        }
        return element;
      });
      this.setState({ speedListTier0: newSpeedListTier0 });
      this.setState({ speedListTier1: newSpeedListTier1 });
      this.setState({ speedListTier2: newSpeedListTier2 });
      this.setState({ speedListTier3: newSpeedListTier3 });
      this.setState({ agilityListTier0: newAgilityListTier0 });
      this.setState({ agilityListTier1: newAgilityListTier1 });
      this.setState({ agilityListTier2: newAgilityListTier2 });
      this.setState({ agilityListTier3: newAgilityListTier3 });
      this.setState({ counterListTier0: newCounterListTier0 });
      this.setState({ counterListTier1: newCounterListTier1 });
      this.setState({ counterListTier2: newCounterListTier2 });
      this.setState({ counterListTier3: newCounterListTier3 });
    });
  };

  handleAllianceColor = option => {
    this.setState({ allianceColor: option.label }, () => {
      this.getTeamNumber();
    });
  };

  handleFollowUp = () => {
    this.setState({ markForFollowUp: !this.state.markForFollowUp });
  };

  handleDockDefense = (event, index) => {
    let newDockDefense = this.state.dockDefense;
    newDockDefense[index] = event.target.value;
    this.setState({ dockDefense: newDockDefense });
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

  getSpeedTier(teamNum) {
    let speedTier;
    this.state.speedListTier0.map(element => {
      if (element.teamNum == teamNum) {
        speedTier = 0;
      }
    });
    this.state.speedListTier1.map(element => {
      if (element.teamNum == teamNum) {
        speedTier = 1;
      }
    });
    this.state.speedListTier2.map(element => {
      if (element.teamNum == teamNum) {
        speedTier = 2;
      }
    });
    this.state.speedListTier3.map(element => {
      if (element.teamNum == teamNum) {
        speedTier = 3;
      }
    });
    return speedTier;
  }

  getAgilityTier(teamNum) {
    let agilityTier;
    this.state.agilityListTier0.map(element => {
      if (element.teamNum == teamNum) {
        agilityTier = 0;
      }
    });
    this.state.agilityListTier1.map(element => {
      if (element.teamNum == teamNum) {
        agilityTier = 1;
      }
    });
    this.state.agilityListTier2.map(element => {
      if (element.teamNum == teamNum) {
        agilityTier = 2;
      }
    });
    this.state.agilityListTier3.map(element => {
      if (element.teamNum == teamNum) {
        agilityTier = 3;
      }
    });
    return agilityTier;
  }

  getCounterTier(teamNum) {
    let counterTier;
    this.state.counterListTier0.map(element => {
      if (element.teamNum == teamNum) {
        counterTier = 0;
      }
    });
    this.state.counterListTier1.map(element => {
      if (element.teamNum == teamNum) {
        counterTier = 1;
      }
    });
    this.state.counterListTier2.map(element => {
      if (element.teamNum == teamNum) {
        counterTier = 2;
      }
    });
    this.state.counterListTier3.map(element => {
      if (element.teamNum == teamNum) {
        counterTier = 3;
      }
    });
    return counterTier;
  }

  validateForm() {
    if (
      ((this.state.matchTypeKey === 'qm' && this.state.matchNum1 !== '') ||
        (this.state.matchTypeKey !== 'qm' &&
          this.state.matchNum1 !== '' &&
          this.state.matchNum2 !== '')) &&
      this.state.teamNum1 !== '' &&
      this.state.teamNum2 !== '' &&
      this.state.teamNum3 !== '' &&
      this.state.speedListTier2.length <= 1 &&
      this.state.speedListTier3.length <= 1 &&
      this.state.agilityListTier2.length <= 1 &&
      this.state.agilityListTier3.length <= 1 &&
      this.state.counterListTier2.length <= 1 &&
      this.state.counterListTier3.length <= 1
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
        speed: this.getSpeedTier(this.state.teamNum1),
        agility: this.getAgilityTier(this.state.teamNum1),
        counterDefense: this.getCounterTier(this.state.teamNum1),
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
        speed: this.getSpeedTier(this.state.teamNum2),
        agility: this.getAgilityTier(this.state.teamNum2),
        counterDefense: this.getCounterTier(this.state.teamNum2),
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
        speed: this.getSpeedTier(this.state.teamNum3),
        agility: this.getAgilityTier(this.state.teamNum3),
        counterDefense: this.getCounterTier(this.state.teamNum3),
        superComments: this.state.superComments3
      };

      fetch('/api/submitDrivingForm', {
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

      fetch('/api/submitDrivingForm', {
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

      fetch('/api/submitDrivingForm', {
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
                      fontSize: '110%'
                    }}
                  >
                    Speed:
                  </div>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 3:
                    {this.state.speedListTier3.length > 1
                      ? ' Only one team'
                      : ''}
                  </div>
                  <ReactSortable
                    style={{
                      background:
                        this.state.speedListTier3.length > 1
                          ? '#ff8080'
                          : '#90ee90'
                    }}
                    group='speedList'
                    className='pick-list'
                    animation={150}
                    list={this.state.speedListTier3}
                    setList={newState =>
                      this.setState({ speedListTier3: newState })
                    }
                  >
                    {this.state.speedListTier3.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 2:
                    {this.state.speedListTier2.length > 1
                      ? ' Only one team'
                      : ''}
                  </div>
                  <ReactSortable
                    style={{
                      background:
                        this.state.speedListTier2.length > 1
                          ? '#ff8080'
                          : '#90ee90'
                    }}
                    group='speedList'
                    className='pick-list'
                    animation={150}
                    list={this.state.speedListTier2}
                    setList={newState =>
                      this.setState({ speedListTier2: newState })
                    }
                  >
                    {this.state.speedListTier2.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 1:
                  </div>
                  <ReactSortable
                    group='speedList'
                    className='pick-list'
                    animation={150}
                    list={this.state.speedListTier1}
                    setList={newState =>
                      this.setState({ speedListTier1: newState })
                    }
                  >
                    {this.state.speedListTier1.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 0:
                  </div>
                  <ReactSortable
                    group='speedList'
                    className='pick-list'
                    animation={150}
                    list={this.state.speedListTier0}
                    setList={newState =>
                      this.setState({ speedListTier0: newState })
                    }
                  >
                    {this.state.speedListTier0.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                </div>
                <div className='div-form'>
                  <div
                    style={{
                      textAlign: 'start',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%'
                    }}
                  >
                    Agility:
                  </div>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 3:
                    {this.state.agilityListTier3.length > 1
                      ? 'Only one team'
                      : ''}
                  </div>
                  <ReactSortable
                    style={{
                      background:
                        this.state.agilityListTier3.length > 1
                          ? '#ff8080'
                          : '#90ee90'
                    }}
                    group='agilityList'
                    className='pick-list'
                    animation={150}
                    list={this.state.agilityListTier3}
                    setList={newState =>
                      this.setState({ agilityListTier3: newState })
                    }
                  >
                    {this.state.agilityListTier3.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 2:{' '}
                    {this.state.agilityListTier2.length > 1
                      ? 'Only one team'
                      : ''}
                  </div>
                  <ReactSortable
                    style={{
                      background:
                        this.state.agilityListTier2.length > 1
                          ? '#ff8080'
                          : '#90ee90'
                    }}
                    group='agilityList'
                    className='pick-list'
                    animation={150}
                    list={this.state.agilityListTier2}
                    setList={newState =>
                      this.setState({ agilityListTier2: newState })
                    }
                  >
                    {this.state.agilityListTier2.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 1:
                  </div>
                  <ReactSortable
                    group='agilityList'
                    className='pick-list'
                    animation={150}
                    list={this.state.agilityListTier1}
                    setList={newState =>
                      this.setState({ agilityListTier1: newState })
                    }
                  >
                    {this.state.agilityListTier1.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 0:
                  </div>
                  <ReactSortable
                    group='agilityList'
                    className='pick-list'
                    animation={150}
                    list={this.state.agilityListTier0}
                    setList={newState =>
                      this.setState({ agilityListTier0: newState })
                    }
                  >
                    {this.state.agilityListTier0.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                </div>
                <div className='div-form'>
                  <div
                    style={{
                      textAlign: 'start',
                      fontFamily: 'Helvetica, Arial',
                      fontSize: '110%'
                    }}
                  >
                    Counter:
                  </div>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 3:
                    {this.state.counterListTier3.length > 1
                      ? 'Only one team'
                      : ''}
                  </div>
                  <ReactSortable
                    style={{
                      background:
                        this.state.counterListTier3.length > 1
                          ? '#ff8080'
                          : '#90ee90'
                    }}
                    group='counterList'
                    className='pick-list'
                    animation={150}
                    list={this.state.counterListTier3}
                    setList={newState =>
                      this.setState({ counterListTier3: newState })
                    }
                  >
                    {this.state.counterListTier3.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 2:{' '}
                    {this.state.counterListTier2.length > 1
                      ? 'Only one team'
                      : ''}
                  </div>
                  <ReactSortable
                    style={{
                      background:
                        this.state.counterListTier2.length > 1
                          ? '#ff8080'
                          : '#90ee90'
                    }}
                    group='counterList'
                    className='pick-list'
                    animation={150}
                    list={this.state.counterListTier2}
                    setList={newState =>
                      this.setState({ counterListTier2: newState })
                    }
                  >
                    {this.state.counterListTier2.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 1:
                  </div>
                  <ReactSortable
                    group='counterList'
                    className='pick-list'
                    animation={150}
                    list={this.state.counterListTier1}
                    setList={newState =>
                      this.setState({ counterListTier1: newState })
                    }
                  >
                    {this.state.counterListTier1.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
                  <div
                    style={{
                      fontFamily: 'Helvetica, Arial'
                    }}
                  >
                    Tier 0:
                  </div>
                  <ReactSortable
                    group='counterList'
                    className='pick-list'
                    animation={150}
                    list={this.state.counterListTier0}
                    setList={newState =>
                      this.setState({ counterListTier0: newState })
                    }
                  >
                    {this.state.counterListTier0.map(team => (
                      <div className='pick-item' key={team.id}>
                        {team.teamNum}
                      </div>
                    ))}
                  </ReactSortable>
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

export default DrivingContent;
