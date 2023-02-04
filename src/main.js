class FloorNode {
    constructor() {
        this.value = {
            id: uid(),
            isGround: false,
            lifts: [],
            isTopFloor: true,
        }
        this.next = null
        this.previous = null
    }
}

class LiftNode {
    constructor() {
        this.id = uid()
        this.currentFloorAt = 0
    }
}

class FloorsList {
    constructor() {
        this.head = null
        this.tail = null
        this.length = 0
    }

    isEmpty() {
        return this.length === 0
    }

    print() {
        let arr = []
        let currNode = this.head

        while (currNode !== null) {
            arr.push(JSON.stringify(currNode.value))
            currNode = currNode.next
        }

        arr.forEach(e => console.log(e))
    }

    addFloor() {
        let newFloor = new FloorNode()

        if (this.head === null) {
            newFloor.value.isGround = true
            this.head = newFloor
            this.tail = this.head
        } else {
            this.tail.value.isTopFloor = false  // set "previous node top floor" as false
            this.tail.next = newFloor   // point "previous node next pointer" to new node
            newFloor.previous = this.tail // set "newFloors previous pointer" to prevnode
            this.tail = newFloor    // set "tail" as new node 
        }

        this.length++
        addFloorToUI(newFloor.value.id)
    }

    addLift() {
        if (this.isEmpty()) {
            let err = 'No floors added yet'
            window.alert(err)
            throw new Error(err)
        }

        let newLift = new LiftNode()
        this.head.value.lifts.push(newLift)

        addLiftToUI(newLift.id)
    }

    findNodeAndIndex(floorId) {
        let currIndex = 0
        let currNode = this.head

        while (currNode) {
            if (currNode.value.id === floorId) {
                return { currIndex, currNode }
            }

            currIndex++
            currNode = currNode.next
        }

        return { currIndex: -1, currNode: null }
    }


    findLift(id, type) {
        console.log('called')
        let { currIndex, currNode } = this.findNodeAndIndex(id)
        let translateValue = -currIndex * 150


        if (currIndex === -1) {
            let err = 'The floor you are trying to access is not found'
            window.alert(err)
            throw new Error(err)
        }

        let groundFloorLifts = this.head.value.lifts
        let targetLift = groundFloorLifts[0]

        if (type === 'up') {

            if (groundFloorLifts.length > 0) {
                currNode.value.lifts.push(targetLift)
                this.head.value.lifts.shift()
            } else {
                let activeNode = currNode

                while (activeNode.value.lifts[0] === undefined) {
                    if (activeNode.previous === null) {
                        window.alert("No more lift's below")
                        return
                    }

                    activeNode = activeNode.previous
                }

                targetLift = activeNode.value.lifts[0]

                currNode.value.lifts.push(activeNode.value.lifts[0])
                activeNode.value.lifts.shift()
            }

        } else if (type === 'down') {
            let activeNode = currNode

            while (activeNode.value.lifts[0] === undefined) {
                activeNode = activeNode.next
            }

            targetLift = activeNode.value.lifts[0]

            currNode.value.lifts.push(targetLift)
            activeNode.value.lifts.shift()
        }


        animateLift(targetLift.id, translateValue)
    }
}

const floorsController = new FloorsList()


/**
 * Utility functions 
 * -------
 * uid - generate random id.
 * geid - get element by id.
 * qs - queryselector
*/

const uid = () => {
    let a = new Uint32Array(3);
    window.crypto.getRandomValues(a);
    return (performance.now().toString(36) + Array.from(a).map(A => A.toString(36)).join("")).replace(/\./g, "");
};

const geid = (tag) => {
    return document.getElementById(tag);
};

const qs = (tag) => {
    return document.querySelector(tag)
}

const animateLift = (liftId, yAxis) => {
    let intervalCall = 0
    let lift = geid(liftId)
    let liftDoors = lift.querySelectorAll('.lift__door')
    lift.style.transform = `translateY(${yAxis}px)`


    let interval = setInterval(() => {
        if (intervalCall === 1) {
            clearInterval(interval)
        }

        liftDoors.forEach(door => door.classList.toggle('open'))
        intervalCall++
    }, 2300)
}


/**
 * Constants
 * --------
 * Floor Buttons (html markup)
 * lift (html markup)
*/
const Floor = (floorId) => `
    <div class="floor" id=${floorId}>
        <div class="floor__buttons">
            <button id=${floorId} data-type="up" class="button">up</button>
            <button id=${floorId} data-type="down" class="button">down</button>
        </div>

        <div class="lift_container"></div>
    </div>
`

const Lift = (id) => `
    <div class="lift" id=${id}>
        <div class="lift__door left"></div>
        <div class="lift__door right"></div>
    </div>
`

/**
 * Main program
 * --------
 * */

const floorsWrapper = qs(".floors_wrapper");
let allFloorButtons = document.querySelectorAll('.floor__buttons button')

const addFloorToUI = (floorId) => {
    floorsWrapper.insertAdjacentHTML('afterbegin', Floor(floorId))
    allFloorButtons = document.querySelectorAll('.floor__buttons button')
    allFloorButtons.forEach(button => button.addEventListener('click', handleFloorButton))
};

const addLiftToUI = (liftId) => {
    let children = floorsWrapper.children
    let lastFloor = children[children.length - 1]
    let liftContainer = lastFloor.querySelector('.lift_container')
    liftContainer.insertAdjacentHTML('beforeend', Lift(liftId))
}


const addFloorBtn = geid("add_floor_btn");
const addLiftBtn = geid("add_lift_btn");

addFloorBtn.addEventListener('click', () => floorsController.addFloor())
addLiftBtn.addEventListener('click', () => {
    floorsController.addLift()
})

const handleFloorButton = (e) => {
    let id = e.currentTarget.id
    let type = e.currentTarget.dataset.type

    floorsController.findLift(id, type)
}


const getLiftToFreeze = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    window.alert(formData.get("liftNumber"))
}

const disableLiftForm = document.querySelector('.disable_lift_form')
disableLiftForm.addEventListener('submit', getLiftToFreeze)
