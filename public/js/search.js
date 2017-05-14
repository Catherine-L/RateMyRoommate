(function() {


var nameSearchForm = $("#name-search-form");
var locationSearchForm = $("#location-search-form");


nameSearchForm.submit(function(e) {

    e.preventDefault();

    var name = $("#name-search-name").val();

    if(!name) return;

    $.ajax({

        url: nameSearchUrl(name),
        dataType: "json"

    }).done(handleReceivedUsers);
});


locationSearchForm.submit(function(e) {

    e.preventDefault();

    var state = $("#location-search-state").val();
    var city = $("#location-search-city").val();

    if(!state || !city) return;

    $.ajax({

        url: locationSearchUrl(state, city),
        dataType: "json"

    }).done(handleReceivedUsers);
});


function handleReceivedUsers(users) {

    var $searchResultsTable = $("#search-results-table");
    var $searchResultsTableBody = $searchResultsTable.find(".table-body");
    var $noResultsFound = $(".no-search-results");

    $searchResultsTableBody.html(""); // clear the table body's html

    users.forEach(function(user) {

        var id = user._id;
        var name = user.firstName + " " + user.lastName;
        var city = user.address.city;
        var state = user.address.state;

        $searchResultsTableBody.append(userRow(id, name, city, state));
    });

    if(users.length > 0) {

        $noResultsFound.addClass("hidden");
        $searchResultsTable.removeClass("hidden");

    } else {

        $searchResultsTable.addClass("hidden");
        $noResultsFound.removeClass("hidden");
    }

    function userRow(id, name, city, state) {

        var tr = $("<tr class='user-row'>");
        var a = $("<a class='select-user'>Select</a>");

        tr.append($("<td class='user-row-name'>").text(name));
        tr.append($("<td class='user-row-city'>").text(city));
        tr.append($("<td class='user-row-state'>").text(state));

        a.attr("href", "/users/" + id);
        tr.append($("<td class='user-row-select'>").append(a));

        return tr;
    }
}


function nameSearchUrl(name) {

    var encodedName = encodeURIComponent(name);

    return "/search/name/" + encodedName;
}


function locationSearchUrl(state, city) {

    var encodedState = encodeURIComponent(state);
    var encodedCity = encodeURIComponent(city);

    return "/search/state/" + encodedState + "/city/" + encodedCity;
}

})();
