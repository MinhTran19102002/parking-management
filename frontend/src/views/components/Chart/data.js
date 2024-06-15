const textStyle = {
  fill: "rgba(255, 255, 255, 1)",
  fontSize: 12,
};

const ChartConfig = {
  textStyle,
  grid: {
    closed: true,
    line: {
      style: {
        stroke: "rgba(238, 238, 238, 0.20)",
        lineWidth: 1,
        cursor: "pointer",
        opacity: 0.6,
      },
    },
  },
  slider: {
    textStyle,
    height: 12,
    backgroundStyle: {
      fill: "rgba(255, 255, 255, 1)",
    },
    handlerStyle: {
      height: 12,
    },
    foregroundStyle: {},
    formatter: () => "",
  },
  scrollbar: {
    type: "horizontal",
    default: {
      style: {
        thumbColor: "#00CAFF",
        trackColor: "#0F1C29",
      },
    },
    hover: {
      style: {
        thumbColor: "#00B6E6",
      },
    },
  },
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
};

export default ChartConfig;
