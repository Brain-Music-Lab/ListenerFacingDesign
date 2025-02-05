#include "psychopy.h"
#include <QObject>
#include <QDebug>
#include <QProcess>
#include <QDir>
#include <cstdio>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <array>
#include <filesystem>

#include <iostream>
#include <thread>

Psychopy::Psychopy(QObject* parent) :
    QObject(parent)
{}

std::string Psychopy::executeCommand(const std::string& command) {
    std::array<char, 128> buffer;
    std::string result;
    
    #ifdef _WIN32
    FILE* pipe = _popen(command.c_str(), "r");
    #else
    FILE* pipe = popen(command.c_str(), "r");
    #endif
    
    if (!pipe) {
        throw std::runtime_error("popen() failed!");
    }
    
    while (fgets(buffer.data(), buffer.size(), pipe) != nullptr) {
        result += buffer.data();
    }
    
    #ifdef _WIN32
    _pclose(pipe);
    #else
    pclose(pipe);
    #endif
    
    return result;
}

std::string Psychopy::getVenvPath() const {
    std::filesystem::path currentPath = std::filesystem::current_path();
    return (currentPath / ".." / "psychopy-apps" / ".psychopy_py310").string();
}

bool Psychopy::activateVenv(const std::string& venvPath) {
    std::string pythonPath = venvPath + "/bin/python";
    
    // Check if Python executable exists
    if (!std::filesystem::exists(pythonPath)) {
        std::cerr << "Python executable not found at: " << pythonPath << std::endl;
        return false;
    }
    
    // Set environment variables
    #ifdef _WIN32
    std::string pathCmd = "set PATH=" + venvPath + "/bin;%PATH%";
    #else
    std::string pathCmd = "export PATH=" + venvPath + "/bin:$PATH";
    #endif
    
    try {
        executeCommand(pathCmd);
        return true;
    } catch (const std::exception& e) {
        std::cerr << "Failed to set environment: " << e.what() << std::endl;
        return false;
    }
}

void Psychopy::buttonClicked() {
    try {
        std::string venvPath = getVenvPath();
        if (!activateVenv(venvPath)) {
            std::cerr << "Failed to activate virtual environment" << std::endl;
            return;
        }
        
        std::string cmd = venvPath + "/bin/python ../psychopy-apps/psychopy_test_app.py";
        std::string output = executeCommand(cmd);
        std::cout << "Python script output: " << output << std::endl;
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}
