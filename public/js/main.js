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

$(".flagCommentFormDiv").hide();

$(".flagCommentButton").click(function() {
    $(this).parent().find(".flagCommentFormDiv").toggle();
});

$(".flagCommentForm").submit(e => {
    e.preventDefault();
    let flaggedCommentID = $(this).find(".flaggedCommentID").val();
    const formData = {
        reason: $(this).parent().find(".flagCommentBox").val()
    };
    var $t = $(this);
     $(this).parent().find(".test").text("this works with this");
    $.ajax({
        type: "POST",
        url: window.location.pathname + "/comments/"+flaggedCommentID+"/flag/",
        data: JSON.stringify(formData),
        success: function(data) {
            //$(".flagCommentFormDiv").hide();
           // $t.closest(".flagCommentFormDiv").hide();
           $t.parent().find(".test").text("this works");
            if(data.errors.length > 0)
                $(".flagCommentFormResponse").text(data.errors[0]);
                //$(this).parent().parent().find(".flagCommentFormResponse").text(data.errors[0]);
            else if(!data.success)
                 $(".flagCommentFormResponse").text("An error has occured but not been reported");
                 //$(this).parent().parent().find(".flagCommentFormResponse").text("An error has occured but not been reported");
            else
                $(".flagCommentFormResponse").text("You have reported this comment as spam");
                //$(this).parent().parent().find(".flagCommentFormResponse").text("You have reported this comment as spam");
        },
        contentType: "application/json",
        dataType: "json"
    });
});
