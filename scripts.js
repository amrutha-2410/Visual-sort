document.addEventListener('DOMContentLoaded', () => {
    const arrayContainer = document.getElementById('array-container');
    const algorithmSelect = document.getElementById('algorithm');
    const speedSlider = document.getElementById('speed');
    const sizeSlider = document.getElementById('size');
    const startButton = document.getElementById('start');

    let array = [];
    let delay = 1000 / speedSlider.value;

    function generateArray(size) {
        arrayContainer.innerHTML = '';
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
            const bar = document.createElement('div');
            bar.classList.add('array-bar');
            bar.style.height = `${array[i]}%`;
            arrayContainer.appendChild(bar);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function bubbleSort() {
        const bars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    bars[j].style.height = `${array[j]}%`;
                    bars[j + 1].style.height = `${array[j + 1]}%`;
                }
                await sleep(delay);
            }
        }
    }

    async function selectionSort() {
        const bars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < array.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                bars[i].style.height = `${array[i]}%`;
                bars[minIdx].style.height = `${array[minIdx]}%`;
                await sleep(delay);
            }
        }
    }

    async function quickSort(low = 0, high = array.length - 1) {
        if (low < high) {
            const pi = await partition(low, high);
            await Promise.all([
                quickSort(low, pi - 1),
                quickSort(pi + 1, high),
            ]);
        }
    }

    async function partition(low, high) {
        const pivot = array[high];
        const bars = document.getElementsByClassName('array-bar');
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                bars[i].style.height = `${array[i]}%`;
                bars[j].style.height = `${array[j]}%`;
                await sleep(delay);
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        bars[i + 1].style.height = `${array[i + 1]}%`;
        bars[high].style.height = `${array[high]}%`;
        await sleep(delay);
        return i + 1;
    }

    async function mergeSort(start = 0, end = array.length - 1) {
        if (start < end) {
            const mid = Math.floor((start + end) / 2);
            await Promise.all([
                mergeSort(start, mid),
                mergeSort(mid + 1, end),
            ]);
            await merge(start, mid, end);
        }
    }

    async function merge(start, mid, end) {
        const tempArray = [];
        const bars = document.getElementsByClassName('array-bar');
        let i = start, j = mid + 1;

        while (i <= mid && j <= end) {
            if (array[i] <= array[j]) {
                tempArray.push(array[i++]);
            } else {
                tempArray.push(array[j++]);
            }
        }

        while (i <= mid) {
            tempArray.push(array[i++]);
        }

        while (j <= end) {
            tempArray.push(array[j++]);
        }

        for (let i = start; i <= end; i++) {
            array[i] = tempArray[i - start];
            bars[i].style.height = `${array[i]}%`;
            await sleep(delay);
        }
    }

    startButton.addEventListener('click', () => {
        delay = 1000 / speedSlider.value;
        switch (algorithmSelect.value) {
            case 'bubble':
                bubbleSort();
                break;
            case 'selection':
                selectionSort();
                break;
            case 'quick':
                quickSort();
                break;
            case 'merge':
                mergeSort();
                break;
            default:
                break;
        }
    });

    sizeSlider.addEventListener('input', () => {
        generateArray(sizeSlider.value);
    });

    speedSlider.addEventListener('input', () => {
        delay = 1000 / speedSlider.value;
    });

    generateArray(sizeSlider.value);
});
