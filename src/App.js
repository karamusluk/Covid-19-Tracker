import "./App.css";
import "leaflet/dist/leaflet.css";

import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import { sortData, statsInfo, upperCaseFirst } from "./utils";
import { useEffect, useState } from "react";

import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Table from "./Table";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 38.963745,
    lng: 35.243322,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const callUrl = `https://disease.sh/v3/covid-19/all`;
    fetch(callUrl)
      .then((resp) => resp.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data
            .filter((country) => {
              return country.countryInfo.iso2 !== "TR";
            })
            .map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2,
            }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const endPoint =
      countryCode === "worldwide" ? "all" : `countries/${countryCode}`;
    const callUrl = `https://disease.sh/v3/covid-19/${endPoint}`;

    await fetch(callUrl)
      .then((resp) => resp.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="TR">Turkey</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {statsInfo.map((stat) => {
            console.log(countryInfo[`today${upperCaseFirst(stat.name)}`]);
            return (
              <InfoBox
                type={stat.name}
                casesType={casesType}
                active={casesType === stat.name}
                onClick={(e) => setCasesType(stat.name)}
                title={stat.title}
                cases={countryInfo[`today${upperCaseFirst(stat.name)}`]}
                total={countryInfo[stat.name]}
              />
            );
          })}
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {upperCaseFirst(casesType)}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
