function secondsToDurationString(seconds) {
  const conversionFactors = {
    mo: 2592000, // 1 month is approx. 30.44 days
    w: 604800, // 1 week is 7 days
    d: 86400, // 1 day is 24 hours
    h: 3600, // 1 hour is 60 minutes
    mi: 60, // 1 minute is 60 seconds
    s: 1, // 1 second is 1 second
  };

  let remainingSeconds = seconds;
  const durationParts = [];

  // Iterate over each time unit in descending order
  const timeUnits = ["mo", "w", "d", "h", "mi", "s"];
  for (const unit of timeUnits) {
    const factor = conversionFactors[unit];
    if (factor) {
      // Calculate the number of units and the remaining seconds
      const unitCount = Math.floor(remainingSeconds / factor);
      remainingSeconds %= factor;

      // If the unit count is greater than zero, add it to the duration string
      if (unitCount > 0) {
        durationParts.push(unitCount + unit);
      }
    }
  }

  // Join the duration parts into a string and return
  return durationParts.join("");
}

// Test the function
const seconds = 4075506;
const durationString = secondsToDurationString(seconds);
console.log(durationString); // Output: "1mo2w3d4h5mi6s"
