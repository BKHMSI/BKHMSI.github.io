var html = "";
var unixStart, unixEnd;
$(document).ready( function () {
    $('#table_id').DataTable();
});


function hideShow(){
  if($("#hideCB").is(':checked')){
    $("#devMode").hide();
  } else {
    $("#devMode").show();
  }
}

function httpRequest(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getJSON(handle, max){
  var url = "http://codeforces.com/api/user.status?handle="+handle+"&from=1&count="+max;
  var json = httpRequest(url);
  var obj = JSON.parse(json);
  return obj;
}

function drawTableHeader(problems){
  html = "<table id=\"table_id\" class=\"display\"><thead><tr>";
  html+="<td>Team Handle</td>";
  for(var i = 0; i<problems.length; i++)
      html+=("<td>"+problems[i]+"</td>");
  html+="<td>Score</td>";
  html+="</tr></thead><tbody>";
}

function filterProblemsOfUser(problems, handles, max){
    var totalWC = 0;
    for(var i = 0; i<handles.length; i++){
        var score = 0;
        html+="<tr>";
        html+=("<td style=\"font-style:bold; height: 50px;\">"+handles[i]+"</td>");
        var json = getJSON(handles[i], max);
        for(var j = 0; j<problems.length; j++){
          var wa = 0, ac = 0, time = 0, count = 0, timeAcc = 0;
          for(var k = 0; k<json.result.length; k++){
              var problem = json.result[k].problem.name;
              if(problem == problems[j]){
                var verdict = json.result[k].verdict;
                time = json.result[k].creationTimeSeconds;
                if(time<=unixEnd && time>=unixStart){
                  count++;
                  timeAcc+=(time-unixStart);
                  if(verdict != "OK") wa++;
                  else ac++;
                }
             }
          }
          // # of problems solved * big factor - (20 * wa) - (total times in minutes)
          if(ac){
            html+="<td style=\"background-color:#00e600\"> &#10004 </td>";
          }else if(wa != 0){
            html+="<td style=\"background-color:#e63900\"> &#x2718 </td>";
          }else{
            html+="<td></td>";
          }
        }
        score = count*100000 - (20*wa) - (timeAcc/60.0);
        html+="<td>"+score+"</td>";
        html+="</tr>";
    }
  html+="</tbody></table>";
  $(html).appendTo('#scoreboard');
  $('#table_id').DataTable();
}

function getUserProblems(handles, max){
  var json = getJSON(handles[0], max);
  var handle = json.result[0].author.members[0].handle;
  html = "<table id=\"table_id\" class=\"display\"><thead><tr>";
  html+=("<td>"+handle+" Problems </td>");
  html+=("<td> Verdict </td>");
  html+=("<td> Date </td>");
  html+="</tr></thead><tbody>";
  for(var k = 0; k<json.result.length; k++){
      html+="<tr>";
      var problem = json.result[k].problem.name;
      var verdict = json.result[k].verdict;
      var time = json.result[k].creationTimeSeconds;
      var myDate = new Date( time * 1000);
      html+="<td>"+problem+"</td>";
      html+="<td>"+verdict+"</td>";
      html+="<td>"+myDate.toGMTString()+"</td>";
      html+="</tr>"
  }
  html+="</tbody></table>";
  $(html).appendTo('#scoreboard');
  $('#table_id').DataTable();
}

function run(){
  html = "";
  var txtSDate = $("#sDate").val();
  var txtEDate = $("#eDate").val();
  unixStart = Date.parse(txtSDate).getTime()/1000;
  unixEnd = Date.parse(txtEDate).getTime()/1000;

  $("#scoreboard").html(html);
  var usersText = $("#handles").val();
  var prblmsText = $("#problems").val();
  var max = $("#count").val();
  if(isNaN(parseInt(max)))
    max = 50;

  var handles = usersText.split("\n");
  var problems = prblmsText.split("\n");
  console.log(problems);
  if(problems.length == 1){
      console.log(handles);
      getUserProblems(handles, parseInt(max));
  }else{
    drawTableHeader(problems);
    filterProblemsOfUser(problems, handles, parseInt(max));
  }
}

/*
DanMaklen
Dokany
Bkhmsi
lightningstruct

Moore's Law
Lucky Numbers
War of the Corporations
Gena's Code
USB Flash Drives
Pasha and Stick
K-special Tables

*/
