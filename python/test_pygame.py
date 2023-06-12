import pygame

# Initialize Pygame
pygame.init()

# Create a Pygame window
screen = pygame.display.set_mode((400, 300))

# Run the main game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill the screen with white color
    screen.fill((255, 255, 255))

    # Update the screen
    pygame.display.flip()

# Quit Pygame
pygame.quit()
