#!bash
version=$(grep \"version\" manifest.json | cut -d '"' -f 4)
zip tab-gc-$version.zip icon128.png manifest.json popup.css popup.html popup.js service_worker.js shared.js
