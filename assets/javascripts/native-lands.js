const mapProjection = d3.geoAlbers()
.scale(43500)
  .rotate([71.057, 0])
  .center([.1,42.4])
  .translate([960 / 2, 500 / 2])

function asthmaHtmlValue(data) {

    if (data.properties.right_yasth_arte) {
      return '<p class="info-window__section"><span class="info-window__category">Municipality</span><br />' 
      + data.properties.municipal
      + '</p> <p class="info-window__section"><span class="info-window__category">Age-adjusted rate per 100,000</span><br />'
      + data.properties.right_yasth_arte
      + '</p> <p class="info-window__section"><span class="info-window__category">Year</span><br />'
      + data.properties.right_cal_years
      + '</p>'
    }
    else {
      if (data.properties.town) {
        return '<p class="info-window__section"><span class="info-window__category">Municipality (no data)</span><br />' 
        + data.properties.town
        + '</p>' 
      } else {
        return '<p class="info-window__section"><span class="info-window__category">Municipality (no data)</span><br />' 
        + data.properties.municipal
        + '</p>' 
      }
  }
}

function tooltipLeft(event, tooltip){
  if (event.pageX > 410) {
    return event.pageX - tooltip.offsetWidth - 10 + "px"
  } else {
    return event.pageX + 10 + "px"
  }
}

function tooltipTop(event, tooltip){
  if (event.pageY > 260) {
    return event.pageY - tooltip.offsetHeight - 10 + "px"
  } else {
    return event.pageY + 10 + "px"
  }
}


function asthmaCreateHeatmap(data) {
  const tooltip = d3.select("body").append("div")
                   .attr("class", "tooltip")
                   .style("opacity", 0);
                  
  const colors = d3.scaleSequentialQuantile([50.6,495])
      .interpolator(d3.interpolateRdPu)
      .domain(data.features.map(feature => (feature.properties.right_yasth_arte)));
  const youthAsthma = d3.select('.youth-asthma-map');
  const path = d3.geoPath().projection(mapProjection);
 youthAsthma.append('g')
    .attr('class', 'heatmap')
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('fill', d => colors(d.properties.right_yasth_arte))
    .attr('stroke', 'red')
    .attr('stroke-width', '1')
    .attr('stroke-opacity', 0.6)
    .attr('d', path)
    // .on("mousemove", (d) => {
    //   tooltip.transition()
    //   .duration(50)
    //   .style("opacity", .9);
    //   tooltip.html(asthmaHtmlValue(d))
    //   .style("left", tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[1]))
    //   .style("top", tooltipTop(d3.event,  document.getElementsByClassName('tooltip')[1]))
    //   }) 
    // .on("mouseleave", d => {
    //   tooltip.transition()
    //   .duration(200)
    //   .style("opacity",0)
    // })
}

function createBasemap(data) {
  const tooltip = d3.select("body").append("div")
                   .attr("class", "tooltip")
                   .style("opacity", 0);
  const baseMap = d3.select('.youth-asthma-map');
  const path = d3.geoPath().projection(mapProjection);
  baseMap.append('g')
      .attr('class', 'heatmap')
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('fill', 'red')
      .attr('stroke', 'blue')
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.6)
      .attr('d', path)
      // .on("mousemove", (d) => {
      //   tooltip.transition()
      //   .duration(50)
      //   .style("opacity", .9);
      //   tooltip.html(asthmaHtmlValue(d))
      //   .style("left", tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[0]))
      //   .style("top", tooltipTop(d3.event, document.getElementsByClassName('tooltip')[0]))
      //   }) 
      // .on("mouseleave", d => {
      //   tooltip.transition()
      //   .duration(200)
      //   .style("opacity",0)
      // })
}

Promise.all([
  d3.json('/assets/data/ma-basemap.geojson'),
  d3.json('/assets/data/mapc-no-borders.geojson'),
  d3.json('/assets/data/language-intersection.geojson'),
  d3.json('/assets/data/territory-intersection.geojson'),
]).then(data => {

  createBasemap(data[0])

  const baseMap = d3.select('.youth-asthma-map');
  const path = d3.geoPath().projection(mapProjection);
  baseMap.append('g')
      .attr('class', 'heatmap')
      .selectAll('path')
      .data(data[1].features)
      .enter()
      .append('path')
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.6)
      .attr('d', path)

      baseMap.append('g')
      .attr('class', 'heatmap')
      .selectAll('path')
      .data(data[2].features)
      .enter()
      .append('path')
      .attr('fill', 'rgba(25,25,25,.3)')
      .attr('stroke', 'green')
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.6)
      .attr('d', path)

      baseMap.append('g')
      .attr('class', 'heatmap')
      .selectAll('path')
      .data(data[3].features)
      .enter()
      .append('path')
      .attr('fill', 'rgba(125,25,25,.4)')
      .attr('stroke', 'green')
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.6)
      .attr('d', path)
})