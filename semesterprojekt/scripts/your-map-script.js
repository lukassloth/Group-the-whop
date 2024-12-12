document.addEventListener('DOMContentLoaded', function () {
    // Når hele DOM'en er indlæst, udføres denne funktion

    const width = 1405;
    const height = 1069.2;
    // Sætter bredde og højde for SVG-elementet

    // Tooltip element
    const tooltip = document.getElementById("tooltip");
    const tooltip2 = document.getElementById("tooltip2");
    const heading = document.getElementById("headingContainer");
    // Henter HTML-elementer til tooltip og overskrift

    // Synkronisering af tooltip2 og sidebar2
    function updateSidebar2Visibility() {
        const sidebar2 = document.querySelector('.sidebar2'); 
        // Henter elementet med klassen 'sidebar2', som er den højre sidebar.
    
        const tooltip2 = document.getElementById('tooltip2'); 
        // Henter elementet med id'et 'tooltip2', som bruges til at vise tooltip-data.
    
        if (tooltip2.style.visibility === 'visible') { 
            // Tjekker om 'tooltip2' er synlig (dvs. om dens visibility-stil er sat til 'visible').
            sidebar2.classList.add('visible'); 
            // Hvis tooltip2 er synlig, tilføjes klassen 'visible' til 'sidebar2', så den glider ind på skærmen.
        } else { 
            // Hvis tooltip2 ikke er synlig.
            sidebar2.classList.remove('visible'); 
            // Klassen 'visible' fjernes fra 'sidebar2', så den glider ud af skærmen.
        }
    }
    
    
    // Når tooltip2 skal vises
    function showTooltip2(content) {
        const tooltip2 = document.getElementById('tooltip2');
        const sidebar2 = document.querySelector('.sidebar2');
        tooltip2.innerHTML = content; // Opdater indhold
        tooltip2.style.visibility = 'visible'; // Gør synlig
        sidebar2.classList.add('visible'); // Flyt sidebar ind på skærmen
    }
    
    // Når tooltip2 skal skjules
    function hideTooltip2() {
        const tooltip2 = document.getElementById('tooltip2');
        const sidebar2 = document.querySelector('.sidebar2');
        tooltip2.style.visibility = 'hidden'; // Skjul tooltip2
        sidebar2.classList.remove('visible'); // Flyt sidebar ud af skærmen
    }
    

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
        .scaleExtent([0, 8])
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
            }, {}),
            // Reducerer array af consumption-data til et objekt med lande som nøgler

            gross_data: data.gross_data.reduce((acc, item) => {
                acc[item.country] = { 
                    avg_land_i_procent: item.avg_land_i_procent,
                    land_km2: item.land_km2
                };
                return acc;
            }, {}),
            // Reducerer array af gross_data til et objekt med lande som nøgler

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
                    const avg_land_i_procent = countryData.gross_data[countryName]?.avg_land_i_procent || 'N/A';
                    const land_km2 = countryData.gross_data[countryName]?.land_km2 || 'N/A';
                    // Henter specifik data for landet fra countryData

                    const nuclearPowerplants = (consumption_twh / 8.12).toFixed(1); // Divider og afrund til 1 decimal
                    const nuclearArea = (((consumption_twh / 8.17) * 2.6) / area * 100).toFixed(5); // Divider og afrund til 1 decimal
                    // Vis data i tooltip
                    tooltip.innerHTML = `
                    <div class="tooltip-content">
                        <strong class="highlight">${avg_land_i_procent}%</strong> of 
                        <strong class="highlight">${countryName}</strong><br>
                        <span class="description">covered in solar panels</span>
                        <hr>
                        <strong class="highlight">${nuclearPowerplants}</strong> 
                        <span class="description">Nuclear Power Plants</span><br>
                        <span class="description">But only</span> 
                        <strong class="highlight">${nuclearArea}%</strong> of 
                        <strong class="highlight">${countryName}</strong><br>
                        <span class="description">covered in powerplants</span>
                    </div>
                `;
                    tooltip.style.left = `${event.pageX + 10}px`;
                    tooltip.style.top = `${event.pageY - 30}px`;
                    tooltip.style.visibility = "visible";
                    // Opdaterer og viser tooltip med landets data

                    event.stopPropagation();
                    // Forhindrer klik på SVG at udløse andre klik-handlere

                
                    // Vis data i tooltip
                    tooltip2.innerHTML = `
                        <h4>${countryName}</h4>
                        <h3>Total area:</h3>
                        ${area} km² <br>
                        <h3>Yearly hours of sunshine:</h3>
                        ${year} Hours <br>
                        <h3>Yearly energy consumption:</h3>
                        ${consumption_twh} TWh <br>
                        <h3>Required landmass in percent:</h3>
                        ${avg_land_i_procent} % <br>
                        <h3>Required landmass in km²:</h3>
                        ${land_km2} km²
                    `;
                    tooltip2.style.left = `${event.pageX + 10}px`;
                    tooltip2.style.top = `${event.pageY - 30}px`;
                    tooltip2.style.visibility = "visible";
                    // Opdaterer og viser tooltip med landets data

document.querySelector(".sidebar2").classList.add("visible");
                });
        })
        .catch(error => console.error('Error loading map data:', error));
        // Logger fejl, hvis kortdata ikke kunne hentes

    // Skjul tooltip'en, når der klikkes uden for lande eller knapper
    svg.on("click", function () {
        tooltip.style.visibility = "hidden";
        hideTooltip2(); // Skjul både tooltip2 og sidebar2
        // Skjuler tooltip
    });
    
    const continentBounds = {
        Africa: [[-50, -61], [80, 58]],
        Asia: [[30, -25], [172, 65]],
        Europe: [[-30, 22], [60, 78]],
        MiddleEast: [[0, -10], [100, 60]],
        NorthAmerica: [[-165, 25], [-10, 30]],
        SouthAmerica: [[-165, -80], [-20, 20]],
        Australia: [[115, -70], [170, 0]],
        World: [[0, 0], [0, 0]] // Zoomer mere ud
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
            tooltip.style.visibility = "hidden";
            // Tilføjer klik-event til knapper for at zoome til det valgte kontinent
        });
    });
});
