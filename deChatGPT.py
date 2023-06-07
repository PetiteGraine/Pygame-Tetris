import pygame
import random

# Initialize Pygame
pygame.init()

# Define colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
CYAN = (0, 255, 255)
YELLOW = (255, 255, 0)
MAGENTA = (255, 0, 255)
ORANGE = (255, 165, 0)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)

# Define constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
BLOCK_SIZE = 30
GRID_WIDTH = SCREEN_WIDTH // BLOCK_SIZE
GRID_HEIGHT = SCREEN_HEIGHT // BLOCK_SIZE
FPS = 30

# Initialize the game window
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Tetris")

clock = pygame.time.Clock()

# Define the Tetrimino shapes
SHAPES = [
    [[1, 1, 1, 1]],  # I shape
    [[1, 1], [1, 1]],  # O shape
    [[1, 1, 0], [0, 1, 1]],  # Z shape
    [[0, 1, 1], [1, 1, 0]],  # S shape
    [[1, 1, 1], [0, 0, 1]],  # J shape
    [[1, 1, 1], [1, 0, 0]],  # L shape
    [[1, 1, 1], [0, 1, 0]],  # T shape
]

# Define the colors for each shape
SHAPE_COLORS = [CYAN, YELLOW, MAGENTA, ORANGE, BLUE, GREEN, RED]

# Define the game grid
grid = [[BLACK] * GRID_WIDTH for _ in range(GRID_HEIGHT)]

# Define the current Tetrimino
current_shape = random.choice(SHAPES)
current_color = random.choice(SHAPE_COLORS)
current_x = GRID_WIDTH // 2 - len(current_shape[0]) // 2
current_y = 0


# Function to draw the grid and shapes
def draw_grid():
    for y in range(GRID_HEIGHT):
        for x in range(GRID_WIDTH):
            pygame.draw.rect(
                screen,
                grid[y][x],
                (x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE),
            )


def draw_shape():
    for y in range(len(current_shape)):
        for x in range(len(current_shape[y])):
            if current_shape[y][x]:
                pygame.draw.rect(
                    screen,
                    current_color,
                    (
                        (current_x + x) * BLOCK_SIZE,
                        (current_y + y) * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE,
                    ),
                )


# Main game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        current_x -= 1
    elif keys[pygame.K_RIGHT]:
        current_x += 1
    elif keys[pygame.K_DOWN]:
        current_y += 1

    screen.fill(BLACK)

    # Update the current shape position
    draw_shape()

    # Draw the grid
    draw_grid()

    pygame.display.flip()
    clock.tick(FPS)

# Quit Pygame
pygame.quit()
