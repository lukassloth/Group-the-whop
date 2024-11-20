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
                    const countryName = d.properties.name;

                    // Vis data i tooltip
                    demo.innerHTML = `
                        <strong>${countryName}</strong>
                    `;
                    demo.style.left = `${event.pageX + 10}px`;
                    demo.style.top = `${event.pageY - 30}px`;
                    demo.style.visibility = "visible";
                    event.stopPropagation(); // Forhindrer SVG-klikhandleren
                });
        })
        .catch(error => console.error('Error loading map data:', error));

    // Skjul tooltip'en, når der klikkes uden for lande eller knapper
    svg.on("click", function () {
        demo.style.visibility = "hidden"; // Kun tooltip skjules
    });

    // Gendan zoom-funktionaliteten for kontinenter
    const continentBounds = {
        Africa: [[-20, -35], [55, 37]],
        Asia: [[60, 0], [150, 55]],
        Europe: [[-10, 35], [40, 70]],
        NorthAmerica: [[-170, 10], [-50, 80]],
        SouthAmerica: [[-90, -60], [-30, 15]],
        Australia: [[110, -45], [155, -10]],
        World: [[-180, -90], [180, 90]] // Justeret bounds for World
    };

    function zoomToRegion(region) {
        const bounds = continentBounds[region];
        if (!bounds) {
            console.error(`No bounds found for region: ${region}`);
            return;
        }

        // Beregn bounding box og skaleringsfaktor
        const [[x0, y0], [x1, y1]] = [
            projection(bounds[0]),
            projection(bounds[1]),
        ];

        const scale = Math.min(
            width / Math.abs(x1 - x0),
            height / Math.abs(y1 - y0)
        ) * 0.9; // Tilføj lidt padding

        const translate = [
            (width - scale * (x0 + x1)) / 2,
            (height - scale * (y0 + y1)) / 2
        ];

        svg.transition()
            .duration(1000)
            .call(
                zoom.transform,
                d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );

        if (region !== "World") {
            heading.style.display = "none";
        } else {
            heading.style.display = "block";
        }
    }

    document.querySelectorAll(".buttons button[data-continent]").forEach(button => {
        button.addEventListener("click", function () {
            const continent = this.getAttribute("data-continent");
            zoomToRegion(continent);
            demo.style.visibility = "hidden"; // Skjul tooltip
        });
    });
});
