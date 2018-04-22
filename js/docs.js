var url ='http://localhost/crm_20180419/hs/Docs';
var docs = new ListDoc();

$(document).ready(function(){

    function loadDocs(type, forcedLoading = false, drowing = true){
        if(docs.lists[type].length>0 && !forcedLoading) { 
            //alert(`${forcedLoading} ${drowing}`);
            drowListDoc(type); return;
        }
        mode='load';
        $('.inner-content').html(`<div class="windows8">
                                    <div class="wBall" id="wBall_1">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_2">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_3">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_4">
                                        <div class="wInnerBall"></div>
                                    </div>
                                    <div class="wBall" id="wBall_5">
                                        <div class="wInnerBall"></div>
                                    </div>
                                </div>`);
        switch(type){
            case 'reg':
                docs.lists['reg'] = [];
                $.ajax({
                        url: url+'/getRegDocs',
                        success: function(data){
                            docs.lists['reg'] = docs.setJSON(data);
                            //window.sessionStorage.setItem('docs',JSON.stringify(docs));
                            if(drowing) drowListDoc(type);
                            //alert('усё');
                        },
                        type: "POST",
                        error:function(){
                            alert("Error");
                        }
                    });
            break;

            case 'pol':
                docs.lists['pol'] = [];
                $.ajax({
                        url: url+'/getPolDocs',
                        success: function(data){
                            docs.lists['pol'] = docs.setJSON(data);
                            //window.sessionStorage.setItem('docs',JSON.stringify(docs));
                            if(drowing) drowListDoc(type);
                            //alert('усё');
                        },
                        type: "POST",
                        error:function(){
                            alert("Error");
                        }
                    });
            break;

            case 'zareg':
                docs.lists['zareg'] = [];
                $.ajax({
                        url: url+'/getZaregDocs',
                        success: function(data){
                            docs.lists['zareg'] = docs.setJSON(data);
                            //window.sessionStorage.setItem('docs',JSON.stringify(docs));
                            if(drowing) drowListDoc(type);
                            //alert('усё');
                        },
                        type: "POST",
                        error:function(){
                            alert("Error");
                        }
                    });
            break;
        }
    }

    function setDocs(type,listDocs){
        if(listDocs.length==0){
            alert('Не выбраны документы!');
            return;
        }
        switch(type){
            case 'pol':
                $.ajax({
                    url: url+'/setPolDocs',
                    success: function(data){
                        data = JSON.stringify(data); 
                        data = JSON.parse(data);
                        if(data['status']=='ok') {
                            loadDocs('reg', true, true);
                            loadDocs('pol', true, false);
                        }
                        if(data['status']!='ok') alert(data['status']);
                    },
                    type: "POST",
                    error:function(){
                        alert("Error server");
                    },
                    data: JSON.stringify(listDocs)
                });
            break;

            case 'zareg':
                $.ajax({
                    url: url+'/setZaregDocs',
                    success: function(data){
                        data = JSON.stringify(data); 
                        data = JSON.parse(data);
                        if(data['status']=='ok') {
                            loadDocs('pol', true, true);
                            loadDocs('zareg', true, false);
                        }
                        if(data['status']!='ok') alert(data['status']);
                    },
                    type: "POST",
                    error:function(){
                        alert("Error server");
                    },
                    data: JSON.stringify(listDocs)
                });
            break;
        }
    }

    var mode = 'read';
    var listAddDoc = [];
    $('.inner-content').on('click','.doc',function(e){ 
        if(mode=='load') return;
        if(!$(e.target).hasClass('image-select') && mode=='read' && !$(e.target).hasClass('button-doc-more-info') && $(e.target).parents('.button-doc-more-info').length==0 )      
            docInfo($(this));
    });
    
    $('.inner-content').on('click','.image-select',function(e){
        if(mode=='load') return;     
        if($(this).hasClass('image-select-active')){
            $(this).removeClass('image-select-active');
        }else{
            $(this).addClass('image-select-active');
        }
    });

    function docInfo(elem){
        if($(elem).find('.info-doc').html()==''){
            var doc = docs.searchId(elem.attr('id'));
            var divInfo = $($(elem).find('.info-doc'));
                divInfo.append('<div class="elem-doc">'+
                                    '<div class="signature">'+'Клиент:'+':</div>'+
                                    '<div class="elem-doc-value">'+doc.info['Клиент']+'</div>'+
                            '</div>');
            if(doc.datePol!=null && doc.datePol!=undefined && doc.datePol!=''){
                divInfo.append('<div class="elem-doc">'+
                                    '<div class="signature">Дата получения::</div>'+
                                    '<div class="elem-doc-value">'+doc.datePol+'</div>'+
                            '</div>');
            }
            if(doc.nomR!=null && doc.nomR!=undefined && doc.nomR!=''){
                divInfo.append('<div class="elem-doc">'+
                                    '<div class="signature">Номер расписки::</div>'+
                                    '<div class="elem-doc-value">'+doc.nomR+'</div>'+
                            '</div>');
            }
            $(elem).find('.info-doc').show();
            $(elem).find('.info-doc').append('<div class="button-doc-more-info"><div class="signature-button">Подробнее</div></div>');
        }
        else{
            $(elem).find('.info-doc').html('');
        }
    }

    $('.inner-content').on('click','.button-doc-more-info', function(e){
        if(mode=='load') return;
        window.sessionStorage.setItem('docInfo', JSON.stringify(docs.searchId($(e.target).parents('.doc').attr('id'))));
        window.parent.location.href="./doc-info.html";
    });

    $('.button-menu-lists').click(function(e){
        if(mode=='load') return;
        var type;
        switch(this.className){
            case 'button-menu-lists reg': type = 'reg'; break;
            case 'button-menu-lists pol': type = 'pol'; break;
            case 'button-menu-lists zareg': type = 'zareg'; break;
        }
        clickButtonMenu(type);
    });

    function clickButtonMenu(type){
        var button = $('.'+type).get();
        if($('.button-menu-lists.button-menu-lists-active')[0]!=button ){
            $('.button-menu-lists.button-menu-lists-active').removeClass('button-menu-lists-active');
            loadDocs(type);
            $(button).addClass('button-menu-lists-active');
        }
    }
    
    $('.menu-buttons').on('click','.button-form',function(e){
        if(mode=='load') return;
        listAddDoc = getDoc($($('.image-select-active').parents('.doc')));
        drowForm();
    });

    $('.inner-content').on('click','.add-doc',function(e){
        if(mode=='load') return;
        mode = 'add-select-doc';
        $('.inner-content').html(
            '<div class="list-doc"> </div>'
        );
        $('.list-doc').append('<div class="caption-form"><div class="caption-form-text">Выберете документы:</div></div>');

        drowButton($('.menu-buttons'),'addDocAndCancelDoc');

        var type = $('.content').attr('id');
        for (var i = 0; i < docs.lists[type].length; i++){
            if(listAddDoc.indexOf(docs.lists[type][i])==-1)
                docs.lists[type][i].drow($('.list-doc'), true);
        }
    });

    $('.menu-buttons').on('click','.form-ok',function(e){
        if(mode=='load') return;
        if($('.content').attr('id')=='reg'){
            var listDocs = [];
            for(var i=0;i<listAddDoc.length;i++){
                if(listAddDoc[i].datePol==null || listAddDoc[i].datePol==undefined || listAddDoc[i].datePol==''){
                    return alert(listAddDoc[i].info['Название']+" не заполнено поле с датой получения!");
                }
                if(listAddDoc[i].nomR==null || listAddDoc[i].nomR==undefined || listAddDoc[i].nomR==''){
                    return alert(listAddDoc[i].info['Название']+" не заполнено поле с номером расписки!");
                }
                listDocs.push({
                    "id":listAddDoc[i].id,
                    "datePol":listAddDoc[i].datePol,
                    "nomR":listAddDoc[i].nomR
                });
            }
            setDocs('pol',listDocs);
        }

        if($('.content').attr('id')=='pol'){
            var listDocs = [];
            for(var i=0;i<listAddDoc.length;i++){
                listDocs.push({
                    "id":listAddDoc[i].id,
                    "datePol":  $('input[name="date"]').val()
                });
            }
            setDocs('zareg',listDocs);
        }
    });

    $('.menu-buttons').on('click','.form-cancel',function(e){
        if(mode=='load') return;
        /*for(var i=0;i<listAddDoc.length;i++){
            delete listAddDoc[i].datePol;
            delete listAddDoc[i].numR;
        }*/
        drowListDoc($('.content').attr('id'));
    });

    $('.menu-buttons').on('click','.add-doc-add',function(e){
        if(mode=='load') return;
        var selectionDoc = getDoc($($('.image-select-active').parents('.doc')));
        listAddDoc=listAddDoc.concat(selectionDoc);
        drowForm();
    });

    $('.menu-buttons').on('click','.add-doc-cancel',function(e){
        if(mode=='load') return;
        drowForm();
    });

    $('.inner-content').on('change', '.info-doc > .elem-form > #datePol',function(e){
        docs.searchId($(this).parents('.doc').attr('id')).datePol=$(this).val();
    });

    $('.inner-content').on('change', '.info-doc > .elem-form > #nomR',function(e){
        docs.searchId($(this).parents('.doc').attr('id')).nomR=$(this).val();
    });

    //отлавливание tap и swipe на сенсорных устройствах
    var initialPoint;
    var finalPoint;
    $('.content').on('touchstart',function(event){  
        initialPoint=event.changedTouches[0];
    });

    $('.content').on('touchend',function(event){
        var nameEventMobil = '';
        finalPoint=event.changedTouches[0];
        var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
        var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
        if (xAbs > 20 || yAbs > 20) {
            selectionMode = false;
            if (xAbs > yAbs) {
                if (finalPoint.pageX < initialPoint.pageX){
                    nameEventMobil = 'swipeLeft';}
                else{
                    nameEventMobil = 'swipeRight';}
            }
            else {
                if (finalPoint.pageY < initialPoint.pageY){
                    nameEventMobil = 'swipeUp';}
                else{
                    nameEventMobil = 'swipeDown';}
                }
        }
        else{
            nameEventMobil = 'tap';
        }

        //swipe
        if(nameEventMobil=='swipeLeft'){
            switch($('.content').attr('id')){
                case 'reg':
                    clickButtonMenu('pol');
                    $('.reg').hide();
                    $('.pol').css('display','table');
                break;
                case 'pol':
                    clickButtonMenu('zareg');
                    $('.pol').hide();
                    $('.zareg').css('display','table');
            break;                
            }
        }

        if(nameEventMobil=='swipeRight'){
            switch($('.content').attr('id')){
                case 'zareg':
                    clickButtonMenu('pol');
                    $('.zareg').hide();
                    $('.pol').css('display','table');
                break;
                case 'pol':
                    clickButtonMenu('reg');
                    $('.pol').hide();
                    $('.reg').css('display','table');
            break;                
            }
        }
        
    });

    $('.inner-content').on('click','.image-cancel',function(e){
        if(mode=='load') return;
        $(this).parents('.doc').remove();
        listAddDoc = getDoc($('.doc'));
    });

    

    function getDoc(elemDocDom){
        var listDoc = [];
        if(elemDocDom.length>0){
            for(var i=0; i<elemDocDom.length; i++){
                listDoc.push(docs.searchId(elemDocDom[i].id));
            }
        }
        return listDoc;
    }

    function drowForm(){
        //$('header').hide();
        selectionMode = false;
        mode = 'add';
        var captionText = 'Не известно';
        var todayDate = new Date().toISOString().slice(0,10);

        switch($('.content').attr('id')){
            case 'reg':
                captionText='Сдача документов на регистрацию:';
                $('.inner-content').html('<div class="form">' + 
                                            '<div class="caption-form"><div class="caption-form-text">'+captionText+'</div></div>' +
                                            '<div class="elem-form"> <div class="signature"> Дата сдачи:</div>  <input type="date" name="date"></div>'+
                                            '<div class="elem-form"> <div class="signature"> Рег. палата: </div> <select name="reg pal"> <option>Регистрационная палата</option> </select> </div> '+
                                            '<div class="container-list-add-doc"><div class="list-add-doc"> </div> <div class="list-add-doc-buttons"><div class="button add-doc"><div class="signature-button">Добавить документ</div></div></div></div>'+
                                        '</div>');                
                
                $('input[type="date"]').val(todayDate); //вывести текущую дату!!!
                drowButton($('.menu-buttons'),'okAndCanсel');
        
                for(var i=0; i<listAddDoc.length; i++){
                    listAddDoc[i].drowInput($('.list-add-doc'),true);
                };
                break;
            case 'pol':
                captionText='Получение документов с регистрации:'; $('.inner-content').html('<div class="form">' + 
                                            '<div class="caption-form"><div class="caption-form-text">'+captionText+'</div></div>' +
                                            '<div class="elem-form"> <div class="signature"> Дата получения:</div>  <input type="date" name="date"></div>'+
                                            '<div class="elem-form"> <div class="signature"> Рег. палата: </div> <select name="reg pal"> <option>Регистрационная палата</option> </select> </div> '+
                                            '<div class="container-list-add-doc"><div class="list-add-doc"> </div> <div class="list-add-doc-buttons"><div class="button add-doc"><div class="signature-button">Добавить документ</div></div></div></div>'+
                                        '</div>');

                $('input[type="date"]').val(todayDate); //вывести текущую дату!!!
                drowButton($('.menu-buttons'),'okAndCanсel');
                
                for(var i=0; i<listAddDoc.length; i++){
                    listAddDoc[i].drow($('.list-add-doc'), false, true);
                };
                break;
            default:
                break;
        }
    }

    function drowListDoc(type='reg'){
        //$('header').show();
        mode = 'read';
        listAddDoc = []; 
        $('.inner-content').html('<div class="list-doc"> </div>');
        switch (type) {
            case "reg":    
            case "button-menu-lists reg":
                $('.content').attr('id', 'reg');
                drowButton($('.menu-buttons'),'reg');
                docs.drowAllDoc($('.list-doc'),'reg');
                break;
            case "pol":    
            case "button-menu-lists pol":
                $('.content').attr('id', 'pol');
                drowButton($('.menu-buttons'),'pol');
                docs.drowAllDoc($('.list-doc'),'pol');
                break;
            case "zareg":    
            case "button-menu-lists zareg":
                $('.content').attr('id', 'zareg');
                drowButton($('.menu-buttons'));
                docs.drowAllDoc($('.list-doc'),'zareg');
                break;            
            default:
                break;
        }
    }

    function drowButton (container, type){
        switch (type) {
            case "reg":
                container.html('<div class="button button-form"><div class="signature-button">Сдать на регистрацию</div></div>');
                break;
            case "pol":
                container.html('<div class="button button-form"><div class="signature-button">Забрать с регистрации</div></div>');
                break;     
            case 'okAndCanсel':
                container.html(
                    '<div class="button form-ok"><div class="signature-button">Ок</div></div>'+
                    '<div class="button form-cancel"><div class="signature-button">Отмена</div></div>');
                break;
            case 'addDocAndCancelDoc':
                container.html(
                    '<div class="button add-doc-add"><div class="signature-button">Добавить документы</div></div>'+
                    '<div class="button add-doc-cancel"><div class="signature-button">Отмена</div></div>'); 
                    break;
            default:
                container.html('');
                break;
        }
    }

    clickButtonMenu('reg');
    //loadDocs();
});