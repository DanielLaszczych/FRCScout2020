import React, { Component } from 'react';
import './PitContent.css';
import Logo from './1796NumberswithScratch.png';
import Row from 'react-bootstrap/Row';
import { Form, Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, {
  Comparator,
  selectFilter,
  textFilter
} from 'react-bootstrap-table2-filter';
import DropdownItem from 'react-bootstrap/DropdownItem';
import {
  BarChart,
  Bar,
  Label,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer
} from 'recharts';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';
import './PitContent.css';

const scoreTypes = [
  { value: 'Average', label: 'Average' },
  { value: 'Median', label: 'Median' },
  { value: 'Max', label: 'Max' }
];

class Data extends Component {
  state = {
    widthSize: '',
    heightSize: '',
    competition: '',
    competitions: [],
    competitionData: [],
    filteredCompetitionData: [],
    matchData: [],
    defenseData: [],
    driveData: [],
    pitData: {},
    graphData: [],
    teamNum: '',
    retrieved: '',
    tableSections: [
      { id: 1, name: 'Auto Cells' },
      { id: 2, name: 'Baseline Cross' },
      { id: 3, name: 'Teleop Cells' },
      { id: 4, name: 'Rotation Control' },
      { id: 5, name: 'Position Control' },
      { id: 6, name: 'Park' },
      { id: 7, name: 'Climb' },
      { id: 8, name: 'Level' },
      { id: 9, name: 'Driving' },
      { id: 10, name: 'Defense' },
      { id: 11, name: 'Penalties' },
      { id: 12, name: 'Break/Comm.' }
    ],
    tableSection: 'Choose',
    tableColumnSpecifics: [
      { id: 1, name: 'Median' },
      { id: 2, name: 'Average' },
      { id: 3, name: 'Max' }
    ],
    tableColumnSpecificsMin: [
      { id: 1, name: 'Median' },
      { id: 2, name: 'Average' },
      { id: 3, name: 'Min' }
    ],
    autoBottomDataField: 'Median',
    autoOuterDataField: 'Median',
    autoInnerDataField: 'Median',
    teleBottomDataField: 'Median',
    teleOuterDataField: 'Median',
    teleInnerDataField: 'Median',
    rotationTimerDataField: 'Median',
    positionTimerDataField: 'Median',
    climbTimerDataField: 'Median',
    speedDataField: 'Median',
    agilityDataField: 'Median',
    counterDefenseDataField: 'Median',
    totalDrivingDataField: 'Median',
    pinningDefenseDataField: 'Median',
    knockingDefenseDataField: 'Median',
    blockingDefenseDataField: 'Median',
    totalDefenseDataField: 'Median',
    teamDataType: '',
    refreshable: false
  };

  median(arr) {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return (arr.length % 2 !== 0
      ? nums[mid]
      : (nums[mid - 1] + nums[mid]) / 2
    ).toFixed(2);
  }

  extractCompData = data => {
    let matchData = data;
    let alteredData = [];
    matchData
      .filter(
        match =>
          match.report_status === 'Done' ||
          match.report_status_super_driving === 'Done' ||
          match.report_status_super_defense === 'Done'
      )
      .map(match => match.team_num)
      .filter((team, index, arr) => arr.indexOf(team) === index)
      .map(team => {
        let obj = {
          teamNum: team,
          matchForms: 0,
          drivingForms: 0,
          defenseForms: 0,
          bottomAutoScore: [],
          outerAutoScore: [],
          innerAutoScore: [],
          crossLine: 0,
          bottomTeleScore: [],
          outerTeleScore: [],
          innerTeleScore: [],
          rotationControl: 0,
          rotationTimer: [],
          positionControl: 0,
          positionTimer: [],
          climb: 0,
          climbTimer: [],
          buddyClimb: 0,
          level: 0,
          park: 0,
          communication: 0,
          break: 0,
          penalties: 0,
          yellowCards: 0,
          redCards: 0,
          speed: [],
          agility: [],
          counterDefense: [],
          totalDriving: [],
          pinningDefense: [],
          knockingDefense: [],
          blockingDefense: [],
          totalDefense: []
        };
        alteredData.push(obj);
      });
    matchData.map(match => {
      if (match.report_status === 'Done') {
        let index = alteredData.findIndex(x => x.teamNum === match.team_num);
        alteredData[index].matchForms++;
        alteredData[index].bottomAutoScore.push(match.auto_scored[0].value);
        alteredData[index].outerAutoScore.push(match.auto_scored[1].value);
        alteredData[index].innerAutoScore.push(match.auto_scored[2].value);
        if (match.cross_line === 'Yes') alteredData[index].crossLine++;
        alteredData[index].bottomTeleScore.push(match.teleop_scored[0].value);
        alteredData[index].outerTeleScore.push(match.teleop_scored[1].value);
        alteredData[index].innerTeleScore.push(match.teleop_scored[2].value);
        if (match.rotation_control === 'Yes') {
          alteredData[index].rotationControl++;
          alteredData[index].rotationTimer.push(match.rotation_timer / 1000.0);
        }
        if (match.position_control === 'Yes') {
          alteredData[index].positionControl++;
          alteredData[index].positionTimer.push(match.position_timer / 1000.0);
        }
        if (match.end_game === 'Hang' && match.climb !== 'Assisted Climb') {
          alteredData[index].climb++;
          alteredData[index].climbTimer.push(match.end_game_timer / 1000.0);
          alteredData[index].park++;
          if (match.climb === 'Buddy Climb') alteredData[index].buddyClimb++;
          if (match.level !== 'No') alteredData[index].level++;
        } else if (match.end_game === 'Park') {
          alteredData[index].park++;
        }
        if (match.communication === 'Yes') alteredData[index].communication++;
        if (match.break === 'Yes') alteredData[index].break++;
        alteredData[index].penalties += match.negatives[0].value;
        alteredData[index].yellowCards += match.negatives[1].value;
        alteredData[index].redCards += match.negatives[2].value;
      }
      if (match.report_status_super_driving === 'Done') {
        let index = alteredData.findIndex(x => x.teamNum === match.team_num);
        alteredData[index].drivingForms++;
        alteredData[index].speed.push(match.speed);
        alteredData[index].agility.push(match.agility);
        alteredData[index].counterDefense.push(match.counter_defense);
        alteredData[index].totalDriving.push(
          match.speed + match.agility + match.counter_defense
        );
      }
      if (match.report_status_super_defense === 'Done') {
        let index = alteredData.findIndex(x => x.teamNum === match.team_num);
        alteredData[index].defenseForms++;
        alteredData[index].pinningDefense.push(match.pinning_defense);
        alteredData[index].knockingDefense.push(match.knock_defense);
        alteredData[index].blockingDefense.push(match.block_defense);
        alteredData[index].totalDefense.push(
          match.pinning_defense + match.knock_defense + match.block_defense
        );
      }
    });
    alteredData.sort((a, b) => a.teamNum - b.teamNum);
    alteredData.forEach(team => {
      if (team.matchForms > 0) {
        team.crossLinePercentage =
          ((team.crossLine / team.matchForms) * 100.0).toFixed(2) + '%';

        team.autoBottomMedian = parseFloat(this.median(team.bottomAutoScore));
        team.autoBottomAverage = parseFloat(
          (
            team.bottomAutoScore.reduce((a, b) => a + b, 0) /
            team.bottomAutoScore.length
          ).toFixed(2)
        );
        team.autoBottomMax = Math.max(...team.bottomAutoScore);
        team.autoOuterMedian = parseFloat(this.median(team.outerAutoScore));
        team.autoOuterAverage = parseFloat(
          (
            team.outerAutoScore.reduce((a, b) => a + b, 0) /
            team.outerAutoScore.length
          ).toFixed(2)
        );
        team.autoOuterMax = Math.max(...team.outerAutoScore);
        team.autoInnerMedian = parseFloat(this.median(team.innerAutoScore));
        team.autoInnerAverage = parseFloat(
          (
            team.innerAutoScore.reduce((a, b) => a + b, 0) /
            team.innerAutoScore.length
          ).toFixed(2)
        );
        team.autoInnerMax = Math.max(...team.innerAutoScore);

        team.teleBottomMedian = parseFloat(this.median(team.bottomTeleScore));
        team.teleBottomAverage = parseFloat(
          (
            team.bottomTeleScore.reduce((a, b) => a + b, 0) /
            team.bottomTeleScore.length
          ).toFixed(2)
        );
        team.teleBottomMax = Math.max(...team.bottomTeleScore);
        team.teleOuterMedian = parseFloat(this.median(team.outerTeleScore));
        team.teleOuterAverage = parseFloat(
          (
            team.outerTeleScore.reduce((a, b) => a + b, 0) /
            team.outerTeleScore.length
          ).toFixed(2)
        );
        team.teleOuterMax = Math.max(...team.outerTeleScore);
        team.teleInnerMedian = parseFloat(this.median(team.innerTeleScore));
        team.teleInnerAverage = parseFloat(
          (
            team.innerTeleScore.reduce((a, b) => a + b, 0) /
            team.innerTeleScore.length
          ).toFixed(2)
        );
        team.teleInnerMax = Math.max(...team.innerTeleScore);

        team.rotationControlPercentage =
          ((team.rotationControl / team.matchForms) * 100.0).toFixed(2) + '%';
        if (team.rotationControl !== 0) {
          team.rotationTimerMedian = this.median(team.rotationTimer);
          team.rotationTimerAverage = (
            team.rotationTimer.reduce((a, b) => a + b, 0) /
            team.rotationTimer.length
          ).toFixed(2);
          team.rotationTimerMin = Math.min(...team.rotationTimer);
        } else {
          team.rotationTimerMedian = 0;
          team.rotationTimerAverage = 0;
          team.rotationTimerMin = 0;
        }

        team.positionControlPercentage =
          ((team.positionControl / team.matchForms) * 100.0).toFixed(2) + '%';
        if (team.positionControl !== 0) {
          team.positionTimerMedian = this.median(team.positionTimer);
          team.positionTimerAverage = (
            team.positionTimer.reduce((a, b) => a + b, 0) /
            team.positionTimer.length
          ).toFixed(2);
          team.positionTimerMin = Math.min(...team.positionTimer);
        } else {
          team.positionTimerMedian = 0;
          team.positionTimerAverage = 0;
          team.positionTimerMin = 0;
        }

        team.parkPercentage =
          ((team.park / team.matchForms) * 100.0).toFixed(2) + '%';
        team.climbPercentage =
          ((team.climb / team.matchForms) * 100.0).toFixed(2) + '%';
        team.levelPercentage =
          ((team.level / team.matchForms) * 100.0).toFixed(2) + '%';
        if (team.climb !== 0) {
          team.climbTimerMedian = this.median(team.climbTimer);
          team.climbTimerAverage = (
            team.climbTimer.reduce((a, b) => a + b, 0) / team.climbTimer.length
          ).toFixed(2);
          team.climbTimerMin = Math.min(...team.climbTimer);
        } else {
          team.climbTimerMedian = 0;
          team.climbTimerAverage = 0;
          team.climbTimerMin = 0;
        }
      } else {
        team.crossLine = 'N/A';
        team.crossLinePercentage = 'N/A';
        team.autoBottomMedian = 'N/A';
        team.autoBottomAverage = 'N/A';
        team.autoBottomMax = 'N/A';
        team.autoOuterMedian = 'N/A';
        team.autoOuterAverage = 'N/A';
        team.autoOuterMax = 'N/A';
        team.autoInnerMedian = 'N/A';
        team.autoInnerAverage = 'N/A';
        team.autoInnerMax = 'N/A';
        team.teleBottomMedian = 'N/A';
        team.teleBottomAverage = 'N/A';
        team.teleBottomMax = 'N/A';
        team.teleOuterMedian = 'N/A';
        team.teleOuterAverage = 'N/A';
        team.teleOuterMax = 'N/A';
        team.teleInnerMedian = 'N/A';
        team.teleInnerAverage = 'N/A';
        team.teleInnerMax = 'N/A';
        team.rotationControl = 'N/A';
        team.rotationControlPercentage = 'N/A';
        team.rotationTimerMedian = 'N/A';
        team.rotationTimerAverage = 'N/A';
        team.rotationTimerMin = 'N/A';
        team.positionControl = 'N/A';
        team.positionControlPercentage = 'N/A';
        team.positionTimerMedian = 'N/A';
        team.positionTimerAverage = 'N/A';
        team.positionTimerMin = 'N/A';
        team.climb = 'N/A';
        team.climbPercentage = 'N/A';
        team.climbTimerMedian = 'N/A';
        team.climbTimerAverage = 'N/A';
        team.climbTimerMin = 'N/A';
        team.park = 'N/A';
        team.parkPercentage = 'N/A';
        team.level = 'N/A';
        team.levelPercentage = 'N/A';
        team.buddyClimb = 'N/A';
        team.communication = 'N/A';
        team.break = 'N/A';
        team.penalties = 'N/A';
        team.yellowCards = 'N/A';
        team.redCards = 'N/A';
      }
      if (team.drivingForms > 0) {
        team.speedMedian = parseFloat(this.median(team.speed));
        team.speedAverage = parseFloat(
          (team.speed.reduce((a, b) => a + b, 0) / team.speed.length).toFixed(2)
        );
        team.speedMax = Math.max(...team.speed);

        team.agilityMedian = parseFloat(this.median(team.agility));
        team.agilityAverage = parseFloat(
          (
            team.agility.reduce((a, b) => a + b, 0) / team.agility.length
          ).toFixed(2)
        );
        team.agilityMax = Math.max(...team.agility);

        team.counterDefenseMedian = parseFloat(
          this.median(team.counterDefense)
        );
        team.counterDefenseAverage = parseFloat(
          (
            team.counterDefense.reduce((a, b) => a + b, 0) /
            team.counterDefense.length
          ).toFixed(2)
        );
        team.counterDefenseMax = Math.max(...team.counterDefense);

        team.totalDrivingMedian = parseFloat(this.median(team.totalDriving));
        team.totalDrivingAverage = parseFloat(
          (
            team.totalDriving.reduce((a, b) => a + b, 0) /
            team.totalDriving.length
          ).toFixed(2)
        );
        team.totalDrivingMax = Math.max(...team.totalDriving);
      } else {
        team.speedMedian = 'N/A';
        team.speedAverage = 'N/A';
        team.speedMax = 'N/A';
        team.agilityMedian = 'N/A';
        team.agilityAverage = 'N/A';
        team.agilityMax = 'N/A';
        team.counterDefenseMedian = 'N/A';
        team.counterDefenseAverage = 'N/A';
        team.counterDefenseMax = 'N/A';
        team.totalDrivingMedian = 'N/A';
        team.totalDrivingAverage = 'N/A';
        team.totalDrivingMax = 'N/A';
      }
      if (team.defenseForms > 0) {
        team.pinningDefenseMedian = parseFloat(
          this.median(team.pinningDefense)
        );
        team.pinningDefenseAverage = parseFloat(
          (
            team.pinningDefense.reduce((a, b) => a + b, 0) /
            team.pinningDefense.length
          ).toFixed(2)
        );
        team.pinningDefenseMax = Math.max(...team.pinningDefense);

        team.knockingDefenseMedian = parseFloat(
          this.median(team.knockingDefense)
        );
        team.knockingDefenseAverage = parseFloat(
          (
            team.knockingDefense.reduce((a, b) => a + b, 0) /
            team.knockingDefense.length
          ).toFixed(2)
        );
        team.knockingDefenseMax = Math.max(...team.knockingDefense);

        team.blockingDefenseMedian = parseFloat(
          this.median(team.blockingDefense)
        );
        team.blockingDefenseAverage = parseFloat(
          (
            team.blockingDefense.reduce((a, b) => a + b, 0) /
            team.blockingDefense.length
          ).toFixed(2)
        );
        team.blockingDefenseMax = Math.max(...team.blockingDefense);

        team.totalDefenseMedian = parseFloat(this.median(team.totalDefense));
        team.totalDefenseAverage = parseFloat(
          (
            team.totalDefense.reduce((a, b) => a + b, 0) /
            team.totalDefense.length
          ).toFixed(2)
        );
        team.totalDefenseMax = Math.max(...team.totalDefense);
      } else {
        team.pinningDefenseMedian = 'N/A';
        team.pinningDefenseAverage = 'N/A';
        team.pinningDefenseMax = 'N/A';
        team.knockingDefenseMedian = 'N/A';
        team.knockingDefenseAverage = 'N/A';
        team.knockingDefenseMax = 'N/A';
        team.blockingDefenseMedian = 'N/A';
        team.blockingDefenseAverage = 'N/A';
        team.blockingDefenseMax = 'N/A';
        team.totalDefenseMedian = 'N/A';
        team.totalDefenseAverage = 'N/A';
        team.totalDefenseMax = 'N/A';
      }
    });
    this.setState({ competitionData: alteredData });
    this.setState({ filteredCompetitionData: alteredData }, () => {
      this.setState({ retrieved: 'compValid' });
    });
  };

  extractTeamMatchData = data => {
    let matchData = data.filter(match => match.report_status === 'Done');
    if (matchData.length > 0) {
      let alteredData = [];
      let total = {
        matchNum: 'Averages',
        matchesPlayed: 0,
        crossLine: 0,
        scoutName: '-',
        autoPowerCells: '-',
        startingPosition: '-',
        bottomAutoScored: [],
        outerAutoScored: [],
        innerAutoScored: [],
        bottomTeleopScored: [],
        outerTeleopScored: [],
        innerTeleopScored: [],
        rotationControl: 0,
        rotationTimes: [],
        positionControl: 0,
        positionTimes: [],
        park: 0,
        climb: 0,
        endGameTimes: [],
        level: 0,
        communication: 0,
        break: 0,
        penalties: 0,
        yellowCards: 0,
        redCards: 0,
        autoComments: '-',
        reflectionComments: '-'
      };
      matchData.forEach(match => {
        let obj = {};
        total.matchesPlayed++;
        obj.matchNum = match.match_num;
        obj.crossLine = match.cross_line;
        if (match.cross_line === 'Yes') total.crossLine++;

        obj.scoutName = match.scout_name;
        obj.autoPowerCells = match.auto_power_cells;
        obj.startingPosition = match.starting_position;

        obj.bottomAutoScore = match.auto_scored[0].value;
        total.bottomAutoScored.push(match.auto_scored[0].value);
        obj.outerAutoScore = match.auto_scored[1].value;
        total.outerAutoScored.push(match.auto_scored[1].value);
        obj.innerAutoScore = match.auto_scored[2].value;
        total.innerAutoScored.push(match.auto_scored[2].value);

        obj.bottomTeleopScore = match.teleop_scored[0].value;
        total.bottomTeleopScored.push(match.teleop_scored[0].value);
        obj.outerTeleopScore = match.teleop_scored[1].value;
        total.outerTeleopScored.push(match.teleop_scored[1].value);
        obj.innerTeleopScore = match.teleop_scored[2].value;
        total.innerTeleopScored.push(match.teleop_scored[2].value);

        if (match.rotation_control === 'Unsuccessful attempt') {
          obj.rotationControl = 'Attempt';
        } else {
          obj.rotationControl = match.rotation_control;
        }

        if (match.rotation_control === 'Yes') {
          total.rotationControl++;
          total.rotationTimes.push(match.rotation_timer / 1000.0);
          obj.rotationTimer = match.rotation_timer / 1000.0;
        } else if (match.rotation_control === 'Unsuccessful attempt') {
          total.rotationTimes.push(match.rotation_timer / 1000.0);
          obj.rotationTimer = match.rotation_timer / 1000.0;
        } else {
          obj.rotationTimer = '-';
        }

        if (match.position_control === 'Unsuccessful attempt') {
          obj.positionControl = 'Attempt';
        } else {
          obj.positionControl = match.position_control;
        }

        if (match.position_control === 'Yes') {
          total.positionControl++;
          total.positionTimes.push(match.position_timer / 1000.0);
          obj.positionTimer = match.position_timer / 1000.0;
        } else if (match.position_control === 'Unsuccessful attempt') {
          total.rotationTimes.push(match.rotation_timer / 1000.0);
          obj.rotationTimer = match.rotation_timer / 1000.0;
        } else {
          obj.positionTimer = '-';
        }

        if (match.end_game === 'Hang') {
          obj.climb = match.climb + '(Hang)';
          obj.park = 'Yes';
          obj.endGameTimer = match.end_game_timer;
          if (obj.level !== ' No') {
            obj.level = match.level;
            total.level++;
          } else {
            obj.level = 'No';
          }
          total.climb++;
          total.park++;
          total.endGameTimes.push(match.end_game_timer / 1000.0);
        } else if (match.end_game === 'Park') {
          obj.climb = 'No';
          obj.park = 'Yes';
          obj.level = '-';
          obj.endGameTimer = '-';
          total.park++;
        } else {
          obj.climb = 'None';
          obj.park = 'None';
          obj.level = '-';
          obj.endGameTimer = '-';
        }

        if (match.communication === 'Yes') total.communication++;
        if (match.break === 'Yes') total.break++;
        total.penalties += match.negatives[0].value;
        total.yellowCards += match.negatives[1].value;
        total.redCards += match.negatives[2].value;

        obj.autoComments = (
          <React.Fragment>
            <Button
              variant='success'
              onClick={() =>
                this.showAutoComment(match.match_num, match.auto_comments)
              }
            >
              Show
            </Button>
          </React.Fragment>
        );

        // obj.autoComments = '-';
        obj.reflectionComments = (
          <React.Fragment>
            <Button
              variant='success'
              onClick={() =>
                this.showReflectionComment(
                  match.match_num,
                  match.reflection_comments
                )
              }
            >
              Show
            </Button>
          </React.Fragment>
        );
        alteredData.push(obj);
      });

      total.crossLine =
        ((total.crossLine / total.matchesPlayed) * 100.0).toFixed(2) + '%';

      total.bottomAutoScore = (
        total.bottomAutoScored.reduce((a, b) => a + b, 0) / total.matchesPlayed
      ).toFixed(2);
      total.outerAutoScore = (
        total.outerAutoScored.reduce((a, b) => a + b, 0) / total.matchesPlayed
      ).toFixed(2);
      total.innerAutoScore = (
        total.innerAutoScored.reduce((a, b) => a + b, 0) / total.matchesPlayed
      ).toFixed(2);

      total.bottomTeleopScore = (
        total.bottomTeleopScored.reduce((a, b) => a + b, 0) /
        total.matchesPlayed
      ).toFixed(2);
      total.outerTeleopScore = (
        total.outerTeleopScored.reduce((a, b) => a + b, 0) / total.matchesPlayed
      ).toFixed(2);
      total.innerTeleopScore = (
        total.innerTeleopScored.reduce((a, b) => a + b, 0) / total.matchesPlayed
      ).toFixed(2);

      total.rotationControl =
        ((total.rotationControl / total.matchesPlayed) * 100.0).toFixed(2) +
        '%';
      if (total.rotationTimes.length !== 0) {
        total.rotationTimer = (
          total.rotationTimes.reduce((a, b) => a + b, 0) /
          total.rotationTimes.length
        ).toFixed(2);
      } else {
        total.rotationTimer = '-';
      }

      total.positionControl =
        ((total.positionControl / total.matchesPlayed) * 100.0).toFixed(2) +
        '%';
      if (total.positionTimes.length !== 0) {
        total.positionTimer = (
          total.positionTimes.reduce((a, b) => a + b, 0) /
          total.positionTimes.length
        ).toFixed(2);
      } else {
        total.positionTimer = '-';
      }

      total.park =
        ((total.park / total.matchesPlayed) * 100.0).toFixed(2) + '%';
      total.climb =
        ((total.climb / total.matchesPlayed) * 100.0).toFixed(2) + '%';
      total.level =
        ((total.level / total.matchesPlayed) * 100.0).toFixed(2) + '%';

      if (total.endGameTimes.length !== 0) {
        total.endGameTimer = (
          total.endGameTimes.reduce((a, b) => a + b, 0) /
          total.endGameTimes.length
        ).toFixed(2);
      } else {
        total.endGameTimer = '-';
      }

      alteredData.sort((a, b) => {
        if (a.matchNum.split('_')[0] === 'qm') {
          if (b.matchNum.split('_')[0] === 'qm') {
            return a.matchNum.split('_')[1] - b.matchNum.split('_')[1];
          } else {
            return -1;
          }
        } else if (a.matchNum.split('_')[0] === 'qf') {
          if (b.matchNum.split('_')[0] === 'qf') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (b.matchNum.split('_')[0] === 'qm') {
              return 1;
            } else {
              return -1;
            }
          }
        } else if (a.matchNum.split('_')[0] === 'sf') {
          if (b.matchNum.split('_')[0] === 'sf') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (
              b.matchNum.split('_')[0] === 'qm' ||
              b.matchNum.split('_')[0] === 'qf'
            ) {
              return 1;
            } else {
              return -1;
            }
          }
        } else if (a.matchNum.split('_')[0] === 'f') {
          if (b.matchNum.split('_')[0] === 'f') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (
              b.matchNum.split('_')[0] === 'qm' ||
              b.matchNum.split('_')[0] === 'qf' ||
              b.matchNum.split('_')[0] === 'sf'
            ) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      });
      let newgraphData = [].concat(alteredData);
      this.setState({ graphData: newgraphData });
      alteredData.unshift(total);
      this.setState({ matchData: alteredData });
    } else {
      this.setState({ matchData: [] });
      this.setState({ graphData: [] });
    }

    let driveData = data.filter(
      match => match.report_status_super_driving === 'Done'
    );
    if (driveData.length > 0) {
      let alteredData = [];
      let total = {
        matchNum: 'Averages',
        matchesPlayed: 0,
        scoutName: '-',
        speeds: 0,
        agilitys: 0,
        counterDefenses: 0,
        driveComment: '-'
      };
      driveData.forEach(match => {
        let obj = {};
        total.matchesPlayed++;
        obj.matchNum = match.match_num;
        obj.scoutName = match.scout_name_super_driving;
        obj.speed = match.speed;
        obj.agility = match.agility;
        obj.counterDefense = match.counter_defense;
        total.speeds += match.speed;
        total.agilitys += match.agility;
        total.counterDefenses += match.counter_defense;

        obj.driveComment = (
          <React.Fragment>
            <Button
              variant='success'
              onClick={() =>
                this.showDriveComment(
                  match.match_num,
                  match.super_comments_driving
                )
              }
            >
              Show
            </Button>
          </React.Fragment>
        );
        alteredData.push(obj);
      });

      total.speed = total.speeds / total.matchesPlayed;
      total.agility = total.agilitys / total.matchesPlayed;
      total.counterDefense = total.counterDefenses / total.matchesPlayed;

      alteredData.sort((a, b) => {
        if (a.matchNum.split('_')[0] === 'qm') {
          if (b.matchNum.split('_')[0] === 'qm') {
            return a.matchNum.split('_')[1] - b.matchNum.split('_')[1];
          } else {
            return -1;
          }
        } else if (a.matchNum.split('_')[0] === 'qf') {
          if (b.matchNum.split('_')[0] === 'qf') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (b.matchNum.split('_')[0] === 'qm') {
              return 1;
            } else {
              return -1;
            }
          }
        } else if (a.matchNum.split('_')[0] === 'sf') {
          if (b.matchNum.split('_')[0] === 'sf') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (
              b.matchNum.split('_')[0] === 'qm' ||
              b.matchNum.split('_')[0] === 'qf'
            ) {
              return 1;
            } else {
              return -1;
            }
          }
        } else if (a.matchNum.split('_')[0] === 'f') {
          if (b.matchNum.split('_')[0] === 'f') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (
              b.matchNum.split('_')[0] === 'qm' ||
              b.matchNum.split('_')[0] === 'qf' ||
              b.matchNum.split('_')[0] === 'sf'
            ) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      });
      alteredData.unshift(total);
      this.setState({ driveData: alteredData });
    } else {
      this.setState({ driveData: [] });
    }

    let defenseData = data.filter(
      match => match.report_status_super_defense === 'Done'
    );
    if (defenseData.length > 0) {
      let alteredData = [];
      let total = {
        matchNum: 'Averages',
        matchesPlayed: 0,
        scoutName: '-',
        pinningDefenses: 0,
        knockingDefenses: 0,
        blockingDefenses: 0,
        defenseComment: '-'
      };
      defenseData.forEach(match => {
        let obj = {};
        total.matchesPlayed++;
        obj.matchNum = match.match_num;
        obj.scoutName = match.scout_name_super_defense;
        obj.pinningDefense = match.pinning_defense;
        obj.knockingDefense = match.knock_defense;
        obj.blockingDefense = match.block_defense;
        total.pinningDefenses += match.pinning_defense;
        total.blockingDefenses += match.block_defense;
        total.knockingDefenses += match.knock_defense;
        obj.defenseComment = (
          <React.Fragment>
            <Button
              variant='success'
              onClick={() =>
                this.showDefenseComment(
                  match.match_num,
                  match.super_comments_defense
                )
              }
            >
              Show
            </Button>
          </React.Fragment>
        );
        alteredData.push(obj);
      });

      total.pinningDefense = total.pinningDefenses / total.matchesPlayed;
      total.blockingDefense = total.blockingDefenses / total.matchesPlayed;
      total.knockingDefense = total.knockingDefenses / total.matchesPlayed;

      alteredData.sort((a, b) => {
        if (a.matchNum.split('_')[0] === 'qm') {
          if (b.matchNum.split('_')[0] === 'qm') {
            return a.matchNum.split('_')[1] - b.matchNum.split('_')[1];
          } else {
            return -1;
          }
        } else if (a.matchNum.split('_')[0] === 'qf') {
          if (b.matchNum.split('_')[0] === 'qf') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (b.matchNum.split('_')[0] === 'qm') {
              return 1;
            } else {
              return -1;
            }
          }
        } else if (a.matchNum.split('_')[0] === 'sf') {
          if (b.matchNum.split('_')[0] === 'sf') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (
              b.matchNum.split('_')[0] === 'qm' ||
              b.matchNum.split('_')[0] === 'qf'
            ) {
              return 1;
            } else {
              return -1;
            }
          }
        } else if (a.matchNum.split('_')[0] === 'f') {
          if (b.matchNum.split('_')[0] === 'f') {
            return (
              a.matchNum.split('_')[1] +
              a.matchNum.split('_')[2] -
              (b.matchNum.split('_')[1] + b.matchNum.split('_')[2])
            );
          } else {
            if (
              b.matchNum.split('_')[0] === 'qm' ||
              b.matchNum.split('_')[0] === 'qf' ||
              b.matchNum.split('_')[0] === 'sf'
            ) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      });
      alteredData.unshift(total);
      this.setState({ defenseData: alteredData });
    } else {
      this.setState({ defenseData: [] });
    }
    this.setState({ retrieved: 'teamMatchValid' });
  };

  extractTeamPitData = pitData => {
    let obj = {};
    obj.groupName =
      'G' +
      pitData.group_name.charAt(6) +
      ' ' +
      (pitData.group_name.charAt(8) === 'R' ? 'Red' : 'Blue');
    obj.weight = pitData.weight;
    obj.height = pitData.height;
    obj.driveTrain = pitData.drive_train;
    let tempMotors = '';
    pitData.motors.forEach(motor => {
      if (motor.value > 0) {
        if (motor.label === 'Other') {
          tempMotors = tempMotors.concat(
            motor.value + 'x ' + motor.motorName + ', '
          );
        } else {
          tempMotors = tempMotors.concat(
            motor.value + 'x ' + motor.label + ', '
          );
        }
      }
    });
    tempMotors = tempMotors.substring(0, tempMotors.length - 2);
    obj.motors = tempMotors;
    let tempWheels = '';
    pitData.wheels.forEach(wheel => {
      if (wheel.value) {
        if (wheel.label === 'Other') {
          tempWheels = tempWheels.concat(
            wheel.count + 'x ' + wheel.wheelName + '(' + wheel.size + ' in.), '
          );
        } else {
          tempWheels = tempWheels.concat(
            wheel.count + 'x ' + wheel.label + '(' + wheel.size + ' in.), '
          );
        }
      }
    });
    tempWheels = tempWheels.substring(0, tempWheels.length - 2);
    obj.wheels = tempWheels;
    obj.driveComments = pitData.drive_comments;
    obj.codeLanguage = pitData.code_language;
    obj.startingPosition = pitData.starting_position;
    obj.autoComments = pitData.auto_comments;
    obj.abilities = pitData.abilities;
    obj.workingOnComments = pitData.working_comments;
    obj.closingComments = pitData.closing_comments;
    obj.image = pitData.image;
    this.setState({ pitData: obj }, () => {
      this.setState({ retrieved: 'teamPitValid' });
    });
  };

  componentDidMount() {
    window.onbeforeunload = null;
    if (this.props.match.path === '/data') {
      fetch('/competitions')
        .then(response => response.json())
        .then(data => {
          this.setState({ competitions: data.competitions });
          this.setState({ teamDataType: 'match' });
          data.competitions.map(c => {
            if (c.iscurrent) {
              this.setState({ competition: c.shortname });
            }
          });
        })
        .then(() => {
          fetch(`/api/competitions/${this.state.competition}/matchData`)
            .then(response => response.json())
            .then(data => {
              let matchData = data.matchData;
              this.extractCompData(matchData);
            });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (this.props.match.path === '/data/:competition') {
      fetch('/competitions')
        .then(response => response.json())
        .then(data => {
          this.setState({ competitions: data.competitions });
          this.setState({ teamDataType: 'match' });
          let validCompetition = false;
          data.competitions.map(c => {
            if (c.shortname === this.props.match.params.competition) {
              validCompetition = true;
            }
          });
          if (!validCompetition) {
            this.setState({
              retrieved: 'compInvalid'
            });
            this.setState({ competition: 'Invalid' });
          } else {
            this.setState({
              competition: this.props.match.params.competition
            });
            fetch(
              `/api/competitions/${this.props.match.params.competition}/matchData`
            )
              .then(response => response.json())
              .then(data => {
                let matchData = data.matchData;
                this.extractCompData(matchData);
              });
          }
        });
    } else {
      fetch('/competitions')
        .then(response => response.json())
        .then(data => {
          this.setState({ competitions: data.competitions });
          let validCompetition = false;
          data.competitions.map(c => {
            if (c.shortname === this.props.match.params.competition) {
              validCompetition = true;
            }
          });
          if (!validCompetition) {
            this.setState({
              retrieved: 'compInvalid'
            });
            this.setState({ competition: 'Invalid' });
            this.setState({ teamNum: this.props.match.params.team });
            this.setState({ teamDataType: this.props.match.params.dataType });
          } else {
            this.setState({ teamNum: this.props.match.params.team });
            this.setState({
              competition: this.props.match.params.competition
            });
            this.setState({ teamDataType: this.props.match.params.dataType });
            if (this.props.match.params.dataType === 'match') {
              fetch(
                `/api/competitions/${this.props.match.params.competition}/team/${this.props.match.params.team}/matchData`
              )
                .then(response => response.json())
                .then(data => {
                  if (data.matchData.length === 0) {
                    this.setState({ retrieved: 'teamMatchInvalid' });
                  } else {
                    let matchData = data.matchData;
                    this.extractTeamMatchData(matchData);
                  }
                });
            } else {
              fetch(
                `/api/competitions/${this.props.match.params.competition}/team/${this.props.match.params.team}/pit`
              )
                .then(response => response.json())
                .then(data => {
                  if (data.pitFormData.length === 0) {
                    this.setState({ retrieved: 'teamPitInvalid' });
                  } else if (data.pitFormData[0].status !== 'Done') {
                    this.setState({ retrieved: 'teamPitInvalid' });
                  } else {
                    let pitData = data.pitFormData[0];
                    this.extractTeamPitData(pitData);
                  }
                });
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    this.setState({
      widthSize: window.innerWidth <= 760 ? '90%' : '50%'
    });
    this.setState({ heightSize: window.innerHeight + 'px' });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.url !== prevProps.match.url) {
      window.onbeforeunload = null;
      if (this.props.match.path === '/data') {
        fetch('/competitions')
          .then(response => response.json())
          .then(data => {
            this.setState({ competitions: data.competitions });
            this.setState({ teamDataType: 'match' });
            data.competitions.map(c => {
              if (c.iscurrent) {
                this.setState({ competition: c.shortname });
              }
            });
          })
          .then(() => {
            fetch(`/api/competitions/${this.state.competition}/matchData`)
              .then(response => response.json())
              .then(data => {
                let matchData = data.matchData;
                this.extractCompData(matchData);
              });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else if (this.props.match.path === '/data/:competition') {
        fetch('/competitions')
          .then(response => response.json())
          .then(data => {
            this.setState({ competitions: data.competitions });
            this.setState({ teamDataType: 'match' });
            let validCompetition = false;
            data.competitions.map(c => {
              if (c.shortname === this.props.match.params.competition) {
                validCompetition = true;
              }
            });
            if (!validCompetition) {
              this.setState({
                retrieved: 'compInvalid'
              });
              this.setState({ competition: 'Invalid' });
            } else {
              this.setState({
                competition: this.props.match.params.competition
              });
              fetch(
                `/api/competitions/${this.props.match.params.competition}/matchData`
              )
                .then(response => response.json())
                .then(data => {
                  let matchData = data.matchData;
                  this.extractCompData(matchData);
                });
            }
          });
      } else {
        fetch('/competitions')
          .then(response => response.json())
          .then(data => {
            this.setState({ competitions: data.competitions });
            let validCompetition = false;
            data.competitions.map(c => {
              if (c.shortname === this.props.match.params.competition) {
                validCompetition = true;
              }
            });
            if (!validCompetition) {
              this.setState({
                retrieved: 'compInvalid'
              });
              this.setState({ competition: 'Invalid' });
              this.setState({ teamNum: this.props.match.params.team });
              this.setState({ teamDataType: this.props.match.params.dataType });
            } else {
              this.setState({ teamNum: this.props.match.params.team });
              this.setState({
                competition: this.props.match.params.competition
              });
              if (this.props.match.params.dataType === 'match') {
                fetch(
                  `/api/competitions/${this.props.match.params.competition}/team/${this.props.match.params.team}/matchData`
                )
                  .then(response => response.json())
                  .then(data => {
                    if (data.matchData.length === 0) {
                      this.setState({ retrieved: 'teamMatchInvalid' });
                    } else {
                      let matchData = data.matchData;
                      this.extractTeamMatchData(matchData);
                    }
                  });
              } else {
                fetch(
                  `/api/competitions/${this.props.match.params.competition}/team/${this.props.match.params.team}/pit`
                )
                  .then(response => response.json())
                  .then(data => {
                    if (data.pitFormData.length === 0) {
                      this.setState({ retrieved: 'teamPitInvalid' });
                    } else if (data.pitFormData[0].status !== 'Done') {
                      this.setState({ retrieved: 'teamPitInvalid' });
                    } else {
                      let pitData = data.pitFormData[0];
                      this.extractTeamPitData(pitData);
                    }
                  });
              }
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      this.setState({
        widthSize: window.innerWidth <= 760 ? '90%' : '50%'
      });
      this.setState({ heightSize: window.innerHeight + 'px' });
    } else if (this.state.refreshable) {
      this.setState({ refreshable: false });
      window.onbeforeunload = null;
      if (this.props.match.path === '/data') {
        fetch('/competitions')
          .then(response => response.json())
          .then(data => {
            this.setState({ competitions: data.competitions });
            this.setState({ teamDataType: 'match' });
            data.competitions.map(c => {
              if (c.iscurrent) {
                this.setState({ competition: c.shortname });
              }
            });
          })
          .then(() => {
            fetch(`/api/competitions/${this.state.competition}/matchData`)
              .then(response => response.json())
              .then(data => {
                let matchData = data.matchData;
                this.extractCompData(matchData);
              });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else if (this.props.match.path === '/data/:competition') {
        fetch('/competitions')
          .then(response => response.json())
          .then(data => {
            this.setState({ competitions: data.competitions });
            this.setState({ teamDataType: 'match' });
            let validCompetition = false;
            data.competitions.map(c => {
              if (c.shortname === this.props.match.params.competition) {
                validCompetition = true;
              }
            });
            if (!validCompetition) {
              this.setState({
                retrieved: 'compInvalid'
              });
              this.setState({ competition: 'Invalid' });
            } else {
              this.setState({
                competition: this.props.match.params.competition
              });
              fetch(
                `/api/competitions/${this.props.match.params.competition}/matchData`
              )
                .then(response => response.json())
                .then(data => {
                  let matchData = data.matchData;
                  this.extractCompData(matchData);
                });
            }
          });
      } else {
        fetch('/competitions')
          .then(response => response.json())
          .then(data => {
            this.setState({ competitions: data.competitions });
            let validCompetition = false;
            data.competitions.map(c => {
              if (c.shortname === this.props.match.params.competition) {
                validCompetition = true;
              }
            });
            if (!validCompetition) {
              this.setState({
                retrieved: 'compInvalid'
              });
              this.setState({ competition: 'Invalid' });
            } else {
              this.setState({ teamNum: this.props.match.params.team });
              this.setState({
                competition: this.props.match.params.competition
              });
              this.setState({ teamDataType: this.props.match.params.dataType });
              if (this.props.match.params.dataType === 'match') {
                fetch(
                  `/api/competitions/${this.props.match.params.competition}/team/${this.props.match.params.team}/matchData`
                )
                  .then(response => response.json())
                  .then(data => {
                    let matchData = data.matchData;
                    this.extractTeamMatchData(matchData);
                  });
              } else {
                fetch(
                  `/api/competitions/${this.props.match.params.competition}/team/${this.props.match.params.team}/pit`
                )
                  .then(response => response.json())
                  .then(data => {
                    if (data.pitFormData.length === 0) {
                      this.setState({ retrieved: 'teamPitInvalid' });
                    } else if (data.pitFormData[0].status !== 'Done') {
                      this.setState({ retrieved: 'teamPitInvalid' });
                    } else {
                      let pitData = data.pitFormData[0];
                      this.extractTeamPitData(pitData);
                    }
                  });
              }
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      this.setState({
        widthSize: window.innerWidth <= 760 ? '90%' : '50%'
      });
      this.setState({ heightSize: window.innerHeight + 'px' });
    }
  }

  getData = competition => {
    this.setState({ competition });
    if (this.state.teamNum === '') {
      if (this.props.match.url === '/data/' + competition) {
        this.setState({ refreshable: true });
      } else {
        this.setState({ refreshable: false });
        this.props.history.push(`/data/${competition}`);
      }
    } else {
      if (this.state.teamDataType === 'match') {
        if (
          this.props.match.url ===
          '/data/' + competition + '/' + this.state.teamNum + '/match'
        ) {
          this.setState({ refreshable: true });
        } else {
          this.setState({ refreshable: false });
          this.props.history.push(
            `/data/${competition}/${this.state.teamNum}/match`
          );
        }
      } else {
        if (
          this.props.match.url ===
          '/data/' + competition + '/' + this.state.teamNum + '/pit'
        ) {
          this.setState({ refreshable: true });
        } else {
          this.setState({ refreshable: false });
          this.props.history.push(
            `/data/${competition}/${this.state.teamNum}/pit`
          );
        }
      }
    }
  };

  changeTable = section => {
    this.setState({ tableSection: section });
    if (section === 'Driving') {
      let compData = this.state.competitionData;
      let filteredData = compData.filter(team => team.drivingForms > 0);
      this.setState({ filteredCompetitionData: filteredData }, () => {
        this.forceUpdate();
      });
    } else if (section === 'Defense') {
      let compData = this.state.competitionData;
      let filteredData = compData.filter(team => team.defenseForms > 0);
      this.setState({ filteredCompetitionData: filteredData }, () => {
        this.forceUpdate();
      });
    } else if (
      section !== ' Driving' &&
      section !== 'Defense' &&
      section !== 'Choose'
    ) {
      let compData = this.state.competitionData;
      let filteredData = compData.filter(team => team.matchForms > 0);
      this.setState({ filteredCompetitionData: filteredData }, () => {
        this.forceUpdate();
      });
    }
  };

  changeAutoBottomColumn = type => {
    this.setState({ autoBottomDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeAutoOuterColumn = type => {
    this.setState({ autoOuterDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeAutoInnerColumn = type => {
    this.setState({ autoInnerDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeTeleBottomColumn = type => {
    this.setState({ teleBottomDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeTeleOuterColumn = type => {
    this.setState({ teleOuterDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeTeleInnerColumn = type => {
    this.setState({ teleInnerDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeRotationTimerColumn = type => {
    this.setState({ rotationTimerDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changePositionTimerColumn = type => {
    this.setState({ positionTimerDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeClimbTimerColumn = type => {
    this.setState({ climbTimerDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeTotalDrivingColumn = type => {
    this.setState({ totalDrivingDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeSpeedColumn = type => {
    this.setState({ speedDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeAgilityColumn = type => {
    this.setState({ agilityDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeCounterDefenseColumn = type => {
    this.setState({ counterDefenseDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeTotalDefenseColumn = type => {
    this.setState({ totalDefenseDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changePinningDefenseColumn = type => {
    this.setState({ pinningDefenseDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeKnockingDefenseColumn = type => {
    this.setState({ knockingDefenseDataField: type }, () => {
      this.forceUpdate();
    });
  };

  changeBlockingDefenseColumn = type => {
    this.setState({ blockingDefenseDataField: type }, () => {
      this.forceUpdate();
    });
  };

  handleTeamNum = event => {
    this.setState({ teamNum: event.target.value });
  };

  checkKeyTeamGo = event => {
    if (event.keyCode === 13) {
      this.handleTeamGo();
    }
  };

  handleTeamGo = () => {
    if (this.state.teamNum === '') {
      if (this.props.match.url === '/data/' + this.state.competition) {
        this.setState({ refreshable: true });
      } else {
        this.setState({ refreshable: false });
        this.props.history.push(`/data/${this.state.competition}`);
      }
    } else {
      if (this.state.teamDataType === 'match') {
        if (
          this.props.match.url ===
          '/data/' +
            this.state.competition +
            '/' +
            this.state.teamNum +
            '/match'
        ) {
          this.setState({ refreshable: true });
        } else {
          this.setState({ refreshable: false });
          this.props.history.push(
            `/data/${this.state.competition}/${this.state.teamNum}/match`
          );
        }
      } else {
        if (
          this.props.match.url ===
          '/data/' + this.state.competition + '/' + this.state.teamNum + '/pit'
        ) {
          this.setState({ refreshable: true });
        } else {
          this.setState({ refreshable: false });
          this.props.history.push(
            `/data/${this.state.competition}/${this.state.teamNum}/pit`
          );
        }
      }
    }
  };

  changeToMatchData = () => {
    if (this.state.teamNum !== '') {
      if (
        this.props.match.url ===
        '/data/' + this.state.competition + '/' + this.state.teamNum + '/match'
      ) {
        this.setState({ refreshable: true });
      } else {
        this.setState({ refreshable: false });
        this.props.history.push(
          `/data/${this.state.competition}/${this.state.teamNum}/match`
        );
      }
    } else {
      if (this.props.match.url === '/data/' + this.state.competition) {
        this.setState({ refreshable: true });
      } else {
        this.setState({ refreshable: false });
        this.props.history.push(`/data/${this.state.competition}`);
      }
    }
  };

  changeToPitData = () => {
    if (this.state.teamNum !== '') {
      if (
        this.props.match.url ===
        '/data/' + this.state.competition + '/' + this.state.teamNum + '/pit'
      ) {
        this.setState({ refreshable: true });
      } else {
        this.setState({ refreshable: false });
        this.props.history.push(
          `/data/${this.state.competition}/${this.state.teamNum}/pit`
        );
      }
    } else {
      if (this.props.match.url === '/data/' + this.state.competition) {
        this.setState({ refreshable: true });
      } else {
        this.setState({ refreshable: false });
        this.props.history.push(`/data/${this.state.competition}`);
      }
    }
  };

  showAutoComment = (matchNum, autoComment) => {
    const newMatchData = this.state.matchData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          autoComments: (
            <React.Fragment>
              <div>
                <Button
                  variant='success'
                  onClick={() => this.hideAutoComment(matchNum, autoComment)}
                >
                  Hide
                </Button>
              </div>
              <span style={{ wordBreak: 'break-word' }}>{autoComment}</span>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ matchData: newMatchData });
  };

  hideAutoComment = (matchNum, autoComment) => {
    const newMatchData = this.state.matchData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          autoComments: (
            <React.Fragment>
              <Button
                variant='success'
                onClick={() => this.showAutoComment(matchNum, autoComment)}
              >
                Show
              </Button>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ matchData: newMatchData });
  };

  showReflectionComment = (matchNum, reflectionComment) => {
    const newMatchData = this.state.matchData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          reflectionComments: (
            <React.Fragment>
              <div>
                <Button
                  variant='success'
                  onClick={() =>
                    this.hideReflectionComment(matchNum, reflectionComment)
                  }
                >
                  Hide
                </Button>
              </div>
              <span style={{ wordBreak: 'break-word' }}>
                {reflectionComment}
              </span>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ matchData: newMatchData });
  };

  hideReflectionComment = (matchNum, reflectionComment) => {
    const newMatchData = this.state.matchData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          reflectionComments: (
            <React.Fragment>
              <div>
                <Button
                  variant='success'
                  onClick={() =>
                    this.showReflectionComment(matchNum, reflectionComment)
                  }
                >
                  Show
                </Button>
              </div>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ matchData: newMatchData });
  };

  showDriveComment = (matchNum, driveComment) => {
    const newDriveData = this.state.driveData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          driveComment: (
            <React.Fragment>
              <div>
                <Button
                  variant='success'
                  onClick={() => this.hideDriveComment(matchNum, driveComment)}
                >
                  Hide
                </Button>
              </div>
              <span style={{ wordBreak: 'break-word' }}>{driveComment}</span>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ driveData: newDriveData });
  };

  hideDriveComment = (matchNum, driveComment) => {
    const newDriveData = this.state.driveData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          driveComment: (
            <React.Fragment>
              <div>
                <Button
                  variant='success'
                  onClick={() => this.showDriveComment(matchNum, driveComment)}
                >
                  Show
                </Button>
              </div>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ driveData: newDriveData });
  };

  showDefenseComment = (matchNum, defenseComment) => {
    const newDefenseData = this.state.defenseData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          defenseComment: (
            <React.Fragment>
              <div>
                <Button
                  variant='success'
                  onClick={() =>
                    this.hideDefenseComment(matchNum, defenseComment)
                  }
                >
                  Hide
                </Button>
              </div>
              <span style={{ wordBreak: 'break-word' }}>{defenseComment}</span>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ defenseData: newDefenseData });
  };

  hideDefenseComment = (matchNum, defenseComment) => {
    const newDefenseData = this.state.defenseData.map(match => {
      if (match.matchNum === matchNum) {
        return {
          ...match,
          defenseComment: (
            <React.Fragment>
              <div>
                <Button
                  variant='success'
                  onClick={() =>
                    this.showDefenseComment(matchNum, defenseComment)
                  }
                >
                  Show
                </Button>
              </div>
            </React.Fragment>
          )
        };
      }
      return match;
    });
    this.setState({ defenseData: newDefenseData });
  };

  render() {
    const competitionItems = this.state.competitions.map(competition => (
      <Dropdown.Item
        eventKey={competition.shortname}
        key={competition.competitionid}
        style={{ fontFamily: 'Helvetica, Arial' }}
      >
        {competition.shortname}
      </Dropdown.Item>
    ));

    const tableSectionItems = this.state.tableSections.map(section => (
      <Dropdown.Item
        eventKey={section.name}
        key={section.id}
        style={{ fontFamily: 'Helvetica, Arial' }}
      >
        {section.name}
      </Dropdown.Item>
    ));

    const tableColumnSpecifics = this.state.tableColumnSpecifics.map(type => (
      <Dropdown.Item
        eventKey={type.name}
        key={type.id}
        style={{ fontFamily: 'Helvetica, Arial' }}
      >
        {type.name}
      </Dropdown.Item>
    ));

    const tableColumnSpecificsMin = this.state.tableColumnSpecificsMin.map(
      type => (
        <Dropdown.Item
          eventKey={type.name}
          key={type.id}
          style={{ fontFamily: 'Helvetica, Arial' }}
        >
          {type.name}
        </Dropdown.Item>
      )
    );

    let compColumns = [
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        dataField: 'teamNum',
        text: 'Team',
        sort: true,
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
        hidden:
          (this.state.tableSection === 'Driving' ||
            this.state.tableSection === 'Defense') &&
          this.state.tableSection !== 'Choose',
        dataField: 'matchForms',
        text: 'Matches Submitted'
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        hidden:
          this.state.tableSection !== 'Driving' &&
          this.state.tableSection !== 'Choose',
        dataField: 'drivingForms',
        text: 'Drive Forms Submitted'
      },
      {
        headerStyle: {
          width: '25%',
          fontSize: '100%',
          outline: 'none'
        },
        hidden:
          this.state.tableSection !== 'Defense' &&
          this.state.tableSection !== 'Choose',
        dataField: 'defenseForms',
        text: 'Defense Forms Submitted'
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Auto Cells',
        dataField: 'autoBottom' + this.state.autoBottomDataField,
        text: 'Bottom (' + this.state.autoBottomDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Auto Cells',
        dataField: 'autoOuter' + this.state.autoOuterDataField,
        text: 'Outer (' + this.state.autoOuterDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Auto Cells',
        dataField: 'autoInner' + this.state.autoInnerDataField,
        text: 'Inner (' + this.state.autoInnerDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Baseline Cross',
        dataField: 'crossLine',
        text: 'Baseline Cross'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Baseline Cross',
        dataField: 'crossLinePercentage',
        text: 'Baseline Cross/Matches',
        sortValue: (cell, row) => row.crossLine / row.matchForms
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Teleop Cells',
        dataField: 'teleBottom' + this.state.teleBottomDataField,
        text: 'Bottom (' + this.state.teleBottomDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Teleop Cells',
        dataField: 'teleOuter' + this.state.teleOuterDataField,
        text: 'Outer (' + this.state.teleOuterDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Teleop Cells',
        dataField: 'teleInner' + this.state.teleInnerDataField,
        text: 'Inner (' + this.state.teleInnerDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Rotation Control',
        dataField: 'rotationControl',
        text: 'Rotation(s)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Rotation Control',
        dataField: 'rotationControlPercentage',
        text: 'Rotation(s)/Matches',
        sortValue: (cell, row) => row.rotationControl / row.matchForms
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Rotation Control',
        dataField: 'rotationTimer' + this.state.rotationTimerDataField,
        text: 'Timer (' + this.state.rotationTimerDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Position Control',
        dataField: 'positionControl',
        text: 'Position(s)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Position Control',
        dataField: 'positionControlPercentage',
        text: 'Position(s)/Matches',
        sortValue: (cell, row) => row.positionControl / row.matchForms
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Position Control',
        dataField: 'positionTimer' + this.state.positionTimerDataField,
        text: 'Timer (' + this.state.positionTimerDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Park',
        dataField: 'park',
        text: 'Park(s)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Park',
        dataField: 'parkPercentage',
        text: 'Park(s)/Matches',
        sortValue: (cell, row) => row.park / row.matchForms
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Climb',
        dataField: 'climb',
        text: 'Climb(s)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Climb',
        dataField: 'climbPercentage',
        text: 'Climb(s)/Matches',
        sortValue: (cell, row) => row.climb / row.matchForms
      },
      {
        headerStyle: {
          fontSize: '75%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Climb',
        dataField: 'climbTimer' + this.state.climbTimerDataField,
        text: 'Timer (' + this.state.climbTimerDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Climb',
        dataField: 'buddyClimb',
        text: 'Buddy Climb(s)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Level',
        dataField: 'level',
        text: 'Levels(s)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Level',
        dataField: 'levelPercentage',
        text: 'Levels(s)/Matches',
        sortValue: (cell, row) => row.level / row.matchForms
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Penalties',
        dataField: 'penalties',
        text: 'Penalties'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Penalties',
        dataField: 'yellowCards',
        text: 'Yellow Cards'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Penalties',
        dataField: 'redCards',
        text: 'Red Cards'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Break/Comm.',
        dataField: 'break',
        text: 'Break(s)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none',
          wordBreak: 'break-all'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Break/Comm.',
        dataField: 'communication',
        text: 'Communication'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Driving',
        dataField: 'totalDriving' + this.state.totalDrivingDataField,
        text: 'Total (' + this.state.totalDrivingDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Driving',
        dataField: 'speed' + this.state.speedDataField,
        text: 'Speed (' + this.state.speedDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Driving',
        dataField: 'agility' + this.state.agilityDataField,
        text: 'Agility (' + this.state.agilityDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Driving',
        dataField: 'counterDefense' + this.state.counterDefenseDataField,
        text: 'Counter Defense (' + this.state.counterDefenseDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Defense',
        dataField: 'totalDefense' + this.state.totalDefenseDataField,
        text: 'Total (' + this.state.totalDefenseDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Defense',
        dataField: 'pinningDefense' + this.state.pinningDefenseDataField,
        text: 'Pinning (' + this.state.pinningDefenseDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Defense',
        dataField: 'knockingDefense' + this.state.knockingDefenseDataField,
        text: 'Knocking (' + this.state.knockingDefenseDataField + ')'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        sortCaret: (order, column) => {
          return '';
        },
        sort: true,
        hidden: this.state.tableSection !== 'Defense',
        dataField: 'blockingDefense' + this.state.blockingDefenseDataField,
        text: 'Blocking (' + this.state.blockingDefenseDataField + ')'
      }
    ];

    let teamColumns = [
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'matchNum',
        text: 'Match #'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'scoutName',
        text: 'Scout Name'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'startingPosition',
        text: 'Starting Position'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'autoPowerCells',
        text: 'Cells Stored (Auto)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'crossLine',
        text: 'Baseline Cross'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'bottomAutoScore',
        text: 'Bottom (Auto)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'outerAutoScore',
        text: 'Outer (Auto)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'innerAutoScore',
        text: 'Inner (Auto)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'bottomTeleopScore',
        text: 'Bottom (Teleop)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'outerTeleopScore',
        text: 'Outer (Teleop)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'innerTeleopScore',
        text: 'Inner (Teleop)'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'rotationControl',
        text: 'Rotation Control'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'rotationTimer',
        text: 'Rotation Timer'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'positionControl',
        text: 'Position Control'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'positionTimer',
        text: 'Position Timer'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'park',
        text: 'Park'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'climb',
        text: 'Climb'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'endGameTimer',
        text: 'End Game Timer'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'level',
        text: 'Level'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'autoComments',
        text: 'Auto Comments'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'reflectionComments',
        text: 'Reflection Comments'
      }
    ];

    let driveColumns = [
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'matchNum',
        text: 'Match #'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'scoutName',
        text: 'Scout Name'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'speed',
        text: 'Speed'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'agility',
        text: 'Agility'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'counterDefense',
        text: 'Counter Defense'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'driveComment',
        text: 'Drive Comments'
      }
    ];

    let defenseColumns = [
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'matchNum',
        text: 'Match #'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'scoutName',
        text: 'Scout Name'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'pinningDefense',
        text: 'Pinning Defense'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'knockingDefense',
        text: 'Knocking Defense'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'blockingDefense',
        text: 'Blocking Defense'
      },
      {
        headerStyle: {
          fontSize: '100%',
          outline: 'none'
        },
        dataField: 'defenseComment',
        text: 'Defense Comments'
      }
    ];

    if (this.state.competition === '') {
      return null;
    }

    if (this.state.retrieved === '') {
      return null;
    } else if (this.state.retrieved === 'compInvalid') {
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
                onSelect={this.getData}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='lg'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.competition}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '3%' }}>
                  {competitionItems}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                value={this.state.teamNum}
                autoComplete='off'
                type='number'
                max={9999}
                min={1}
                placeholder='Team Number'
                onChange={this.handleTeamNum}
                className='mb-1'
                style={{
                  background: 'none',
                  fontFamily: 'Helvetica, Arial',
                  display: 'inline-block',
                  width: '50%'
                }}
                onKeyDown={this.checkKeyTeamGo}
              />
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  display: 'inline-block'
                }}
                onClick={this.handleTeamGo}
                className='btn-xs'
              >
                Go
              </Button>
            </div>
            <div>
              <Button
                size='xs'
                onClick={this.changeToMatchData}
                variant={
                  this.state.teamDataType === 'match'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginRight: '2%' }}
              >
                Match Data
              </Button>
              <Button
                size='xs'
                onClick={this.changeToPitData}
                variant={
                  this.state.teamDataType === 'pit'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginLeft: '2%' }}
              >
                Pit Data
              </Button>
            </div>
            <h1 className='pt-4'>
              That competition is not available in our database
            </h1>
          </div>
        </div>
      );
    } else if (this.state.retrieved === 'teamMatchInvalid') {
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
                onSelect={this.getData}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='lg'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.competition}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '3%' }}>
                  {competitionItems}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                value={this.state.teamNum}
                autoComplete='off'
                type='number'
                max={9999}
                min={1}
                placeholder='Team Number'
                onChange={this.handleTeamNum}
                className='mb-1'
                style={{
                  background: 'none',
                  fontFamily: 'Helvetica, Arial',
                  display: 'inline-block',
                  width: '50%'
                }}
                onKeyDown={this.checkKeyTeamGo}
              />
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  display: 'inline-block'
                }}
                onClick={this.handleTeamGo}
                className='btn-xs'
              >
                Go
              </Button>
            </div>
            <div>
              <Button
                size='xs'
                onClick={this.changeToMatchData}
                variant={
                  this.state.teamDataType === 'match'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginRight: '2%' }}
              >
                Match Data
              </Button>
              <Button
                size='xs'
                onClick={this.changeToPitData}
                variant={
                  this.state.teamDataType === 'pit'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginLeft: '2%' }}
              >
                Pit Data
              </Button>
            </div>
            <h1 className='pt-4'>No match data available</h1>
          </div>
        </div>
      );
    } else if (this.state.retrieved === 'teamPitInvalid') {
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
                onSelect={this.getData}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='lg'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.competition}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '3%' }}>
                  {competitionItems}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                value={this.state.teamNum}
                autoComplete='off'
                type='number'
                max={9999}
                min={1}
                placeholder='Team Number'
                onChange={this.handleTeamNum}
                className='mb-1'
                style={{
                  background: 'none',
                  fontFamily: 'Helvetica, Arial',
                  display: 'inline-block',
                  width: '50%'
                }}
                onKeyDown={this.checkKeyTeamGo}
              />
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  display: 'inline-block'
                }}
                onClick={this.handleTeamGo}
                className='btn-xs'
              >
                Go
              </Button>
            </div>
            <div>
              <Button
                size='xs'
                onClick={this.changeToMatchData}
                variant={
                  this.state.teamDataType === 'match'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginRight: '2%' }}
              >
                Match Data
              </Button>
              <Button
                size='xs'
                onClick={this.changeToPitData}
                variant={
                  this.state.teamDataType === 'pit'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginLeft: '2%' }}
              >
                Pit Data
              </Button>
            </div>
            <h1 className='pt-4'>No pit data available</h1>
          </div>
        </div>
      );
    } else if (this.state.retrieved === 'compValid') {
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
                onSelect={this.getData}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='lg'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.competition}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '3%' }}>
                  {competitionItems}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                value={this.state.teamNum}
                autoComplete='off'
                type='number'
                max={9999}
                min={1}
                placeholder='Team Number'
                onChange={this.handleTeamNum}
                className='mb-1'
                style={{
                  background: 'none',
                  fontFamily: 'Helvetica, Arial',
                  display: 'inline-block',
                  width: '50%'
                }}
                onKeyDown={this.checkKeyTeamGo}
              />
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  display: 'inline-block'
                }}
                onClick={this.handleTeamGo}
                className='btn-xs'
              >
                Go
              </Button>
            </div>
            <div style={{ textAlign: 'middle', marginBottom: '3%' }}>
              <Dropdown
                style={{ display: 'inline-block' }}
                focusFirstItemOnShow={false}
                onSelect={this.changeTable}
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
                  {this.state.tableSection}
                </Dropdown.Toggle>
                <Dropdown.Menu>{tableSectionItems}</Dropdown.Menu>
              </Dropdown>
            </div>
            {this.state.tableSection === 'Auto Cells' ? (
              <React.Fragment>
                <Dropdown
                  style={{ display: 'inline-block' }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeAutoBottomColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.autoBottomDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeAutoOuterColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.autoOuterDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{ display: 'inline-block' }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeAutoInnerColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.autoInnerDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
              </React.Fragment>
            ) : null}
            {this.state.tableSection === 'Teleop Cells' ? (
              <React.Fragment>
                <Dropdown
                  style={{ display: 'inline-block' }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeTeleBottomColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.teleBottomDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeTeleOuterColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.teleOuterDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{ display: 'inline-block' }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeTeleInnerColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.teleInnerDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
              </React.Fragment>
            ) : null}
            {this.state.tableSection === 'Rotation Control' ? (
              <Dropdown
                style={{ display: 'inline-block' }}
                focusFirstItemOnShow={false}
                onSelect={this.changeRotationTimerColumn}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='sm'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.rotationTimerDataField}
                </Dropdown.Toggle>
                <Dropdown.Menu>{tableColumnSpecificsMin}</Dropdown.Menu>
              </Dropdown>
            ) : null}
            {this.state.tableSection === 'Position Control' ? (
              <Dropdown
                style={{ display: 'inline-block' }}
                focusFirstItemOnShow={false}
                onSelect={this.changePositionTimerColumn}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='sm'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.positionTimerDataField}
                </Dropdown.Toggle>
                <Dropdown.Menu>{tableColumnSpecificsMin}</Dropdown.Menu>
              </Dropdown>
            ) : null}
            {this.state.tableSection === 'Climb' ? (
              <Dropdown
                style={{ display: 'inline-block' }}
                focusFirstItemOnShow={false}
                onSelect={this.changeClimbTimerColumn}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='sm'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.climbTimerDataField}
                </Dropdown.Toggle>
                <Dropdown.Menu>{tableColumnSpecificsMin}</Dropdown.Menu>
              </Dropdown>
            ) : null}
            {this.state.tableSection === 'Driving' ? (
              <React.Fragment>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeTotalDrivingColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.totalDrivingDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeSpeedColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.speedDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeAgilityColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.agilityDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeCounterDefenseColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.counterDefenseDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
              </React.Fragment>
            ) : null}
            {this.state.tableSection === 'Defense' ? (
              <React.Fragment>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeTotalDefenseColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.totalDefenseDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changePinningDefenseColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.pinningDefenseDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeKnockingDefenseColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.knockingDefenseDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{
                    display: 'inline-block',
                    marginLeft: '3%',
                    marginRight: '3%'
                  }}
                  focusFirstItemOnShow={false}
                  onSelect={this.changeBlockingDefenseColumn}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='sm'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.blockingDefenseDataField}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{tableColumnSpecifics}</Dropdown.Menu>
                </Dropdown>
              </React.Fragment>
            ) : null}
          </div>
          <div style={{ width: '100%', overflow: 'auto' }}>
            <div
              style={{ minWidth: '100%', width: '200%', maxWidth: '2000px' }}
            >
              <BootstrapTable
                striped
                hover
                keyField='teamNum'
                //rowStyle={this.state.style}
                bordered
                bootstrap4
                // defaultSorted={defaultSorted}
                data={this.state.filteredCompetitionData}
                columns={compColumns}
                filter={filterFactory()}
              />
            </div>
          </div>
        </div>
      );
    } else if (this.state.retrieved === 'teamMatchValid') {
      return (
        <React.Fragment>
          <div className='div-main'>
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
                  onSelect={this.getData}
                >
                  <Dropdown.Toggle
                    style={{
                      fontFamily: 'Helvetica, Arial',
                      textAlign: 'center'
                    }}
                    size='lg'
                    variant='success'
                    id='dropdown-basic'
                  >
                    {this.state.competition}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ minWidth: '3%' }}>
                    {competitionItems}
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  value={this.state.teamNum}
                  autoComplete='off'
                  type='number'
                  max={9999}
                  min={1}
                  placeholder='Team Number'
                  onChange={this.handleTeamNum}
                  className='mb-1'
                  style={{
                    background: 'none',
                    fontFamily: 'Helvetica, Arial',
                    display: 'inline-block',
                    width: '50%'
                  }}
                  onKeyDown={this.checkKeyTeamGo}
                />
                <Button
                  variant='success'
                  type='btn'
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                    border: '1px solid black',
                    marginLeft: '4%',
                    display: 'inline-block'
                  }}
                  onClick={this.handleTeamGo}
                  className='btn-xs'
                >
                  Go
                </Button>
              </div>
              <div>
                <Button
                  size='xs'
                  onClick={this.changeToMatchData}
                  variant={
                    this.state.teamDataType === 'match'
                      ? 'success'
                      : 'outline-success'
                  }
                  style={{ display: 'inline-block', marginRight: '2%' }}
                >
                  Match Data
                </Button>
                <Button
                  size='xs'
                  onClick={this.changeToPitData}
                  variant={
                    this.state.teamDataType === 'pit'
                      ? 'success'
                      : 'outline-success'
                  }
                  style={{ display: 'inline-block', marginLeft: '2%' }}
                >
                  Pit Data
                </Button>
              </div>
            </div>
            {this.state.graphData.length > 0 ? (
              this.state.widthSize === '90%' ? (
                <div className='graph-holder'>
                  <div className='graph-wrap'>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '15%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Auto - Bottom Cells'
                          dataKey={'bottomAutoScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'bottomAutoScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '15%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Teleop - Bottom Cells'
                          dataKey={'bottomTeleopScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'bottomTeleopScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '15%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Auto - Outer Cells'
                          dataKey={'outerAutoScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'outerAutoScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '15%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Teleop - Outer Cells'
                          dataKey={'outerTeleopScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'outerTeleopScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '15%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Auto - Inner Cells'
                          dataKey={'innerAutoScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'innerAutoScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '15%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Teleop - Inner Cells'
                          dataKey={'innerTeleopScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'innerTeleopScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <div>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '90%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Auto - Bottom Cells'
                          dataKey={'bottomAutoScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'bottomAutoScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '90%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Teleop - Bottom Cells'
                          dataKey={'bottomTeleopScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'bottomTeleopScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '90%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Auto - Outer Cells'
                          dataKey={'outerAutoScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'outerAutoScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '90%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Teleop - Outer Cells'
                          dataKey={'outerTeleopScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'outerTeleopScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '90%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Auto - Inner Cells'
                          dataKey={'innerAutoScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'innerAutoScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer
                      width={this.state.widthSize === '90%' ? '90%' : '50%'}
                      height={300}
                    >
                      <BarChart data={this.state.graphData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='matchNum'></XAxis>
                        <YAxis padding={{ top: 25 }} />
                        <Legend verticalAlign='top' height={36} iconSize={0} />
                        <Bar
                          name='Teleop - Inner Cells'
                          dataKey={'innerTeleopScore'}
                          fill='#28a745'
                        >
                          <LabelList
                            dataKey={'innerTeleopScore'}
                            position='insideTop'
                            offset={-20}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </React.Fragment>
              )
            ) : null}
          </div>
          <div className='table-holder'>
            <div className='table-wrap'>
              <BootstrapTable
                striped
                hover
                keyField='matchNum'
                //rowStyle={this.state.style}
                bordered
                bootstrap4
                // defaultSorted={defaultSorted}
                data={this.state.matchData}
                columns={teamColumns}
              />
            </div>
          </div>
          <div
            style={{ height: '50px', backgroundColor: 'rgb(230, 243, 227)' }}
          ></div>
          <div
            style={{
              width: '100%',
              overflow: 'auto',
              backgroundColor: 'rgb(230, 243, 227)'
            }}
          >
            <div
              style={{ minWidth: '100%', width: '200%', maxWidth: '2000px' }}
            >
              <BootstrapTable
                striped
                hover
                keyField='matchNum'
                //rowStyle={this.state.style}
                bordered
                bootstrap4
                // defaultSorted={defaultSorted}
                data={this.state.driveData}
                columns={driveColumns}
              />
            </div>
          </div>
          <div
            style={{ height: '50px', backgroundColor: 'rgb(230, 243, 227)' }}
          ></div>
          <div
            style={{
              width: '100%',
              overflow: 'auto',
              backgroundColor: 'rgb(230, 243, 227)'
            }}
          >
            <div
              style={{ minWidth: '100%', width: '200%', maxWidth: '2000px' }}
            >
              <BootstrapTable
                striped
                hover
                keyField='matchNum'
                //rowStyle={this.state.style}
                bordered
                bootstrap4
                // defaultSorted={defaultSorted}
                data={this.state.defenseData}
                columns={defenseColumns}
              />
            </div>
          </div>
        </React.Fragment>
      );
    } else if (this.state.retrieved === 'teamPitValid') {
      return (
        <div className='div-main'>
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
                onSelect={this.getData}
              >
                <Dropdown.Toggle
                  style={{
                    fontFamily: 'Helvetica, Arial',
                    textAlign: 'center'
                  }}
                  size='lg'
                  variant='success'
                  id='dropdown-basic'
                >
                  {this.state.competition}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '3%' }}>
                  {competitionItems}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                value={this.state.teamNum}
                autoComplete='off'
                type='number'
                max={9999}
                min={1}
                placeholder='Team Number'
                onChange={this.handleTeamNum}
                className='mb-1'
                style={{
                  background: 'none',
                  fontFamily: 'Helvetica, Arial',
                  display: 'inline-block',
                  width: '50%'
                }}
                onKeyDown={this.checkKeyTeamGo}
              />
              <Button
                variant='success'
                type='btn'
                style={{
                  fontFamily: 'Helvetica, Arial',
                  boxShadow: '-3px 3px black, -2px 2px black, -1px 1px black',
                  border: '1px solid black',
                  marginLeft: '4%',
                  display: 'inline-block'
                }}
                onClick={this.handleTeamGo}
                className='btn-xs'
              >
                Go
              </Button>
            </div>
            <div>
              <Button
                size='xs'
                onClick={this.changeToMatchData}
                variant={
                  this.state.teamDataType === 'match'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginRight: '2%' }}
              >
                Match Data
              </Button>
              <Button
                size='xs'
                onClick={this.changeToPitData}
                variant={
                  this.state.teamDataType === 'pit'
                    ? 'success'
                    : 'outline-success'
                }
                style={{ display: 'inline-block', marginLeft: '2%' }}
              >
                Pit Data
              </Button>
            </div>
            <div
              className='div-form'
              style={{ textAlign: 'center', marginTop: '20px' }}
            >
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Group: ' + this.state.pitData.groupName}
              </p>
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Weight: ' + this.state.pitData.weight + ' lbs'}
              </p>
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Height: ' + this.state.pitData.height + ' inches'}
              </p>
            </div>
            <div
              className='div-form'
              style={{ textAlign: 'center', marginTop: '20px' }}
            >
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Drive Train: ' + this.state.pitData.driveTrain}
              </p>
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Motors: ' + this.state.pitData.motors}
              </p>
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Wheels: ' + this.state.pitData.wheels}
              </p>
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '100%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Drive Comments: ' +
                  (this.state.pitData.driveComments === ''
                    ? 'No comments'
                    : this.state.pitData.driveComments)}
              </p>
            </div>
            <div
              className='div-form'
              style={{ textAlign: 'center', marginTop: '20px' }}
            >
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Code Language: ' + this.state.pitData.codeLanguage}
              </p>
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Starting Position (Pref.): ' +
                  this.state.pitData.startingPosition}
              </p>
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '100%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Auto Comments: ' +
                  (this.state.pitData.autoComments === ''
                    ? 'No comments'
                    : this.state.pitData.autoComments)}
              </p>
            </div>
            <div
              className='div-form'
              style={{ textAlign: 'center', marginTop: '20px' }}
            >
              <p
                style={{
                  fontSize: '150%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                Abilities:
              </p>
              <ul>
                {this.state.pitData.abilities.map(ability =>
                  ability.value ? (
                    <li
                      key={ability.id}
                      style={{
                        fontFamily: 'Helvetica, Arial',
                        textAlign: 'left'
                      }}
                    >
                      {ability.label}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
            <div
              className='div-form'
              style={{ textAlign: 'center', marginTop: '20px' }}
            >
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '100%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Working On Comments: ' +
                  (this.state.pitData.workingOnComments === ''
                    ? 'No comments'
                    : this.state.pitData.workingOnComments)}
              </p>
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '100%',
                  fontFamily: 'Helvetica, Arial'
                }}
              >
                {'Closing Comments: ' +
                  (this.state.pitData.closingComments === ''
                    ? 'No comments'
                    : this.state.pitData.closingComments)}
              </p>
            </div>
            {this.state.pitData.image === null ? (
              <p>No Image</p>
            ) : (
              <ImagePreview
                dataUri={this.state.pitData.image}
                isFullscreen={false}
              />
            )}
          </div>
        </div>
      );
    }
  }
}

export default Data;
