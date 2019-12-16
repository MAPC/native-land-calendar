---
layout: post
title:  "Native Land"
date:   2019-12-12 08:49:40 -0500
---
<section class="native-land">
  <svg class="native-land__map map" viewBox="0 0 535 500" style="border: 1px solid #292929;"></svg>
  <aside class="native-land__sidebar">
    <h1>Native Land, Native Language</h1>
    <div class="toggle-group">
      <label class="switch">
        <input type="checkbox" checked class="toggle__territory legend-q3-2019 ">
        <span class="slider round legend-q3-2019"></span>
      </label>
      Territory
    </div>
    <div class="toggle-group">
      <label class="switch">
        <input type="checkbox" class="toggle__language legend-q3-2019 ">
        <span class="slider round legend-q3-2019"></span>
      </label>
      Language
    </div>
    <section class="native-land__tooltip">Hover over the map to learn more about the land you're on.</section>
    Source: native-lands.ca, December 12, 2019
  </aside>
</section>
<script src="/assets/javascripts/d3.min.js"> </script>
<script src="/assets/javascripts/native-lands.js"></script>