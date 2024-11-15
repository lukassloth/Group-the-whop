document.addEventListener('DOMContentLoaded', function() {
    const width = 960;
    const height = 500;

    // Vælg tooltip-elementet
    const demo = document.getElementById('demo');

    // Opret SVG for kortet
    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Opsæt kortprojektionen
    const projection = d3.geoNaturalEarth1()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Hent og vis kortdata
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(function(world) {
            svg.append("g")
                .selectAll("path")
                .data(topojson.feature(world, world.objects.countries).features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "#6f8c52")
                .attr("stroke", "#fff")
                .on("click", function(event, d) {
                    // Hent landets navn
                    const countryName = d.properties.name;

                    // Opdater #demo med landets navn og positionér det
                    demo.innerHTML = "This is " + countryName;
                    demo.style.left = `${event.pageX + 10}px`;
                    demo.style.top = `${event.pageY - 30}px`;
                    demo.style.visibility = "visible";
                });
        });

    // Skjul tooltip'en, når der klikkes andre steder på kortet
    svg.on("click", function(event) {
        if (event.target.tagName !== "path") {
            demo.style.visibility = "hidden";
        }
    });
});
