document.addEventListener('DOMContentLoaded', function () {
    // Når hele DOM'en er indlæst, udføres denne funktion

    const width = 1405;
    const height = 1069.2;
    // Sætter bredde og højde for SVG-elementet

    // Tooltip element
    const demo = document.getElementById("demo");
    const heading = document.getElementById("frontpage_heading");
    // Henter HTML-elementer til tooltip og overskrift

    // Opret SVG
    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    // Opretter et SVG-element i #map-container med angivne dimensioner

    // Opsæt kortprojektionen
    const projection = d3.geoNaturalEarth1()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2]);
    // Angiver en kortprojektion (geoNaturalEarth1) og centrering af kortet

    const path = d3.geoPath().projection(projection);
    // Angiver, at kortet skal tegnes baseret på projektionen

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            svg.selectAll("g").attr("transform", event.transform);
        });
    // Opsætter zoom-funktionalitet med minimum og maksimum zoom (1 til 8).
    // Ved zoom ændres `transform`-attributten på alle grupper i SVG

    svg.call(zoom);
    // Aktiverer zoom-funktionen på SVG-elementet

    // Variabel til at gemme data fra API'et
    let countryData = {};
    // Initialiserer et objekt til at gemme data om lande

    fetch('api/data')
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data);
        // Logger hele API-responsen

        countryData = {
            area: data.area.reduce((acc, item) => {
                acc[item.country] = item.area;
                return acc;
            }, {}),
            // Reducerer array af area-data til et objekt med lande som nøgler

            sunshine_hours: data.sunshine_hours.reduce((acc, item) => {
                acc[item.country] = item.year;
                return acc;
            }, {}),
            // Reducerer array af sunshine_hours-data til et objekt med lande som nøgler

            consumption: data.consumption.reduce((acc, item) => {
                acc[item.country] = item.consumption_twh;
                return acc;
            }, {})
            // Reducerer array af consumption-data til et objekt med lande som nøgler
        };
        console.log('Parsed Data:', countryData);
        // Logger det samlede countryData-objekt
    })
    .catch(error => console.error('Error fetching data:', error));
    // Logger fejl, hvis API-opkaldet fejler

    // Hent og vis kortdata
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(function (world) {
            const countries = topojson.feature(world, world.objects.countries).features;
            // Konverterer kortdata til et GeoJSON-objekt med landefeatures

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
                    // Henter landets navn fra data

                    // Find data for landet
                    const area = countryData.area[countryName] || 'N/A';
                    const year = countryData.sunshine_hours[countryName] || 'N/A';
                    const consumption_twh = countryData.consumption[countryName] || 'N/A';
                    // Henter specifik data for landet fra countryData

                    // Vis data i tooltip
                    demo.innerHTML = `
                        <strong>${countryName}</strong><br>
                        Area: ${area} km^2 <br> 
                        Year: ${year} Hours <br>
                        Consumption: ${consumption_twh} TWh
                    `;
                    demo.style.left = `${event.pageX + 10}px`;
                    demo.style.top = `${event.pageY - 30}px`;
                    demo.style.visibility = "visible";
                    // Opdaterer og viser tooltip med landets data

                    event.stopPropagation();
                    // Forhindrer klik på SVG at udløse andre klik-handlere
                });
        })
        .catch(error => console.error('Error loading map data:', error));
        // Logger fejl, hvis kortdata ikke kunne hentes

    // Skjul tooltip'en, når der klikkes uden for lande eller knapper
    svg.on("click", function () {
        demo.style.visibility = "hidden";
        // Skjuler tooltip
    });

    // Gendan zoom-funktionaliteten for kontinenter
    const continentBounds = {
        Africa: [[-40, -41], [70, 58]],          // Afrika
        Asia: [[30, -15], [180, 75]],           // Asien
        Europe: [[-30, 32], [60, 78]],          // Europa
        NorthAmerica: [[-170, 10], [-50, 80]],  // Nordamerika
        SouthAmerica: [[-95, -60], [-15, 35]],  // Sydamerika
        Australia: [[105, -50], [160, 5]],      // Australien
        World: [[-180, -85], [180, 95]]         // World (virker ik)
        // Bounding box-koordinater for hvert kontinent og hele verden
    };
    
    console.log("Initial zoom state:", d3.zoomIdentity);
    // Logger den oprindelige zoom-tilstand (uden ændringer)

    function zoomToRegion(region) {
        const bounds = continentBounds[region];
        if (!bounds) {
            console.error(`No bounds found for region: ${region}`);
            return;
        }
        // Finder bounding box for det valgte region

        const [[x0, y0], [x1, y1]] = [
            projection(bounds[0]),
            projection(bounds[1]),
        ];
        // Konverterer bounding box-koordinater til pixels ved hjælp af projektionen

        const scale = Math.min(
            width / Math.abs(x1 - x0),
            height / Math.abs(y1 - y0)
        ) * 0.9;
        // Beregner skaleringsfaktor baseret på kortets bredde og højde

        const translate = [
            (width - scale * (x0 + x1)) / 2,
            (height - scale * (y0 + y1)) / 2
        ];
        // Beregner translationen for at centrere regionen

        svg.transition()
            .duration(1000)
            .call(
                zoom.transform,
                d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );
        // Animerer zoom og translation til den valgte region

        if (region !== "World") {
            heading.style.display = "none";
        } else {
            heading.style.display = "block";
        }
        // Skjuler eller viser overskriften afhængigt af regionen
    }

    document.querySelectorAll(".buttons button[data-continent]").forEach(button => {
        button.addEventListener("click", function () {
            const continent = this.getAttribute("data-continent");
            zoomToRegion(continent);
            demo.style.visibility = "hidden";
            // Tilføjer klik-event til knapper for at zoome til det valgte kontinent
        });
    });
});
