import fs from 'fs';

// Read the teamMembers.js file
fs.readFile('teamMembers.js', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Use a comprehensive regular expression to capture each object in the array, even if it spans multiple lines
  const memberRegex = /{\s*([^{}]*?)name:\s*"(.*?)"(.*?)}/gs;

  // Replace each object with the updated structure, adding firstName, middleName, and lastName
  const updatedData = data.replace(memberRegex, (match, before, name, after) => {
    const nameParts = name.split(' ');
    let firstName = '', middleName = '', lastName = '';

    // Determine the first, middle, and last names based on the number of parts
    if (nameParts.length === 2) {
      [firstName, lastName] = nameParts;
    } else if (nameParts.length > 2) {
      firstName = nameParts[0];
      lastName = nameParts[nameParts.length - 1];
      middleName = nameParts.slice(1, -1).join(' ');
    } else {
      // Fallback in case there's only one part
      firstName = nameParts[0];
      lastName = '';
    }

    // Add firstName, middleName, and lastName fields without altering the existing name field
    return `{ ${before.trim()}, name: "${name}", firstName: "${firstName}", middleName: "${middleName}", lastName: "${lastName}", ${after.trim()} }`;
  });

  // Write the updated data back to the file or to a new file
  fs.writeFile('teamMembers_updated.js', updatedData, (err) => {
    if (err) {
      console.error('Error writing the updated file:', err);
    } else {
      console.log('File has been updated successfully.');
    }
  });
});