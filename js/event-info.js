var event = JSON.parse(sessionStorage.getItem('event-info'));
$(document).ready(function(){
    var divInfo = $('.form');
    for(var key in event){
        var name = "";
        var value = "";
        if(key == "id"){
            continue;
        }
        if(key == "date"){
            name = 'Дата';
            value = event["date"];
        }
        if(key == "startTime"){
            name = 'С';
            value = event["startTime"];
        }
        if(key == "endTime"){
            name = 'По';
            value = event["endTime"];
        }
        if(key == "name"){
            name = 'Название'; 
            value = event["name"];
            if(value==''){
                value = 'Не указано';
            }
        }
        if(key == "status"){
            name = 'Статус';
            value = event["status"];
        }
        if(key == "allDay"){
            name = 'На весь день';
            value = event["allDay"]?'Да':'Нет';
        }
        if(key == "client"){
            name = 'Клиент';
            value = event["client"];
            if(value==''){
                value = 'Не указан';
            }
        }
        divInfo.append('<div class="elem-doc">'+
                            '<div class="signature">'+name+':</div>'+
                            '<div class="elem-doc-value">'+value+'</div>'+
                    '</div><br/>');
    }

    $('.button').click(function(e){
        window.location.href = './calendar-day.html';
    });
});