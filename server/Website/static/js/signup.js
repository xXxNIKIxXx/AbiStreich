(() => {
	"use strict";

	const resetForm = document.getElementById("resetForm");
	const password = document.getElementById("password");
	const confirmPassword = document.getElementById("confirmPassword");
	const submitButton = document.getElementById("submitButton");
	const minLength = document.getElementById("minLength");
	const hasNumber = document.getElementById("hasNumber");
	const hasSpecial = document.getElementById("hasSpecial");
	const hasLowerUpper = document.getElementById("hasLowerUpper");
	const strengthMeter = document
		.getElementById("strengthMeter")
		.querySelector("span");
	const togglePassword = document.getElementById("togglePassword");
	const toggleConfirmPassword = document.getElementById(
		"toggleConfirmPassword"
	);

	function checkPasswordStrength() {
		const passwordValue = password.value;
		let strength = 0;

		if (passwordValue.length >= 8) {
			minLength.classList.add("valid");
			minLength.classList.remove("invalid");
			strength++;
		} else {
			minLength.classList.add("invalid");
			minLength.classList.remove("valid");
		}

		if (/\d/.test(passwordValue)) {
			hasNumber.classList.add("valid");
			hasNumber.classList.remove("invalid");
			strength++;
		} else {
			hasNumber.classList.add("invalid");
			hasNumber.classList.remove("valid");
		}

		if (/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) {
			hasSpecial.classList.add("valid");
			hasSpecial.classList.remove("invalid");
			strength++;
		} else {
			hasSpecial.classList.add("invalid");
			hasSpecial.classList.remove("valid");
		}

		if (/[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue)) {
			hasLowerUpper.classList.add("valid");
			hasLowerUpper.classList.remove("invalid");
			strength++;
		} else {
			hasLowerUpper.classList.add("invalid");
			hasLowerUpper.classList.remove("valid");
		}

		if (strength === 0) {
			strengthMeter.style.width = "0";
			strengthMeter.className = "";
		} else if (strength === 1) {
			strengthMeter.style.width = "25%";
			strengthMeter.className = "strength-weak";
		} else if (strength === 2) {
			strengthMeter.style.width = "50%";
			strengthMeter.className = "strength-medium";
		} else if (strength === 3) {
			strengthMeter.style.width = "75%";
			strengthMeter.className = "strength-medium";
		} else if (strength === 4) {
			strengthMeter.style.width = "100%";
			strengthMeter.className = "strength-strong";
		}
	}

	function allRulesValid() {
		return (
			minLength.classList.contains("valid") &&
			hasNumber.classList.contains("valid") &&
			hasSpecial.classList.contains("valid") &&
			hasLowerUpper.classList.contains("valid")
		);
	}

	resetForm.addEventListener("submit", (event) => {
		document.querySelectorAll(".requirements").forEach((element) => {
			element.style.display = "block";
		});

		let formValid = resetForm.checkValidity();
		let rulesValid = allRulesValid();
		let passwordsMatch = password.value === confirmPassword.value;

		if (password.value.length > 0 && rulesValid == false) {
			password.parentElement.querySelector(".invalid-feedback").textContent =
				"Your password must meet all the requirements.";
		}

		if (!formValid || !rulesValid || !passwordsMatch) {
			event.preventDefault();
			event.stopPropagation();

			if (!passwordsMatch) {
				confirmPassword.setCustomValidity("Passwords do not match.");
			} else {
				confirmPassword.setCustomValidity("");
			}

			if (!rulesValid) {
				password.setCustomValidity(
					"Your password must meet all the requirements."
				);
			} else {
				password.setCustomValidity("");
			}
		}

		resetForm.classList.add("was-validated");
	});

	confirmPassword.addEventListener("input", () => {
		if (password.value === confirmPassword.value) {
			confirmPassword.setCustomValidity("");
		} else {
			confirmPassword.setCustomValidity("Passwords do not match.");
		}
	});

	password.addEventListener("input", () => {
		checkPasswordStrength();

		if (password.value.length > 0 && allRulesValid() == false) {
			password.parentElement.querySelector(".invalid-feedback").textContent =
				"Your password must meet all the requirements.";
		} else if (password.value.length == 0) {
			password.parentElement.querySelector(".invalid-feedback").textContent =
				"Please enter a password.";
		} else {
			password.setCustomValidity("");
		}

		if (password.value === confirmPassword.value) {
			confirmPassword.setCustomValidity("");
		} else {
			confirmPassword.setCustomValidity("Passwords do not match.");
		}
	});

	// Toggle password visibility
	togglePassword.addEventListener("click", () => {
		const currentType = password.type;
		password.type = currentType === "password" ? "text" : "password";
		togglePassword.classList.toggle(
			"bi-eye-slash-fill",
			password.type === "password"
		);
		togglePassword.classList.toggle("bi-eye-fill", password.type === "text");
	});

	toggleConfirmPassword.addEventListener("click", () => {
		const currentType = confirmPassword.type;
		confirmPassword.type = currentType === "password" ? "text" : "password";
		toggleConfirmPassword.classList.toggle(
			"bi-eye-slash-fill",
			confirmPassword.type === "password"
		);
		toggleConfirmPassword.classList.toggle(
			"bi-eye-fill",
			confirmPassword.type === "text"
		);
	});
})();