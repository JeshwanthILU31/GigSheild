const FALLBACK_WEATHER_DATA = {
  rainfall: 12,
  temperature: 34,
  aqi: 120
};

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const AIR_POLLUTION_BASE_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
const OPENWEATHERMAP_COUNTRY_CODE = 'IN';

const getAxiosClient = () => {
  try {
    return require('axios');
  } catch (error) {
    return null;
  }
};

const getRainfallAmount = (weatherPayload) => {
  if (weatherPayload?.rain?.['1h'] != null) {
    return Number(weatherPayload.rain['1h']);
  }

  if (weatherPayload?.rain?.['3h'] != null) {
    return Number(weatherPayload.rain['3h']);
  }

  return 0;
};

const getTemperatureValue = (weatherPayload) => {
  return Number(weatherPayload?.main?.temp ?? FALLBACK_WEATHER_DATA.temperature);
};

const getAqiValue = (airPollutionPayload) => {
  return Number(airPollutionPayload?.list?.[0]?.main?.aqi ?? FALLBACK_WEATHER_DATA.aqi);
};

const getWeatherData = async (pinCode) => {
  const axios = getAxiosClient();
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!axios || !apiKey || !pinCode) {
    return FALLBACK_WEATHER_DATA;
  }

  try {
    const weatherResponse = await axios.get(WEATHER_BASE_URL, {
      params: {
        zip: `${pinCode},${OPENWEATHERMAP_COUNTRY_CODE}`,
        appid: apiKey,
        units: 'metric'
      },
      timeout: 5000
    });

    const rainfall = getRainfallAmount(weatherResponse.data);
    const temperature = getTemperatureValue(weatherResponse.data);
    const latitude = weatherResponse?.data?.coord?.lat;
    const longitude = weatherResponse?.data?.coord?.lon;

    let aqi = FALLBACK_WEATHER_DATA.aqi;

    if (latitude != null && longitude != null) {
      const airPollutionResponse = await axios.get(AIR_POLLUTION_BASE_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: apiKey
        },
        timeout: 5000
      });

      aqi = getAqiValue(airPollutionResponse.data);
    }

    return {
      rainfall,
      temperature,
      aqi
    };
  } catch (error) {
    return FALLBACK_WEATHER_DATA;
  }
};

module.exports = {
  getWeatherData
};
