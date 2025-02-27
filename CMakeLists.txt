cmake_minimum_required(VERSION 3.22)

project(listener-facing-design VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Quick Gui)
qt_standard_project_setup()

set(HEADERS
    include/psychopy.h)

set(SOURCE
    src/main.cpp
    src/psychopy.cpp)

qt_add_executable(listener-facing-design ${HEADERS} ${SOURCE})

qt_policy(SET QTP0001 NEW)

# qt_add_qml_module(listener-facing-design 
#     URI main
#     QML_FILES
#         main.qml)

target_include_directories(${PROJECT_NAME} 
    PRIVATE 
    ${CMAKE_SOURCE_DIR}/include
    ${Qt6Quick_INCLUDE_DIRS} 
    ${Qt6Gui_INCLUDE_DIRS})

target_link_libraries(${PROJECT_NAME} PRIVATE Qt6::Gui Qt6::Quick)