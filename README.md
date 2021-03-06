# Wasm exercise

Encrypt files on the web. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need nodejs as well as emscripten. I couldn't get emscripten to work properly on my windows machine so I also had to install Ubuntu using VMware. If you  have windows, I highly recommend you too install Ubuntu.

```
Get nodejs-> https://nodejs.org/en/
Get started with emscripten -> http://kripken.github.io/emscripten-site/docs/getting_started/index.html
Find Ubuntu here, I used the latest version -> https://www.ubuntu.com/
Get VMware here -> https://my.vmware.com/en/web/vmware/free#desktop_end_user_computing/vmware_workstation_player/12_0
```

### Installing

Assuming you're on some sort of Linux machine and you have emscripten as well as nodejs, these commands should install everything.

```
git clone https://github.com/sedfvrzg/emscripten-webasm-encryption-test.git wasm_exercise
cd wasm_exercise/wasm
make
cd ..
npm install
node index.js
```

Then navigate to http://localhost:3000.

A live example can be found here https://peaceful-sands-60543.herokuapp.com/.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

*Thank you.
