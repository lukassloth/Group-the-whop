function barChart() {

    // Laver chartens dimensioner med marginer
    const width = 900;
    const height = 500;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;

    // Laver det horisontale, altså x
    const x = d3.scaleBand()
      .domain(d3.groupSort(data, ([d]) => -d.frequency, (d) => d.letter))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    // Laver den verticale, altså y
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)])
      .range([height - marginBottom, marginTop]);

    // Laver svg containeren
    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Tilføjer noget til baren
    svg.append("g")
      .attr("fill", "steelblue")
    .selectAll()
    .data(data)
    .join("rect")
      .attr("x", (d) => x(d.letter))
      .attr("y", (d) => y(d.frequency))
      .attr("height", (d) => y(0) - y(d.frequency))
      .attr("width", x.bandwidth());

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0`)
      .call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currenctColor")
        .attr("text-anchor", "start")
        .attr("↑ Frequency (%)"));

return svg.node();

}