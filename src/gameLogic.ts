import {createSignal} from "solid-js";

export const playingFieldDimensions = { x: 12, y: 12 };
export const bombCount = 8;

export type FieldProps = {
    isBomb?: boolean;
    bombNeighbors: number;
    x: number;
    y: number;
    revealed: boolean;
    marked: boolean;
};

const randomInt = (num: number) => Math.floor(Math.random() * num);
const generateRandomPosition = () => ({
    x: randomInt(playingFieldDimensions.x),
    y: randomInt(playingFieldDimensions.y),
});

const initialPlayingField: FieldProps[][] = Array.from(
    { length: playingFieldDimensions.x },
    (_x, x) => {
        return Array.from({ length: playingFieldDimensions.y }, (_y, y) => ({
            bombNeighbors: 0,
            x,
            y,
            revealed: false,
            marked: false,
        }));
    }
);

export const [playingField, setPlayingField] = createSignal(initialPlayingField, {
    equals: () => false,
});

export const bombPositions = Array.from({ length: bombCount }).map(() => {
    return generateRandomPosition();
});

bombPositions.forEach((pos) => {
    initialPlayingField[pos.x][pos.y] = {
        ...initialPlayingField[pos.x][pos.y],
        isBomb: true,
    };
    // up
    if (initialPlayingField[pos.x][pos.y - 1]) {
        initialPlayingField[pos.x][pos.y - 1].bombNeighbors += 1;
    }
    // down
    if (initialPlayingField[pos.x][pos.y + 1]) {
        initialPlayingField[pos.x][pos.y + 1].bombNeighbors += 1;
    }
    // right
    if (initialPlayingField[pos.x + 1]) {
        // right right
        if (initialPlayingField[pos.x + 1][pos.y]) {
            initialPlayingField[pos.x + 1][pos.y].bombNeighbors += 1;
        }
        // right down
        if (initialPlayingField[pos.x + 1][pos.y + 1]) {
            initialPlayingField[pos.x + 1][pos.y + 1].bombNeighbors += 1;
        }
        // right up
        if (initialPlayingField[pos.x + 1][pos.y - 1]) {
            initialPlayingField[pos.x + 1][pos.y - 1].bombNeighbors += 1;
        }
    }
    if (initialPlayingField[pos.x - 1]) {
        if (initialPlayingField[pos.x - 1][pos.y]) {
            initialPlayingField[pos.x - 1][pos.y].bombNeighbors += 1;
        }

        if (initialPlayingField[pos.x - 1][pos.y - 1]) {
            initialPlayingField[pos.x - 1][pos.y - 1].bombNeighbors += 1;
        }

        if (initialPlayingField[pos.x - 1][pos.y + 1]) {
            initialPlayingField[pos.x - 1][pos.y + 1].bombNeighbors += 1;
        }
    }
});

export const revealField = (x: number, y: number) => {
    const newPlayingField = playingField();

    const innerReveal = (x1: number, y1: number) => {
        if (!newPlayingField[x1] || !newPlayingField[x1][y1]) {
            return;
        }
        newPlayingField[x1][y1].revealed = true;
        newPlayingField[x1][y1].marked = false;

        // Reveal adjacent
        if (newPlayingField[x1][y1].bombNeighbors === 0) {
            // right
            if (
                newPlayingField[x1 + 1] &&
                newPlayingField[x1 + 1][y1] &&
                !newPlayingField[x1 + 1][y1].revealed
            ) {
                innerReveal(x1 + 1, y1);
            }
// left
            if (
                newPlayingField[x1 - 1] &&
                newPlayingField[x1 - 1][y1] &&
                !newPlayingField[x1 - 1][y1].revealed
            ) {
                innerReveal(x1 - 1, y1);
            }
// bottom
            if (
                newPlayingField[x1] &&
                newPlayingField[x1][y1 + 1] &&
                !newPlayingField[x1][y1 + 1].revealed
            ) {
                innerReveal(x1, y1 + 1);
            }
// top
            if (
                newPlayingField[x1] &&
                newPlayingField[x1][y1 - 1] &&
                !newPlayingField[x1][y1 - 1].revealed
            ) {
                innerReveal(x1, y1 - 1);
            }

// bottom right
            if (
                newPlayingField[x1 + 1] &&
                newPlayingField[x1 + 1][y1 + 1] &&
                !newPlayingField[x1 + 1][y1 + 1].revealed
            ) {
                innerReveal(x1 + 1, y1 + 1);
            }
// top left
            if (
                newPlayingField[x1 - 1] &&
                newPlayingField[x1 - 1][y1 - 1] &&
                !newPlayingField[x1 - 1][y1 - 1].revealed
            ) {
                innerReveal(x1 - 1, y1 - 1);
            }
// top right
            if (
                newPlayingField[x1 - 1] &&
                newPlayingField[x1 - 1][y1 + 1] &&
                !newPlayingField[x1 - 1][y1 + 1].revealed
            ) {
                innerReveal(x1 - 1, y1 + 1);
            }
// bottom left
            if (
                newPlayingField[x1 - 1] &&
                newPlayingField[x1 - 1][y1 - 1] &&
                !newPlayingField[x1 - 1][y1 - 1].revealed
            ) {
                innerReveal(x1 - 1, y1 - 1);
            }
        }
    };

    innerReveal(x, y);

    setPlayingField(newPlayingField);

    if (newPlayingField[x][y].isBomb) {
        setLifeStatus('💀')
    }

    checkWinStatus()
};

export const markField = (x: number, y: number) => {
    const newPlayingField = playingField();
    if(newPlayingField[x][y].revealed) {
        return
    }
    newPlayingField[x][y].marked = !newPlayingField[x][y].marked;
    setPlayingField(newPlayingField);

    checkWinStatus()
};

export const [lifeStatus, setLifeStatus] = createSignal('🙂')

export const countMarked = () => {
    return playingField()
        .flat()
        .flat()
        .map(({marked}) => marked)
        .filter((e) => e).length;
};

export const countRevealed = () => {
    return playingField()
        .flat()
        .flat()
        .map(({revealed}) => revealed)
        .filter((e) => e).length;
};

const checkWinStatus = () => {
    const openFields = playingFieldDimensions.x * playingFieldDimensions.y - countMarked() - countRevealed()

    if(openFields === 0 && lifeStatus() !== '💀') {
        setLifeStatus('🎉')
    }
}
