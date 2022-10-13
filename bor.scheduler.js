const schedule = require("node-schedule");
const moment = require("moment");
const sendBor = require("./bor.sender");
const config = require("../config/config");

console.log("ASDK [BOR] sync running...");
const startYear = parseInt(config.BOR.START_YEAR);
const lastYear = parseInt(moment().format("YYYY"));
const rangeYear = lastYear - startYear;

const rule = new schedule.RecurrenceRule();
rule.second = 30;

schedule.scheduleJob(rule, async () => {
  for (let i = 0; i < rangeYear; i++) {
    const year = startYear + i;
    await sendBor(year);
    console.log(
      `[BOR]\nsendAt\t: ${moment().format(
        "YYYY-MM-DD HH:mm:ss.SSS"
      )}\nyear\t: ${year}`
    );
  }
});
