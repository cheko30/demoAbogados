//Script de prueba para commit
var contratos = [];
var contador = 0;
window.addEventListener("load",function()
{
    /*if(window.location.search != "")
    {
        var elements = window.location.search.replace("?","").split("&");
        for(var i=0;i<elements.length;i++)
        {
            var keyValue = elements[i].split("=");
            var id = Number(keyValue[0].replace("id_",""));
            var name = unescape(keyValue[1]);
            contratos.push({id:id,name:name});
        }
        addEntries(contratos);
    }*/

    if(window.location.pathname.indexOf("contratos.html") != -1)
    {
        databaseManager.initDataBase(function()
        {
            databaseManager.Contratos.getAll(addEntries);
        });
    }
    else
    {
        databaseManager.initDataBase(function(){
            if(window.location.search!="")
            {
                var id = window.location.search.split("=")[1];
                var key = Number(id);
                databaseManager.Contratos.getById(key,function(element)
                {
                    if(element.data != null && element.data != undefined)
                    {
                        var page = document.getElementById("contratoPage");
                        page.innerHTML = element.data;
                    } 
                });
            }
        });
    }


});

function addEntries(contratos)
{
    for(var i=0;i<contratos.length;i++)
    {
        if(contratos[i].name != ""  && contratos[i].name != undefined && contratos[i].name != null)
        {
            addEntrie(contratos[i],i+1);
        }
        else
        {
            var contrato = new databaseManager.Contratos(contratos[i].id,contratos[i].name,contratos[i].data);
            contrato.delete();
        }
    }
}

function addEntrie(contrato,i)
{
    var num = i||contrato.id;
    var htmltable = '<td class="number">'+num+'</td>'+
    '<td colspan="2">'+contrato.name +'</td>'+
    '<td class="edit actionButton"><button onclick="editContrato('+contrato.id+')">Editar</button></td>'+
    '<td class="delete actionButton"><button onclick="deleteContrato('+contrato.id+')">Borrar</button></td>';

    var table = document.createElement("TR");
    table.innerHTML = htmltable;
    table.id = "row_"+contrato.id;
    var element = document.getElementById("infoTable");
    element.appendChild(table);
}

var databaseManager = (function()
{
    window.myDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    /*window.myTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
    window.myKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;*/
    var DB_NAME = "ElementiaDB";
    var tableName = "Contratos";
    var VERSION = 1;
    var DataBase = null;
    function initDataBase(cochinoCallback)
    {
        var request = window.myDB.open(DB_NAME, VERSION);
        request.onerror = function(event)
        {
            console.log(event);
        };
        request.onsuccess = function(event) 
        {
            DataBase = event.target.result;
            /*DataBase = event.target.result;
            var objStore = DataBase.createObjectStore(tableName,{keyPath: 'id', autoIncrement: true});
            cochinoCallback();*/
            setTimeout(cochinoCallback,200);
        };
        request.onupgradeneeded  = function(event) 
        {
            DataBase = event.target.result;
            try{DataBase.deleteObjectStore(tableName)}catch(e){};
            var objStore = DataBase.createObjectStore(tableName,{keyPath: 'id', autoIncrement: true});
            setTimeout(cochinoCallback,200);

        };
    }

    function Contratos(id,name,data)
    {
        this.id=id;
        this.name=name;
        this.data=data;
    }

    Contratos.prototype.create = function(cochinoCallback)
    {
        var obj={name: this.name,data: this.data};
        if(DataBase==null)
        {
            throw "No se inicializo la data base";
        }
        var transaction = DataBase.transaction([tableName], "readwrite");
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.add(obj);
        var self = this;
        request.onerror = function(){error=true;}
        request.onsuccess = function(event) {
            var data = event.target.result;
            self.id = data;
            if(cochinoCallback)
            {
                cochinoCallback(self);
            }
          }   
    }

    
    Contratos.prototype.update = function(cochinoCallback)
    {
        var obj={id: Number(this.id),name: this.name,data: this.data};
        if(DataBase==null)
        {
            throw "No se inicializo la data base";
        }
        var transaction = DataBase.transaction([tableName], "readwrite");
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.put(obj);
        var self = this;
        request.onerror = function(event) {
          }  
        request.onsuccess = function(event) {
          var data = event.target.result;
          data.name = self.name;
          data.data = self.data;
          if(cochinoCallback)
          {
              cochinoCallback();
          }
        }    
    }

    Contratos.prototype.delete = function()
    {
        var obj={name: this.name,data: this.data};
        if(DataBase==null)
        {
            throw "No se inicializo la data base";
        }
        var transaction = DataBase.transaction([tableName], "readwrite");
        var objectStore = transaction.objectStore(tableName);
        objectStore.delete(this.id);
    }

    Contratos.getAll = function(cochinoCallback)
    {
        var contratos = [];
        var transaction = DataBase.transaction([tableName], "readwrite");
        var objectStore = transaction.objectStore(tableName);
        objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            contratos.push(cursor.value);
            cursor.continue();
        }
        else
        {
            if(cochinoCallback)
            {
                cochinoCallback(contratos);
            }
        }
        };
    }

    Contratos.getById = function(id,cochinoCallback)
    {
        var transaction = DataBase.transaction([tableName], "readwrite");
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.get(id);
        var result = null;
        var error = false;
        request.onerror = function(event) {
            error=true;
                };
        request.onsuccess = function(event) {
            var data = event.target.result;
            result =  new Contratos(id,data.name,data.data);
            if(cochinoCallback)
            {
                cochinoCallback(result);
            }
        };
    }


    return {
        initDataBase: initDataBase ,
        Contratos: Contratos,
        cleanDB: function(){ myDB.deleteDatabase(DB_NAME);}
    };

})();

function addContrato()
{
    var contrato = new databaseManager.Contratos();
    contrato.create(function(data){window.location = "formato.html?id="+data.id;});

    /*var joiner = window.location.search != ""? "&":"?";
    window.location = "formato.html" + window.location.search + joiner +"id_" + contratos.length + "=" + escape(name);*/
    
}

function cancelaContratos()
{
    if(window.location.search!="")
    {
        var id = window.location.search.split("=")[1];
        var key = Number(id);
        window.location = "contratos.html"
    }
    /*if(window.location.search != "")
    {
        var index = window.location.search.lastIndexOf("&");
        window.location = "contratos.html" + window.location.search.substring(0,index);
    }
    else
    {
        window.location = "contratos.html";
    }*/
}

function goToContratos()
{

        if(window.location.search!="")
        {
            var id = window.location.search.split("=")[1];
            var key = Number(id);
            databaseManager.Contratos.getById(key,function(element){
                var page = document.getElementById("contratoPage");
                element.data = page.innerHTML;
                element.name = document.getElementById("nameEntry").innerText;
                if(element.name == undefined || element.name == null || element.name == "")
                {
                    alert("Ingrese un nombre de contrato");
                }    
                else
                {
                    element.update(function()
                    {
                        window.location = "contratos.html";
                    });
                }           
            });
        }
        else
        {
            window.location = "contratos.html";
        }
}

function editContrato(id)
{
    window.location = "formato.html?id=" + id;
}

function deleteContrato(id)
{
    var key = Number(id);
    var element =document.getElementById("row_"+key);
    element.parentElement.removeChild(element);
    databaseManager.Contratos.getById(key,function(element){element.delete();window.location = "contratos.html"});    
}

