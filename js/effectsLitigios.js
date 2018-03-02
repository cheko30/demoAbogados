function addActor()
{
    var element = document.getElementById("actores");
    if(element.value == "")
    {
        alert("Ingrese un actor");
    }
    var lista = document.getElementById("actoresList");
    var actor = document.createElement("LI");
    actor.innerHTML = element.value;
    lista.appendChild(actor);
}


function removeActor()
{
    var lista = document.getElementById("actoresList");
    lista.lastChild.remove();
}