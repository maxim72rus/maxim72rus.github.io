 	
	if ('serviceWorker' in navigator) {
	  navigator.serviceWorker.register('../sw.js', { scope: '../' }).then(function(reg) {
		// регистрация сработала
		console.log('Registration succeeded. Scope is ' + reg.scope);
	  }).catch(function(error) {
		// регистрация прошла неудачно
		console.log('Registration failed with ' + error);
	  });
	};    class Doc{  
        constructor(id, name,status,date,booking,estate, area){
            this.id = id;
           /* this.name = name;//название
            this.status=status;//статус
            this.date=date;//дата подписания
            this.booking=booking;//бронь
            this.estate=estate;//недвижимость
            this.area=area;//площадь*/

            this.info = {};

            this.info['Название']=name;
            this.info['Статус']=status;
            this.info['Дата подписания']=date;
            this.info['Бронь']=booking;
            this.info['Недвижимость']=estate;
            this.info['Площадь']=area;
            this.datePol = '';
            this.nomR
        }

        setJSON(strJSON){
            try{
                var doc = JSON.parse(strJSON);
            }
            catch(e){
                var doc=strJSON;
            }
            for (var key in doc){
                this[key]=doc[key];
                if(key=='info' && this[key].hasOwnProperty('ДатаПодписания')){
                    this.info['Дата подписания'] = this['info']['ДатаПодписания'].slice(0,10);
                    delete this.info['ДатаПодписания'];
                }
                if(key=='datePol'){
                    this[key]=doc[key].slice(0,10);
                }
            }
            return this;
        }

        drow(container, boolImageSelect, boolImageCancel){
            if(!$(".doc").is("#"+this.id)){
                container.append("<div class='doc' id='"+this.id+"'><div class='caption-doc'>"+this.info['Название']+"</div><div class='info-doc'></div></div>");
                if(boolImageSelect){
                    $('#'+this.id).find($('.caption-doc')).after("<div class='image-select'/>");
                }
                if(boolImageCancel){
                    $('#'+this.id).find($('.caption-doc')).after("<div class='image-cancel'/>");
                }
            }
        }

        drowInput(container, boolImageCancel){
            this.drow(container, false, boolImageCancel);
            var doc = $('#'+this.id);
            doc.children('.info-doc').append(
                '<div class="elem-form"> <div class="signature"> Дата:</div>  <input type="date" id="datePol"/></div>'+
                '<div class="elem-form"> <div class="signature"> № расписки: </div> <input type="text" id="nomR"/> ');
            doc.find('#datePol').val(this.datePol);
            doc.find('#nom').val(this.nom);
        }
    }
    
    class ListDoc{
        constructor(regDoc=[], polDoc=[], zaregDoc=[]){
            this.lists={};
            this.lists['reg'] = regDoc;
            this.lists['pol'] = polDoc;
            this.lists['zareg'] = zaregDoc;
        }

        setJSON(strJSON){
            try{
                var docsJSON = JSON.parse(strJSON);
            }
            catch(e){
                var docsJSON = strJSON;
            }
            
            var docs;
            if(docsJSON.hasOwnProperty('lists')){
                docs = new ListDoc();

                for(var key in docsJSON){
                    for(var i=0; i < docsJSON[key].length; i++){
                        docs.lists[key].push(new Doc().setJSON(docsJSON[key][i]));            
                        alert(JSON.stringify(docs));
                    };
                }
            }else{
                docs = [];
    
                for(var i=0; i < docsJSON.length; i++){
                    docs[i]= new Doc().setJSON(docsJSON[i]);
                };
            }
            
            return docs;
        }

        searchId(id){
            for(var key in this.lists){
                for(var i=0; i < this.lists[key].length; i++){
                    if(this.lists[key][i].id == id){
                        return this.lists[key][i];
                    }
                };
            };
            alert('id не найден');         
        }

        drowAllDoc(container, type){
            for (var i = 0; i < this.lists[type].length; i++){
                this.lists[type][i].drow(container, true);
            }
        }

        drowDateDoc(container,date){
            for(var i=0; i < this.lists['pol'].length; i++){
                if(this.lists['pol'][i].datePol == date){
                    this.lists['pol'][i].drow(container,false,false);
                }
            };
        }
    }
    
    class EventDay{
        constructor(id, date,startTime,endTime,name,participants,status){
            this.id = id;
            this.date=date;
            this.startTime=startTime;
            this.endTime=endTime;
            this.name=name;
            this.participants=participants;
            this.status=status;
        }

        setJSON(strJSON){
            try{
                var event = JSON.parse(strJSON);
            }
            catch(e){
                var event = strJSON;
            }
            for(var key in this){
                this[key]=event[key];
                if(key=='date'){
                    this[key]=event[key].slice(0,10);
                }
            }
            return this;
        }
        
        drow(){            
            $('#container-day-content').append(
            '<div class="event-day" id="'+this.id+'">'+
            '<div class="event-day-caption">'+this.startTime+' - '+this.endTime+'</div>'+
            '<div class="event-day-text">'+this.name+'</div>'+
            '</div>');
            
            switch(this.status){
                case 'Свободен':
                    $('#'+this.id).addClass('free');
                    break;
                case 'Занят':
                    $('#'+this.id).addClass('busy');
                    break;
            }
        }
    }