import React, { Component } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import colors from "../constants/colors";
import "../styles/Charts.css";

export default class Charts extends Component {
  render() {
    const { data } = this.props;
    let result;
    try {
      const updatedData = data.slice(1).slice(-50);
      result = updatedData.map((dataItem) => {
        let newObject = {};
        for (let [key, value] of Object.entries(dataItem)) {
          if (key === "date") {
            newObject[key] = value;
          } else {
            newObject[key] = Number(value);
          }
        }
        return {
          ...newObject,
          totalactive:
            newObject.totalconfirmed -
            (newObject.totalrecovered + newObject.totaldeceased),
        };
      });
    } catch (err) {}

    return (
      <div className="charts">
        <ResponsiveContainer>
          <LineChart
            width={600}
            height={300}
            data={result}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend
              wrapperStyle={{
                margin: "-3rem 1rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="totalconfirmed"
              stroke={colors.red}
              dot={false}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="totalactive"
              stroke={colors.orange}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totalrecovered"
              stroke={colors.green}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totaldeceased"
              stroke={colors.purple}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
