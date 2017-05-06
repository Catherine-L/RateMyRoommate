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
        url: "/users/1/comment",
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
