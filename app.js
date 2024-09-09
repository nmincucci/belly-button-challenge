// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Extract the required data for the charts
    let otuIds = result.otu_ids;
    let sampleValues = result.sample_values;
    let otuLabels = result.otu_labels;

    // Build the horizontal bar chart
    // Get the top 10 OTUs
    let top10Values = sampleValues.slice(0, 10);
    let top10Ids = otuIds.slice(0, 10).map(id => `OTU ${id}`);
    let top10Labels = otuLabels.slice(0, 10);

    let barData = [{
      x: top10Values.reverse(),
      y: top10Ids.reverse(),
      text: top10Labels.reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    let barLayout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };

    Plotly.newPlot('bar', barData, barLayout);

    // Build the bubble chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    }];

    let bubbleLayout = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' },
      hovermode: 'closest'
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
