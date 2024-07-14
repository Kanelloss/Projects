$(function() {
    var debounceTimeout = null;

    $('#searchInput').on('input', function() { // Changed from $('searchInput') to $('#searchInput')
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            getMovie(this.value.trim());
        }, 1500);
    });

    $('#showMore').on('click', function(e) { // Added e parameter and e.preventDefault()
        e.preventDefault(); // Added this line
        onShowMoreClicked();
    });
});

function getMovie(title) {
    if (!title) return;

    onBeforeSend();
    fetchMovieFromApi(title);
}

function fetchMovieFromApi(title) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', `http://www.omdbapi.com/?t=${title}&apiKey=c79ee41a`, true);
    xhr.timeout = 5000;
    xhr.ontimeout = (e) => onApiError(e);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                handleResults(JSON.parse(xhr.responseText));
            } else {
                onApiError();
            }
        }
    };
    xhr.send();
}

function handleResults(response) {
    if (response.Response === 'True') {
        let transformed = transform(response);
        buildMovie(transformed);
    } else if (response.Response === 'False') {
        hideComponent('#waiting');
        showNotFound();
    }
}

function transform(response) {
    let camelCaseKeysResponse = camelCaseKeys(response);
    clearNotAvailableInformation(camelCaseKeysResponse);
    buildImdbLink(camelCaseKeysResponse);
    return camelCaseKeysResponse;
}

function camelCaseKeys(response) {
    return _.mapKeys(response, (v, k) => _.camelCase(k));
}

function clearNotAvailableInformation(response) {
    for (const key in response) {
        if (response.hasOwnProperty(key) && response[key] === 'N/A') {
            response[key] = '';
        }
    }
}

function buildImdbLink(response) {
    if (response.imdbId && response.imdbId !== 'N/A') {
        response.imdbId = `https://www.imdb.com/title/${response.imdbId}`;
    }
}

function buildMovie(response) {
    if (response.poster) {
        $('#image').attr('src', response.poster).on('load', function() { // Fixed typo 'response.poster'
            buildMovieMetadata(response, $(this));
        });
    } else {
        buildMovieMetadata(response);
    }
}

function buildMovieMetadata(response, imageTag) {
    hideComponent('#waiting');
    handleImage(imageTag);
    handleLiterals(response);
    showComponent('.movie'); // Changed from '#movie' to '.movie'
}

function hideComponent(selector) {
    return $(selector).addClass('hidden');
}

function handleImage(imageTag) {
    if (imageTag) {
        $('#image').replaceWith(imageTag);
    } else {
        $('#image').removeAttr('src');
    }
}

function handleLiterals(response) {
    $('.movie').find('[id]').each(function(index, item) { // Changed from $('#movie') to $('.movie')
        if ($(item).is('a')) {
            $(item).attr('href', response[item.id]);
        } else {
            let valueElement = $(item).children('span');
            let metadataValue = response[item.id];

            valueElement.length ? valueElement.text(metadataValue) : $(item).text(metadataValue);
        }
    });
}

function showNotFound() {
    $('.not-found').removeClass('hidden').appendTo($('.center')); // Removed clone() as it's not needed
}

function hideNotFound() {
    $('.center').find('.not-found').remove();
}

function showError() {
    $('.error').removeClass('hidden').appendTo($('.center')); // Removed clone() as it's not needed
}

function hideError() {
    $('.center').find('.error').remove();
}

function hideExtras() {
    $('.extended').hide();
}

function collapsePlot() {
    $('#plot').removeClass('expanded');
}

function showComponent(selector) {
    return $(selector).removeClass('hidden'); // Removed clone() and appendTo($('.center')) as it's not needed
}

function onBeforeSend() {
    showComponent('#waiting');
    hideComponent('.movie'); // Changed from '#movie' to '.movie'
    hideNotFound();
    hideError();
    collapsePlot();
    hideExtras();
}

function onApiError() {
    hideComponent('#waiting');
    showError();
}

function onShowMoreClicked() {
    $('#plot').toggleClass('expanded');
    if ($('.extended').is(':visible')) {
        $('.extended').hide(700);
    } else {
        $('.extended').show(700);
    }
}
