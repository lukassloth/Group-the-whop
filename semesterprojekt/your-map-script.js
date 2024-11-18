document.addEventListener('DOMContentLoaded', function () {
    const width = 960;
    const height = 500;

    // Tooltip element
    const demo = document.getElementById("demo");
    const heading = document.getElementById("frontpage_heading");

    // Opret SVG
    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Opsæt kortprojektionen
    const projection = d3.geoNaturalEarth1()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            svg.selectAll("g").attr("transform", event.transform);
        });

    svg.call(zoom);

    // Hent og vis kortdata
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(function (world) {
            const countries = topojson.feature(world, world.objects.countries).features;

            // Tegn kortet
            svg.append("g")
                .selectAll("path")
                .data(countries)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "#6f8c52")
                .attr("stroke", "#fff")
                .on("click", function (event, d) {
                    // Vis tooltip ved klik på et land
                    const countryName = d.properties.name;
                    demo.innerHTML = `This is ${countryName}`;
                    demo.style.left = `${event.pageX + 10}px`;
                    demo.style.top = `${event.pageY - 30}px`;
                    demo.style.visibility = "visible";
                    event.stopPropagation(); // Forhindrer SVG-klikhandleren
                });

            // Grænser for kontinenter (latitude, longitude)
            const continentBounds = {
                Africa: [[-20, -35], [55, 37]],
                Asia: [[60, 0], [150, 55]],
                Europe: [[-10, 35], [40, 70]],
                NorthAmerica: [[-170, 10], [-50, 80]],
                SouthAmerica: [[-90, -60], [-30, 15]],
                Australia: [[110, -45], [155, -10]],
                World: [[0, 0], [0, 0]],
            };

            // Zoom til en region
            function zoomToRegion(region) {
                const bounds = continentBounds[region];
                if (!bounds) {
                    console.error(`No bounds found for region: ${region}`);
                    return;
                }

                // Konverter grænserne til projektionens koordinater
                const projectedBounds = bounds.map(coord => projection(coord));
                if (projectedBounds.some(coord => coord === null)) {
                    console.error(`Invalid projection for region: ${region}`, projectedBounds);
                    return;
                }

                const [[x0, y0], [x1, y1]] = projectedBounds;

                // Beregn skala og translation for zoom
                const scale = Math.min(
                    width / Math.abs(x1 - x0),
                    height / Math.abs(y1 - y0)
                ) * 0.9; // Tilføj lidt padding

                const translate = [
                    (width - scale * (x0 + x1)) / 2,
                    (height - scale * (y0 + y1)) / 2
                ];

                console.log("Zooming to region:", region, { scale, translate });

                svg.transition()
                    .duration(1000) // Tilføj transition for glidende animation
                    .call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(translate[0], translate[1])
                            .scale(scale)
                    );

                // Skjul tooltip og overskrift, når der zoomes til kontinenter
                if (region !== "World") {
                    heading.style.display = "none"; // Skjul overskriften
                } else {
                    heading.style.display = "block"; // Vis overskriften
                }
            }

            // Event handler for alle knapper
            document.querySelectorAll(".buttons button[data-continent]").forEach(button => {
                button.addEventListener("click", function (event) {
                    const continent = this.getAttribute("data-continent");

                    // Zoom til den valgte region
                    zoomToRegion(continent);

                    // Skjul tooltip
                    demo.style.visibility = "hidden";

                    event.stopPropagation(); // Forhindrer SVG-klikhandleren
                });
            });
        });

    // Skjul tooltip'en, når der klikkes uden for lande eller knapper
    svg.on("click", function (event) {
        if (event.target.tagName !== "path" && !event.target.closest(".buttons")) {
            demo.style.visibility = "hidden"; // Kun tooltip skjules
        }
    });
});