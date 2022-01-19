namespace :worldwide do
  desc "Create worlwide location"

  task :location => [:environment] do
    worlwide = Location.find_by(location_id: 'worldwide')

    worlwide_result = Location.select([
      'sum(area_m2) as area_m2',
      'sum(perimeter_m) as perimeter_m',
      '1634701000 as coast_length_m', # Data from https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline
    ])

    unless worlwide
      Location.create(
        name: 'Worldwide',
        location_type: 'worldwide',
        iso: 'WORDLWIDE',
        area_m2: worlwide_result[0][:area_m2],
        perimeter_m: worlwide_result[0][:perimeter_m],
        coast_length_m: worlwide_result[0][:coast_length_m],
        location_id: 'worldwide'
      )

      puts 'Location Worldwide created'
    else
      worlwide.update(
        area_m2: worlwide_result[0][:area_m2],
        perimeter_m: worlwide_result[0][:perimeter_m],
        coast_length_m: worlwide_result[0][:coast_length_m],
      )

      puts 'Location Worldwide updated'
    end
  end

  task :mangrove_datum => [:environment] do
    worldwide = Location.find_by(location_id: 'worldwide')

    # delete previous data
    if worldwide and worldwide.mangrove_datum
      worldwide.mangrove_datum.delete_all
    end

    mangrove_datum_result = MangroveDatum.select([
      'date',
      'sum(gain_m2) as gain_m2',
      'sum(loss_m2) as loss_m2',
      'sum(length_m) as length_m',
      'sum(area_m2) as area_m2',
      'avg(hmax_m) as hmax_m',
      'avg(agb_mgha_1) as agb_mgha_1',
      'avg(hba_m) as hba_m',
      'sum(agb_tco2e) as agb_tco2e',
      'sum(bgb_tco2e) as bgb_tco2e',
      'sum(soc_tco2e) as soc_tco2e',
      'sum(toc_tco2e) as toc_tco2e',
    ])
      .group('date')

    mangrove_datum_result.each do |m|
      mangrove_datum_item = MangroveDatum.find_by(date: m[:date], location_id: worldwide.id)

      total_carbon_query = MangroveDatum.select(['toc_hist_tco2eha'])
        .where.not(toc_hist_tco2eha: nil)
        .where(date: m[:date])
        .pluck(:toc_hist_tco2eha)

      total_carbon_result = nil

      if total_carbon_query
        total_carbon_result = Hash.new
        total_carbon_result["0--700"] = total_carbon_query.map { |t| t['0--700'] }.reduce(:+)
        total_carbon_result["1400--2100"] = total_carbon_query.map { |t| t['1400--2100'] }.reduce(:+)
        total_carbon_result["2100--2800"] = total_carbon_query.map { |t| t['2100--2800'] }.reduce(:+)
        total_carbon_result["2800--3500"] = total_carbon_query.map { |t| t['2800--3500'] }.reduce(:+)
        total_carbon_result["700--1400"]   = total_carbon_query.map { |t| t['700--1400'] }.reduce(:+)
      end

      unless mangrove_datum_item
        MangroveDatum.create!(
          date: m[:date],
          gain_m2: m[:gain_m2],
          loss_m2: m[:loss_m2],
          length_m: m[:length_m],
          area_m2: m[:area_m2],
          hmax_m: m[:hmax_m],
          agb_mgha_1: m[:agb_mgha_1],
          hba_m: m[:hba_m],
          agb_tco2e: m[:agb_tco2e],
          bgb_tco2e: m[:bgb_tco2e],
          soc_tco2e: m[:soc_tco2e],
          toc_tco2e: m[:toc_tco2e],
          toc_hist_tco2eha: total_carbon_result,
          location_id: worldwide.id,
        )

        puts 'MangroveDatum Worldwide created'
      else
        mangrove_datum_item.update(
          date: m[:date],
          gain_m2: m[:gain_m2],
          loss_m2: m[:loss_m2],
          length_m: m[:length_m],
          area_m2: m[:area_m2],
          hmax_m: m[:hmax_m],
          agb_mgha_1: m[:agb_mgha_1],
          hba_m: m[:hba_m],
          agb_tco2e: m[:agb_tco2e],
          bgb_tco2e: m[:bgb_tco2e],
          soc_tco2e: m[:soc_tco2e],
          toc_tco2e: m[:toc_tco2e],
          toc_hist_tco2eha: total_carbon_result,
        )

        puts 'MangroveDatum Worldwide updated'
      end
    end
  end
end
