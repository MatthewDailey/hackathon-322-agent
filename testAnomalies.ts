/**
 * @fileoverview Test script for running anomaly detection on a chart image
 */

import { examineGraphForAnomalies } from './anomolies';
import path from 'path';

async function main() {
  try {
    // Path to the chart image
    const imagePath = path.resolve('chart.png');
    
    console.log(`Analyzing chart at: ${imagePath}`);
    console.log('-----------------------------------');
    
    // Run the anomaly detection
    const analysis = await examineGraphForAnomalies(imagePath);
    
    // Output the results
    console.log('ANALYSIS RESULTS:');
    console.log(analysis);
  } catch (error) {
    console.error('Error running anomaly detection:', error);
    process.exit(1);
  }
}

// Run the main function
main();