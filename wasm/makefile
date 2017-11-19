CC = emcc
all: main.cpp types.h
	$(CC) --bind -O3 sha512.cpp main.cpp -s WASM=1 -s TOTAL_MEMORY=268435456 -s RESERVED_FUNCTION_POINTERS=2 -o ../public/api.js --std=c++11
