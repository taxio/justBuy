function isReallyNaN(x) {
  return x !== x;    // xがNaNであればtrue, それ以外ではfalse
}

//itemListのクイックソート 降順
function quickSort(array) {
  (function sort(start, end) {
    if(start >= end) {
      return;
    }
    var reference = array[start][1];
    var left = start + 1;
    var right = end;

    while(left < right) {
      if(array[left][1] < reference) {
        while(right > left) {
          if(array[right][1] >= reference) {
            var tmp = array[left];
            array[left] = array[right];
            array[right] = tmp;
            right--;
            break;
          }
          right--;
        }
      }
      left++;
    }
    var center;
    if(array[right][1] < reference) {
      center = right - 1;
    }else {
      center = right;
    }
    var buf = array[start];
    array[start] = array[center];
    array[center] = buf;

    sort(start, center - 1);
    sort(center + 1, end);
  })(0, array.length - 1);

  return array;
}

// 実行環境のエンディアンがLEかどうか判別
function isLittleEndian(){
    if ((new Uint8Array((new Uint16Array([0x00ff])).buffer))[0]) return true;
    return false;
}
