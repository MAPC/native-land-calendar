const mapProjection = d3.geoAlbers()
.scale(36500)
.rotate([71.057, 0])
.center([.4,42.37])
.translate([960 / 2, 500 / 2])

function tooltipTerritory(data) {
  return `<p>You're on the land of: ${data.properties.Nations}</p>`
}

function tooltipLanguages(data) {
  return `<p>Languages spoken: ${data.properties.langs}</p>`
}

function tooltipLeft(event, tooltip){
  if (event.pageX > 410) {
    return event.pageX - tooltip.offsetWidth - 10 + "px"
  } else {
    return event.pageX + 10 + "px"
  }
}

function tooltipTop(event, tooltip) {
  if (event.pageY > 260) {
    return event.pageY - tooltip.offsetHeight - 10 + "px"
  } else {
    return event.pageY + 10 + "px"
  }
}

function createBasemap(state, region) {
  const baseMap = d3.select('.native-land__map');
  const path = d3.geoPath().projection(mapProjection);
  baseMap.append('g')
  .attr('class', 'map__basemap')
  .selectAll('path')
  .data(state.features)
  .enter()
  .append('path')
  .attr('fill', '#9e9ba8')
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)

  baseMap.append('g')
  .attr('class', 'map__region')
  .selectAll('path')
  .data(region.features)
  .enter()
  .append('path')
  .attr('fill', '#9e9ba8')
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)
}

function territoryOverlay(territoryBoundaries, territoryData) {
  const tooltip = d3.select(".native-land__tooltip")
  .append("div")
  .style("display", "none")
  const colors = d3.scaleOrdinal(['red','blue','green','purple','yellow','cyan'])
  const baseMap = d3.select('.native-land__map');
  const path = d3.geoPath().projection(mapProjection);
  
  baseMap.append('g')
  .attr('class', 'map__territories')
  .selectAll('path')
  .data(territoryBoundaries.features)
  .enter()
  .append('path')
  .attr("fill", (d,i) => colors(i))
  .attr("fill-opacity", .4)
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)

  baseMap.append('g')
  .attr('class', 'map__territories')
  .selectAll('path')
  .data(territoryData.features)
  .enter()
  .append('path')
  .attr("fill", 'white')
  .attr("fill-opacity", 0)
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)
  .on("mousemove", (d) => {
    tooltip.html(tooltipTerritory(d))
    .style("display", "inline")
  }) 
}

function languageOverlay(territoryBoundaries, territoryData) {
  const tooltip = d3.select(".native-land__tooltip")
  .append("div")
  .style("display", "none")
  const colors = d3.scaleOrdinal(['red','blue','green','purple','yellow','cyan'])
  const baseMap = d3.select('.native-land__map');
  const path = d3.geoPath().projection(mapProjection);
  
  baseMap.append('g')
  .attr('class', 'map__languages')
  .selectAll('path')
  .data(territoryBoundaries.features)
  .enter()
  .append('path')
  .attr("fill", (d,i) => colors(i))
  .attr("fill-opacity", .4)
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)

  baseMap.append('g')
  .attr('class', 'map__languages')
  .selectAll('path')
  .data(territoryData.features)
  .enter()
  .append('path')
  .attr("fill", 'white')
  .attr("fill-opacity", 0)
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0)
  .attr('d', path)
  .on("mousemove", (d) => {
    tooltip.html(tooltipLanguages(d))
    .style("display", "inline")
  })
}

function createLegend() {
  const legendEl = document.querySelector(".native-land__sidebar")
  d3.selectAll('.map__languages').attr("visibility", "hidden")
  legendEl.addEventListener("click", function(e){
    switch(e.target.classList[0]) {
      case "toggle__territory":
        toggleLine('.map__territories')
        break
      case "toggle__language":
        toggleLine('.map__languages')
        break
    }
  })
}

function toggleLine(elementClass){
  const selection = document.querySelector(elementClass)
  if (selection.getAttribute("visibility") === "hidden"){
    d3.selectAll(elementClass).attr("visibility", "visible")
  } else {
    d3.selectAll(elementClass).attr("visibility", "hidden")
  }
}

Promise.all([
  d3.json('/assets/data/ma-basemap.geojson'),
  d3.json('/assets/data/mapc-with-borders.geojson'),
  d3.json('/assets/data/full-territory.geojson'),
  d3.json('/assets/data/overlapping-territory-data.geojson'),
  d3.json('/assets/data/full-language.geojson'),
  d3.json('/assets/data/overlapping-language-data.geojson')
]).then(data => {
  createBasemap(data[0], data[1])
  territoryOverlay(data[2], data[3])
  languageOverlay(data[4],data[5])
  createLegend()
})