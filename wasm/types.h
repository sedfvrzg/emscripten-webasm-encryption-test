#ifndef TYPES
#define TYPES
#include "ttmath/ttmath.h"
#include <map>

constexpr uint32_t ui32max = 0xFFFFFFFF;

using ui512 = ttmath::UInt<16>; //32bit * 16
using ui32 = uint32_t;
using ui8 = uint8_t;
using hexmap = std::map<char, int>;

#endif
