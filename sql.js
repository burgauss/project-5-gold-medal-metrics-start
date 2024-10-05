var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  let createCountryTable = `CREATE TABLE Country (
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  gdp INTEGER,
  population INTEGER);`
  return createCountryTable;
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  let createGoldMedalTable = `CREATE TABLE GoldMedal (
    id INTEGER PRIMARY KEY NOT NULL,
    year INTEGER NOT NULL,
    city TEXT NOT NULL,
    season TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    gender TEXT NOT NULL,
    sport TEXT NOT NULL,
    discipline TEXT NOT NULL,
    event TEXT NOT NULL);`
  return createGoldMedalTable;
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = country => {
    let querygoldMedalNumber= `SELECT COUNT(*) AS count
    FROM goldMedal
    WHERE country = "${country}";`
    // console.log("queryGoldMedalNumber: "+querygoldMedalNumber);
    return querygoldMedalNumber;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = country => {
  let queryMostSummerWins = `WITH medalCount AS (
SELECT year, country, COUNT(*) AS medalCount
FROM goldmedal
WHERE country="${country}" AND Season="Summer"
GROUP BY year, country
) SELECT year, MAX(medalCount) AS count
FROM medalCount;`
  return queryMostSummerWins;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
  let queryMostWinterWins = `WITH medalCount AS (
    SELECT year, country, COUNT(*) AS medalCount
    FROM goldmedal
    WHERE country="${country}" AND Season="Winter"
    GROUP BY year, country
    ) SELECT year, MAX(medalCount) AS count
    FROM medalCount;`
      return queryMostWinterWins;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestYear = country => {
  let queryBestYear = `WITH medalCount AS (
    SELECT year, country, COUNT(*) AS medalCount
    FROM goldmedal
    WHERE country="${country}"
    GROUP BY year, country
    ) SELECT year, MAX(medalCount) AS count
    FROM medalCount;`
      return queryBestYear;
};

/*
Returns a SQL query string that will find the discipline this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
  let queryBestDiscipline = `WITH medalCountPerDiscipline AS(
SELECT year, country ,discipline, COUNT(*) AS medalCount
FROM goldmedal
WHERE Country="${country}"
GROUP BY year, Country, Discipline)
SELECT Discipline, MAX(medalCount) AS count
FROM medalCountPerDiscipline;`
  return queryBestDiscipline;
};

/*
Returns a SQL query string that will find the sport this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
  let queryBestSport = `WITH medalCountPerSport AS(
    SELECT year, Country ,sport, COUNT(*) AS medalCount
    FROM goldmedal
    WHERE country="${country}"
    GROUP BY year, country, Sport)
    SELECT sport, MAX(medalCount) AS count
    FROM medalCountPerSport;`
      return queryBestSport;
};

/*
Returns a SQL query string that will find the event this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  let queryBestEvent = `WITH medalCountPerEvent AS(
    SELECT year, Country ,event, COUNT(*) AS medalCount
    FROM goldmedal
    WHERE Country="${country}"
    GROUP BY year, country, event)
    SELECT event, MAX(medalCount) AS count
    FROM medalCountPerEvent;`
      return queryBestEvent;
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const numberMenMedalists = country => {
  let queryNumberMenMedalist = `SELECT COUNT(DISTINCT name)
  FROM goldmedal
  WHERE Gender = "Men" AND Country = "${country}";`
  return queryNumberMenMedalist;
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  let queryNumberWomenMedalist = `SELECT COUNT(DISTINCT name)
  FROM goldMedal
  WHERE gender = "Women" AND country = "${country}";`
  return queryNumberWomenMedalist;
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
  let queryMostMedaledAthlete = `WITH medalCountPerAthlete AS (SELECT name, COUNT(*) AS countMedal
    FROM goldMedal
    WHERE country="${country}"
    GROUP BY name)
    SELECT name, MAX(countMedal)
    FROM medalCountPerAthlete`
  return queryMostMedaledAthlete;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
  let queryOrderedMedals = `SELECT * FROM goldMedal WHERE country="${country}" `
  if (field && sortAscending !== null){
      queryOrderedMedals += `ORDER BY ${field} `
      queryOrderedMedals += sortAscending ? `ASC` : `DESC`;
  }
  return queryOrderedMedals;
};

/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  let queryOrderedSport = `SELECT sport, COUNT(*) AS count, (COUNT(*) * 100.0 / (SELECT COUNT(*) 
  FROM goldMedal WHERE Country="${country}")) AS percent
  FROM goldMedal
  WHERE Country ="${country}"
  GROUP BY sport `
  if (field && sortAscending !== null){
    queryOrderedSport += `ORDER BY ${field} `
    queryOrderedSport += sortAscending ? `ASC` : `DESC`;
  }
  // console.log(queryOrderedSport);
  return queryOrderedSport;
};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
