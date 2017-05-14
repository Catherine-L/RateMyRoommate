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

$(document).on("click", "[data-trigger='delete']", function (evt) {
  var commentID = $(this).prev().data("comment");
  console.log(commentID) //index number, can be pretty much anything
  var comment = $(this).prev().val();
  console.log(comment)
  const formData = {
        comment: $(".deleteSpam").val()
    };
    if (confirm("Are you sure you want to delete this comment?"))
    {
        $.ajax({
            type: "POST",
            url: window.location.pathname + "/delete/" + comment,
            data: JSON.stringify(formData),
            success: function(data) {
                $(`*[data-adminoptions="${commentID}"]`).hide();
                if(!data.success)
                    $(`*[data-adminresponse="${commentID}"]`).text("An error has occured but not been reported");
                else
                    $(`*[data-adminresponse="${commentID}"]`).text("This comment has been deleted");
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
});

$(document).on("click", "[data-trigger='unflag']", function (evt) {
  var commentID = $(this).prev().data("comment");
  //console.log(commentID) //index number, can be pretty much anything
  var comment = $(this).prev().val();
  //console.log(comment)
  const formData = {
        comment: $(".unflagSpam").val()
    };
    if (confirm("Are you sure you want to unflag this comment?"))
    {
        $.ajax({
            type: "POST",
            url: window.location.pathname + "/unflag/" + comment,
            data: JSON.stringify(formData),
            success: function(data) {
                $(`*[data-adminoptions="${commentID}"]`).hide();
                if(!data.success)
                    $(`*[data-adminresponse="${commentID}"]`).text("An error has occured but not been reported");
                else
                    $(`*[data-adminresponse="${commentID}"]`).text("This comment has been unflagged");
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
});

$(".flagCommentDiv").hide();

$(".flagCommentButton").click(function() {
    console.log($(this))
    $(this).parent().find(".flagCommentDiv").toggle();
});

$(".flagCommentForm").submit(function(e) {
    e.preventDefault();
    let flaggedCommentID = $(this).find(".flaggedCommentID").val();
    
    const formData = {
        reason: $(this).parent().find(".flagCommentBox").val()
    };
    var $this = $(this);
    $.ajax({
        type: "POST",
        url: window.location.pathname + "/comments/"+flaggedCommentID+"/flag/",
        data: JSON.stringify(formData),
        success: function(data) {
            console.log($this.closest(".flagCommentDiv"));
            $this.closest(".flagCommentDiv").hide();
            if(data.errors.length > 0)
                $this.parent().parent().find(".flagCommentFormResponse").text(data.errors[0]);
            else if(!data.success)
                 $this.parent().parent().find(".flagCommentFormResponse").text("An error has occured but not been reported");
            else
                $this.parent().parent().find(".flagCommentFormResponse").text("You have reported this comment as spam");
        },
        contentType: "application/json",
        dataType: "json"
    });
});
