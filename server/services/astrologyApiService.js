import axios from 'axios';

const BASE_URL = process.env.ASTROLOGY_API_BASE_URL || 'https://json.astrologyapi.com/v1';
const API_KEY = process.env.ASTROLOGY_API_KEY;

// Create auth header
const getAuthHeader = () => ({
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
});

// Build birth details payload
const buildBirthPayload = (birthDetail) => {
  const dob = new Date(birthDetail.dateOfBirth);
  const [hour, min] = (birthDetail.timeOfBirth || '12:00').split(':').map(Number);

  return {
    day: dob.getDate(),
    month: dob.getMonth() + 1,
    year: dob.getFullYear(),
    hour: hour || 12,
    min: min || 0,
    lat: birthDetail.latitude,
    lon: birthDetail.longitude,
    tzone: birthDetail.timezone || 0,
  };
};

// Get Sun Sign
export const getSunSign = async (birthDetail) => {
  try {
    const payload = buildBirthPayload(birthDetail);
    const res = await axios.post(`${BASE_URL}/sun_sign/`, payload, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Sun Sign API error:', err.response?.data || err.message);
    return null;
  }
};

// Get Moon Sign
export const getMoonSign = async (birthDetail) => {
  try {
    const payload = buildBirthPayload(birthDetail);
    const res = await axios.post(`${BASE_URL}/moon_sign/`, payload, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Moon Sign API error:', err.response?.data || err.message);
    return null;
  }
};

// Get Ascendant
export const getAscendant = async (birthDetail) => {
  try {
    const payload = buildBirthPayload(birthDetail);
    const res = await axios.post(`${BASE_URL}/ascendant/`, payload, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Ascendant API error:', err.response?.data || err.message);
    return null;
  }
};

// Get Birth Chart
export const getBirthChart = async (birthDetail) => {
  try {
    const payload = buildBirthPayload(birthDetail);
    const res = await axios.post(`${BASE_URL}/planets/`, payload, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Birth Chart API error:', err.response?.data || err.message);
    return null;
  }
};

// Get Daily Horoscope
export const getDailyHoroscope = async (sign) => {
  try {
    const res = await axios.get(`${BASE_URL}/sun_sign_prediction/daily/${sign.toLowerCase()}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error('Daily Horoscope API error:', err.response?.data || err.message);
    return null;
  }
};

// Get Monthly Horoscope
export const getMonthlyHoroscope = async (sign) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/sun_sign_prediction/monthly/${sign.toLowerCase()}`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    console.error('Monthly Horoscope API error:', err.response?.data || err.message);
    return null;
  }
};

// Get Yearly Horoscope
export const getYearlyHoroscope = async (sign, year) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/sun_sign_prediction/yearly/${year}/${sign.toLowerCase()}`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    console.error('Yearly Horoscope API error:', err.response?.data || err.message);
    return null;
  }
};
