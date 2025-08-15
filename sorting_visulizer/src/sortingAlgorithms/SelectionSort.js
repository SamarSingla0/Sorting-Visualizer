export function getSelectionSortAnimations(array) {
  const animations = [];
  const dupe = array.slice();
  const n = dupe.length;

  for (let i = 0; i < n - 1; i++) {
    let mini = i;

    for (let j = i + 1; j < n; j++) {
      animations.push({ type: "compare", indices: [mini, j] });
      animations.push({ type: "uncompare", indices: [mini, j] });
      if (dupe[j] < dupe[mini]) {
        mini = j;
      }
    }


    if (mini !== i) {
      animations.push({ type: "compare", indices: [i, mini] });
      animations.push({ type: "uncompare", indices: [i, mini] });

      animations.push({
        type: "swap",
        indices: [i, mini],
        heights: [dupe[mini], dupe[i]],
      });

      const temp = dupe[mini];
      dupe[mini] = dupe[i];
      dupe[i] = temp;
    }
  }

  return animations;
}
