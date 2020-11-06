import { Circle, Popup } from "react-leaflet";

import React from "react";
import numeral from "numeral";

export const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};

export const statsInfo = [
  {
    name: "cases",
    title: "Coronovirus cases",
  },
  {
    name: "recovered",
    title: "Recovered",
  },
  {
    name: "deaths",
    title: "Deaths",
  },
];

export const upperCaseFirst = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const sortData = (data) =>
  [...data].sort((a, b) => (a.cases > b.cases ? -1 : 1));

export const prettyPrint = ({ text, format = "0.0a", ...args }) => {
  const prefix = args["prefix"] ? args["prefix"] : "";
  return text ? `${prefix}${numeral(text).format(format)}` : "None Detected";
};
//circle drowing
export const showDataOnMap = (data, casesType = "cases") => {
  //draw biggest first
  const tempData = data.sort((a, b) => (a[casesType] > b[casesType] ? -1 : 1));
  return tempData.map((country) => {
    return (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup>
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            />
            <div className="info-text">
              <div className="info-name">{country.country}</div>
              <div className="info-confirmed">
                Cases: {numeral(country.cases).format("0,0")}
              </div>
              <div className="info-recovered">
                Recovered: {numeral(country.recovered).format("0,0")}
              </div>
              <div className="info-deaths">
                Deaths: {numeral(country.deaths).format("0,0")}
              </div>
            </div>
          </div>
        </Popup>
      </Circle>
    );
  });
};
