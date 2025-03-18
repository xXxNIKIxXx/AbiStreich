//TODO: FIX START END MONTH SPLIT ISSUE
//TODO: FIX SOME MONTHS DOESENT WORK WITH OFFSET
//INFO: Variables that are static and cange changed
let stroke_width = 10;
let radius = 10;
let middle_radius = 90;
let text_distance = 20;
let svg_padding = 100;

//INFO: Style vars for circle text
let circle_text_size = "20px";
let circle_text_font = "Arial";


document.addEventListener('wheel', function (event) {
	if (event.deltaY > 0) {
		// Wheel scrolled down
		scrollDown();
	} else if (event.deltaY < 0) {
		// Wheel scrolled up
		scrollUp();
	}
});

function scrollDown() {
	console.log('Scrolled down');
	
	// Get elements
	const circles = document.getElementById('parrent');
	const lines = document.getElementById('lines');
	
	// Set modifiers for each display mode
	const modifiers = {
		year: 6,
		month: 6,
		day: 6
	};

	// Update rotation based on display mode
	let newRotate;
	
	if (circles) {
		const currentTransform = circles.style.transform;
		const currentRotate = currentTransform.match(/rotate\(([-\d.]+)deg\)/);
		
		if (currentRotate) {
			const currentRotateValue = parseFloat(currentRotate[1]);
			
			switch (display_mode) {
				case "year":
					newRotate = (currentRotateValue + (360 / 365) * modifiers.year) % 360;
					break;
				case "month":
					const daysInMonth = new Date(new Date().getFullYear(), month_index, 0).getDate();
					newRotate = (currentRotateValue + (360 / (daysInMonth * 24)) * modifiers.month) % 360;
					break;
				case "day":
					newRotate = (currentRotateValue + (360 / 1440) * modifiers.day) % 360;
					break;
				default:
					console.error('Invalid display mode');
					return;
			}
			
			circles.style.transform = `rotate(${newRotate}deg)`;
		} else {
			console.error('Could not find current rotation');
			switch (display_mode) {
				case "year":
					circles.style.transform = `rotate(${-90 + (360 / 365) * modifiers.year}deg)`;
					break;
				case "month":
					const daysInMonth = new Date(new Date().getFullYear(), month_index, 0).getDate();
					circles.style.transform = `rotate(${-90 + (360 / (daysInMonth * 24)) * modifiers.month}deg)`;
					break;
				case "day":
					circles.style.transform = `rotate(${-90 + (360 / 1440) * modifiers.day}deg)`;
					break;
			}
		}
	}

	// Update lines element rotation
	if (lines) {
		lines.style.transform = circles.style.transform;
	}

	// Update individual circle text rotations
	const elements = document.querySelectorAll('.circle_text');
	elements.forEach(element => {
		const currentRotation = element.getAttribute('transform').split(" ");
		if (display_mode == "month") {
			const daysInMonth = new Date(new Date().getFullYear(), month_index, 0).getDate();
			const newRotation = parseFloat(currentRotation[0].split("(")[1]) - (360 / (daysInMonth * 24)) * modifiers.month;
			element.setAttribute('transform', `rotate(${newRotation} ${currentRotation[1]} ${currentRotation[2]}`);
		} else {
			const newRotation = parseFloat(currentRotation[0].split("(")[1]) - (360 / circle_lenght) * modifiers[display_mode];
			element.setAttribute('transform', `rotate(${newRotation} ${currentRotation[1]} ${currentRotation[2]}`);
		}
	});
}


function scrollUp() {
	console.log('Scrolled up');

	// Get elements
	const circles = document.getElementById('parrent');
	const lines = document.getElementById('lines');

	// Set modifiers for each display mode
	const modifiers = {
		year: 6,
		month: 6,
		day: 6
	};

	// Update rotation based on display mode
	let newRotate;

	if (circles) {
		const currentTransform = circles.style.transform;
		const currentRotate = currentTransform.match(/rotate\(([-\d.]+)deg\)/);

		if (currentRotate) {
			const currentRotateValue = parseFloat(currentRotate[1]);

			switch (display_mode) {
				case "year":
					newRotate = (currentRotateValue - (360 / 365) * modifiers.year) % 360;
					break;
				case "month":
					const daysInMonth = new Date(new Date().getFullYear(), month_index, 0).getDate();
					newRotate = (currentRotateValue - (360 / (daysInMonth * 24)) * modifiers.month) % 360;
					break;
				case "day":
					newRotate = (currentRotateValue - (360 / 1440) * modifiers.day) % 360;
					break;
				default:
					console.error('Invalid display mode');
					return;
			}

			circles.style.transform = `rotate(${newRotate}deg)`;
		} else {
			console.error('Could not find current rotation');
			switch (display_mode) {
				case "year":
					circles.style.transform = `rotate(${-90 - (360 / 365) * modifiers.year}deg)`;
					break;
				case "month":
					const daysInMonth = new Date(new Date().getFullYear(), month_index, 0).getDate();
					circles.style.transform = `rotate(${-90 - (360 / (daysInMonth * 24)) * modifiers.month}deg)`;
					break;
				case "day":
					circles.style.transform = `rotate(${-90 - (360 / 1440) * modifiers.day}deg)`;
					break;
			}
		}
	}

	// Update lines element rotation
	if (lines) {
		lines.style.transform = circles.style.transform;
	}

	// Update individual circle text rotations
	const elements = document.querySelectorAll('.circle_text');
	elements.forEach(element => {
		const currentRotation = element.getAttribute('transform').split(" ");
		if (display_mode == "month") {
			const daysInMonth = new Date(new Date().getFullYear(), month_index, 0).getDate();
			const newRotation = parseFloat(currentRotation[0].split("(")[1]) + (360 / (daysInMonth * 24)) * modifiers.month;
			element.setAttribute('transform', `rotate(${newRotation} ${currentRotation[1]} ${currentRotation[2]}`);
		} else {
			const newRotation = parseFloat(currentRotation[0].split("(")[1]) + (360 / circle_lenght) * modifiers[display_mode];
			element.setAttribute('transform', `rotate(${newRotation} ${currentRotation[1]} ${currentRotation[2]}`);
		}
	});

}


//INFO: HELPER FUNCTIONS

/**
 * INFO: Determines the appropriate text color (black or white) based on the brightness of a given hexadecimal color.
 *
 * @param {string} hexColor - The hexadecimal color code (e.g., "#FFFFFF").
 *
 * @returns {string} - Returns '#000000' for black text if the color is bright, or '#FFFFFF' for white text if the color is dark.
 */
function textColor(hexColor) {
	let hex = hexColor.replace('#', '');
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	let brightness = (r * 299 + g * 587 + b * 114) / 1000;

	return brightness > 123 ? 'dark_text' : 'bright_text';
}

function openEventEditModal(event) {
	console.log(event)
	
	document.querySelector("#editEventModalLable").innerText = event.name;
	document.querySelector("#edit_event_id").value = event.id;

	document.getElementById("name_edit").value = event.name;
	document.getElementById("start_date_edit").value = event.start_date;
	document.getElementById("end_date_edit").value = event.end_date;
	document.getElementById("start_time_edit").value = event.start_time;
	document.getElementById("end_time_edit").value = event.end_time;
	document.getElementById("color_edit").value = event.color;

	document.getElementById("averageTime_edit").value = event.day_average_level;
	document.getElementById('averageTimeValue_edit').innerText = `${event.day_average_level} (${event.day_average_level * 30} Minuten)`
	document.getElementById("urgency_edit").value = event.urgency;
	document.getElementById("urgencyValue_edit").innerText = event.urgency;

	switch (event.recurrence) {
		case "weekly":
			document.getElementById("weekly_edit").checked = true;
			break;
		case "monthly":
			document.getElementById("monthly_edit").checked = true;
			break;
		case "quarterly":
			document.getElementById("quarterly_edit").checked = true;
			break;
		case "yearly":
			document.getElementById("yearly_edit").checked = true;
			break;
		default:
			document.getElementById("none_edit").checked = true;
	}

	switch (event.taskType) {
		case "private":
			document.getElementById("privateTask_edit").checked = true;
			break;
		default:
			document.getElementById("externalTask_edit").checked = true;
	}

	document.querySelector("#event_notes_edit").value = event.notes.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

	const modal = new bootstrap.Modal(document.getElementById('edit_event'));
	modal.show();
}

/**
 * INFO: This function creates a legend for the events on the page.
 *
 * @param {Array} data - An array of objects, each representing an event.
 * INFO: Each object should have properties 'color', 'name', and any other relevant data.
 *
 * @returns {void}
 *
 * INFO: The function creates a legend by dynamically generating buttons for each event.
 * INFO: Each button has a background color corresponding to the event's color,
 * INFO: a text label displaying the event's name, and additional attributes for the modal functionality.
 * INFO: The buttons are appended to the 'legend' element on the page.
 */
function createLegend(data) {
	const legend = document.getElementById('legend');
	data.forEach(event => {

		// Replace HTML entities with regular quotes
		const cleanJson = event.user_report.replace(/&#39;/g, '"');

		// Now parse the string to create an array
		const user_report_array = JSON.parse(cleanJson);

		console.log(user_report_array)

		if(user_report_array.length == 0) {
			new_dayly_average = parseInt(event.day_average_level)
		} else {

			var ideal = 100 / (daysBetweenDates(event.start_date, event.end_date)+1);

			console.log("Ideal:", ideal)

			const last_day = user_report_array[user_report_array.length - 1];

			var day_to_use_for_time_spend = last_day

			const currentDate = new Date().toISOString().split('T')[0];
			if (last_day["day"] === currentDate) {
				day_to_use_for_time_spend = user_report_array[user_report_array.length - 2];
			}

			console.log("Day to use for time spend:", day_to_use_for_time_spend)


				var compare_factor = (event.day_average_level * 30) / day_to_use_for_time_spend["time"]
				
				console.log("Compare factor:", compare_factor)

				let progress_before = 0;
				for (let i = user_report_array.length - 1; i >= 0; i--) {
					if (user_report_array[i].hasOwnProperty("percentage") && user_report_array[i] != day_to_use_for_time_spend) {
						console.log("Found progress before:", user_report_array[i].percentage)
						progress_before = parseInt(user_report_array[i].percentage) + (ideal * i);
						break;
					}
				}
				if (progress_before === 0) {
					progress_before = ideal;
				}

				console.log("Progress before:", progress_before)

				console.log(day_to_use_for_time_spend["percentage"])

				var progress_growth = day_to_use_for_time_spend["percentage"] - progress_before

				console.log("Progress growth:", progress_growth)

				var real_progress = progress_growth * compare_factor

				console.log("Real progress:", real_progress)

				step_modifier = ideal / real_progress;

				console.log("Step modifier:", step_modifier)
		

			if (step_modifier < 0) {
				new_dayly_average = Math.floor(event.day_average_level * step_modifier);
			} else {
				new_dayly_average = Math.ceil(event.day_average_level * step_modifier);
			}


			console.log("New daily average:", new_dayly_average)

		}

		if (new_dayly_average < 0) {
			time_all = event.day_average_level * (daysBetweenDates(event.start_date, event.end_date) + 1);

			console.log("Time all:", time_all)

			new_dayly_average = Math.ceil(time_all / (daysBetweenDates(new Date(), event.end_date) + 1));

		}

		console.warn(event);
		const button = document.createElement('button');
		const progress = document.createElement('div');
		progress.classList.add("progress");
		progress.style.height = "5px";
		progress.style.marginBottom = "5px";
		progress.classList.add("progress-bar-no-top-round");
		const progressBar = document.createElement('div');
		progressBar.classList.add("progress-bar");
		progressBar.role = "progressbar";
		const lastReport = user_report_array[user_report_array.length - 1] || { percentage: 0 };
		progressBar.style.width = (lastReport.percentage || 0) + "%";
		progressBar.style.backgroundColor = "#2890e3";
		progress.appendChild(progressBar);
		button.style.backgroundColor = event.color;
		button.classList.add("btn");
		button.style.width = "100%";
		button.classList.add("legend_button");
		button.classList.add("btn-no-bottom-round");
		button.classList.add(textColor(event.color));
		const textSpan = document.createElement('span');
		textSpan.style.float = 'left';
		textSpan.style.fontWeight = 'bold';
		textSpan.style.marginRight = '10px';
		if (parseInt(event.day_average_level) === new_dayly_average) {
			textSpan.textContent = event.day_average_level;
		} else if (new_dayly_average > parseInt(event.day_average_level)) {
			textSpan.innerHTML = `<span style="color: red;">${new_dayly_average}</span>`;
		} else {
			textSpan.innerHTML = `<span style="color: green;">${new_dayly_average}</span>`;
		}
		button.appendChild(textSpan);

		const nameSpan = document.createElement('span');
		nameSpan.innerHTML = event.name;
		button.appendChild(nameSpan);

		button.addEventListener("click", () => openEventEditModal(event));

		legend.appendChild(button);
		legend.appendChild(progress);
	});

	// const button = document.createElement('button');
	// button.type = 'button';
	// button.classList.add('btn', 'btn-primary');
	// button.setAttribute('data-bs-toggle', 'modal');
	// button.setAttribute('data-bs-target', '#progressModal');
	// button.textContent = 'Fortschritt anzeigen';
	// button.style.width = "100%";

	// legend.appendChild(document.createElement('br'));
	// legend.appendChild(button);
}


/**
 * INFO: This function generates a random color in hexadecimal format and assigns it to the color input field.
 *
 * @returns {void}
 */
function color_input() {
	document.getElementById('color').value = '#' + Math.floor(Math.random() * 16777215).toString(16);
}


/**
 * INFO: This function calculates the coordinates of a given degree in a circle of a given radius from the middle of the circle.
 *
 * @param {number} degrees - The degree in the circle.
 * @param {number} radius - The radius of the circle.
 * @param {number} centerX - The x-coordinate of the center of the circle.
 * @param {number} centerY - The y-coordinate of the center of the circle.
 *
 * @returns {Object} - An object containing the x and y coordinates of the given degree in the circle.
 */
function getCoordinates(degrees, radius, centerX, centerY) {
	let angleRadians = degrees * Math.PI / 180;
	let x = centerX + radius * Math.cos(angleRadians);
	let y = centerY + radius * Math.sin(angleRadians);
	return {
		x,
		y
	};
}

// function get_red_line_position() {
// 	const current_rotation = parseInt(document.getElementById("parrent").style.transform.replace("rotate(", "").replace("deg)", ""));

// 	let now
// 	let circle_splits 
	
// 	console.log("Current Rotation:", current_rotation)
// 	console.log("DISPLAY MODE:", display_mode)
// 	if (display_mode == 'year') {
// 		now = new Date(new Date().getFullYear(), 9, 1);
// 		circle_splits = 365
// 		console.log("Days in year:", circle_splits)
// 		days_scrolled = Math.round(current_rotation / (360 / circle_splits))
// 		now.setDate(now.getDate() - days_scrolled);
// 	} else if (display_mode == 'month') {
// 		now = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
// 		circle_splits = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
// 		console.log("Days in month:", circle_splits);
// 		days_scrolled = Math.round(current_rotation / (360 / circle_splits));
// 		now.setDate(now.getDate() - days_scrolled);
// 	}

// 	console.log("Red line data:", now);
// 	console.log("Days scrolled:", days_scrolled);

// 	return now
// }

/**
 * INFO: This function calculates the number of days between two given dates.
 *
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 *
 * @returns {number} - The number of days between the two dates.
 */
function daysBetweenDates(date1, date2) {
	const differenceMs = Math.abs(new Date(date1) - new Date(date2));
	const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
	return days;
}


/**
 * INFO: Calculates the offset for a given date based on the current display mode.
 *
 * @param {Object} date - The date object containing event details.
 * @param {string} date.start_date - The start date of the event in "YYYY-MM-DD" format.
 * @param {string} date.start_time - The start time of the event in "HH:mm:ss" format.
 *
 * @returns {number} - The calculated offset, which represents the number of days or minutes from a reference point.
 */
function getOfset(date) {
	if (display_mode == "month") {
		first_of_month = "" + new Date().getFullYear() + "-" + month_index + "-1"
		if (parseInt(date["start_date"].split("-")[1]) < parseInt(month_index)) {
			ofset = 0
		} else {
			ofset = daysBetweenDates(first_of_month, date["start_date"])
		}
	} else if (display_mode == "day") {
		ofset = minutesBetweenTimes("00:00:00", date["start_time"]);
	} else {
		ofset = daysBetweenDates("" + new Date().getFullYear() + "-1-1", date["start_date"])
	}
	return ofset;
}


/**
 * INFO: This function calculates the number of minutes between two given times. (MAX: 1440)
 *
 * @param {string} time1 - The first time in the format "HH:mm".
 * @param {string} time2 - The second time in the format "HH:mm".
 *
 * @returns {number} - The number of minutes between the two times.
 */
function minutesBetweenTimes(time1, time2) {
	time1_hour = parseInt(time1.split(":")[0]);
	time1_minute = parseInt(time1.split(":")[1]);

	time2_hour = parseInt(time2.split(":")[0]);
	time2_minute = parseInt(time2.split(":")[1]);

	hour_difference = (time2_hour - time1_hour);
	minute_difference = (time2_minute - time1_minute);

	total_difference = (hour_difference * 60) + minute_difference;

	return total_difference;
}


/**
 * INFO: This function generates a list of text items to be displayed on the lines that redirect to other formats.
 * INFO: The list is based on the current display mode.
 *
 * @returns {Array<string>} - The list of text items to be displayed on the lines.
 */
function get_line_list_items() {
	if (display_mode === "year") {
		list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	} else if (display_mode === "day") {
		list = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
	} else {
		const urlParts = window.location.href.split('/');
		const month = urlParts[urlParts.length - 1];
		const year = new Date().getFullYear();
		list = Array.from({
			length: new Date(year, month, 0).getDate()
		}, (_, i) => i + 1);
	}
	return list;
}


//INFO: FUNCTIONS WICH ARE USED TO DRAW THE DATA

/**
 * INFO: Function wich adds the little text to the lines wich redirects you to the other fornats.
 * INFO: Works by taking an list as input and iterating through the list.
 * INFO: Devides the circle in len(list) and then add each text to the given position in the circle.
 *
 * @param {Array<string>} text_list - The list of text to be added to the lines.
 *
 * @returns {void}
 */
function addLineText(text_list) {
	const maxRadius = middle_radius + (events.length + 1) * stroke_width;
	const m_rr = middle_radius + (events.length + 2) * stroke_width + text_distance;
	const svgSize = maxRadius * 2 + svg_padding;
	const parent = document.getElementById("lines");
	parent.setAttribute('width', svgSize);
	parent.setAttribute('height', svgSize);
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.classList.add("line_texts");

	var index = 0;

	for (let i = 0; i <= 360; i += (360 / (text_list.length))) {
		if (i !== 360 && index !== text_list.length) {
			let {
				x: x,
				y: y
			} = getCoordinates(i, m_rr, svgSize / 2, svgSize / 2);

			const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			text.setAttribute('x', x);
			text.setAttribute('y', y);
			text.setAttribute('font-family', circle_text_font);
			text.setAttribute('font-size', circle_text_size);
			text.setAttribute('text-anchor', "middle");
			text.setAttribute('alignment-baseline', "middle");
			text.setAttribute('writing-mode', "vertical-lr");
			text.classList.add("circle_text");
			if (display_mode !== "day") {
				text.classList.add("redirect");
			}
			text.setAttribute('transform', 'rotate(0 ' + x + ' ' + y + ')');

			text.setAttribute('data-month', index + 1)

			const textNode = document.createTextNode(text_list[index]);
			text.appendChild(textNode);

			svg.appendChild(text);
			if (display_mode !== "day") {
				text.addEventListener('click', function () {
					window.location.href = window.location.href + "/" + text.getAttribute('data-month');
				});
			}
			parent.appendChild(svg);
			index++;
		}
	}
}


function addMiddleText(text) {
	const circleContainer = document.querySelector(".circle_container");
	const middleElements = document.createElement("div");
	middleElements.style.zIndex = "1";
	middleElements.classList.add("middle_elements");

	const textDiv = document.createElement("div");
	textDiv.classList.add("middle_text");
	textDiv.style.fontFamily = circle_text_font;
	textDiv.style.fontSize = circle_text_size;
	textDiv.style.textAlign = "center";
	textDiv.style.verticalAlign = "middle";
	textDiv.style.display = "flex";
	textDiv.style.flexDirection = "row";
	textDiv.style.justifyContent = "center";
	textDiv.style.alignItems = "center";
	textDiv.style.height = "100%";

	const leftIcon = document.createElement("i");
	leftIcon.classList.add("bi", "bi-caret-left-fill");
	leftIcon.style.cursor = "pointer";
	leftIcon.onclick = back;

	const rightIcon = document.createElement("i");
	rightIcon.classList.add("bi", "bi-caret-right-fill");
	rightIcon.style.cursor = "pointer";
	rightIcon.onclick = forward;

	const textNode = document.createElement("a");
	textNode.textContent = text;
	textNode.style.cursor = "pointer";
	textNode.onclick = reset;
	textDiv.appendChild(leftIcon);
	textDiv.appendChild(textNode);
	textDiv.appendChild(rightIcon);

	middleElements.appendChild(textDiv);
	circleContainer.appendChild(middleElements);
	
}

function back() {
	if (month_index === "None" && day_index === "None") {
		window.location.href = window.location.origin + "/project_overview/" + (parseInt(year_index) - 1);
	} else if (day_index === "None") {
		let newMonth = parseInt(month_index) - 1;
		if (newMonth < 1) {
			newMonth = 12;
		}
		window.location.href = window.location.origin + "/project_overview/" + parseInt(year_index) + "/" + parseInt(newMonth);
	} else {
		let newDay = parseInt(day_index) - 1;
		let maxDays = new Date(parseInt(year_index), parseInt(month_index), 0).getDate();
		if (newDay < 1) {
			newDay = maxDays;
		}
		window.location.href = window.location.origin + "/project_overview/" + parseInt(year_index) + "/" + parseInt(month_index) + "/" + parseInt(newDay);
	}
}

function forward() {
	if (month_index === "None" && day_index === "None") {
		window.location.href = window.location.origin + "/project_overview/" + (parseInt(year_index) + 1);
	} else if (day_index === "None") {
		let newMonth = parseInt(month_index) + 1;
		if (newMonth > 12) {
			newMonth = 1;
		}
		window.location.href = window.location.origin + "/project_overview/" + parseInt(year_index) + "/" + parseInt(newMonth);
	} else {
		let maxDays = new Date(parseInt(year_index), parseInt(month_index), 0).getDate();
		let newDay = parseInt(day_index) + 1;
		if (newDay > maxDays) {
			newDay = 1;
		}
		window.location.href = window.location.origin + "/project_overview/" + parseInt(year_index) + "/" + parseInt(month_index) + "/" + parseInt(newDay);
	}
}

function reset() {
	console.log('reset');
	rotate_to_current()
}

/**
 * INFO: This function adds lines to the SVG to separate the circle into sections.
 * INFO: The number of lines added depends on the length of the `text_list` parameter.
 *
 * @param {Array<string>} text_list - The list of text items to be used for the line labels.
 *
 * @returns {void}
 */
function addLines(text_list) {
	const maxRadius = middle_radius + (events.length + 1) * stroke_width;
	const minRadius = middle_radius;

	const svgSize = maxRadius * 2 + svg_padding;

	const parent = document.getElementById("lines");
	parent.setAttribute('width', svgSize);
	parent.setAttribute('height', svgSize);
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.classList.add("lines");

	for (let i = 0; i <= 360; i += (360 / (text_list.length))) {
		console.log(i)
		if (i < 359.9999999) {
			let {
				x: x1,
				y: y1
			} = getCoordinates(i, minRadius, svgSize / 2, svgSize / 2);
			let {
				x: x2,
				y: y2
			} = getCoordinates(i, maxRadius, svgSize / 2, svgSize / 2);

			const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute('x1', x1);
			line.setAttribute('y1', y1);
			line.setAttribute('x2', x2);
			line.setAttribute('y2', y2);
			line.classList.add("line");

			svg.appendChild(line)
		}
	}
	parent.appendChild(svg);
}


/**
 * INFO: This function adds a circle to the SVG based on the given event data.
 *
 * @param {Object} event - The event data containing properties like name, color, start_time, end_time, start_date, end_date.
 *
 * @returns {void}
 */
function add_circle(event) {
	const parent = document.getElementById("circles")
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

	const ringPath = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	ringPath.setAttribute('cx', "50%");
	ringPath.setAttribute('cy', "50%");
	ringPath.setAttribute('r', middle_radius + radius);
	ringPath.setAttribute('fill', 'none');
	ringPath.setAttribute('stroke', event['color']);
	ringPath.setAttribute('stroke-width', stroke_width);
	ringPath.setAttribute('transform-origin', 'center');
	ringPath.classList.add("rotateble");

	const circumference = Math.ceil(Math.PI * 2 * (middle_radius + radius));

	ringPath.setAttribute('stroke-dasharray', circumference);

	if (display_mode == "day") {
		days_between = minutesBetweenTimes(event['start_time'], event['end_time'])
	} else if (display_mode == "month") {
		const urlParts = window.location.href.split('/');
		month = parseInt(urlParts[urlParts.length - 1]);
		start_date_month = parseInt(event["start_date"].split("-")[1]);
		end_date_month = parseInt(event["end_date"].split("-")[1]);
		last_of_month = "" + new Date().getFullYear() + "-" + month + "-" + new Date(new Date().getFullYear(), month, 0).getDate()
		first_of_month = "" + new Date().getFullYear() + "-" + month + "-1"
		if (start_date_month != month && end_date_month != month) {
			days_between = daysBetweenDates(first_of_month, last_of_month);
		} else if (start_date_month < month) {
			days_between = daysBetweenDates(first_of_month, event["end_date"])
		} else if (end_date_month > month) {
			days_between = daysBetweenDates(event['start_date'], last_of_month);
		} else {
			days_between = daysBetweenDates(event['start_date'], event['end_date']);
		}
		console.log("Start month:", start_date_month, "End month:", end_date_month, "Current month:", month, "first of month:", first_of_month, "last of month:", last_of_month, "Days between:", days_between)
	} else {
		days_between = daysBetweenDates(event['start_date'], event['end_date']);
	}
	var days_show;

	//TODO: CALCULATE WITH EVERY MONTH HAS THE SAME AMOUNT OF DAYS (365/12) SO IN MONTH WERE I DONT HAVE 31 DAYS I HAVE TO ADD THE DAYS REMAINING TO FILL 31 TO THE OTER DAYS
	days_between = days_between + 1;

	if (days_between <= circle_lenght & days_between != 0) {
		days_show = days_between;
	} else if (days_between >= 0) {
		days_show = 1;
	} else {
		days_show = circle_lenght;
	}

	const dashOffset = (circumference / circle_lenght) * (circle_lenght - days_show);
	ringPath.setAttribute('stroke-dashoffset', Math.ceil(dashOffset));

	ofset = getOfset(event)

	ringPath.setAttribute('transform', 'rotate(' + (360 / circle_lenght * ofset) + ')');

	svg.appendChild(ringPath)
	radius += stroke_width
	parent.appendChild(svg)


	console.table(event)
	console.log("Lenght of circle:", circle_lenght)
	console.log("Offset:", ofset)
	console.log("Days to be shown:", days_show)
	console.log("Days betwen dates:", days_between)
}


function create_corner_circles(is_start) {
	console.log("Creating corner circles", is_start)
	const parent = document.getElementById("circles")
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const ringPath = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	ringPath.setAttribute('cx', "50%");
	ringPath.setAttribute('cy', "50%");
	if (is_start == true) {
		console.log("Creating start circle")
		ringPath.setAttribute('r', middle_radius + 3);
	} else {
		ringPath.setAttribute('r', middle_radius + radius - 3);
	}
	ringPath.setAttribute('fill', 'none');
	ringPath.classList.add("corner-circle");
	ringPath.setAttribute('stroke-width', 1.75);
	ringPath.setAttribute('transform-origin', 'center');
	ringPath.classList.add("rotateble");

	svg.appendChild(ringPath)
	parent.appendChild(svg)
}

function go_back() {
	let current_url = window.location.pathname;
	let origin = window.location.origin;
	current_url = current_url.split('/');
	current_url = current_url.slice(1, -1);
	current_url = current_url.join('/');

	window.location.href = origin + "/" + current_url;
}

function rotate_to_current() {
	if(display_mode == "year") {
		const currentYear = new Date().getFullYear();
		if (currentYear !== parseInt(year_index)) {
			return;
		}
		const startOfYear = new Date(new Date().getFullYear(), 0, 1);
		const currentDate = new Date();
		const minutesBetween = Math.floor((currentDate - startOfYear) / (1000 * 60));
		console.log(`Minutes between start of the year and current date: ${minutesBetween}`);
		const degreesPerMinute = 360 / (365 * 24 * 60);
		console.log(`Degrees per minute: ${degreesPerMinute}`);
		const rotation = degreesPerMinute * minutesBetween;
		console.log(`Rotation: ${rotation}`);
		
		document.querySelector("#parrent").style.transform = `rotate(${-90 - rotation}deg)`;
		document.querySelector("#lines").style.transform = `rotate(${-90 - rotation}deg)`;

		document.querySelectorAll(".circle_text").forEach((element) => {
			const currentRotation = element.getAttribute('transform').split(" ");
			element.setAttribute('transform', 'rotate(' + rotation + ' ' + parseInt(currentRotation[1]) + ' ' + parseInt(currentRotation[2].split(")")[0]) + ')');
		});

	} else if(display_mode == "month") {
		const currentMonth = new Date().getMonth() + 1;
		if (currentMonth !== parseInt(month_index)) {
			return;
		}
		const startOfMonth = new Date(new Date().getFullYear(), currentMonth - 1, 1);
		const currentDate = new Date();
		const minutesBetween = Math.floor((currentDate - startOfMonth) / (1000 * 60));
		console.log(`Minutes between start of the month and current date: ${minutesBetween}`);
		const degreesPerMinute = 360 / (new Date(new Date().getFullYear(), currentMonth, 0).getDate() * 24 * 60);
		console.log(`Degrees per minute: ${degreesPerMinute}`);
		const rotation = degreesPerMinute * minutesBetween;
		console.log(`Rotation: ${rotation}`);

		document.querySelector("#parrent").style.transform = `rotate(${-90 - rotation}deg)`;
		document.querySelector("#lines").style.transform = `rotate(${-90 - rotation}deg)`;

		document.querySelectorAll(".circle_text").forEach((element) => {
			const currentRotation = element.getAttribute('transform').split(" ");
			element.setAttribute('transform', 'rotate(' + rotation + ' ' + parseInt(currentRotation[1]) + ' ' + parseInt(currentRotation[2].split(")")[0]) + ')');
		});
	} else {
		const currentDate = new Date();
		const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		const minutesBetween = Math.floor((currentDate - startOfDay) / (1000 * 60));
		console.log(`Minutes between start of the day and current time: ${minutesBetween}`);
		const degreesPerMinute = 360 / 1440; // 1440 minutes in a day
		console.log(`Degrees per minute: ${degreesPerMinute}`);
		const rotation = degreesPerMinute * minutesBetween;
		console.log(`Rotation: ${rotation}`);

		document.querySelector("#parrent").style.transform = `rotate(${-90 - rotation}deg)`;
		document.querySelector("#lines").style.transform = `rotate(${-90 - rotation}deg)`;

		document.querySelectorAll(".circle_text").forEach((element) => {
			const currentRotation = element.getAttribute('transform').split(" ");
			console.warn(element)
			element.setAttribute('transform', 'rotate(' + rotation + ' ' + parseInt(currentRotation[1]) + ' ' + parseInt(currentRotation[2].split(")")[0]) + ')');
		});
	}
}

/*
* Sets up the event level progress bar based on the completion of events.
*
* @function setup_event_level_progress
* 
* @description
* This function calculates the number of completed events based on the current date and compares it to the next level.
* It then updates the progress bar's width and the text content of the progress bar.
*
* @param {Array} events - An array of event objects, where each event object has properties like end_date.
* @param {Array} levels - An array of level values representing the completion thresholds for each level.
*
* @returns {void}
*/
function setup_event_level_progress() {
	let completedEvents = 0;
	const currentDate = new Date();

	all_events.forEach(event => {
		const endDate = new Date(event.end_date);
		if (currentDate > endDate) {
			completedEvents++;
		}
	});

	console.log(`Number of completed events: ${completedEvents}`);

	document.querySelector("#progress_left_text").textContent = `${completedEvents}`;
	
	const nextLevel = levels.find(level => level > completedEvents);
	document.querySelector("#progress").style.width = `${(completedEvents / nextLevel) * 100}%`;

	document.querySelector("#progress_right_text").textContent = nextLevel;
}

function addRedLine() {
	if (display_mode === "day" || (display_mode === "month" && new Date().getMonth() + 1 === parseInt(month_index)) || (display_mode === "year" && new Date().getFullYear() === parseInt(year_index))) {
		let {
			x: x1,
			y: y1
		} = getCoordinates(0, middle_radius - (stroke_width / 2 + 3), ((middle_radius + (events.length + 1) * stroke_width) * 2 + svg_padding) / 2, ((middle_radius + (events.length + 1) * stroke_width) * 2 + svg_padding) / 2);
		let {
			x: x2,
			y: y2
		} = getCoordinates(0, (middle_radius + (events.length + 1) * stroke_width) + (stroke_width / 2 + 3), ((middle_radius + (events.length + 1) * stroke_width) * 2 + svg_padding) / 2, ((middle_radius + (events.length + 1) * stroke_width) * 2 + svg_padding) / 2);
		
		document.querySelector("#red_line").style.width = (middle_radius + (events.length + 1) * stroke_width) * 2 + svg_padding + "px";
		document.querySelector("#red_line").style.height = (middle_radius + (events.length + 1) * stroke_width) * 2 + svg_padding + "px";
		
		const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke', '#ff0000');
		line.setAttribute('stroke-width', "2px");
		
		document.querySelector("#red_line").appendChild(line);
	}
}

// function move_in() {
// 	const date = get_red_line_position()
// 	const month = date.getMonth() + 1;
// 	const day = date.getDate();

// 	alert(`Days scrolled: ${month}/${day}/${date}`)


// 	if(display_mode == "year") {
// 		window.location = window.location.href + `/${month}`;
// 	} else if(display_mode == "month") {
// //		window.location = window.location.href + `/${day}`;	
// 	}
// }

function move_out() {
	window.location = window.location.href.split('/').slice(0, -1).join('/');
}

function setup_circle_navigation() {
	// document.getElementById("circle_navigation_up").addEventListener("click", ()=> {
	// 	move_in();
	// });
	document.getElementById("circle_navigation_down").addEventListener("click", ()=> {
		move_out()
	});
}

function executeUserReport() {

}

function checkUserReportDisplay() {
	all_events.forEach(event => {
		const cleanJson = event.user_report.replace(/&#39;/g, '"');
		const user_report_array = JSON.parse(cleanJson);
		console.log(user_report_array);

		if (user_report_array.length > 0) {
			const lastElement = user_report_array[user_report_array.length - 1];
			console.log("Last element:", lastElement);

			if (lastElement.hasOwnProperty("day")) {
				console.log("Day of the last element:", lastElement.day);
			} else {
				console.warn("The last element does not have a 'day' property.");
			}
		} else {
			executeUserReport()
			console.warn("The user_report_array is empty.");
		}
	});
}

//INFO: Variables that are needed but not user controlled
//INFO: Display modes are 0: month (default), 1: day, 2: year

let line_list = get_line_list_items();


if (display_mode == "year") {
	circle_lenght = 365;
	addMiddleText(year_index)
} else if (display_mode == "day") {
	circle_lenght = 1440;
	var dayIndex = day_index.padStart(2, '0');
	var monthIndex = month_index.padStart(2, '0');
	addMiddleText(dayIndex + "." + monthIndex);
} else {
	circle_lenght = line_list.length;
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	addMiddleText(monthNames[month_index - 1]);
}


const circle_container = document.querySelector(".circle_container");

circle_container.style.width = (middle_radius + (events.length + 2) * stroke_width + text_distance) * 2 + svg_padding - text_distance * 2 + "px";
circle_container.style.height = (middle_radius + (events.length + 2) * stroke_width + text_distance) * 2 + svg_padding - text_distance * 2 + "px";

const display_switch = document.querySelector(".display_switch");
display_switch.style.top = `calc(50% + ${(middle_radius + (events.length + 2) * stroke_width + text_distance) + svg_padding - text_distance * 2}px)`;

const svg_parrent = document.querySelector("#parrent");

svg_parrent.style.width = (middle_radius + (events.length + 2) * stroke_width + text_distance) * 2 + svg_padding - text_distance * 2 + "px";
svg_parrent.style.height = (middle_radius + (events.length + 2) * stroke_width + text_distance) * 2 + svg_padding - text_distance * 2 + "px";

setup_event_level_progress()

setup_circle_navigation()

addRedLine();

color_input();

create_corner_circles(true);

//INFO: Code wich displays the result
for (let index = 0; index < events.length; index++) {
	add_circle(events[index]);
}

create_corner_circles(false);

addLines(line_list)
addLineText(line_list)
createLegend(events)

rotate_to_current()

checkUserReportDisplay()