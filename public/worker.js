try {
    self.importScripts('api.js');
}
catch(e){
    console.log(e);
}

let ready = false;
const _data = {
    name: "",
    size: -1,
    u8ptr: -1,
    cbPtr: -1,
    progressPtr: -1,
    reset(){
        this.name = "";
        this.size = -1;
        this.u8ptr = -1;
        this.cbPtr = -1;
        this.progressPtr = -1;
    },
    set(name, size, u8ptr, cbPtr, progressPtr){
        this.name = name;
        this.size = size;
        this.u8ptr = u8ptr;
        this.cbPtr = cbPtr;
        this.progressPtr = progressPtr;
    }
};
const UPDATE_PROGRESS = 2;
const DOWNLOAD_FILE = 3;

function createDownload(){
    const { name, size, u8ptr, cbPtr, progressPtr } = _data;
    const file = self.Module.HEAPU8.subarray(u8ptr, u8ptr + size);
    const blob = new Blob([file], { type: 'application/octet-stream' });
    self.postMessage({ cmd: DOWNLOAD_FILE, blob, name })

    self.Module._free(u8ptr);
    self.Module.Runtime.removeFunction(cbPtr);
    self.Module.Runtime.removeFunction(progressPtr);
    _data.reset();
}

function updateProgress(){
    self.postMessage({ cmd: UPDATE_PROGRESS })
}

self.onmessage = (mes) => {
    if(!ready){
        console.log('wait');
        return;
    }
    switch (mes.data.cmd) {
        case 1:
            const reader = new FileReader();
            reader.onloadend = evt => {
                const u8arr = new Uint8Array(evt.target.result);
                const u8ptr = self.Module._malloc(u8arr.length);
                self.Module.HEAPU8.set(u8arr, u8ptr);

                const cbPtr = self.Module.Runtime.addFunction(createDownload);
                const progressPtr = self.Module.Runtime.addFunction(updateProgress);
                _data.set(mes.data.blob.name, u8arr.length, u8ptr, cbPtr, progressPtr);

                self.Module.crypt(u8ptr, u8arr.length, cbPtr, progressPtr ,mes.data.key);
            }
            reader.readAsArrayBuffer(mes.data.blob);
            break;
        default:
            return;

    }
}

self.Module.onRuntimeInitialized = () => {
    ready = true;
};
