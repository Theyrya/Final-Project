document.addEventListener('DOMContentLoaded', function () {

    function Settings(event) {
        event.preventDefault();
        alert("Settings functionality will be implemented soon.");
    }

    const formElements = document.querySelectorAll('input[required], textarea[required]');
    formElements.forEach(function (element) {
        element.addEventListener('input', function () {
            validateForm();
        });
    });

    function validateForm() {
        let valid = true;

        formElements.forEach(function (element) {
            if (element.type === 'radio') {
                const radioGroup = document.getElementsByName(element.name);
                let groupValid = false;
                radioGroup.forEach(function (radio) {
                    if (radio.checked) {
                        groupValid = true;
                    }
                });
                if (!groupValid) valid = false;
            } else {
                if (!element.value.trim()) {
                    valid = false;
                }
            }
        });

        const submitButton = document.querySelector('button[type="submit"]');
        if (valid) {
            submitButton && (submitButton.disabled = false);
        } else {
            submitButton && (submitButton.disabled = true);
        }
    }

    const settingsLink = document.querySelector('a[href="settings.html"]');
    if (settingsLink) {
        settingsLink.addEventListener('click', Settings);
    }

    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            console.log(`Opening ${link.href} in a new tab.`);
        });
    });

});
