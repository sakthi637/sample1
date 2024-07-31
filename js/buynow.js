document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.buynow-new-address-form');
    const inputs = form.querySelectorAll('input[type="text"]');
    const phoneInput = form.querySelector('input[placeholder="10-digit mobile number"]');
    const pincodeInput = form.querySelector('input[placeholder="Pincode"]');
    const nameInput = form.querySelector('input[placeholder="Name"]');
    const addressInput = form.querySelector('input[placeholder="Address (Area and Street)"]');
    const cityInput = form.querySelector('input[placeholder="City/District/Town"]');

    const currentLocationBtn = form.querySelector('.buynow-current-location-btn');
    const saveBtn = form.querySelector('.buynow-save-btn');
    const cancelBtn = form.querySelector('.buynow-cancel-btn');
    const changeBtn = document.querySelector('#buynow-login-section button');
    const viewAllBtn = document.querySelector('.buynow-view-all-btn');

    function validatePhoneNumber(phone) {
        return /^\d{10}$/.test(phone);
    }

    function validatePincode(pincode) {
        return /^\d{6}$/.test(pincode);
    }

    function validateTextInput(input) {
        return input.trim() !== '';
    }

    function showAlert(message) {
        alert(message);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        if (!validateTextInput(nameInput.value)) {
            showAlert('Please enter a valid name.');
            isValid = false;
        }

        if (!validatePhoneNumber(phoneInput.value)) {
            showAlert('Please enter a valid 10-digit mobile number.');
            isValid = false;
        }

        if (!validatePincode(pincodeInput.value)) {
            showAlert('Please enter a valid 6-digit pincode.');
            isValid = false;
        }

        if (!validateTextInput(addressInput.value)) {
            showAlert('Please enter a valid address.');
            isValid = false;
        }

        if (!validateTextInput(cityInput.value)) {
            showAlert('Please enter a valid city/district/town.');
            isValid = false;
        }

        if (isValid) {
            window.location.href = 'conform.html';
        }
    });

    currentLocationBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showAlert('Using current location.');
    });

    cancelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showAlert('Address entry cancelled.');
        form.reset();
    });

    changeBtn.addEventListener('click', function () {
        showAlert('Do You Need to Change Your login info.');
    });

    viewAllBtn.addEventListener('click', function () {
        showAlert('Viewing all addresses.');
    });

    saveBtn.addEventListener('click', function (e) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    });
});
