export function getBubbleSortAnimations(array) {
  const animations = [];
  const dupe = array.slice();
  const n = dupe.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push([j, j + 1]);
     animations.push([j, j + 1]);
      if (dupe[j] > dupe[j + 1]) {
      animations.push([j, dupe[j + 1]]);
        animations.push([j + 1, dupe[j]]);
        let temp = dupe[j];
        dupe[j] = dupe[j + 1];
        dupe[j + 1] = temp;
      } else {
        animations.push([j, dupe[j]]);
        animations.push([j + 1, dupe[j + 1]]);
      }
    }
  }
  return animations;
}
