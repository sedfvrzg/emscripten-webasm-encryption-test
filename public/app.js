const CTX_W = 400;
const CTX_H = 30;
const CTX_PC = CTX_W / 100;

const UPDATE_PROGRESS = 2;
const DOWNLOAD_FILE = 3;

const keyfield = document.querySelector('#keyfield');
const ctx = document.querySelector('canvas').getContext('2d');
const label = document.querySelector('label');
const filefield = document.querySelector('#file');
const worker = new Worker('worker.js');

const Warning = {
    warning: document.querySelector('#warning'),
    id: -1,
    set(m){
        this.warning.textContent = "Warning: " + m;
        if(this.id !== -1){
            window.clearTimeout(this.id);
        }

        this.id = window.setTimeout(() => {
            this.warning.textContent = " ";
            this.id = -1;
        }, 2500)
    }
}

let progress = 0;
let timestamp = 0;

const init = () => {
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeRect(0,0,CTX_W,CTX_H);

    document.querySelector('button').addEventListener('click', buttonCallback);
    worker.addEventListener('message', workerCallback);
    filefield.addEventListener('change', fileCallback);
}

//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
numberWithCommas = x =>  {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const buttonCallback = () => {
    if(!validate()){
        return;
    }

    worker.postMessage({ cmd: 1, blob: filefield.files[0], key:  keyfield.value })
    timestamp = Date.now();
}

const validate = () => {

    if(keyfield.value.length < 1){
        Warning.set("Please enter a password.");
        return false;
    }
    if(filefield.files.length !== 1){
        Warning.set("Please select a file.")
        return false;
    }
    if(filefield.files[0].size > 1024*1024*256){
        Warning.set(`File too large. Max: ${numberWithCommas(1024*1024*256)}, You: ${numberWithCommas(filefield.files[0].size)}`);
        return false;
    }

    return true;
}

const workerCallback = ({ data }) => {
    switch (data.cmd) {
        case UPDATE_PROGRESS:
            ++progress;
            ctx.fillRect(0,0,progress * CTX_PC, CTX_H);
            break;
        case DOWNLOAD_FILE:
            download(data);
            break;
        default:
            return;
    }
}

const resetCanvas = () => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,CTX_W, CTX_H);
    ctx.strokeRect(0,0,CTX_W, CTX_H);
    ctx.fillStyle = "#FFFFFF";
}

const resetDocument = () => {
    resetCanvas();
    filefield.value = null;
    keyfield.value = "";
    label.innerHTML = "Select File";
    progress = 0;

    console.log(Date.now() - timestamp);
}

const fileCallback = e => {
    let fname = e.currentTarget.files[0].name;
    if(fname.length > 29) fname = fname.substring(0, 29) + "...";
    label.innerHTML = fname;
}

const download = data => {
    const { blob, name } = data;
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    a.click();

    resetDocument();
}

init();
