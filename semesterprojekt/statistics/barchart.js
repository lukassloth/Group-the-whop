function barChart(data) {
  const width = 1000;
  const height = 500;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 200;
  const marginLeft = 40;

  const x = d3.scaleBand()
      .domain(data.map(d => d.country)) // Use 'country' from CSV
      .range([marginLeft, width - marginRight])
      .padding(0.1);

  const y = d3.scaleLinear()
      .domain([0, 50000]) // Use 'consumption_twh' from CSV
      .range([height - marginBottom, marginTop]);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  svg.append("g")
      .attr("fill", "#4d7327")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.country))
      .attr("y", d => y(d.consumption_twh)) // Set y position based on actual value
      .attr("height", d => y(0) - y(d.consumption_twh)) // Calculate height based on value
      .attr("width", x.bandwidth());

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")  
      .style("font-size", "15px")
      .style("text-anchor", "end")
      .attr("dx", "-12px")
      .attr("dy", "1.5px")
      .attr("transform", "rotate(-65)"); 

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Energy consumption (tWh)"));

  return svg.node();
}

// Replace the d3.csv() call with this
fetch('/api/barchart-data')
  .then(response => response.json())
  .then(data => {
    console.log("Loaded data:", data);
    const chart = barChart(data);
    document.getElementById("barchart").appendChild(chart);
  })
  .catch(function(error) {
    console.log("Error loading the data:", error);
  });