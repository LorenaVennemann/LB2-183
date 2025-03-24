$(document).ready(function () {
    $('#form').validate({
        rules: {
            title: {
                required: true,
                minlength: 3
            },
            state: {
                required: true
            }
        },
        messages: {
            title: {
                required: 'Please enter a description.',
                minlength: 'Description must be at least 3 characters long.'
            },
            state: 'Please select a state.'
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});