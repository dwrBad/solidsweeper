import {createSignal, For, Show} from "solid-js";
import {bombCount, countMarked,  lifeStatus, playingField } from "./gameLogic";
import Box from "./components/Box";

const [timeSpent, setTimeSpent] = createSignal(0);

setInterval(() => setTimeSpent(timeSpent() + 1), 1000);

const App = () => {
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    return (
        <>
            <Show when={lifeStatus() === '🎉'}>
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    "line-height": 1,
                    'font-size': '100vh'
                }}>
                    🎉
                </div>
            </Show>
            <Show when={lifeStatus() === '💀'}>
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    "line-height": 1,
                    'font-size': '100vh'
                }}>
                    💀
                </div>
            </Show>
            <div
                style={{
                    border: "15px solid #ccc",
                    display: "inline-block",
                    background: "#ccc",
                }}
            >
                <div
                    style={{
                        border: "15px solid #ccc",
                        display: "flex",
                        "justify-content": "space-between",
                        color: "red",
                        "font-size": "25px",
                        "font-family": "mono",
                        margin: '0 auto'

                    }}
                >
                    <div style={{
                        width: '120px'
                    }}>💣 {bombCount - countMarked()}</div>
                    <div style={{
                        "border-color": "#fff #000 #000 #FFF ",
                        'border-style': 'solid',
                        'border-width': '1px',
                        width: '40px',
                        height: '40px',
                        'text-align': 'center'
                    }}>{lifeStatus()}
                    </div>
                    <div style={{
                        'text-align': 'right',
                        width: '120px'
                    }}>{timeSpent()} 🕑</div>
                </div>
                <For each={playingField()}>
                    {(row) => (
                        <div style={{display: "flex"}}>
                            <For each={row}>{(elValue) => <Box {...elValue} />}</For>
                        </div>
                    )}
                </For>
            </div>
        </>
    );
};

export default App

