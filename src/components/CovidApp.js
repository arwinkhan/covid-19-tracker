import React, { Component } from "react";
import Overview from "./Overview";
import { withStyles } from "@material-ui/styles";
import colors from "../constants/colors";
import Charts from "./Charts";
import DisplayTable from "./DisplayTable";
import styles from "../styles/CovidAppStyles";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/DarkModeButton.css";
import MapSection from "./MapSection";
import Barchart from "./Barchart";
import stateCodes from "../constants/stateCodes";

class CovidApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      todayData: {},
      isLoading: false,
      mapData: [],
      tableData: [],
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatData = this.formatData.bind(this);
    this.findId = this.findId.bind(this);
    this.handleFormat = this.handleFormat.bind(this);
    this.tableData = this.tableData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ isLoading: !this.state.isLoading });
    const countryData = axios.get("https://api.covid19india.org/data.json");
    const districtLevel = axios.get(
      "https://api.covid19india.org/v2/state_district_wise.json"
    );
    const stateChanges = axios.get(
      "https://api.covid19india.org/states_daily.json"
    );
    const response = await axios.get(
      "https://api.rootnet.in/covid19-in/stats/history"
    );

    axios.all([countryData, districtLevel, stateChanges]).then(
      axios.spread((...responses) => {
        const countryData = responses[0].data;
        const districtLevel = responses[1].data;
        const stateChanges = responses[2].data;
        // console.log(districtLevel);

        const [todayData] = countryData.cases_time_series.slice(-1);

        const data = countryData.statewise.slice(1, -1);

        this.setState(
          { data: data, todayData: todayData, isLoading: false },
          this.handleFormat
        );
      })
    );

    // this.setState(
    //   (st) => ({
    //     data: response.data.data,
    //     isLoading: !st.isLoading,
    //   }),
    //   this.handleFormat
    // );
  }

  // active: "22569";
  // confirmed: "31324";
  // deaths: "1008";
  // deltaconfirmed: "1866";
  // deltadeaths: "69";
  // deltarecovered: "610";
  // lastupdatedtime: "29/04/2020 02:50:45";
  // recovered: "7747";
  // state: "Total";
  // statecode: "TT";
  // statenotes: "";

  formatData(data) {
    const formatedData = data.map((state, i) => {
      return {
        id: this.findId(state.state),
        state: state.state.replace(" and ", " & "),
        value: state.confirmed,
      };
    });
    return formatedData;
  }

  findId(location) {
    for (let [key, value] of Object.entries(stateCodes)) {
      if (location === key) {
        return value;
      }
    }
  }

  tableData(data) {
    const newArr = data
      .slice(-1)
      .map((data) => data.regional)
      .flat();
    const newData = newArr.map((region, i) => {
      return {
        id: region.loc,
        name: region.loc,
        deaths: region.deaths,
        discharged: region.discharged,
        confirmed: region.totalConfirmed,
        active: region.totalConfirmed - (region.discharged + region.deaths),
      };
    });
    return newData;
  }

  handleFormat() {
    const newdata = this.formatData(this.state.data);
    // const tableData = this.tableData(this.state.data);
    // this.setState({ mapData: newdata, tableData: tableData });
    this.setState({ mapData: newdata });
  }

  render() {
    const { classes, setDarkMode, isDarkMode } = this.props;
    const { mapData, tableData, isLoading, data } = this.state;

    if (isLoading) {
      return (
        <div className={classes.loadingIcon}>
          <FontAwesomeIcon icon={faSyncAlt} className={classes.refreshIcon} />
        </div>
      );
    }

    return (
      <>
        <div className={classes.header}>
          <h1 className={classes.heading}>
            <span>Covid-19</span> India Trend
          </h1>
          <div className={classes.btnBox}>
            <FontAwesomeIcon
              icon={faSyncAlt}
              className={classes.button}
              onClick={this.fetchData}
            />
          </div>
          <div className="darkModeButton">
            <label className="switch">
              <input
                type="checkbox"
                onChange={setDarkMode}
                checked={isDarkMode}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <Overview
          isDarkMode={isDarkMode}
          data={this.state.todayData}
          loadingStatus={this.loadingStatus}
        />
        <div className={classes.content}>
          <div className={classes.contentArea}>
            <div className={classes.mapArea}>
              <MapSection
                data={data}
                mapData={mapData}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
          {/* <div className={classes.chartArea}>
            <Charts data={this.state.data} isLoading={this.state.isLoading} />
            <div className={classes.tinyChartArea}>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: "rgba(249, 52, 94,.1)" }}
                >
                  <h3 style={{ color: colors.red }}>confirmed</h3>
                  <Barchart
                    data={this.state.data}
                    isLoading={this.state.isLoading}
                    dataKey="confirmed"
                    stroke={colors.red}
                  />
                </div>
              </div>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: "rgba(250, 100, 0,.1)" }}
                >
                  <h3 style={{ color: colors.orange }}>active</h3>
                  <Barchart
                    data={this.state.data}
                    isLoading={this.state.isLoading}
                    dataKey="active"
                    stroke={colors.orange}
                  />
                </div>
              </div>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: "rgba(28, 177, 66,.1)" }}
                >
                  <h3 style={{ color: colors.green }}>Recovered</h3>
                  <Barchart
                    data={this.state.data}
                    isLoading={this.state.isLoading}
                    dataKey="discharged"
                    stroke={colors.green}
                  />
                </div>
              </div>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: "rgba(98, 54, 255,.1)" }}
                >
                  <h3 style={{ color: colors.purple }}>Deceased</h3>
                  <Barchart
                    data={this.state.data}
                    isLoading={this.state.isLoading}
                    dataKey="deaths"
                    stroke={colors.purple}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.tableContainer}>
            <h2 className={classes.tableHeading}>
              State/UT Wise Data (Sortable){" "}
            </h2>
            <DisplayTable tableData={tableData} isDarkMode={isDarkMode} />
          </div> */}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(CovidApp);
