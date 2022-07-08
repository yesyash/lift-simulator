const FloorButtons = () => {
    let floorButtons = document.createElement("div");
    floorButtons.className = "floor__buttons";
    let button = document.createElement("button");
    button.className = "button";
    let upBtn = (button.innerText = "up");
    let downBtn = (button.innerText = "down");
    floorButtons.append(upBtn, downBtn);
    return floorButtons;
};
export const addFloor = () => {
    const floorsWrapper = document.querySelector(".floors_wrapper");
    let floor = document.createElement("div");
    floor.className = "floor";
    let buttons = FloorButtons();
    floor.append(buttons);
};
