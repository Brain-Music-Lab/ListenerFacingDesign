
def center_geom(screen, percent_of_screen=0.5):
    width = int(screen.width() * percent_of_screen)
    height = int(screen.height() * percent_of_screen)
    x = int((screen.width() - width) // 2)
    y = int((screen.height() - height) // 2)

    return x, y, width, height