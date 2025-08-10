import { AnalysisDisplay } from "./analyzer/AnalysisDisplay";
import type { AnalysisSaveData } from "./analyzer/SaveAnalysisDialog";
const content = `
Code Analysis of Virtual Memory Project
Here's an analysis of the provided code, addressing your specific requests:

1. Project Purpose:

What is this project designed to do? This project implements a virtual memory system. It allows a program to access a larger address space than the available physical RAM by using a combination of RAM and a "swap file" (simulated by swapFile). It handles page faults, eviction of pages from RAM to the swap file, and restoration of pages from the swap file back to RAM.
Who is the intended user? The primary intended user is a developer or student learning about operating system concepts, specifically virtual memory management. It provides a simplified, but functional, model for understanding how virtual memory works at a low level. It could also be used as a component in a larger operating system simulation or educational tool.
2. Key Technologies:

Languages: C++ is the primary language.
Frameworks/Libraries:
Standard C++ Library: Uses <vector>, <unordered_map>, <cassert>, <cstdio>, and <climits>, <stdint.h>. These provide essential data structures (vectors, hash maps) and utilities for memory management, assertions, and input/output.
CMake: Used for building the project, as defined by the CMakeLists.txt file.
3. Setup & Usage:

Prerequisites:

A C++ compiler (e.g., g++, clang++) with C++14 support or later.
CMake (version 3.16.3 or later is specified in the CMakeLists.txt).
Build Instructions (Assuming CMake is installed):

Create a build directory: mkdir build
Navigate into the build directory: cd build
Run CMake: cmake .. (This will generate build files based on the CMakeLists.txt).
Build the project: make (This will compile the C++ code and create the executable ex4).
Running the Executable:

Once built, you can run the ex4 executable (or YaaraTest if you uncomment those lines in CMakeLists.txt) from the build directory. The SimpleTest.cpp and YaaraTest.cpp contain test cases.
The output will show memory write and read operations, and assertion messages if any tests fail.
4. Architecture Overview:

ex4/
├── CMakeLists.txt         # CMake build configuration file
├── MemoryConstants.h      # Defines constants related to memory sizes and offsets
├── PhysicalMemory.cpp     # Implements physical memory operations (read, write, evict, restore)
├── PhysicalMemory.h       # Header for PhysicalMemory.cpp
├── SimpleTest.cpp         # A simple test program for basic VM functionality
├── VirtualMemory.cpp      # Implements the virtual memory management logic
├── VirtualMemory.h        # Header for VirtualMemory.cpp
├── YaaraConstants.h      # Defines constants related to memory sizes and offsets for the Yaara tests
└── YaaraTest.cpp         # Test program to verify virtual memory functions
Key components and their relationships:

MemoryConstants.h / YaaraConstants.h: Defines constants crucial for the virtual memory system: PAGE_SIZE, RAM_SIZE, VIRTUAL_MEMORY_SIZE, OFFSET_WIDTH, PHYSICAL_ADDRESS_WIDTH, VIRTUAL_ADDRESS_WIDTH, and others. These constants determine the memory layout and addressing scheme. YaaraConstants.h has a different set of constants.
PhysicalMemory.cpp / PhysicalMemory.h: This simulates the physical RAM and a swap file. It provides the following functions:
PMread(): Reads a word from a physical address.
PMwrite(): Writes a word to a physical address.
PMevict(): Moves a page from RAM to the swap file.
PMrestore(): Moves a page from the swap file to RAM.
VirtualMemory.cpp / VirtualMemory.h: This is the core of the virtual memory implementation. It uses a multi-level page table structure to translate virtual addresses into physical addresses. It contains functions like:
VMinitialize(): Initializes the virtual memory system (likely setting up the page table).
VMread(): Reads a word from a virtual address. It calls translate() to convert the virtual address to a physical address, then uses PMread() to read the data.
VMwrite(): Writes a word to a virtual address. It calls translate() to convert the virtual address to a physical address, then uses PMwrite() to write the data.
translate(): The heart of the address translation process. It walks the page tables to find the physical address corresponding to a virtual address. This function also handles page faults and eviction/restoration of pages.
SimpleTest.cpp / YaaraTest.cpp: Contains test cases that demonstrate the functionality of the virtual memory system. They write and read values to/from virtual addresses and verify the results.
`;

export default function AnalysisDisplayTest() {
  const handleSaveAnalysis = async (data: AnalysisSaveData) => {
    const saveData = {
      ...data,
      sourceCode: "sourceCode",
    };

    try {
      console.log(saveData);
      // await analysisService.saveAnalysis(saveData);
    } catch (error) {
      console.error("API call to save analysis failed:", error);
      throw error;
    }
  };
  return (
    <AnalysisDisplay
      analysis={content}
      model="https://github.com/AmossDvir/OS-ex4"
      onReset={() => {}}
      onSave={handleSaveAnalysis}
      repoName="https://github.com/AmossDvir/OS-ex4"
      repoUrl="https://github.com/AmossDvir/OS-ex4"
    ></AnalysisDisplay>
  );
}
