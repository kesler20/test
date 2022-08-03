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

class PlotlyInterface {
  constructor(canvasID, data, plotTitle, yTicks, xTicks) {
    this.canvasID = canvasID;
    this.plotly = window.Plotly;
    this.data = data;
    this.plotTitle = plotTitle;
    this.yTicks = yTicks;
    this.xTicks = xTicks;
  }

  constructInitialPlot() {
    const layout = {
      title: this.plotTitle,
      yaxis: {
        title: this.yTickss,
        range: [900, 1150],
        titlefont: {
          family: "Arial, sans-serif",
          size: 18,
          color: "black",
        },
      },
      xaxis: {
        title: this.xTicks,
        titlefont: {
          family: "Arial, sans-serif",
          size: 18,
          color: "black",
        },
      },
    };

    const config = {
      responsive: true,
      editable: true,
    };

    const plotData = [...this.data];
    this.plotly.plot(this.canvasID, plotData, layout, config);
  }

  updateInitialPlot(newData) {
    /*
    new Data is an array of arrays

    [[trace1],[trace2],[trace3]...[traceN]]
    where N is the size of the array
    
    */
    const traceIDs = [];
    for (let i = 0; i < newData.y.length; i++) {
      traceIDs.push(i);
    }
    this.plotly.extendTraces(
      this.canvasID,
      {
        y: [...newData.y],
        x: [...newData.x],
      },
      traceIDs
    );

    let dataMatrix = []
    newData.y.map(val => {
        dataMatrix.push(val[0]) 
    })

    if (this.newData) {
      this.plotly.relayout("plot", {
        yaxis: {
          range: [Math.min(...dataMatrix) - 50, Math.max(...dataMatrix) + 50],
        },
      });
    }
  }
}
