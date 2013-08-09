$(document).ready(function () {
    $('#f').isHappy({
        fields: {
            // reference the field you're talking about, probably by `id`
            // but you could certainly do $('[name=name]') as well.
            '#username': {
                required: true,
                message: 'Какое-то имя у вас должно быть.'
            },
            '#password': {
                required: true,
                message: 'Вы забыли пароль ввести.',
            },
        },
        submitButton : '#vhodButton',
    });

    $('#addform').isHappy({
        fields: {
            // reference the field you're talking about, probably by `id`
            // but you could certainly do $('[name=name]') as well.
            '#url': {
                required: true,
                message: 'Добавьте ссылку.'
            },
            '#text': {
                required: true,
                message: 'Заголовок забыли!',
            }
        }
    });
}); 
