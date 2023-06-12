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
BLOCK_SIZE = 20
GRID_WIDTH = 10
GRID_HEIGHT = 20
FPS = 30

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

# Initialize the game window
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Tetris")

clock = pygame.time.Clock()

# Define the game grid
grid = [[BLACK] * GRID_WIDTH for _ in range(GRID_HEIGHT)]


# Function to create a new Tetrimino
def new_tetrimino():
    shape = random.choice(SHAPES)
    color = random.choice(SHAPE_COLORS)
    x = GRID_WIDTH // 2 - len(shape[0]) // 2
    y = 0
    return shape, color, x, y


# Function to check if the current Tetrimino collides with the grid or other blocks
def collides():
    for y in range(len(current_shape)):
        for x in range(len(current_shape[y])):
            if current_shape[y][x]:
                if (
                    current_x + x < 0
                    or current_x + x >= GRID_WIDTH
                    or current_y + y >= GRID_HEIGHT
                    or grid[current_y + y][current_x + x] != BLACK
                ):
                    return True
    return False


# Function to place the current Tetrimino onto the grid
def place_tetrimino():
    for y in range(len(current_shape)):
        for x in range(len(current_shape[y])):
            if current_shape[y][x]:
                grid[current_y + y][current_x + x] = current_color


# Function to check if any lines are filled and clear them
def clear_lines():
    lines_cleared = 0
    for y in range(GRID_HEIGHT):
        if all(grid[y]):
            del grid[y]
            grid.insert(0, [BLACK] * GRID_WIDTH)
            lines_cleared += 1
    return lines_cleared


# Initialize the placed blocks list
placed_blocks = []


def place_tetrimino():
    global placed_blocks
    for y in range(len(current_shape)):
        for x in range(len(current_shape[y])):
            if current_shape[y][x]:
                placed_blocks.append((current_x + x, current_y + y, current_color))


# Function to draw the grid and shapes
def draw_grid():
    for y in range(GRID_HEIGHT):
        for x in range(GRID_WIDTH):
            pygame.draw.rect(
                screen,
                grid[y][x],
                (x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE),
            )
    for block in placed_blocks:
        x, y, color = block
        pygame.draw.rect(
            screen, color, (x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
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


# Initialize the game
current_shape, current_color, current_x, current_y = new_tetrimino()
score = 0
game_over = False

# Main game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if not game_over:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            current_x -= 1
            if collides():
                current_x += 1
        elif keys[pygame.K_RIGHT]:
            current_x += 1
            if collides():
                current_x -= 1
        elif keys[pygame.K_DOWN]:
            current_y += 1
            if collides():
                current_y -= 1
                place_tetrimino()
                lines_cleared = clear_lines()
                score += lines_cleared**2

                current_shape, current_color, current_x, current_y = new_tetrimino()
        elif keys[pygame.K_UP]:
            rotated_shape = list(zip(*reversed(current_shape)))
            if not collides():
                current_shape = rotated_shape
            elif current_x < 0:
                current_x = 0
            elif current_x + len(current_shape[0]) > GRID_WIDTH:
                current_x = GRID_WIDTH - len(current_shape[0])

        # Update the current shape position
        if collides():
            current_y -= 1
            place_tetrimino()
            lines_cleared = clear_lines()
            score += lines_cleared**2

            current_shape, current_color, current_x, current_y = new_tetrimino()

            if collides():
                game_over = True

    screen.fill(WHITE)

    # Draw the grid and shapes
    draw_grid()
    draw_shape()

    # Draw the score
    font = pygame.font.Font(None, 36)
    score_text = font.render("Score: " + str(score), True, WHITE)
    screen.blit(score_text, (20, 20))

    # Draw "Game Over" text if the game is over
    if game_over:
        game_over_text = font.render("Game Over", True, WHITE)
        screen.blit(
            game_over_text,
            (SCREEN_WIDTH // 2 - game_over_text.get_width() // 2, SCREEN_HEIGHT // 2),
        )

    pygame.display.flip()
    clock.tick(FPS)

# Quit Pygame
pygame.quit()
