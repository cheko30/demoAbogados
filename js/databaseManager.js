var contratos = [];
var contador = 0;
window.addEventListener("load",function()
{
    /*if(window.location.pathname.indexOf("contratos.html") != -1)
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
    }*/


});

function addEntries(contratos)
{
    for(var i=0;i<contratos.length;i++)
    {
        addEntrie(contratos[i]);
    }
}

function addEntrie(contrato)
{
    var htmltable = '<td class="number">'+contrato.id+'</td>'+
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
    var VERSION = 4;
    var DataBase = null;
    function initDataBase(cochinoCallback)
    {
        var request = window.myDB.open(DB_NAME, VERSION);
        request.onerror = function(event)
        {
        
        };
        request.onsuccess = function(event) 
        {
            DataBase = event.target.result;
            cochinoCallback();
        };
        request.onupgradeneeded  = function(event) 
        {
            DataBase = event.target.result;
            try{DataBase.deleteObjectStore(tableName)}catch(e){};
            var objStore = DataBase.createObjectStore(tableName,{keyPath: 'id', autoIncrement: true});
            cochinoCallback();
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
    var element = document.querySelector("#lastRow input");
    var name = element.value;
    if(name == "" || name==null)
    {
        alert("Ingrese un nombre porfavor");
        return;
    }
    /*try
    {
    var contrato = new databaseManager.Contratos();
    contrato.name = name;
    contrato.create(function(data){window.location = "formato.html?id="+data.id;});
    }
    catch(e){
        contratos.push(JSON.stringify({id: contratos.length, name: name}));
        window.location = "formato.html";
    }*/
    contratos.push({id:contador++,name:name});
    addEntrie(contratos[contador-1]);
}

function cancelaContratos()
{
   /* if(window.location.search!="")
    {
        var id = window.location.search.split("=")[1];
        var key = Number(id);
        databaseManager.Contratos.getById(key,function(element){element.delete();window.location = "contratos.html"});
    }
    else
    {*/
        window.location = "contratos.html";
    //}
}

function goToContratos()
{

    try
    {
        if(window.location.search!="")
        {
            var id = window.location.search.split("=")[1];
            var key = Number(id);
            databaseManager.Contratos.getById(key,function(element){
                var page = document.getElementById("contratoPage");
                element.data = page.innerHTML;
                element.update(function()
                {
                    window.location = "contratos.html";
                })
            });
        }
        else
        {
            window.location = "contratos.html";
        }
    }
    catch(e){
        window.location = "contratos.html";
    }


}

function editContrato(id)
{
    window.location = "formato.html?id="+id;
}

function deleteContrato(id)
{
    var key = Number(id);
    var element =document.getElementById("row_"+key);
    element.parentElement.removeChild(element);
    //databaseManager.Contratos.getById(key,function(element){element.delete();window.location = "contratos.html"});
}

