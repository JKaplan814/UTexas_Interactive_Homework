function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  var metaURL = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metaURL).then(function(data) {
      // Use d3 to select the panel with id of `#sample-metadata`
    console.log(data);

    d3.select('#sample-metadata').html("");
      // Use `.html("") to clear any existing metadata
    Object.entries(data).forEach(([key, value]) => {
      d3.select('#sample-metadata')
      .append("li").text(`${key}: ${value}`)
    });
    
    
    
 

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  var dataURL = `/samples/${sample}`;
  d3.json(dataURL).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    console.log(data);

    var trace1 = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
        }
      }];

    var bubble_layout = {
      showlegend: false,
      height: 500,
      width: 1300
    };

    Plotly.newPlot('bubble',trace1, bubble_layout);
    // sort frame in pandas in app.py
    var ten_values = data.sample_values.slice(0,10);
    var ten_ids = data.otu_ids.slice(0,10);
    var ten_labels = data.otu_labels.slice(0,10);

    var trace2 = [{
      values: ten_values,
      labels: ten_ids,
      hovertext: ten_labels,
      type: 'pie'
    }];

    var pie_layout = {
      showlegend: true
    };
    
    Plotly.newPlot('pie', trace2, pie_layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values, slice(0, 10)
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
