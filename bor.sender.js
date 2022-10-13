const axios = require("axios");
const config = require("../config/config");
const dataValuesSender = require("./dataValuesSender");

const getToken = async () => {
  return axios({
    method: "post",
    url: `${config.BOR.URL}/login`,
    data: {
      userName: config.BOR.USERNAME,
      password: config.BOR.PASSWORD,
    },
  })
    .then((res) => {
      return res.data.data.access_token;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getBor = async (token, year, page = 1, limit = 1000) => {
  return axios({
    method: "get",
    url: `${config.BOR.URL}/rlsatutitikdua`,
    params: {
      page,
      limit,
      tahun: year,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if ("status" in res.data) {
        if (res.data.status) {
          return res.data;
        }
      }
      return null;
    })
    .catch((err) => {
      console.log(err);
    });
};

const dataCacthcer = async (token, year, page = 1) => {
  const result = [];
  const data = await getBor(token, year, page);
  if (data) {
    result.push(...data.data);
    const pagination = data.pagination;
    if (page < pagination.total_number_of_pages) {
      const dataNext = await dataCacthcer(token, year, pagination.next.page);
      result.push(...dataNext);
    }
  }
  return result;
};

const borParser = async (year) => {
  const token = await getToken();
  const borData = await dataCacthcer(token, year);
  const dataValues = [];

  if (borData.length > 0) {
    await Promise.all(
      borData.map(async (data) => {
        dataValues.push({
          dataElement: "S0YoTtxUotq",
          period: year,
          orgUnit: data.koders,
          value: data.bor,
        });
      })
    );
  }

  return dataValues;
};

const sendBor = async (year) => {
  const data = await borParser(year);
  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 100) {
      const temp = data.slice(i, i + 100);
      await dataValuesSender(
        {
          dataValues: temp,
        },
        true
      );
    }
  }
};

module.exports = sendBor;
