export function getHeapSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;

  function heapify(heapSize, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

   if (l < heapSize) {
      animations.push({ type: "compare", indices: [i, l] });
      animations.push({ type: "uncompare", indices: [i, l] });
      if (arr[l] > arr[largest]) largest = l;
    }

    if (r < heapSize) {
      animations.push({ type: "compare", indices: [i, r] });
      animations.push({ type: "uncompare", indices: [i, r] });
      if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
      animations.push({ type: "compare", indices: [i, largest] });
      animations.push({ type: "uncompare", indices: [i, largest] });

      animations.push({
        type: "swap",
        indices: [i, largest],
        heights: [arr[largest], arr[i]],
      });

      const tmp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = tmp;

      heapify(heapSize, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    animations.push({ type: "compare", indices: [0, i] });
    animations.push({ type: "uncompare", indices: [0, i] });

    animations.push({
      type: "swap",
      indices: [0, i],
      heights: [arr[i], arr[0]],
    });

    const tmp = arr[0];
    arr[0] = arr[i];
    arr[i] = tmp;

    heapify(i, 0);
  }

  return animations;
}