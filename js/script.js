/*
    Javascript file for project
*/
var gitIssues = {

    /*
        @param: API Url of github
        Call the above api and fetches the list of issues for the given repo
    */
    api: function(api_url) {
        $('.loader').show();
        $.ajax({
            type: "GET",
            url: api_url,
            success: function(response) {
                gitIssues.countIssuesInIntervals(response);
                $(".alert").text("Success");
                $(".alert").addClass("alert-success");
                setTimeout(function() {
                    $(".alert").text("");
                    $(".alert").removeClass("alert-success");
                }, 3000);
                $('.loader').hide();
            },
            error: function() {
                $(".alert").text("Error");
                $(".alert").addClass("alert-danger");
                $(".loader").hide();
            }
        });
    },

    /*
        @param: Issues of repo fetched from github api
        Function will count number of issues in the specified intervals
    */
    countIssuesInIntervals: function(issues) {
        var one_day = 24 * 60 * 60 * 1000;
        var cur_date = new Date();
        var last_24_hours = (new Date(new Date().getTime() - one_day)).toISOString();
        var last_7_days = (new Date(new Date().getTime() - 7*one_day)).toISOString();
        var total_issues = issues.length;
        var last_24_hours_issues = 0;
        var last_7_days_issues = 0;

        $.each(issues, function(key, issue){
            created_at = issue["created_at"];
            if(created_at >= last_24_hours) last_24_hours_issues++;
            if(created_at >= last_7_days) last_7_days_issues++;
        });
        between_7_days_and_24_hours_issues = last_7_days_issues - last_24_hours_issues;
        before_7_days_issues = total_issues - last_7_days_issues;
        gitIssues.displayInformation(total_issues, last_24_hours_issues, between_7_days_and_24_hours_issues, before_7_days_issues);
    },

    /*
        @params: Number of issues in each specified intervals
        Function will set number of issues in dom element for showinng in table
    */
    displayInformation: function(total_issues, last_24_hours_issues, between_7_days_and_24_hours_issues, before_7_days_issues) {
        $(".issue-table").css("display","block");
        $("#total_issues").text(total_issues);
        $("#last_24_hours_issues").text(last_24_hours_issues);
        $("#between_7_days_and_24_hours_issues").text(between_7_days_and_24_hours_issues);
        $("#before_7_days_issues").text(before_7_days_issues);
    }
};

jQuery(document).ready(function () {

    $("#url_form_btn").on("click", function() {
        $(".issue-table").css("display","none");
        var url = $("#repo_url").val();
        var url_split = url.split("/");
        if( url_split.length >4 && (url_split[0] == "http:" || url_split[0] == "https:") && ( url_split[2] == "github.com" || url_split[2] == "www.github.com" ) ) {
            var user = url_split[3];
            var repo = url_split[4];
            var api_url = "https://api.github.com/repos/"+ user + "/" + repo + "/issues";
            gitIssues.api(api_url);
        }
        else {
            $(".alert").text("Invalid url");
        }
    });
});
