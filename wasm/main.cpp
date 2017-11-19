#include <emscripten/bind.h>
#include <emscripten.h>
#include "types.h"
#include "sha512.h"
template<typename T>
void log(const T& m){
  std::cout << m << std::endl;
}

hexmap getmap();
ui512 raw_data(const std::string &);
void crypt(const int & addr, const int & len, const int & cb,  const int & updatecb , const std::string & key);
void testMessage(const int & );

void crypt(const int & addr, const int & len, const int & cb,  const int & updatecb , const std::string & key){
  auto update = reinterpret_cast<void(*)()>(updatecb);
  auto callback = reinterpret_cast<void(*)()>(cb);

  ui32* asui32 = reinterpret_cast<ui32*>(addr);
  ui8* asui8 = reinterpret_cast<ui8*>(addr);
  ui512 xor_data = raw_data(key);
  ui512 mod = xor_data % ui32max;

  size_t non_int_rem = len % 4;
  size_t int_loops = (len - non_int_rem) / 4;
  size_t non_loop_rem = int_loops % 100;
  size_t total_rem_in_bytes = non_int_rem + (non_loop_rem * 4);

  size_t final_int_loops = int_loops - non_loop_rem;

  size_t j = 0;
  size_t outer = 100;
  size_t inner_add = final_int_loops / 100;
  size_t inner_check = inner_add;

  for (size_t i = 0; i < outer; ++i) {
    for(; j < inner_check; ++j){
      asui32[j] ^= (xor_data % mod).table[0];
      ++mod;
    }
    update();
    inner_check += inner_add;
  }

  size_t byte_rem = total_rem_in_bytes % 4;
  size_t int_rem = (total_rem_in_bytes - byte_rem) / 4;

  for (size_t i = 0; i < int_rem; ++i) {
    asui32[i + final_int_loops] ^= (xor_data % mod).table[0];
    ++mod;
  }

  ui32 rem_data = (xor_data % mod).table[0];
  size_t data_worked = (int_rem +  final_int_loops) * 4;


  for (size_t i = 0; i < byte_rem; ++i) {
    asui8[i + data_worked] ^= (rem_data & 0xFF);
    rem_data >>= 8;
  }

  callback();
}

ui512 raw_data(const std::string & val){
  std::string hex = sha512(val);
  ui512 res(0);
  ui512 _16(16);
  hexmap hm = getmap();

  auto beg = hex.rbegin();
  int pw{0};

  while(beg != hex.rend()){
    _16.Pow(pw++);
    res += _16 * hm[*beg++];
    _16 = 16;
  }

  return res;
}

hexmap getmap(){
  hexmap result;
  std::string symbols{ "0123456789abcdef" };
  for (size_t i = 0; i < symbols.length(); i++) {
    result[symbols[i]] = i;
  }

  return result;
}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::function("crypt", &crypt);
}
