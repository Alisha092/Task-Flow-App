$(".sidebar ul li").on('click', function () {
    $(".sidebar ul li.active").removeClass('active');
    $(this).addClass('active');
});

$('.open-btn').on('click', function () {
    $('.sidebar').addClass('active');

});


$('.close-btn').on('click', function () {
    $('.sidebar').removeClass('active');

})

function handleItemClick(element) {
    const target = element.getAttribute('data-target');
    switch (target) {
        case 'newTask':
            // Code to handle the 'New Task' item click

            break;

        case 'renderTasks':
            // Code to handle the 'Render Tasks' item click
            console.log('Render Tasks clicked');
            console.dir(element)
            break;
    }
    console.log('Clicked element with target:', target);
}

document.addEventListener('DOMContentLoaded', function () {
    const topicSelect = document.getElementById('topicSelect');
    const newTopicInput = document.getElementById('newTopicInput');

    topicSelect.addEventListener('change', function () {
        if (topicSelect.value === 'addNew') {
            newTopicInput.classList.remove('d-none');
        } else {
            newTopicInput.classList.add('d-none');
        }
    });
});