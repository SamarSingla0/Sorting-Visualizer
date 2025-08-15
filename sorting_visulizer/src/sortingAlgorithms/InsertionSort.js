export function getInsertionSortAnimations(array) {
  const animations = [];
  const dupe = array.slice();
  const n = dupe.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && dupe[j - 1] > dupe[j]) {
      animations.push([j - 1, j]);
      animations.push([j - 1, j]);
      animations.push([j - 1, dupe[j]]);
      animations.push([j, dupe[j - 1]]);
      let temp = dupe[j - 1];
      dupe[j - 1] = dupe[j];
      dupe[j] = temp;
      j--;
    }
  }
  return animations;
}
