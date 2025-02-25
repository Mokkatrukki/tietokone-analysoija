function extractGpuData() {
    // Select the GPU name from the <h1> element
    const gpuNameElement = document.querySelector('h1');
    const gpuName = gpuNameElement ? gpuNameElement.textContent.trim() : 'Unknown GPU';
  
    // Select all rows within the table body
    const rows = document.querySelectorAll('table#gpu_integratedgputable tbody tr');
    const processors = [];
  
    // Iterate over each row
    rows.forEach(row => {
      // Select the first cell which contains the processor name
      const processorCell = row.querySelector('td a');
      if (processorCell) {
        const processorName = processorCell.textContent.trim();
        processors.push(processorName);
      }
    });
  
    // Create the result object
    const result = {
      gpu: gpuName,
      processor: processors
    };
  
    // Convert the result object to a JSON string
    const jsonResult = JSON.stringify(result, null, 2);
  
    // Print the JSON string to the console
    console.log(jsonResult);
  }

  extractGpuData()