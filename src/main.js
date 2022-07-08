const geid = (tag) => {
    return document.getElementById(tag);
};

const addFloorBtn = geid("add_floor_btn");
const addLiftBtn = geid("add_lift_btn");

if (addFloorBtn) {
    addFloorBtn.style.background = "red";
}


