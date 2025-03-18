$(document).ready(function () {
	const table = $(".sorting").DataTable({
		bSort: true,
		aoColumnDefs: [{
			aTargets: ["non_sort"],
			bSortable: false,
		}, ],
		dom: '<"d-flex justify-content-between"<"dataTables_length"l><"d-flex"<"dataTables_filter"f>>>t<"d-flex justify-content-between"<"dataTables_info"i><"custom-button"><"pagination"p>>',
	});

	// Add a custom button next to the search bar
	if (archived) {
		$("div.custom-button").html(
			`<a href="${eventsUrl}" id="back_button" class="btn btn-primary"><i class="bi bi-arrow-left"></i> Back</a>`
		);
	} else {
		$("div.custom-button").html(
			`<a href="${eventsUrl}" id="add_user_button" class="btn btn-success"><i class="bi bi-archive-fill"></i> Archive</a>`
		);
	}
});


document.getElementById("createMilestoneButton").addEventListener("click", function () {
	$("#editModal").modal("hide");
	$("#createMilestoneModal").modal("show");

	$("#createMilestoneModal").on("hidden.bs.modal", function () {
		$("#editModal").modal("show");
	});

	document.getElementById("milestoneName_add").value = "";
	document.getElementById("milestoneDate_add").value = "";
	document.getElementById("milestoneNumber_add").value = "";

	const oldElement = document.getElementById("submitcreatemilestonebutton");
	const newElement = oldElement.cloneNode(true);
	oldElement.parentNode.replaceChild(newElement, oldElement);
		document.getElementById("submitcreatemilestonebutton").addEventListener("click", function (event) {
		// Get the data from the milestone form
		const milestoneName = document.getElementById("milestoneName_add").value;
		const milestoneDate = document.getElementById("milestoneDate_add").value;
		const milestoneNumber = document.getElementById("milestoneNumber_add").value;

		console.log(milestoneName, milestoneDate, milestoneNumber);

		const editModal = document.getElementById("editModal");
		console.log(editModal);

		const milestone_container = editModal.querySelector("#milestones")

		// Process the data (e.g., add the new milestone to the event)
		const milestoneElement = document.createElement("div");
		milestoneElement.className = "input-group mb-3";
		
		milestoneElement.innerHTML = `
			<span class="form-control" style="cursor: default;">${milestoneName}</span>
			<span class="form-control" style="max-width: fit-content; cursor: default;">${milestoneDate}</span>
			<span class="form-control" style="max-width: fit-content; cursor: default;">${milestoneNumber}</span>
			<button type="button" class="btn btn-success edit_milestone_button" style="background-color: #2890e3; border-color: #2890e3; color: #f0f0f0;">
				<i class="bi bi-gear-fill"></i>
			</button>
			<button type="button" class="btn btn-danger delete_milestone_button">
				<i class="bi bi-x-lg"></i>
			</button>
		`;

		milestone_container.appendChild(milestoneElement);

		milestoneElement.querySelector(".edit_milestone_button").addEventListener("click", function (event) {
			$("#editModal").modal("hide");
			document.getElementById("editmilestoneName").value = event.target.closest(".input-group").querySelector("span:nth-child(1)").innerText;
			document.getElementById("editmilestoneDate").value = event.target.closest(".input-group").querySelector("span:nth-child(2)").innerText;
			document.getElementById("editmilestoneNumber").value = event.target.closest(".input-group").querySelector("span:nth-child(3)").innerText;
			$("#editMilestoneModal").modal("show");

			$("#editMilestoneModal").on("hidden.bs.modal", function () {
				$("#editModal").modal("show");
			});

			document.getElementById("submiteditmilestonebutton").addEventListener("click", function () {
				// Get the data from the milestone form
				const milestoneName = document.getElementById("editmilestoneName").value;
				const milestoneDate = document.getElementById("editmilestoneDate").value;
				const milestoneNumber = document.getElementById("editmilestoneNumber").value;

				// Update the milestone element
				const milestoneElement = event.target.closest(".input-group");
				milestoneElement.querySelector("span:nth-child(1)").innerText = milestoneName;
				milestoneElement.querySelector("span:nth-child(2)").innerText = milestoneDate;
				milestoneElement.querySelector("span:nth-child(3)").innerText = milestoneNumber;

				// Close the milestone modal and reopen the edit event modal
				$("#editMilestoneModal").modal("hide");
				$("#editModal").modal("show");
			});
		});

		milestoneElement.querySelector(".delete_milestone_button").addEventListener("click", function (event) {
			event.target.closest(".input-group").remove();
		});

		// Close the milestone modal and reopen the edit event modal
		$("#createMilestoneModal").modal("hide");
		$("#editModal").modal("show");
	});
});

document.querySelectorAll(".send_input").forEach((button) => {
	button.addEventListener("click", function (event) {
		event.preventDefault();

		const simpleTab = document.getElementById("simpleSettings");
		const simpleInputs = simpleTab.querySelectorAll("input");
		let allSimpleFilled = true;

		simpleInputs.forEach((input) => {
			if (!input.value && input.required) {
				allSimpleFilled = false;
				input.classList.add("is-invalid");
			} else {
				input.classList.remove("is-invalid");
			}
		});

		if (!allSimpleFilled) {
			const simpleTabButton = document.querySelector("button#simple-tab");
			simpleTabButton.click();
			return;
		}

		const advancedTab = document.getElementById("advancedSettings");
		const advancedInputs = advancedTab.querySelectorAll("input, select");
		const allInputs = [...simpleInputs, ...advancedInputs];

		const milestones = [];
		document.querySelectorAll("#milestones .input-group").forEach((milestoneElement) => {
			const milestone = {
				name: milestoneElement.children[0].innerText,
				date: milestoneElement.children[1].innerText,
				number: milestoneElement.children[2].innerText,
			};
			milestones.push(milestone);
		});

		const formData = {};
		allInputs.forEach((input) => {
			if (!input.classList.contains("send_input")) {
				formData[input.name] = input.value;
			}
		});

		formData["milestones"] = milestones;

		// Get selected task type
		const taskType = document.querySelector('input[name="taskType"]:checked').value;
		formData["taskType"] = taskType;

		// Get selected recurrence
		const recurrence = document.querySelector('input[name="recurrence"]:checked').value;
		formData["recurrence"] = recurrence;

		// Get notes
		const notes = document.getElementById("edit_event_notes").value;
		formData["notes"] = notes;

		console.log(JSON.stringify(formData));

		// Create an invisible form
		const invisibleForm = document.createElement("form");
		invisibleForm.style.display = "none";
		invisibleForm.method = "POST";
		invisibleForm.action = "/event";

		// Add inputs to the form
		for (const key in formData) {
			if (formData.hasOwnProperty(key)) {
				const input = document.createElement("input");
				input.type = "hidden";
				input.name = key;
				if (key === "milestones") {
					input.value = JSON.stringify(formData[key]);
				} else {
					input.value = formData[key];
				}
				invisibleForm.appendChild(input);
			}
		}

		// Append the form to the body and submit it
		document.body.appendChild(invisibleForm);
		invisibleForm.submit();
	});
});


document.querySelectorAll(".editEventBtn").forEach((button) => {
	button.addEventListener("click", function (event) {
		event.preventDefault();
		let eventId = button.getAttribute("data-eventid");
		document.getElementById("edit_event_id").value = eventId;
		document.getElementById("edit_event_name").value = events[eventId]["name"];
		document.getElementById("edit_event_start_date").value = events[eventId]["start_date"];
		document.getElementById("edit_event_end_date").value = events[eventId]["end_date"];
		document.getElementById("edit_event_start_time").value = events[eventId]["start_time"];
		document.getElementById("edit_event_end_time").value = events[eventId]["end_time"];	
		document.getElementById("edit_event_color").value = events[eventId]["color"];
		document.getElementById("edit_event_averageTime").value = events[eventId]["day_average_level"];
		document.getElementById("edit_event_averageTimeValue").innerHTML = `${events[eventId]["day_average_level"]} (${events[eventId]["day_average_level"] * 30} Minuten)`;
		document.getElementById("edit_event_urgency").value = events[eventId]["urgency"];
		document.getElementById("edit_event_urgencyValue").innerHTML = `${events[eventId]["urgency"]}`;
		document.getElementById("edit_event_notes").value = events[eventId]["notes"].replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
		switch (events[eventId]["recurrence"]) {
			case "weekly":
				document.getElementById("edit_event_weekly").checked = true;
				break;
			case "monthly":
				document.getElementById("edit_event_monthly").checked = true;
				break;
			case "quarterly":
				document.getElementById("edit_event_quarterly").checked = true;
				break;
			case "yearly":
				document.getElementById("edit_event_yearly").checked = true;
				break;
			default:
				document.getElementById("edit_event_none").checked = true;
		}

		switch (events[eventId]["task_type"]) {
			case "private":
				document.getElementById("edit_event_privateTask").checked = true;
				break;
			default:
				document.getElementById("edit_event_externalTask").checked = true;
		}
		
		const milestone_container = document.querySelector("#milestones")

		while (milestone_container.firstChild) {
			milestone_container.removeChild(milestone_container.firstChild);
		}
		
		JSON.parse(button.getAttribute("data-milestones").replace(/'/g, '"')).forEach((milestone) => {
			const milestoneElement = document.createElement("div");
			milestoneElement.className = "input-group mb-3";
			
			milestoneElement.id = `milestone_${milestone.id}`;

			milestoneElement.innerHTML = `
				<span class="form-control" style="cursor: default;">${milestone.name}</span>
				<span class="form-control" style="max-width: fit-content; cursor: default;">${milestone.date}</span>
				<span class="form-control" style="max-width: fit-content; cursor: default;">${milestone.number}</span>
				<button type="button" class="btn btn-success edit_milestone_button" style="background-color: #2890e3; border-color: #2890e3; color: #f0f0f0;">
					<i class="bi bi-gear-fill"></i>
				</button>
				<button type="button" class="btn btn-danger delete_milestone_button">
					<i class="bi bi-x-lg"></i>
				</button>
			`;

			milestone_container.appendChild(milestoneElement);
			console.log(milestoneElement)
			milestoneElement.querySelector(".edit_milestone_button").addEventListener("click", function (event) {
				$("#editModal").modal("hide");
				document.getElementById("editmilestoneName").value = event.target.closest(".input-group").querySelector("span:nth-child(1)").innerText
				document.getElementById("editmilestoneDate").value = event.target.closest(".input-group").querySelector("span:nth-child(2)").innerText
				document.getElementById("editmilestoneNumber").value = event.target.closest(".input-group").querySelector("span:nth-child(3)").innerText
				$("#editMilestoneModal").modal("show");

				$("#editMilestoneModal").on("hidden.bs.modal", function () {
					$("#editModal").modal("show");
				});

				document.getElementById("submiteditmilestonebutton").addEventListener("click", function () {
					// Get the data from the milestone form
					const milestoneName = document.getElementById("editmilestoneName").value;
					const milestoneDate = document.getElementById("editmilestoneDate").value;
					const milestoneNumber = document.getElementById("editmilestoneNumber").value;

					// Update the milestone element
					const milestoneElement = event.target.closest(".input-group");
					milestoneElement.querySelector("span:nth-child(1)").innerText = milestoneName;
					milestoneElement.querySelector("span:nth-child(2)").innerText = milestoneDate;
					milestoneElement.querySelector("span:nth-child(3)").innerText = milestoneNumber;

					// Close the milestone modal and reopen the edit event modal
					$("#editMilestoneModal").modal("hide");
					$("#editModal").modal("show");
				});
			})
			milestoneElement.querySelector(".delete_milestone_button").addEventListener("click", function (event) {
				event.target.closest(".input-group").remove();
			})
		})

		$("#editModal").modal("show");
	});
});

document.querySelectorAll(".deleteEventBtn").forEach((button) => {
	button.addEventListener("click", function (event) {
		event.preventDefault();
		let eventId = button.getAttribute("data-eventid");

		document.getElementById("deleteEventId").value = eventId;
		document.getElementById("eventNameToDelete").innerHTML = events[eventId]["name"];

		$("#deleteModal").modal("show");
	});
});