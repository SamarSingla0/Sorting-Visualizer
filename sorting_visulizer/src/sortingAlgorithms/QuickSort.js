export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return [];
  const aux = array.slice();
  quickSortHelper(aux, 0, array.length - 1, animations);
  return animations;
}

function quickSortHelper(arr, low, high, animations) {
  if (low < high) {
    let pIdx = partition(arr, low, high, animations);
    quickSortHelper(arr, low, pIdx - 1, animations);
    quickSortHelper(arr, pIdx + 1, high, animations);
  }
}

// Lomuto partition, no 'pivot' step so runner is happy!
function partition(arr, low, high, animations) {
  let pivot = arr[high];
  let i = low;

  for (let j = low; j < high; j++) {
    // Color ON (red)
    animations.push([j, high]);
    // Color OFF (turquoise)
    animations.push([j, high]);

    if (arr[j] <= pivot) {
      // Animate swap i, j
      animations.push([i, arr[j]]);
      animations.push([j, arr[i]]);
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      i++;
    } else {
      // No swap: just push "same heights"
      animations.push([i, arr[i]]);
      animations.push([j, arr[j]]);
    }
  }
  // Final swap to place the pivot. ADD color steps!
  animations.push([i, high]);      // Color ON
  animations.push([i, high]);      // Color OFF
  animations.push([i, arr[high]]);
  animations.push([high, arr[i]]);

  let temp = arr[i];
  arr[i] = arr[high];
  arr[high] = temp;

  return i;
}
