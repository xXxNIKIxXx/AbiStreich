const lock_buttons = document.querySelectorAll(".lock");

lock_buttons.forEach((button) => {
	button.addEventListener("click", function (event) {
		const userId = button.getAttribute("data-userid");
		const form = document.createElement("form");
		form.method = "post";
		form.action = "/users";

		const actionInput = document.createElement("input");
		actionInput.type = "hidden";
		actionInput.name = "action";
		actionInput.value = "lock";
		form.appendChild(actionInput);

		const userIdInput = document.createElement("input");
		userIdInput.type = "hidden";
		userIdInput.name = "userid";
		userIdInput.value = userId;
		form.appendChild(userIdInput);

		document.body.appendChild(form);
		form.submit();
	});
});

const delete_buttons = document.querySelectorAll(".delete");

delete_buttons.forEach((button) => {
	button.addEventListener("click", function (event) {
		const userId = button.getAttribute("data-userid");
		const username = button.getAttribute("data-username");
		document.getElementById("deleteUserModal_userid").value = userId;
		document.getElementById("deleteUserModal_username_display").innerText =
			username;
		$("#deleteUserModal").modal("show");
	});
});

const deleteUserModal_confirmationInput = document.getElementById(
	"deleteUserModal_confirmationInput"
);

deleteUserModal_confirmationInput.addEventListener("input", function (event) {
	const deleteButton = document.getElementById("deleteButton");
	if (
		deleteUserModal_confirmationInput.value ===
		document.getElementById("deleteUserModal_username_display").innerText
	) {
		deleteButton.disabled = false;
	} else {
		deleteButton.disabled = true;
	}
});

const edit_buttons = document.querySelectorAll(".edit");

edit_buttons.forEach((button) => {
	button.addEventListener("click", function (event) {
		document.getElementById("editUserModal_userid").value = button.getAttribute("data-userid");
		document.getElementById("editUserModal_usr_username").value = button.getAttribute("data-username");
		document.getElementById("editUserModal_usr_email").value = button.getAttribute("data-email");
		console.log(button.getAttribute("data-permissions"))
		$('#editUserModal_permissions').selectpicker('val', button.getAttribute("data-permissions"));

		$("#editUserModal").modal("show");
	});
});

$(document).ready(function () {
	const table = $(".sorting").DataTable({
		bSort: true,
		aoColumnDefs: [{
			aTargets: ["non_sort"],
			bSortable: false,
		}, ],
		dom: '<"d-flex justify-content-between"<"dataTables_length"l><"d-flex"<"dataTables_filter"f><"custom-button">>>t<"d-flex justify-content-between"<"dataTables_info"i><"pagination"p>>',
	});

	let updateButtonHtml = '<button id="update_schedule_button" class="btn btn-primary"><i class="bi bi-arrow-repeat"></i>Schedule Update</button>';
	if (updating) {
		updateButtonHtml = '<button id="update_schedule_button" class="btn btn-warning"><i class="bi bi-hourglass-split"></i> Updating... </button>';
	}

	$("div.custom-button").html(
		'<div class="btn-group" role="group">' +
		'<button id="add_user_button" class="btn btn-success"><i class="bi bi-person-fill-add"></i> Add User</button>' +
		updateButtonHtml +
		'</div>'
	);

	// Attach an event to the button
	$("#update_schedule_button").on("click", function () {
		// Send a GET request to /schedule_update
		window.location.href = "/schedule_update";
	});

	// Attach an event to the button
	$("#add_user_button").on("click", function () {
		// Open the custom modal
		$("#addUserModal").modal("show");
	});
});