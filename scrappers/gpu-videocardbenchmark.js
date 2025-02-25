//https://www.videocardbenchmark.net/gpu_list.php
function extractGpuData() {
    // Select all table rows within the table body of the table with ID 'cputable'
    const rows = document.querySelectorAll('#cputable tbody tr');
    const gpuData = [];
  
    // Iterate over each row
    rows.forEach(row => {
      // Select all cells within the current row
      const cells = row.querySelectorAll('td');
  
      // Ensure there are enough cells in the row
      if (cells.length >= 3) {
        // Extract the GPU name from the first cell's link text
        const gpuName = cells[0].querySelector('a').textContent.trim();
  
        // Extract the GPU score and rank from the second and third cells
        const gpuScore = cells[1].textContent.trim();
        const gpuRank = cells[2].textContent.trim();
  
        // Add the extracted data to the gpuData array as an object
        gpuData.push({
          name: gpuName,
          score: gpuScore,
          rank: gpuRank
        });
      }
    });
  
    // Convert the array of objects to a JSON string
    const jsonResult = JSON.stringify(gpuData, null, 2);
  
    // Print the JSON string to the console
    console.log(jsonResult);
  } 

  extractGpuData()