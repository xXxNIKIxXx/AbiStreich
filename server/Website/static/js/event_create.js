const milestone_save_button = document.getElementById("milestonebutton_d8mZWPiyGe");

new bootstrap.Modal(document.getElementById('MilestoneModal_d8mZWPiyGe'));

new bootstrap.Modal(document.getElementById('EditMilestoneModal_d8mZWPiyGe'));

var milestoneid = 0;

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function addMilestone() {
  let milestoneName = document.getElementById('milestoneName_d8mZWPiyGe').value;
  let milestoneDate = document.getElementById('milestoneDate_d8mZWPiyGe').value;
  let milestoneNumber = document.getElementById('milestoneNumber_d8mZWPiyGe').value;

  // Save the milestone (you can add your saving logic here)
  console.log('Milestone added:', milestoneName, milestoneDate, milestoneNumber);


  // Close the modal
   const createMilestoneModal = bootstrap.Modal.getInstance(document.getElementById('MilestoneModal_d8mZWPiyGe'));
   createMilestoneModal.hide();

  const milestoneContainer = document.getElementById('milestones_d8mZWPiyGe');
  const milestoneElement = document.createElement('div');
  milestoneElement.className = 'input-group mb-3';
  milestoneElement.id = `milestone_${milestoneid}`;
  milestoneElement.innerHTML = `
    <span class="form-control" style="cursor: default;">${escapeHtml(milestoneName)}</span>
    <span class="form-control" style="max-width: fit-content; cursor: default;">${escapeHtml(milestoneDate)}</span>
    <span class="form-control" style="max-width: fit-content; cursor: default;">${escapeHtml(milestoneNumber)}</span>
    <button type="button" class="btn btn-success edit_milestone_button" style="background-color: #2890e3; border-color: #2890e3; color: #f0f0f0;">
        <i class="bi bi-gear-fill"></i>
    </button>
    <button type="button" class="btn btn-danger delete_milestone_button">
        <i class="bi bi-x-lg"></i>
    </button>
  `;

    // Reset the modal inputs
    document.getElementById('milestoneName_d8mZWPiyGe').value = '';
    document.getElementById('milestoneDate_d8mZWPiyGe').value = '';
    document.getElementById('milestoneNumber_d8mZWPiyGe').value = '';
    milestoneContainer.appendChild(milestoneElement);

    milestoneElement.querySelector('.delete_milestone_button').addEventListener('click', function() {
        milestoneElement.remove();
    });

    milestoneElement.querySelector('.edit_milestone_button').addEventListener('click', function(e) {
        editMilestone(e)
    });

    milestoneid++;
}

function editMilestone(e) {
    console.log(e)

    const milestoneElement = e.target.closest('.input-group');
    const milestoneName = milestoneElement.children[0].innerText;
    const milestoneDate = milestoneElement.children[1].innerText;
    const milestoneNumber = milestoneElement.children[2].innerText;

    document.getElementById('EditmilestoneId_d8mZWPiyGe').value = milestoneElement.id;

    document.getElementById('EditmilestoneName_d8mZWPiyGe').value = milestoneName;
    document.getElementById('EditmilestoneDate_d8mZWPiyGe').value = milestoneDate;
    document.getElementById('EditmilestoneNumber_d8mZWPiyGe').value = milestoneNumber;

    const createMilestoneModal = bootstrap.Modal.getInstance(document.getElementById('EditMilestoneModal_d8mZWPiyGe'));
    createMilestoneModal.show();

}

milestone_save_button.addEventListener("click", function (event) {
    addMilestone()
});

document.querySelector("#Editmilestonebutton_d8mZWPiyGe").addEventListener("click", function (event) {
    const milestoneElement = document.getElementById(document.getElementById('EditmilestoneId_d8mZWPiyGe').value);

    const milestoneName = document.getElementById('EditmilestoneName_d8mZWPiyGe').value;
    const milestoneDate = document.getElementById('EditmilestoneDate_d8mZWPiyGe').value;
    const milestoneNumber = document.getElementById('EditmilestoneNumber_d8mZWPiyGe').value;

    milestoneElement.children[0].innerText = milestoneName;
    milestoneElement.children[1].innerText = milestoneDate;
    milestoneElement.children[2].innerText = milestoneNumber;

    const editMilestoneModal = bootstrap.Modal.getInstance(document.getElementById('EditMilestoneModal_d8mZWPiyGe'));
    editMilestoneModal.hide();
});

