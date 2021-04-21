const { DateTime } = require('luxon');


module.exports = class ServiceTime {
    constructor(arg) {
        if (arg instanceof DateTime) {
            this.date = arg;
        }
        else if (arg instanceof Date) {
            this.date = new newDateFromISO(arg.toISOString());
        }
        else if (arg) {
            this.date = newDateFromISO(arg);
        }
        else {
            this.date = newToday();
        }
    }
    toString() {
        return this.date.toISO();
    }
    toJSDate() {
        return new Date(this.toString());
    }
    isSame(date) {
        return equal(this, date);
    }
}


// Date functions
function equal(dt1, dt2) {
    return +dt1 === +dt2;
}

function setServiceZone(date_time) {
    return date_time.setZone('Asia/Seoul');
}

function newToday() {
    return setServiceZone(DateTime.local());
}
function newDateFromISO(iso) {
    return setServiceZone(DateTime.fromISO(iso));
}
