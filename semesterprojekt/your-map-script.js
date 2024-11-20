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

    // Map aliases for country names
    const countryAliases = {
        "United States": "United States of America",
        "Russia": "Russian Federation",
        "Ivory Coast": "Côte d'Ivoire",
        // Add more aliases as needed
    };

    // Funktion til at normalisere lande-navne
    function normalizeCountryName(name) {
        const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
        return countryAliases[normalized] || normalized;
    }

    // Hent data fra API
    fetch('http://localhost:3001/api/data')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Data fra tabellerne
            const areaData = data.area.map(item => ({
                country: normalizeCountryName(item.country),
                area: item.area
            }));
            const sunshineData = data.sunshine_hours.map(item => ({
                country: normalizeCountryName(item.country),
                hours: item.hours
            }));
            const consumptionData = data.consumption.map(item => ({
                country: normalizeCountryName(item.country),
                consumption: item.consumption
            }));

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
                            const normalizedCountryName = normalizeCountryName(countryName);

                            // Find data for landet
                            const areaInfo = areaData.find(item => item.country === normalizedCountryName);
                            const sunshineInfo = sunshineData.find(item => item.country === normalizedCountryName);
                            const consumptionInfo = consumptionData.find(item => item.country === normalizedCountryName);

                            // Vis data i tooltip
                            demo.innerHTML = `
                                <strong>${countryName}</strong><br>
                                Area: ${areaInfo ? areaInfo.area : 'N/A'}<br>
                                Sunshine Hours: ${sunshineInfo ? sunshineInfo.hours : 'N/A'}<br>
                                Consumption: ${consumptionInfo ? consumptionInfo.consumption : 'N/A'}
                            `;
                            demo.style.left = `${event.pageX + 10}px`;
                            demo.style.top = `${event.pageY - 30}px`;
                            demo.style.visibility = "visible";
                            event.stopPropagation(); // Forhindrer SVG-klikhandleren
                        });
                })
                .catch(error => console.error('Error loading map data:', error));
        })
        .catch(error => console.error('Error fetching data:', error));

    // Skjul tooltip'en, når der klikkes uden for lande eller knapper
    svg.on("click", function (event) {
        if (event.target.tagName !== "path" && !event.target.closest(".buttons")) {
            demo.style.visibility = "hidden"; // Kun tooltip skjules
        }
    });

    // Gendan zoom-funktionaliteten for kontinenter
    const continentBounds = {
        Africa: [[-20, -35], [55, 37]],
        Asia: [[60, 0], [150, 55]],
        Europe: [[-10, 35], [40, 70]],
        NorthAmerica: [[-170, 10], [-50, 80]],
        SouthAmerica: [[-90, -60], [-30, 15]],
        Australia: [[110, -45], [155, -10]],
        World: [[0, 0], [0, 0]],
    };

    function zoomToRegion(region) {
        const bounds = continentBounds[region];
        if (!bounds) {
            console.error(`No bounds found for region: ${region}`);
            return;
        }

        const projectedBounds = bounds.map(coord => projection(coord));
        if (projectedBounds.some(coord => coord === null)) {
            console.error(`Invalid projection for region: ${region}`, projectedBounds);
            return;
        }

        const [[x0, y0], [x1, y1]] = projectedBounds;

        const scale = Math.min(
            width / Math.abs(x1 - x0),
            height / Math.abs(y1 - y0)
        ) * 0.9;

        const translate = [
            (width - scale * (x0 + x1)) / 2,
            (height - scale * (y0 + y1)) / 2
        ];

        svg.transition()
            .duration(1000)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(translate[0], translate[1])
                    .scale(scale)
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
            demo.style.visibility = "hidden";
        });
    });
});

