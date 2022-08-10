// the code should be able to plot regardless of the number of channels
// and regardless of the shape of the data

/*
The data can be passed as a collection of objects of the following form 
    const trend1 = {
      x: [...x_values],
      y: [...trends_1],
      mode: "lines",
      name: "Trend 1",
      line: {
        color: "blue",
        dash: "dot",
      },
    };
*/

export default class PlotlyInterface {
  constructor(canvasID, plotTitle, yTicks, xTicks) {
    this.canvasID = canvasID;
    this.plotly = window.Plotly;
    this.plotTitle = plotTitle;
    this.yTicks = yTicks;
    this.xTicks = xTicks;
    this.layout = {
      title: this.plotTitle,
      font: {color: "#76889a"},
      paper_bgcolor: "#1b2444", 
      plot_bgcolor: "#1b2444",
      yaxis: {
        title: this.yTickss,
        range: [900, 1150],
        gridcolor:'#525f89',
        titlefont: {
          family: "Arial, sans-serif",
          size: 18,
          color: "#76889a",
        },
      },
      xaxis: {
        title: this.xTicks,
        titlefont: {
          family: "Arial, sans-serif",
          size: 18,
          color: "#76889a",
        },
      },
    };

    this.config = {
      responsive: true,
      editable: true,
    };
  }

  constructInitialPlot(plotData) {
    this.plotly.newPlot(this.canvasID, plotData, this.layout, this.config);
  }

  updateInitialPlot(newDataY, newDataX) {
    /*
    new Data is an object with a y and an x property which are array of arrays

    [[trace1],[trace2],[trace3]...[traceN]]
    where N is the size of the outer array
    
    */

    const traceIDs = [];
    for (let i = 0; i < newDataY.length; i++) {
      traceIDs.push(i);
    }

    console.log('y',[...newDataY])
    console.log('x',[...newDataX])
    this.plotly.extendTraces(
      this.canvasID,
      {
        y: [...newDataY],
        x: [...newDataX],
      },
      traceIDs
    );

    let dataMatrix = [];
    newDataY.forEach((val) => {
      dataMatrix.push(val[0]);
    });

    if (newDataY.length > 0) {
      this.plotly.relayout(this.canvasID, {
        yaxis: {
          range: [Math.min(...dataMatrix) - 50, Math.max(...dataMatrix) + 50],
        },
      });
    }
  }
}
