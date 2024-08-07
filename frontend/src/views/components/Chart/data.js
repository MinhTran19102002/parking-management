const textStyle = {
  fontSize: 12,
};

const style = {
  fontSize: 12,
};
export const scrollbar = {
  type: "horizontal",
  default: {
    style: {
      // thumbColor: "#00CAFF",
      // trackColor: "#0F1C29",
    },
  },
  hover: {
    style: {
      // thumbColor: "#00B6E6",
    },
  },
};

export const DefaultTheme = {
  styleSheet: {
    fontFamily: "Lexend",
  },
  components: {
    scrollbar,
  },
};

const ChartConfig = {
  textStyle,
  style,
  grid: {
    closed: true,
    line: {
      style: {
        lineWidth: 1,
        cursor: "pointer",
        opacity: 0.6,
      },
    },
  },
  slider: {
    textStyle,
    height: 12,
    handlerStyle: {
      height: 12,
    },
    foregroundStyle: {},
    formatter: () => "",
  },
  scrollbar,
  onReady: (plot, { legendSelected, setLegendSelected, setSliderState }) => {
    plot.on("legend-item:click", (evt) => {
      let rs = legendSelected;
      try {
        rs = evt.gEvent.target.cfg.delegateObject.legend.cfg.items.reduce(
          (acc, curr) => {
            return {
              ...acc,
              [curr.name]: !curr.unchecked,
            };
          },
          {}
        );
      } catch {
      } finally {
        setLegendSelected(rs);
      }
    });
  },
  legend: {
    position: "top",
    itemName: {
      style,
    },
  },
};

export default ChartConfig;
