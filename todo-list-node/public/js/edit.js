$(document).ready(function () {
    $('#form').validate({
        rules: {
            title: {
                required: true
            }
        },
        messages: {
            title: 'Please enter a description.',
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});