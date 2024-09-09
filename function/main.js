class Node {
    constructor(Name) {
        this.Name = Name
        this.Children = []
        this.parent = null
        this.ChildrenIndex = 0
        // this.x = 0
        // this.y = 0
    }

    addChild(child) {
        child.parent = this
        // child.y = this.y + 1
        // child.x = this.x + this.Children.length
        child.ChildrenIndex = this.Children.length
        this.Children.push(child)
    }
}

class Itterator {
    constructor(node) {
        this.InitNode = node
        this.list = [node]
        this.length = 1
        this.index = 0
        this.method = 'BFS'
        this.result = {}
        this.resultStr = []
        this.posRes = {}
        this.renderList = [node]
    }

    setMethod(method) {
        if (method == 'BFS' || method == 'DFS')
            this.method = method
    }

    next() {
        if (this.list.length > 0) {
            let current = this.list[0]
            let current_render = this.renderList[0]
            // if (this.method == 'BFS')
            //     current_render = this.list[this.list.length - 1]
            this.list.splice(0, 1)
            this.renderList.splice(0, 1)
            this.index += 1

            // DFS FOR RENDERING LIST
            for (let i in current_render.Children) {
                i = current_render.Children.length - i - 1
                this.renderList.unshift(current_render.Children[i])
            }

            for (let i in current.Children) {
                if (this.method == 'BFS') {
                    this.list.push(current.Children[i])
                }
                else {
                    i = current.Children.length - i - 1
                    this.list.unshift(current.Children[i])
                }
                this.length += 1
            }
            this.result[current.Name] = current
            this.resultStr.push(current.Name)

            // POSITION FOR RENDERING
            if (current_render.Name != this.InitNode.Name) {
                let y = this.posRes[current_render.parent.Name].y + 1
                let x = this.posRes[current_render.parent.Name].x + this.posRes[current_render.parent.Name]['width_len']
                // Set parent width_len to += 1
                let backTrackObj = current_render
                let check_len = this.posRes[backTrackObj.parent.Name]['width_len']
                this.posRes[backTrackObj.parent.Name]['width_len'] += 1
                backTrackObj = backTrackObj.parent
                // Set parent parent width_len to += 1 if check_len != 0
                while (backTrackObj.parent && check_len != 0) {
                    this.posRes[backTrackObj.parent.Name]['width_len'] += 1
                    backTrackObj = backTrackObj.parent
                }
                this.posRes[current_render.Name] = { 'x': x, 'y': y, 'width_len': 0 }
            }
            else
                this.posRes[current_render.Name] = { 'x': 0, 'y': 0, 'width_len': 0 }

            return current
        } else {
            return null
        }
    }

    reset() {
        this.list = [this.InitNode]
        this.renderList = [this.InitNode]
        this.length = 1
        this.index = 0
        this.result = {}
        this.resultStr = []
        this.posRes = {}
    }

    hasNext() {
        return this.length > this.index
    }

    checkExist(Name) {
        return this.result[Name] ? true : false
    }

    getExistNode(Name) {
        return this.result[Name]
    }

    fullPass() {
        this.reset()
        while (this.hasNext())
            this.next()
    }
}


let A = new Node("A")
let B = new Node("B")
let C = new Node("C")
let D = new Node("D")
A.addChild(B)
A.addChild(C)
B.addChild(D)

let itt = new Itterator(A)
// itt.setMethod('DFS')
while (itt.hasNext()) {
    console.log(itt.next().Name)
}

// METHOD SELECT
let methods = ['BFS', 'DFS']
for (let i in methods) {
    let k = document.createElement("li")
    let a = document.createElement("a")
    a.innerText = methods[i]
    a.addEventListener("click", (event) => {
        document.getElementById('method_name').innerText = a.innerText
        itt.setMethod(a.innerText)
        // itt.reset()
        itt.fullPass()
    })
    k.appendChild(a)
    document.getElementById('method_select').appendChild(k)
}
// ALERT
let alert = document.getElementById('alert')
let alert_content = document.getElementById('alert_content')

function alertShow(text) {
    alert.classList.remove('opacity-0')
    alert.classList.remove('pointer-events-none')
    alert.classList.add('opacity-100')
    alert_content.innerText = text
    setTimeout(() => {
        alert.classList.remove('opacity-100')
        alert.classList.add('opacity-0')
        alert.classList.add('pointer-events-none')
    }, 2000)
}


// BUTTONS FUNCTION
document.getElementById('find').addEventListener('click', () => {
    if (itt.resultStr.length == 0)
        while (itt.hasNext()) {
            itt.next()
        }
    document.getElementById('result').innerText = 'Result: ' + itt.resultStr.join('->')
})

document.getElementById('add').addEventListener('click', () => {
    let parent = document.getElementById('Parent').value
    let children = document.getElementById('Children').value
    if (children == 'A') {
        alertShow('Cannot add A')
        return
    }
    if (parent == '') {
        alertShow('parent cannot be empty')
        return
    }
    if (children == '') {
        alertShow('children cannot be empty')
        return
    }
    if (!itt.checkExist(parent))
        alertShow('Parent does not exist -> Set Parent another name')

    if (!itt.checkExist(children)) {
        itt.getExistNode(parent).addChild(new Node(children))
        console.log('Add ' + children + ' to ' + parent)
        itt.fullPass()
        canvasReset()
        canvasDraw(false)
        document.getElementById('Parent').value = ''
        document.getElementById('Children').value = ''
        return
    }
    alertShow('Already Exist Parent -> Set Children another name')
    return
})

document.getElementById('delete').addEventListener('click', () => {
    let parent = document.getElementById('Parent').value
    let children = document.getElementById('Children').value
    if (children == 'A') {
        alertShow('Cannot add A')
        return
    }
    if (parent == '') {
        alertShow('parent cannot be empty')
        return
    }
    if (children == '') {
        alertShow('children cannot be empty')
        return
    }
    if (!itt.checkExist(parent))
        alertShow('Parent does not exist -> Set Parent another name')

    if (itt.checkExist(children)) {
        let parentNode = itt.getExistNode(parent)
        let childrenNode = itt.getExistNode(children)
        // Delete All references
        let newItt = new Itterator(childrenNode)
        while (newItt.hasNext()) {
            let child = newItt.next()
            child.parent = null
            child.Children = []
            console.log(child)
        }
        // Delete Children Node
        for (let i = childrenNode.ChildrenIndex + 1; i < parentNode.Children.length; i++) {
            parentNode.Children[i].ChildrenIndex -= 1
        }
        parentNode.Children.splice(childrenNode.ChildrenIndex, 1)
        // console.log('Delete ' + children + ' from ' + parent)
        itt.fullPass()
        canvasReset()
        canvasDraw(false)
        document.getElementById('Parent').value = ''
        document.getElementById('Children').value = ''
        return
    }
    alertShow('Not Exist Children -> Set Children another name')
    return
})

document.getElementById('animation').addEventListener('click', () => {
    canvasReset()
    canvasDraw(true)
})

// DRAWING
let canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
window.onresize = (event) => {
    // let ctx2 = canvas.getContext('2d')
    // xscale = canvas.clientWidth / canvas.width
    // yscale = canvas.clientHeight / canvas.height
    // ctx.scale(xscale, yscale)
    // console.log(yscale)

    // var imgD = ctx.getImageData(0, 0, canvas.width - 1, canvas.height - 1)
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    canvasReset()
    ctx.font = `${fontSize}px Arial`;
    ctx.setTransform(1, 0, 0, 1, 0, 20)
    canvasDraw(false)
    // ctx.putImageData(imgD, 0, 0)
}
let ctx = canvas.getContext('2d')
let fontSize = 20
let gap = 50
ctx.font = `${fontSize}px Arial`;
ctx.setTransform(1, 0, 0, 1, 0, 20)

function canvasReset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function canvasDraw(anim) {
    let color = getComputedStyle(document.getElementById('result')).color
    let keys = Object.keys(itt.result)
    let delay = 0
    let time_delay = 500
    for (let i = 0; i < keys.length; i++) {
        setTimeout(() => {
            let node = itt.result[keys[i]]
            let posRes = itt.posRes
            // Draw Connection
            if (node.parent) {
                ctx.beginPath()
                ctx.moveTo(posRes[node.parent.Name].x * (fontSize + gap) + 10 + fontSize / 2 - 4, posRes[node.parent.Name].y * (fontSize + gap) + 15)
                ctx.lineTo(posRes[node.Name].x * (fontSize + gap) + 10 + fontSize / 2 - 4, posRes[node.Name].y * (fontSize + gap) - 10)
                ctx.lineWidth = 2
                ctx.strokeStyle = color
                ctx.stroke()
            }
            // Draw Node
            ctx.fillStyle = color
            ctx.fillText(node.Name, posRes[node.Name].x * (fontSize + gap) + 10, posRes[node.Name].y * (fontSize + gap) + 10)
        }, delay)
        if (anim)
            delay += time_delay
    }
}

canvasDraw(false)