let wastedTime = 0;
let timeTakenlabel  = document.getElementById("TimeTaken")
let sort_btn = document.getElementById("sort_button");
let bars_container = document.getElementById("bars_container");
let select_algo = document.getElementById("algorithm");
let speed = document.getElementById("read_speed");
let selected_algorithm = "";
let globalArray=[];

var k=0;
var speed_mult=10;
var height_mult = screen.height/120;


sort_btn.disabled=true;

speed.addEventListener("click", function () {
  speed_mult=prompt("Enter Speed Range (range 10 - 100):");
  if (speed_mult==null){
    alert("Default speed set to 50");
    speed_mult=50;
  } 
  else if (speed_mult>100){
    alert("Input capped to 100");
    speed_mult=100;
  }
  else if (speed_mult<10){
    alert("Input adjusted to 10");
    speed_mult=10;
  } 
});


select_algo.addEventListener("change", async function () {
  selected_algorithm = select_algo.value;

  sort_btn.disabled=true;

  let array = await readFileAndFillArray();
  generate_bar(array);
  globalArray=array;

  sort_btn.disabled=false;
});


function generate_bar(array) {

  bars_container.innerHTML=""

  for (let i = 0; i < array.length; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = array[i] * height_mult + "px";
    bar.innerText=array[i];
    bar.style.border = "thin solid "
    bars_container.appendChild(bar);
  }
}


function sleep(ms) {
  wastedTime = wastedTime + ms;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bubbleSort(array) {

  let startTime = performance.now()

  console.log(array,array.length)

  let bars = document.getElementsByClassName("bar");

  for (let i = 0; i < array.length; i++) {

    for (let j = 0; j < array.length - i - 1; j++) {

      if (array[j] > array[j + 1]) {
        
        for (let k = 0; k < array.length; k++) {

          if (k !== j && k !== j + 1) {

            bars[k].style.backgroundColor = "lightblue";

          }
        }

        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        
        bars[j].innerText = array[j];
        bars[j+1].innerText = array[j+1];

        bars[j].style.height = parseInt(array[j]) * height_mult + "px";
        bars[j].style.backgroundColor = "lightgreen";
        bars[j + 1].style.height = parseInt(array[j + 1]) * height_mult + "px";
        bars[j + 1].style.backgroundColor = "lightgreen";
        await sleep(speed_mult);
      }
    }
    console.log(i,array);
    await sleep(speed_mult);
  }

  let endTime = performance.now()

  timeTakenlabel.innerText = 'Time taken: ' + ((endTime- startTime) - wastedTime) + 'ms' 
  console.log((endTime- startTime) - wastedTime)


}


async function partition(items, left, right) {
  let bars = document.getElementsByClassName("bar");
  let pivotIndex = Math.floor((right + left) / 2);
  var pivot = items[pivotIndex];
  bars[pivotIndex].style.backgroundColor = "red";
  let i=0;
  let j=0;

  for (let i = 0; i < bars.length; i++) {
    if (i != pivotIndex) {
      bars[i].style.backgroundColor = "lightblue";
    }
  }

  (i = left), 
    (j = right); 
  while (i <= j) {
    while (items[i] < pivot) {
      i++;
    }
    while (items[j] > pivot) {
      j--;
    }
    if (i <= j) {
      await swap(items, i, j, bars); 
      i++;
      j--;
    }
  }
  return i;
}

async function quickSort(items, left, right) {
  var index;
  let bars = document.getElementsByClassName("bar");
  if (items.length > 1) {
    index = await partition(items, left, right); 
    if (left < index - 1) {
      await quickSort(items, left, index - 1);
    }
    if (index < right) {
      await quickSort(items, index, right);
    }
  }

  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "lightblue";
  }
  return items;
}



async function InsertionSort(array) {
  let bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = array[j + 1] * height_mult + "px";
      bars[j + 1].innerText = array[j + 1]
      bars[j + 1].style.backgroundColor = "red";
      await sleep(speed_mult);

      for (let k = 0; k < bars.length; k++) {
        if (k != j + 1) {
          bars[k].style.backgroundColor = "lightblue";
        }
      }
      j = j - 1;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = array[j + 1] * height_mult + "px";
    bars[j + 1].innerText = array[j + 1]
    bars[j + 1].style.backgroundColor = "lightgreen";
    await sleep(speed_mult);
  }

  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "lightblue";
  }
  return array;
}


async function HeapSort(array) {
  let bars = document.getElementsByClassName("bar");
  for (let i = Math.floor(array.length / 2); i >= 0; i--) {
    await heapify(array, array.length, i);
  }
  for (let i = array.length - 1; i >= 0; i--) {
    await swap(array, 0, i, bars);
    await heapify(array, i, 0);
  }
  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "lightblue";
    await sleep(speed_mult);
  }
  return array;
}

async function heapify(array, n, i) {
  let bars = document.getElementsByClassName("bar");
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  if (left < n && array[left] > array[largest]) {
    largest = left;
  }
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }
  if (largest != i) {
    await swap(array, i, largest, bars);
    await heapify(array, n, largest);
  }
}

 async function swap(array, i, j, bars) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;

  bars[i].innerText = array[i];
  bars[j].innerText = array[j];

  bars[i].style.height = array[i] * height_mult + "px";
  bars[j].style.height = array[j] * height_mult + "px";
  bars[i].style.backgroundColor = "red";
  bars[j].style.backgroundColor = "red";
  await sleep(speed_mult);

  for (let k = 0; k < array.length; k++) {
    if (k != i && k != j) {
      bars[k].style.backgroundColor = "lightblue";
    }
  }

    console.log(array);
}

async function mergeSort(arr) {
  let bars = document.getElementsByClassName("bar");
  if (arr.length < 2) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  await mergeSort(left);
  await mergeSort(right);

  let i = 0;
  let j = 0;
  let k = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    bars[k].style.height = arr[k] * height_mult + "px";
    bars[k].innerText = arr[k];
    bars[k].style.backgroundColor = "lightgreen";
    if (k + arr.length < bars.length) {
      bars[k + arr.length].style.height = arr[k] * height_mult + "px";
      bars[k + arr.length].innerText = arr[k];
      console.log(arr[k] * height_mult);
      bars[k + arr.length].style.backgroundColor = "darkgreen";
    }
    await sleep(speed_mult);
    k++;
  }

  while (i < left.length) {
    arr[k] = left[i];
    bars[k].style.height = arr[k] * height_mult + "px";
    bars[k].innerText = arr[k];
    bars[k].style.backgroundColor = "lightgreen";
    await sleep(speed_mult);
    i++;
    k++;
  }

  while (j < right.length) {
    arr[k] = right[j];
    bars[k].style.height = arr[k] * height_mult + "px";
    bars[k].innerText = arr[k];
    bars[k].style.backgroundColor = "lightgreen";
    await sleep(speed_mult);
    j++;
    k++;
  }

  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "lightblue";
  }

  return arr;
}

function mergeSortD(arr, start, end) {
  if (arr.length < 2) {
    return arr;
  }

  let middle = Math.floor((start + end) / 2);
  let left = arr.slice(start, middle);
  let right = arr.slice(middle, end);

  mergeSort(right);
}


function getMax(arr,n)
{
    let mx = arr[0];
        for (let i = 1; i < n; i++)
            if (arr[i] > mx)
                mx = arr[i];
        return mx;
}

function countSort(arr,n,exp,bars)
{
  return new Promise(async function(resolve,reject){

    console.log(n);
  
        let output = Array.apply(null, Array(n)).map(function () {return 0}) 
        let i;
        let count = Array.apply(null, Array(10)).map(function () {return 0})
  
        console.log("array in count sort: ",arr);

        for (i = 0; i < n; i++){
            count[Math.floor(arr[i] / exp) % 10]++;
            console.log("math floor: ",Math.floor(arr[i] / exp) % 10)
        }
        
  
        console.log("count array: ",count); 

        for (i = 1; i < 10; i++){
            count[i]  = count[i] + count[i - 1];
        }
       

        console.log("Updated Count Array: ",count);    
  
        for (i = n - 1; i >= 0; i--) {
           let x = count[Math.floor(arr[i] / exp) % 10]
           console.log("INDEX:",x);
            x = x-1;
            output[x] = arr[i];
            console.log("output: ",output);
            bars[x].style.height = output[x] * height_mult + "px";
            bars[x].innerText = output[x]
            bars[x].style.backgroundColor = "lightblue";
            count[Math.floor(arr[i] / exp) % 10]--;
            await sleep(speed_mult);
        }
        

          arr = []
          arr = arr.concat(output);           

  resolve(arr)

  })
  
}

 async function radixsort(arr)
{       console.log("beforeSORTARRAY: ",arr);
        let bars = document.getElementsByClassName("bar");
        let m = getMax(arr, arr.length);
        for (let exp = 1; Math.floor(m / exp) > 0; exp = exp*10){
            arr = await countSort(arr, arr.length, exp, bars);
          }

        console.log("Final Array: ",arr);
}


function bucketSort(arr,n){
  return new Promise(async function(resolve,reject){
  let bars = document.getElementsByClassName("bar");
  for (let i = 0; i < n; i++) {
    let result = '0.'.concat(arr[i]);
    arr[i]=parseFloat(result);
  }
    if (n <= 0)
            return;
   
        let buckets = new Array(n);
   
        for (let i = 0; i < n; i++)
        {
            buckets[i] = [];
        }
   
        for (let i = 0; i < n; i++) {
            let idx = arr[i] * n;
            buckets[Math.floor(idx)].push(arr[i]);
        }
   
        for (let i = 0; i < n; i++) {
            buckets[i].sort(function(a,b){return a-b;});
            bars[i].style.height = buckets[i] * height_mult + "px";
            bars[i].innerText = buckets[i]
            bars[i].style.backgroundColor = "red";
        }
   
        let index = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[index++] = buckets[i][j];
                bars[i].style.height = arr[i] * height_mult * 100 + "px";
                bars[i].innerText = arr[i]
                bars[i].style.backgroundColor = "lightblue";
            }
            await sleep(speed_mult);
        }
        for (let i = 0; i < n; i++) {
          bars[i].style.height = arr[i] * height_mult * 100 + "px";
          bars[i].innerText = arr[i]
          bars[i].style.backgroundColor = "lightblue";
          await sleep(speed_mult);
        }
        console.log(arr);
        resolve(arr)
      })
}


const readFileAndFillArray = ()=>{

  return new Promise(function(Resolve,Reject){

  var input = document.getElementById('inputfile');

  let files = input.files;

  if(files.length===0){
    let error = 'file was not valid or had data that was not correct.'
    alert(error)
    Reject(error)
  }

  const file = files[0]

  let reader = new FileReader();

      reader.onload =(e)=>{
       let filecontent = reader.result;
       let array = filecontent.split(/\r?\n/);

       for(let i=0;i<array.length;i++){
          array[i] = parseInt(array[i]);
       }

       Resolve(array);

        console.log(array);
      }

      reader.readAsText(file);

  
    })
  }



  document.getElementById('inputfile').addEventListener('change', async () => {

    sort_btn.disabled=true;

    let array = await readFileAndFillArray();
    generate_bar(array);
    globalArray=array;

    sort_btn.disabled=false;

  });

sort_btn.addEventListener("click", async function () {

  console.log("clicked!");
  timeTakenlabel.innerText = 'Time taken: Calculating...... '  

  wastedTime = 0;

  sort_btn.disabled = true;
  select_algo.disabled=true;

  let array = globalArray

  switch (selected_algorithm) {
    case "bubble":
      await bubbleSort(array);
      console.log(array);
      break;
    case "merge":
      let startTimeMerge = performance.now();
      await mergeSort(array);
      let endTimeMerge = performance.now();
      timeTakenlabel.innerText = 'Time taken: ' + ((endTimeMerge- startTimeMerge) - wastedTime) + 'ms' 
      console.log(array);
      break;
    case "heap":
      let startTimeHeap = performance.now();
      await HeapSort(array);
      let endTimeHeap = performance.now();
      timeTakenlabel.innerText = 'Time taken: ' + ((endTimeHeap- startTimeHeap) - wastedTime) + 'ms' 
      console.log(array);
      break;
    case "insertion":
      let startTimeInsertion = performance.now();
      await InsertionSort(array);
      let endTimeInsertion = performance.now();
      timeTakenlabel.innerText = 'Time taken: ' + ((endTimeInsertion- startTimeInsertion) - wastedTime) + 'ms' 
      console.log(array);
      break;
    case "Radix & Count":
      let startTimeRadix = performance.now();
      await radixsort(array,array.length);
      let endTimeRadix = performance.now();
      timeTakenlabel.innerText = 'Time taken: ' + ((endTimeRadix- startTimeRadix) - wastedTime) + 'ms' 
      break;
    case "Bucket":
      let startTimeBucket = performance.now();
      await bucketSort(array,array.length);
      let endTimeBucket = performance.now();
      timeTakenlabel.innerText = 'Time taken: ' + ((endTimeBucket- startTimeBucket) - wastedTime) + 'ms' 
      break;
    case "quick":
      k=prompt("Enter Value Of 'K': ");
      if (array.length > k){
        alert("7.4-5 Coarsening The Recursion Since "+array.length+" Elements < 'K'");
        let startTimeInsertion = performance.now();
        await InsertionSort(array);
        let endTimeInsertion = performance.now();
        timeTakenlabel.innerText = 'Time taken: ' + ((endTimeInsertion- startTimeInsertion) - wastedTime) + 'ms' 
        console.log(array);
        break;
      } else {
      let startTimeQuick= performance.now();
      await quickSort(array, 0, array.length - 1);
      console.log(array);
      let endTimeQuick = performance.now();
      timeTakenlabel.innerText = 'Time taken: ' + ((endTimeQuick- startTimeQuick) - wastedTime) + 'ms' 
      break; }
    default:
      await bubbleSort(array);
      console.log(array);
      break;
  }

  select_algo.disabled=false;

});
