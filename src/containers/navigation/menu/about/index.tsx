import Image from 'next/image';

const About = () => {
  return (
    <div className="pb-20 font-sans text-2lg font-light leading-8 text-black/85">
      <h2 className="py-6 text-3xl font-bold">About Global Mangrove Watch</h2>
      <h3 className="pb-6 text-xl font-bold leading-8">
        Monitoring to catalyse the action needed to protect and restore mangroves
      </h3>
      <div className="space-y-5">
        <p>
          Thriving mangroves are key to the health of nature and effective climate action. Global
          Mangrove Watch (GMW) is an online platform that provides the remote sensing data and tools
          for monitoring mangroves necessary for this. It gives universal access to near real-time
          information on where and what changes there are to mangroves across the world, and
          highlights why they are valuable.
        </p>

        <p>
          With hi-res information on topography, soil conditions and hydrology, Global Mangrove
          Watch gives coastal and park managers, conservationists, policymakers and practitioners
          the evidence needed to respond to illegal logging, pinpoint the causes of local mangrove
          loss and track restoration progress. It is a tool that can help mangroves be central to
          climate mitigation, adaptation and sustainable development plans and policies.
        </p>
      </div>
      <h3 className="py-6 text-xl font-bold leading-8">Global Mangrove Watch Partners</h3>
      <div className="space-y-5">
        <p>
          The Global mangrove Watch (GMW) was established in 2011 under the Japan Aerospace
          Exploration Agency’s{' '}
          <span className="font-semibold text-brand-800">(JAXA) Kyoto & Carbon Initiative</span> by
          Aberystwyth University, solo Earth Observation and the International Water Management
          Institute, with the aim to provide open access geospatial information about mangrove
          extent and changes to the Ramsar Convention on Wetlands. In collaboration with Wetlands
          International and with support from DOB Ecology, the first GMW baseline maps were released
          in 2018 at the Ramsar COP13. The GMW maps also constitute the official mangrove datasets
          used by UNEP for reporting on Sustainable Development Goal 6.6.1 (change in the extent of
          water-related ecosystems over time).
        </p>
        <p>
          With support from the Oak Foundation, COmON Foundation, DOB Ecology and the Dutch Postcode
          Lottery, The Nature Conservancy, Wetlands International, Aberystwyth University, and
          soloEO in 2019 initiated a deeper collaboration, and are working with NASA, JAXA, IWMI,
          UNEP-WCMC and a host of partners to develop the Global Mangrove Watch Platform.
        </p>
      </div>
      <h3 className="py-6 text-xl font-bold leading-8">GMW and the Global Mangrove Alliance</h3>
      <div className="space-y-5">
        <p>
          A coordinated effort across sectors and geographies will accomplish more, faster. Global
          Mangrove Watch is the evidence base informing the Global Mangrove Alliance, a
          collaboration of organisations working to increase the world’s mangrove cover 20% by 2030.{' '}
          <span className="font-semibold text-brand-800">Learn more at MangroveAlliance.org.</span>
        </p>
        <p>
          Got a query? Contact{' '}
          <span className="font-semibold text-brand-800">Mangrove Alliance</span>
        </p>

        <div className="space-y-6">
          <div>
            <p>Convened by</p>
            <Image
              src="/images/partners/convened.png"
              alt="Convened by Aberystwyth University, soloEO, TNC, Wetlands International"
              className="-ml-3"
              width={500}
              height={300}
            />
          </div>
          <div>
            <p>Supported by</p>
            <Image
              src="/images/partners/supported.png"
              alt="Supported by University of Cambridge, JAXA, NASA, IUCN, Griffith University, Conservation International, WWF, Scripps Institution of Oceanography"
              className="-ml-2"
              width={500}
              height={300}
            />
          </div>

          <div>
            <p>Donors</p>
            <Image
              src="/images/partners/donors.png"
              alt="DOB Ecology, Oak Foundation, Dutch Postcode Lottery, COmON Foundation"
              className="-ml-6 -mt-1"
              width={500}
              height={300}
            />
          </div>

          <div>
            <p>Designed by:</p>
            <a
              href="https://www.vizzuality.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="m-10"
            >
              <Image
                src="/images/vizzuality.png"
                alt="Vizzuality"
                width={300}
                height={300}
                className="ml-2 -mt-1 w-40"
              />
            </a>
          </div>
        </div>

        <h3 className="py-4 text-xl font-bold leading-8">Disclaimer</h3>
        <p>
          THE USE OF THESE SERVICES AND CONTENT IS AT YOUR SOLE RISK. THE SERVICES AND CONTENT ARE
          PROVIDED ON AN “AS IS” BASIS AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND, EITHER
          EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
          STATUTORY, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. ACTUAL CONDITIONS MAY DIFFER FROM
          MAPS AND INFORMATION PROVIDED BY THE SERVICES. WE DO NOT WARRANT THAT THE CONTENT OR
          SERVICES WILL BE ERROR FREE, ACCURATE OR WITHOUT INTERRUPTION.
        </p>
      </div>
    </div>
  );
};

export default About;
