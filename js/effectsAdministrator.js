window.addEventListener("load",function()
{
    gaugeEffects.createGauges("gauges");
});

window.addEventListener("resize",function()
{
    gaugeEffects.createGauges("gauges");
});

var gaugeEffects =(function()
{
    function addEffects(target)
    {
        var opts = {
            angle: -0.2, // The span of the gauge arc
            lineWidth: 0.2, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
              length: 0.6, // // Relative to gauge radius
              strokeWidth: 0.035, // The thickness
              color: '#000000' // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#6FADCF',   // Colors
            colorStop: '#8FC0DA',    // just experiment with them
            strokeColor: '#E0E0E0',  // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true,     // High resolution support
            staticZones: [
                {strokeStyle: "#30B32D", min: 0, max: 80}, 
                {strokeStyle: "#FFDD00", min: 80, max: 160},
                {strokeStyle: "#FFA500", min: 160, max: 240}, 
                {strokeStyle: "#FF1100", min: 240, max: 300} 
             ],
            
          };
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
          gauge.maxValue = 300; // set max gauge value
          gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
          gauge.animationSpeed = 20; // set animation speed (32 is default value)
          gauge.set(125); // set actual value
    }

    function createGauges(containerName)
    {
        var container = document.getElementById(containerName);
        container.innerHTML="";
        var textHeight = 20;
        var containerWidth = container.getBoundingClientRect().width;
        var limit = 5;
        var firstElementWidth = 2/6;
        if(window.innerWidth <= 930)
        {
            limit=1;
            firstElementWidth=1;
        }
        var containerHeight= container.getBoundingClientRect().height - textHeight;
        var labels = ["Estado de Avance","M&oacute;dulo de Contratos","M&oacute;dulo de PI","M&oacute;dulo de Gobierno Corporativo","Mesa de Ayuda"];
        for(let i=0;i<limit;i++)
        {
            let element = document.createElement("DIV");
            let gauge = document.createElement("CANVAS");
            let text = document.createElement("P");
            text.innerHTML=labels[i];
            text.style["height"] = textHeight + "px";
            if(i==0)
            {
                gauge.width = firstElementWidth*containerWidth;
                gauge.height = containerHeight;
                text.classList.add("gauge__text-first");
            }
            else
            {
                gauge.width = (1/6)*containerWidth;
                gauge.height = containerHeight/2;
                text.classList.add("gauge__text");
            }
            element.appendChild(gauge);
            element.appendChild(text);
            container.appendChild(element);
            addEffects(gauge);
        }
    }
    return {
        createGauges: createGauges
    }

})();