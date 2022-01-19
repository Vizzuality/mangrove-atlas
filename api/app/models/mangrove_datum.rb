class MangroveDatum < ApplicationRecord
  include ::NumberFormat

  require 'csv'

  MangroveAtlasApi::Application.load_tasks

  # model association
  belongs_to :location
  # validations
  validates_presence_of :date

  def self.worldwide
    worldwide = Location.worldwide
    self.where(location_id: worldwide.id)
    self
  end

  def self.rank_by(column_name, dir = 'DESC', start_date = '1996', end_date = '2015', limit = '5')
    self
      .where.not("#{column_name} IS NULL")
      .where("date >= ? AND date <= ?", Date.strptime(start_date, '%Y'), Date.strptime(end_date, '%Y'))
      .order("#{column_name} #{dir}")
      .limit(limit.to_i)
  end

  def self.dates_with_data(column_name)
    if column_name
      self.select('date').where.not("#{column_name} IS NULL").group('date')
    else
      self.select('date').group('date')
    end
  end

  def self.import(import_params)
    CSV.foreach(import_params[:file].path, headers: true, col_sep: ';') do |row|
      location = Location.find_by(location_id: row['location_id'])

      if (location)
        mangrove_datum_hash = MangroveDatum.new
        mangrove_datum_hash.date = Date.strptime(row['date'], '%Y-%m-%d')
        mangrove_datum_hash.gain_m2 = self.comma_conversion(row['gain_m2'])
        mangrove_datum_hash.loss_m2 = self.comma_conversion(row['loss_m2'])
        mangrove_datum_hash.length_m = self.comma_conversion(row['length_m'])
        mangrove_datum_hash.area_m2 = self.comma_conversion(row['area_m2'])
        mangrove_datum_hash.hmax_m = self.comma_conversion(row['hmax_mangrove_m'])
        mangrove_datum_hash.agb_mgha_1 = self.comma_conversion(row['agb_mangrove_mgha-1'])
        mangrove_datum_hash.hba_m = self.comma_conversion(row['hba_mangrove_m'])
        mangrove_datum_hash.con_hotspot_summary_km2 = row['con_hotspot_summary_km2']
        mangrove_datum_hash.agb_hist_mgha_1 = row['agb_mangrove_hist_mgha-1']
        mangrove_datum_hash.hba_hist_m = row['hba_mangrove_hist_m']
        mangrove_datum_hash.hmax_hist_m = row['hmax_mangrove_hist_m']
        mangrove_datum_hash.location = location
        mangrove_datum_hash.save!
      end
    end

    return self
  end

  def self.import_geojson(import_params)
    mangrove_datum = JSON.parse(File.read(import_params[:file].path))

    mangrove_datum['features'].each do |mangrove_data|
      row = mangrove_data['properties']
      location = Location.find_by(location_id: row['id'])

      if location
        # Extracting years
        complex_rows = [
          'area_mangrove_gain_m2',
          'area_mangrove_loss_m2',
          'area_mangrove_m2',
          'agb_mangrove_hist_mgha-1',
          'agb_mangrove_mgha-1',
          'hmax_mangrove_hist_m',
          'hmax_mangrove_m',
          'length_mangrove_m',
          'agb_tco2e',
          'bgb_tco2e',
          'soc_tco2e',
          'toc_tco2e',
          'toc_hist_tco2eha-1',
        ]

        years = complex_rows.map { |r| !row[r].nil? ? row[r].keys : nil }
        years = years.select { |y| y != nil }.flatten.uniq
        
        years.each do |year|
          mangrove_datum_hash = MangroveDatum.new
          mangrove_datum_hash.date = Date.strptime("#{year}-01-01", '%Y-%m-%d')
          mangrove_datum_hash.gain_m2 = row['area_mangrove_gain_m2'].nil? ? nil : row['area_mangrove_gain_m2'][year]
          mangrove_datum_hash.loss_m2 = row['area_mangrove_loss_m2'].nil? ? nil : row['area_mangrove_loss_m2'][year]
          if !row['area_mangrove_gain_m2'].nil? and !row['area_mangrove_loss_m2'].nil?
            mangrove_datum_hash.net_change_m2 = row['area_mangrove_gain_m2'][year].to_f - row['area_mangrove_loss_m2'][year].to_f
          end
          mangrove_datum_hash.length_m = row['length_mangrove_m'].nil? ? nil : row['length_mangrove_m'][year]
          mangrove_datum_hash.area_m2 = row['area_mangrove_m2'].nil? ? nil : row['area_mangrove_m2'][year]
          mangrove_datum_hash.hmax_m = row['hmax_mangrove_m'].nil? ? nil : row['hmax_mangrove_m'][year]
          mangrove_datum_hash.agb_mgha_1 = row['agb_mangrove_mgha-1'].nil? ? nil : row['agb_mangrove_mgha-1'][year]
          mangrove_datum_hash.hba_m = row['hba_mangrove_m']
          mangrove_datum_hash.con_hotspot_summary_km2 = row['con_hotspot_summary_km2'].to_json
          mangrove_datum_hash.agb_hist_mgha_1 = row['agb_mangrove_hist_mgha-1'].nil? ? nil : row['agb_mangrove_hist_mgha-1'][year].to_json
          mangrove_datum_hash.hba_hist_m = row['hba_mangrove_hist_m']
          mangrove_datum_hash.hmax_hist_m = row['hmax_mangrove_hist_m'].nil? ? nil : row['hmax_mangrove_hist_m'][year].to_json
          mangrove_datum_hash.agb_tco2e = row['agb_tco2e'].nil? ? nil : row['agb_tco2e'][year]
          mangrove_datum_hash.bgb_tco2e = row['bgb_tco2e'].nil? ? nil : row['bgb_tco2e'][year]
          mangrove_datum_hash.soc_tco2e = row['soc_tco2e'].nil? ? nil : row['soc_tco2e'][year]
          mangrove_datum_hash.toc_tco2e = row['toc_tco2e'].nil? ? nil : row['toc_tco2e'][year]
          mangrove_datum_hash.toc_hist_tco2eha = row['toc_hist_tco2eha-1'].nil? ? nil : row['toc_hist_tco2eha-1'][year]
          mangrove_datum_hash.location = location
          mangrove_datum_hash.save!
        end
      end
    end

    return self
  end
end
