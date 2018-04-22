var doc = new Doc().setJSON(window.sessionStorage.getItem('docInfo'));

$(document).ready(function(){
    var divInfo = $('.form');
    for(var key in doc.info){
        divInfo.append('<div class="elem-doc">'+
                            '<div class="signature">'+key+':</div>'+
                            '<div class="elem-doc-value">'+doc.info[key]+'</div>'+
                    '</div><br/>');
    }

    if(doc.datePol!='' && doc.datePol!=null && doc.datePol!=undefined){
        divInfo.append('<div class="elem-doc">'+
                        '<div class="signature">'+'Дата получения:'+'</div>'+
                        '<div class="elem-doc-value">'+doc.datePol+'</div>'+
                '</div><br/>');  
    }

    if(doc.nomR!='' && doc.nomR!=null && doc.nomR!=undefined){
        divInfo.append('<div class="elem-doc">'+
                        '<div class="signature">'+'№ расписки:'+'</div>'+
                        '<div class="elem-doc-value">'+doc.nomR+'</div>'+
                '</div><br/>');  
    }

    $('.button').click(function(e){
        window.location.href = './docs.html';
    });
});