(() => {
	"use strict";
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
})();