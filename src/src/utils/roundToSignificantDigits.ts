/**
 * Rounds a number to a specified number of significant digits.
 * @param value the number which needs to be rounded
 * @param sig the number of significant digits
 * @returns the rounded number
 */
export const roundToSignificantDigits = (value: number, sig: number = 5) => {
  if (value === 0) {
    return 0;
  }

  const power = sig - Math.ceil(Math.log10(Math.abs(value)));
  const magnitude = Math.pow(10, power);
  const shifted = Math.round(value * magnitude);
  return shifted / magnitude;
};
