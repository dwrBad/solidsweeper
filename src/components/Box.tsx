import {createEffect, createSignal, Show} from "solid-js";
import {Component} from "solid-js/types/server";
import {playingField, FieldProps, revealField, markField} from "../gameLogic";


const Box: Component<FieldProps> = (props) =>  {
    const buttonClick = (event: MouseEvent) => {
        if (event.button === 0) {
            revealField(props.x, props.y);
        }
        if (event.button === 2) {
            markField(props.x, props.y);
        }
    };

    const [revealed, setRevealed] = createSignal(props.revealed);
    const [marked, setMarked] = createSignal(props.marked);

    createEffect(() => {
        setRevealed(playingField()[props.x][props.y].revealed);
        setMarked(playingField()[props.x][props.y].marked);
    });

    const color = () => {
        if (props.bombNeighbors === 1) {
            return "#00F";
        }
        if (props.bombNeighbors === 2) {
            return "#0C0";
        }
        if (props.bombNeighbors === 3) {
            return "#F00";
        }
        if (props.bombNeighbors === 4) {
            return "#000";
        }
    };

    const revealStyle = () =>
        revealed()
            ? { background: "#cccccc", "border-width": "1px", "border-color": "#333" }
            : {
                background: "#cccccc",
                "border-width": "2px",
                "border-color": "#fff #000 #000 #FFF ",
            };

    return (
        <button
            type="button"
            onMouseDown={buttonClick}
            style={{
                width: "30px",
                height: "30px",
                margin: "0",
                display: "block",
                "line-height": 1,
                "border-style": "solid",
                "font-weight": "bold",
                color: color(),
                ...revealStyle(),
            }}
        >
            <Show when={!revealed() && marked()}>🚩</Show>
            <Show when={revealed()}>
                {props.isBomb
                    ? "💣"
                    : "" + (props.bombNeighbors === 0 ? " " : props.bombNeighbors)}
            </Show>
        </button>
    );
}

export default Box
