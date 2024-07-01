import dayjs from 'dayjs';
const DAY = 'date';
const MONTH = 'month';
const YEAR = 'year';
export default {
  defaultConfig: {
    columnStyle: {
      radius: [4, 4, 0, 0]
    },
    columnWidthRatio: 0.72,
    maxColumnWidth: 16,
    xAxis: {
      label: {
        autoRotate: true,
        autoEllipsis: false
      },
      grid: {
        alignTick: false,
        closed: true,
        line: {
          style: {
            lineWidth: 1,
            cursor: 'pointer',
            opacity: 0.2
          }
        }
      }
    },
    yAxis: {
      min: 0,
      grid: {
        closed: true,
        line: {
          style: {
            lineWidth: 1,
            cursor: 'pointer',
            opacity: 0.6
          }
        }
      }
    }
  },

  textStyle: {
    fontWeight: 500,
    fill: '#999'
  },

  getMax: (data = []) => {
    const rs = 1.1 * Math.max(data || [0]);
    return rs;
  },

  generateRange: (start, end, unit, format = 'L') => {
    let rs = [start.format(format)];
    unit = unit === 'date' ? 'day' : unit;
    //unit = day || month || year || hour
    if (dayjs.isDayjs(start)) {
      start = start.format('YYYY-MM-DD');
    }

    // const len = end.diff(start, unit);
    const len = end.diff(start, unit);
    start = dayjs(start);

    for (let i = 1; i <= (len < 30 ? len : 30); i++) {
      const e = start.add(i, unit);
      rs.push(e.format(format));
    }
    return rs;
  },

  getFormatByTimetype: (unit) => {
    let format = 'L';

    switch (unit) {
      case DAY:
        format = 'L';
        break;
      case MONTH:
        format = 'MM/YYYY';
        break;
      case YEAR:
        format = 'YYYY';
        break;
    }

    return format;
  },

  getDisplayFormatByTimetype: (unit) => {
    let format = 'DD/MM';

    switch (unit) {
      case DAY:
        format = 'DD/MM';
        break;
      case MONTH:
        format = 'MM/YY';
        break;
      case YEAR:
        format = 'YYYY';
        break;
    }

    return format;
  }
};
