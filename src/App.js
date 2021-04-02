import react, { useEffect, useState } from 'react'
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import './App.css';
import Table from './Table';
import { sortData } from './utils';
import LineGraph from "./LineGraph";
function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(['Worldwide']);
  const [countryInfo, setCountryInfo] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          let sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
        })
    }
    getCountriesData();
  }, [])      // if the condition is set to empty array, this will fire the code only once 
  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/all`)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, [])
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    
    const url = countryCode === 'Worldwide' ? `https://disease.sh/v3/covid-19/all` : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  }
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox onClick={(e) => setCasesType("cases")} isRed active={casesType === "cases"} title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
          <InfoBox onClick={(e) => setCasesType("recovered")} active={casesType === "recovered"} title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
          <InfoBox onClick={(e) => setCasesType("deaths")} isRed active={casesType === "deaths"} title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
        </div>
        <div className="graph">
          <h2>Worldwide new {casesType}</h2>
          <LineGraph casesType={casesType} />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
