// main.js

window.onload = async () => {
    if(!catalyst) {
        return;
    }

    const user = await catalyst.userManagement.getCurrentProjectUser().catch(er => console.log("no user: ", er));

    if(!user) {
        window.location.href = '/__catalyst/auth/login'
        return;
    }
    document.getElementById('freeze-layer').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    const tab = document.getElementById('myTab');

    tab.addEventListener('shown.bs.tab', (event) => {
        const activeTabId = event.target.getAttribute('data-bs-target');

        if(activeTabId === 'myreports') {
            populateReport();
        }
    });
});

function populateReport() {
    $.ajax({
        url: "/api/reports",
        type: "get",
        success: function (data) {
            const table = document.getElementById('reports-table');
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            data.forEach((entries, idx) => {
                const tr = document.createElement('tr');
               
                // set serial no
                const serial = document.createElement('th');
                serial.setAttribute('scope', 'row');
                serial.innerText = idx + 1;
                tr.appendChild(serial);

                // set ReportId
                const reportId = document.createElement('th');
                reportId.innerText = entries.id;
                tr.appendChild(reportId);
                
                // set ReportedDate
                const reportedDate = document.createElement('th');
                reportedDate.innerText = entries.date;
                tr.appendChild(reportedDate);

                // set reported city
                const reportedCity = document.createElement('th');
                reportedCity.innerText = entries.city;
                tr.appendChild(reportedCity);

                tbody.appendChild(tr);
            });
            displayTable();
        },
        error: function (error) {
            alert(error.message);
        }
    });
}

function postAlienEncounter() {
    var city = $("#city-post-input").val();
    $.ajax({
        url: "/api/alien",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "city_name": city
        }),
        success: function (data) {
            alert(data.message);
        },
        error: function (error) {
            alert(error.message);
        }
    });
}
 
function getAlienEncounter() {
    showLoader();
    var positive = "https://media.giphy.com/media/Y1GYiLui9NHcxVKhdo/giphy.gif";
    var negative = "https://media.giphy.com/media/fsPcMdeXPxSP6zKxCA/giphy.gif";
    var city = $("#city-get-input").val();
    $.ajax({
        url: "/api/alien?city_name=" + city,
        type: "get",
        success: function (data) {
            console.log(data);
            $("#result-text").text("");
            $("#result-text").text(data.message);
            var imagesrc = negative;
            if (data.signal == 'positive') {
                imagesrc = positive;
            }
            $("#result-image").html("");
            $("#result-image").html("<img src='" + imagesrc + "' />");
            hideLoader();
        },
        error: function (error) {
            alert(error.message);
        }
    });
}

function displayTable(display = true) {
    if(display) {
        $("#reports-loader").hide();
        $("#reports-table").show();
        return;
    }
    $("reports-table").hide();
    $("#reports-loader").show();
    return;
}

function showLoader()
{
    $("#result-container").hide();
    $("#loader").show()
}
 
function hideLoader()
{
    $("#loader").hide()
    $("#result-container").show();
}