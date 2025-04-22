group "default" {
    targets = [ "frontend", "backend" ]
}

target "_common" {
    platforms = [ "linux/amd64", "linux/arm64"]
}

target "frontend" {
    inherits = [ "_common" ]
    tags = ["dethridge7/frontend:latest"]
}

target "backend" {
    inherits = [ "_common" ]
    tags = ["dethridge7/backend:latest"]
}