const axios = require("axios");
const token = require("./tokenGenerator");
const config = require("../../../config/config");

const payload = (data, orgUnitByCode) => {
  let params = {};
  if (orgUnitByCode) {
    params = {
      orgUnitIdScheme: "code",
    };
  }
  return {
    method: "post",
    url: `${config.DHIS_URL}/api/dataValueSets`,
    params,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    data,
  };
};

const dataValuesSender = async (data, orgUnitByCode = false) => {
  return axios(payload(data, orgUnitByCode))
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = dataValuesSender;
