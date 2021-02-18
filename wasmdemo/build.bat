@echo off
ECHO --- BUILDING WASM MODULE FROM RUST SOURCE ---
CD hello-wasm-standalone
wasm-pack build --target no-modules
echo --- COPYING BUILD PRODUCTS ---
COPY pkg\hello_wasm_standalone_bg.wasm ..\site-local-requirejs
CD ..\site-local-requirejs
echo --- SERVING AT LOCALHOST:8000 ---
CALL python -m http.server
