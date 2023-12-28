const SCAL = 20
const MAX_ROUND_TIME = 100
const FIGURES_BLOCKS = [
	null,
	"imgs/Jblock.png",
	"imgs/Iblock.png",
	"imgs/Sblock.png",
	"imgs/Lblock.png",	
	"imgs/Tblock.png",
	"imgs/Zblock.png",
	"imgs/Oblock.png"
]
let time = 0
let matrix = []
let height = 0
let length = 0
let score = 0
let gameTime = 0
let gameOn = false
let figure = {
	pos: {
		x: 0,
		y: 0
	},
	matrix: null
}
let canvas
let context

function start(h, l) {
	height = +h
	length = +l
	if (isNaN(height) || isNaN(length) || height < 10 || length < 10 || height > 50 || length > 50) {
		return alert("Не можливо створити поле з заданих параметрів")
	}

	matrix = []
	let info = document.getElementById("info")
	if (info == null) {
		info = document.createElement("div")
		info.setAttribute("id", "info")
		info.innerText = "Ваш рахунок " + score + " очків"
		document.body.appendChild(info)
	} else {
		info.innerText = "Ваш рахунок " + score + " очків"
	}

	canvas = document.getElementById("tetris")
	canvas.width = length * SCAL
	canvas.height = height * SCAL
	context = canvas.getContext("2d")
	context.scale(SCAL, SCAL);
	
	for (let i = 0; i < height; i++) {
		matrix.push(new Array(length).fill(0))
	}
	
	gameOn = true
	document.getElementById("start_game").disabled = gameOn
	document.addEventListener("keydown", checkKey)
	setNewFigure()
	gameTime = setInterval(infiniteGame, 10)
}

function checkKey(event) {
	if (event.keyCode == 37) {
		figure.pos.x -= 1
		if (isCollided()) {
			figure.pos.x += 1
		}
	} else if (event.keyCode == 39) {
		figure.pos.x += 1
		if (isCollided()) {
			figure.pos.x -= 1
		}
	} else if (event.keyCode == 40) {
		moveDown()
	} else if (event.keyCode == 38) {
		for (let y = 0; y < figure.matrix.length; y++) {
			for (let x = 0; x < y; x++) {
				[
					figure.matrix[x][y],
					figure.matrix[y][x]
				]=[
					figure.matrix[y][x],
					figure.matrix[x][y],
				]
			}
		}
		for (let row = 0; row < figure.matrix.length; row++) {
			figure.matrix[row].reverse()
		}

		let move = 1
		while (isCollided()) {
			figure.pos.x += move
			move = -(move + (move > 0 ? 1 : -1))
		}
	}
}

function infiniteGame() {
	if (gameOn) {
		time++
		if (time >= MAX_ROUND_TIME) {
			moveDown()
			time = 0
		}	
		draw()
	} else {
		gameOn = false
		clearInterval(gameTime)
		document.getElementById("start_game").disabled = gameOn
		document.removeEventListener("keydown", checkKey)
		document.getElementById("info").innerText = "Гра закінчена. Рахунок " + score + " очків"
	}
}

function draw() {
	context.fillRect(0, 0, canvas.width, canvas.height)
	drawMatrix(matrix, {x: 0, y: 0})
	drawMatrix(figure.matrix, figure.pos)
}

function drawMatrix(matrix, pos) {
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[0].length; x++) {
			if (matrix[y][x] != 0) {
				let img = document.createElement("IMG")
				img.src = FIGURES_BLOCKS[matrix[y][x]]
				context.drawImage(img, x + pos.x, y + pos.y, 1, 1)
			}
		}
	}
}

function getPoints() {
	outLoop:
	for (let y = matrix.length - 1; y > 0; y--) {
		for (let x = 0; x < matrix[0].length; x++) {
			if (matrix[y][x] == 0) {
				continue outLoop
			}
		}
		matrix.splice(y, 1)
		matrix.unshift(new Array(length).fill(0))
		score += 100
		y++
		console.log("allo")
		document.getElementById("info").innerText = "Ваш рахунок " + score + " очків"
	}
}

function moveDown() {
	figure.pos.y++
	if (isCollided()) {
		figure.pos.y--
		placeFigure()
		getPoints()
		setNewFigure()
	}
}

function isCollided() {
	const m = figure.matrix
	const p = figure.pos
	for (let y = 0; y < m.length; y++) {
		for (let x = 0; x < m[0].length; x++) {
			if (m[y][x] !== 0 && (matrix[y + p.y] && matrix[y + p.y][x + p.x]) !== 0) {
				return true
			}
		}
	}
	return false
}

function placeFigure() {
	const m = figure.matrix
	const p = figure.pos
	for (let y = 0; y < m.length; y++) {
		for (let x = 0; x < m[0].length; x++) {
			if (m[y][x] != 0) {
				matrix[y + p.y][x + p.x] = m[y][x]
			}
		}
	}
}

function setNewFigure() {
	const pieces = "ijlostz"
	figure.matrix = spawnFigure(pieces[Math.floor(Math.random() * pieces.length)])
	figure.pos.y = 0
	figure.pos.x = (Math.floor(matrix[0].length / 2)) - (Math.floor(figure.matrix[0].length / 2))
	if(isCollided()) {
		gameOn = false
	}
}

function spawnFigure(type) {
	if (type == "t"){
		return [
			[0,0,0],
			[5,5,5],
			[0,5,0] ]
	} else if (type == "o") {
		return [
			[7,7],
			[7,7] ]
	} else if (type == "l") {
		return [
			[0,4,0],
			[0,4,0],
			[0,4,4] ]
	} else if (type == "j") {
		return [
			[0,1,0],
			[0,1,0],
			[1,1,0] ]
	} else if (type == "i") {
		return [
			[0,2,0,0],
			[0,2,0,0],
			[0,2,0,0],
			[0,2,0,0] ]
	} else if (type == "s") {
		return [
			[0,3,3],
			[3,3,0],
			[0,0,0] ]
	} else if (type == "z") {
		return [
			[6,6,0],
			[0,6,6],
			[0,0,0] ]
	}
}