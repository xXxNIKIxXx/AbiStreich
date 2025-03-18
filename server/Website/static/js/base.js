const lineCount = 15;
const boxesPerLine = 1;
const minSpeed = 0.0001;
const speedModifier = 0.2;
const scrollDistance = 10;
const lineDisplayHeight = 2;
const lines = [];
const boxes = [];
let lineHeight = window.innerHeight / lineCount; // Equal line spacing
window.onload = function () {
	// Create lines
	for (let i = 0; i < lineCount; i++) {
		const line = document.createElement("div");
		line.className = "line";
		line.style.height = `${lineDisplayHeight}px`;
		line.style.top = `${i * lineHeight}px`;
		document.body.querySelector(".background").appendChild(line);
		lines.push(line);
	}

	// Create boxes
	lines.forEach((line, index) => {
		for (let i = 0; i < boxesPerLine; i++) {
			const box = document.createElement("div");
			box.className = "box";

			// Assign random size
			box.style.width = `${500 + Math.random() * 10}px`;
			box.style.height = `${lineHeight - lineDisplayHeight}px`; // Match height between lines

			// Position box on the current line
			box.style.top = `${index * lineHeight + lineDisplayHeight}px`;

			// Start on random position on screen
			const startLeft = Math.random() * (window.innerWidth / 3);
			box.style.left = `${startLeft}px`;

			const randomColor = `rgba(${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, 0.5)`;
			box.style.background = `linear-gradient(-90deg, ${randomColor}, transparent)`;

			document.body.querySelector(".background").appendChild(box);
			boxes.push({
				element: box,
				speed: minSpeed + Math.random() * speedModifier, // Random speed for smooth motion
				x: startLeft, // Keep track of current x position
			});
		}
	});
	animate();
};

function animate() {
	boxes.forEach((box) => {
		box.x += box.speed;

		// Reset position when the box moves off-screen to the right
		if (box.x > window.innerWidth) {
			box.x = -parseFloat(box.element.style.width) * 2;
		}

		// Reset position when the box moves off-screen to the left
		if (box.x < -parseFloat(box.element.style.width) * 2) {
			box.x = window.innerWidth;
		}

		box.element.style.transform = `translateX(${box.x}px)`;
	});

	requestAnimationFrame(animate);
}

// Update on resize
window.addEventListener("resize", () => {
	lineHeight = window.innerHeight / lineCount;
	lines.forEach((line, index) => {
		line.style.top = `${index * lineHeight}px`;
	});

	boxes.forEach((box, index) => {
		const lineIndex = Math.floor(index / boxesPerLine);
		box.element.style.top = `${lineIndex * lineHeight + lineDisplayHeight}px`;
		box.element.style.height = `${lineHeight - lineDisplayHeight}px`;
	});
});
window.addEventListener("wheel", (e) => {
	if (e.deltaY > 0) {
		boxes.forEach((box, index) => {
			box.x += scrollDistance;
		});
	} else {
		boxes.forEach((box, index) => {
			box.x -= scrollDistance;
		});
	}
});

function applyTheme(theme) {
	document.documentElement.setAttribute('data-bs-theme', theme);
}
