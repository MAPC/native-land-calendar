const mapProjection = d3.geoAlbers()
.scale(36500)
.rotate([71.057, 0])
.center([.4,42.37])
.translate([960 / 2, 500 / 2])

function tooltipValue(data) {
  return `<p>${data.properties.Nations}</p>`
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

function createBasemap(state, regionWithBorders, regionWithoutBorders) {
  const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  const baseMap = d3.select('.native-land-map');
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
  .data(regionWithBorders.features)
  .enter()
  .append('path')
  .attr('fill', '#9e9ba8')
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)

  baseMap.append('g')
  .attr('class', 'map__region--borderless')
  .selectAll('path')
  .data(regionWithoutBorders.features)
  .enter()
  .append('path')
  .attr('fill', '#9e9ba8')
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)
  .style('display', 'none')
}

function languageOverlay(languageData) {
  const tooltip = d3.select(".tooltip")
  .style("opacity", 0);

  const baseMap = d3.select('.native-land-map');
  const path = d3.geoPath().projection(mapProjection);
  baseMap.append('g')
  .attr('class', 'map__basemap')
  .selectAll('path')
  .data(languageData.features)
  .enter()
  .append('path')
  .attr('fill', 'rgba(239,55,39,.4)')
  .attr('stroke', 'black')
  .attr('stroke-width', '1')
  .attr('stroke-opacity', 0.6)
  .attr('d', path)
  .on("mousemove", (d) => {
    tooltip.transition()
    .duration(50)
    .style("opacity", .9);
    tooltip.html(tooltipValue(d))
    .style("left", tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[1]))
    .style("top", tooltipTop(d3.event,  document.getElementsByClassName('tooltip')[1]))
    }) 
  .on("mouseleave", d => {
    tooltip.transition()
    .duration(200)
    .style("opacity",0)
  })
}

function territoryOverlay(territoryBoundaries, territoryData) {
  const tooltip = d3.select(".tooltip")
  .style("opacity", 0);

  const colors = d3.scaleOrdinal(['red','blue','green','purple','yellow','cyan'])

  const baseMap = d3.select('.native-land-map');
  const path = d3.geoPath().projection(mapProjection);
  
  baseMap.append('g')
  .attr('class', 'map__region')
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
  .attr('class', 'map__region')
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
    tooltip.transition()
    .duration(50)
    .style("opacity", .9);
    tooltip.html(tooltipValue(d))
    .style("left", tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[1]))
    .style("top", tooltipTop(d3.event,  document.getElementsByClassName('tooltip')[1]))
    }) 
  .on("mouseleave", d => {
    tooltip.transition()
    .duration(200)
    .style("opacity",0)
  })
}

Promise.all([
  d3.json('/assets/data/ma-basemap.geojson'),
  d3.json('/assets/data/mapc-with-borders.geojson'),
  d3.json('/assets/data/mapc-no-borders.geojson'),
  d3.json('/assets/data/language-intersection.geojson'),
  d3.json('/assets/data/full-territory.geojson'),
  d3.json('/assets/data/overlapping-territory-data.geojson'),
]).then(data => {
  createBasemap(data[0], data[1], data[2])
  territoryOverlay(data[4], data[5])
})