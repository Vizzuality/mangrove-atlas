import React from 'react';

const HabitatExtentInfo = () => {
  return (
    <div>
      <h1>Global extent of mangroves for select years from 1996 to 2020.</h1>
      Overview:
      <p>
        This layer depicts the global extent and change of mangrove forests in the years 1996, 2007
        - 2010 and 2015 - 2020. The data set was generated within the framework of the Global
        Mangrove Watch (GMW) , an initiative convened by Aberystwyth University, soloEO, The Nature
        Conservancy and Wetlands International.
      </p>
      <p>
        The paper describing the mangrove extent and change dataset is available at:
        <a href="https://doi.org/10.3390/rs14153657" target="_blank" rel="noreferrer">
          https://doi.org/10.3390/rs14153657
        </a>
      </p>
      <p>
        The proportional length of coastline covered by mangroves was calculated by intersecting the
        mangrove extent, buffered by 200 m, with the Global Shoreline Vector dataset (Sayre, 2019)
        within each geometry. The percentage (%) covered was then calculated as the sum of the
        length of coastline occupied by mangrove habitat (km) divided by the total length of
        coastline (km) within the geometry multiplied by 100. Please note coverage calculations are
        still under validation.
      </p>
      <p>
        The paper describing the Global Coastline Vector dataset:
        <a
          href="https://doi.org/10.1080/1755876X.2018.1529714"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://doi.org/10.1080/1755876X.2018.1529714
        </a>
      </p>
      <strong>Date of content:</strong>
      <p>1996, 2007, 2008, 2009, 2010, 2015, 2016, 2017, 2018, 2019, 2020</p>
      <strong>License:</strong>
      <p>
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC-BY 4.0
        </a>
      </p>
    </div>
  );
};

export default HabitatExtentInfo;
