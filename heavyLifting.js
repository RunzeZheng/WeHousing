/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var actual_JSON;

function loadJSON(file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function load() {
    loadJSON("apartment.json", function (response) {
        actual_JSON = JSON.parse(response);
        loadPageNum(actual_JSON);
        loadData(actual_JSON, 0);
    });
}

function loadPageNum(data) {
    var max = 5, dataLength = data.apartments.length, page = 2, pageNum;
    //create page number
    if (dataLength < max) {//only 1 page
        max = dataLength;
    } else {
        pageNum = "<ul class='pagination'><li id='prevPage' onclick='changePage(" + data.apartments.length + ", this)'>«</li>" +
                "<li id='1' class='active' onclick='changePage(" + data.apartments.length + ", this)'>1</li>";
        while (dataLength > 10) {
            dataLength -= 5;
            pageNum += "<li id='" + page + "' onclick='changePage(" + data.apartments.length + ", this)'>" + page++ + "</li>";
        }
        dataLength -= 5;
        pageNum += "<li id='" + page + "' onclick='changePage(" + data.apartments.length + ", this)'>" + page++ + "</li>" +
                "<li id='nextPage' onclick='changePage(" + data.apartments.length + ", this)'>»</li></ul>";
        document.getElementById("pageList").innerHTML = pageNum;
    }
}

function loadData(data, startingPoint) {
    console.log("load data: ");
    console.log(data);
    var size = 0, i, txt = "<tbody>", max = 5;

    //create apt table
    if (max + startingPoint > data.apartments.length) {
        max = data.apartments.length;
    } else {
        max += startingPoint;
    }
    for (i = startingPoint; i < max; i++) {
        size += 1;
        txt += "<tr>" +
                "<td id='tableRow'onmouseover='highLight(this)' onmouseout='deHighLight(this)'>" +
                "<img src='" + data.apartments[i].image + "' id='aptPics'>" +
                "<span id='aptInfo'><h2><a href='#' onclick='detail(this)'>" + data.apartments[i].name + "</a></h2>" +
                "<p id='description'>" + data.apartments[i].description + "</p>" +
                "<p id='from'>From " +
                "<span id='price'> $" + data.apartments[i].price + "</span></p>" +
                "<p id='priceUnit'>USD / Month</p></span>" +
                "</td>" +
                "</tr>";
    }
    txt += "</tbody>";
    document.getElementById("locationHeader").innerHTML = "Minneapolis, MN: " + data.apartments.length + " Apartment(s).";
    document.getElementById("aptTable").innerHTML = txt;
}

function sortByPopularity() {
    document.getElementById("priceButton").style.backgroundColor = "lightgray";
    document.getElementById("priceButton").style.textColor = "gray";
    document.getElementById("priceButton").style.fontWeight = "normal";
    document.getElementById("popButton").style.backgroundColor = "gold";
    document.getElementById("popButton").style.textColor = "black";
    document.getElementById("popButton").style.fontWeight = "bold";

    var actual_JSON;
    loadJSON("apartment.json", function (response) {
        actual_JSON = JSON.parse(response);
        actual_JSON.apartments.sort(function (a, b) {
            return b["popularity"] - a["popularity"];
        });
        console.log(actual_JSON);
        loadData(actual_JSON, 0);
    });
}

function sortByPrice() {
    document.getElementById("popButton").style.backgroundColor = "lightgray";
    document.getElementById("popButton").style.textColor = "gray";
    document.getElementById("popButton").style.fontWeight = "normal";
    document.getElementById("priceButton").style.backgroundColor = "gold";
    document.getElementById("priceButton").style.textColor = "black";
    document.getElementById("priceButton").style.fontWeight = "bold";


    loadJSON("apartment.json", function (response) {
        actual_JSON = JSON.parse(response);
        actual_JSON.apartments.sort(function (a, b) {
            return b["price"] - a["price"];
        });
        loadData(actual_JSON, 0);
    });
}

function highLight(ele) {
    ele.style.backgroundColor = "darkgray";
}

function deHighLight(ele) {
    ele.style.backgroundColor = "white";
}

function detail(ele) {
    console.log(ele);
    window.open("detail.html?" + ele.innerHTML);
}

function changePage(data, page) {
    var goto = page.getAttribute('id'), currentPage = document.getElementsByClassName("active")[0].id;
    var maxPage = Math.ceil(data / 5);
    console.log("current Page: " + currentPage);

    if (goto == "prevPage" && currentPage > 1) {
        goto = currentPage - 1;
        console.log("going to page: " + goto);
    } else if (goto == "nextPage" && currentPage < maxPage) {
        goto = parseInt(currentPage) + 1;
        console.log("going to page: " + goto);
    }
    if (goto != "prevPage" && goto != "nextPage") {
        var itemStart = (goto - 1) * 5;

        document.getElementsByClassName("active")[0].removeAttribute("class");
        var page = document.getElementById(goto.toString());
        page.setAttribute("class", "active");

        //loadJSON("apartment.json", function(response) {  
        //actual_JSON = JSON.parse(response);
        loadData(actual_JSON, itemStart);
        //});   
        document.getElementsByClassName("active")[0].removeAttribute("class");
        var page = document.getElementById(goto.toString());
        page.setAttribute("class", "active");
    }
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1);
    var result = query.replace(/%20/g, " ");

    return result;
}

function showChosenApt(url) {
    var data = parseURLParams(url);
    document.getElementById("aptChosen").innerHTML = data;
}
