import { qs } from "./utils/query-selector";
import { addFloor } from "./utils/add-floor";
const addFloorBtn = document.getElementById("#add_floor_btn");
const addLiftBtn = document.querySelector("#add_lift_btn");
addFloorBtn === null || addFloorBtn === void 0 ? void 0 : addFloorBtn.addEventListener("", () => {
    console.log("add floor clicked");
});
window.onload = () => {
    console.log(qs("#add_floor_btn"));
    console.log(addFloor());
};
