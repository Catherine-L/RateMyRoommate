$("#commentFormDiv").hide();

$("#addCommentButton").click(function() {
    $("#commentFormDiv").toggle();
});

$("#addCommentForm").submit(e => {
    e.preventDefault();
    const formData = {
        comment: $("#addCommentBox").val()
    };
    $.ajax({
        type: "POST",
        url: window.location.pathname + "/comment",
        data: JSON.stringify(formData),
        success: function(data) {
            $("#commentFormDiv").toggle(); //hide comment box
            if(data.errors.length > 0)
                $("#commentFormResponse").text(data.errors[0]);
            else if(!data.success)
                $("#commentFormResponse").text("An error has occured but not been reported");
            else
                $("#commentFormResponse").text("Your comment has been submitted");
        },
        contentType: "application/json",
        dataType: "json"
    });
});

$("#deleteSpam").submit(e => {
    e.preventDefault();
    var comment = $("#commentID").val()
    const formData = {
        comment: $("#deleteSpam").val()
    };
    if (confirm("Are you sure you want to delete this comment?"))
    {
        $.ajax({
            type: "POST",
            url: window.location.pathname + "/delete/" + comment,
            data: JSON.stringify(formData),
            success: function(data) {
                $("#adminOptions").hide();
                if(!data.success)
                    $("#adminResponse").text("An error has occured but not been reported");
                else
                    $("#adminResponse").text("This comment has been deleted");
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
});

$("#unflagSpam").submit(e => {
    e.preventDefault();
    var comment = $("#commentID").val()
    const formData = {
        comment: $("unflagSpam").val()
    };
    if (confirm("Are you sure you want to unflag this comment?"))
    {
        $.ajax({
            type: "POST",
            url: window.location.pathname + "/unflag/" + comment,
            data: JSON.stringify(formData),
            success: function(data) {
                $("#adminOptions").hide();
                if(!data.success)
                    $("#adminResponse").text("An error has occured but not been reported");
                else
                    $("#adminResponse").text("This comment has been unflagged as spam");
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
});