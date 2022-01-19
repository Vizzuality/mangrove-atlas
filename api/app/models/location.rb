class Location < ApplicationRecord
  require 'csv'

  MangroveAtlasApi::Application.load_tasks

  before_destroy :destroy_mangrove_data

  # model association
  has_many :mangrove_datum, dependent: :destroy

  # validations
  validates_presence_of :name, :location_type, :iso

  def self.worldwide
    self.find_by(location_type: 'worldwide')
  end

  def self.rank_by_mangrove_data_column(column_name, dir = 'DESC', start_date = '1996-01-01', end_date = '2015-01-01', location_type = nil, limit = '5')
    data = MangroveDatum.joins('INNER JOIN locations on locations.id = mangrove_data.location_id')
      .select("mangrove_data.location_id, sum(#{column_name}) as #{column_name}, locations.location_type")
      .where.not(gain_m2: nil, location_id: Location.worldwide.id)
      .where("date::date >= ? AND date::date <= ?", Date.strptime(start_date, '%Y'), Date.strptime(end_date, '%Y'))
      .where('locations.location_type = ?', location_type)
      .group('mangrove_data.location_id, locations.location_type')
      .order("#{column_name} #{dir}")
      .limit(limit)
    
    location_ids = data.map { |m| m.location_id }
    
    result = self.where(id: location_ids).includes(:mangrove_datum)

    result
  end

  def self.import(import_params)
    CSV.foreach(import_params[:file].path, headers: true, col_sep: ';') do |row|
      location_hash = Location.new
      location_hash.name = row['name']
      location_hash.location_type = row['location_type']
      location_hash.iso = row['iso']
      location_hash.bounds = row['bounds']
      location_hash.geometry = row['geometry']
      location_hash.area_m2 = row['area_m2']
      location_hash.perimeter_m = row['perimeter_m']
      location_hash.coast_length_m = row['coast_length_m']
      location_hash.location_id = row['location_id']
      location_hash.save!
    end

    return self
  end

  def self.import_geojson(import_params)
    mangrove_datum = JSON.parse(File.read(import_params[:file].path))

    mangrove_datum['features'].each do |mangrove_data|
      row = mangrove_data['properties']
      location = Location.find_by(location_id: row['id'])

      unless location
        location_hash = Location.new
        location_hash.name = row['name']
        location_hash.location_type = row['type']
        location_hash.iso = row['iso']
        location_hash.bounds = row['bounds']
        location_hash.geometry = mangrove_data['geometry']
        location_hash.area_m2 = row['area_m2']
        location_hash.perimeter_m = row['perimeter_m']
        location_hash.coast_length_m = row['coast_length_m']
        location_hash.location_id = row['id']
        location_hash.save!
      end
    end

    return self
  end

  def self.dates_with_data(column_name)
    if column_name
      self.joins(:mangrove_datum).select('mangrove_data.date').where.not("mangrove_data.#{column_name} IS NULL").group('mangrove_data.date')
    else
      self.joins(:mangrove_datum).select('mangrove_data.date').group('mangrove_data.date')
    end
  end

  private

   def destroy_mangrove_data
     self.mangrove_datum.destroy_all
   end
end
