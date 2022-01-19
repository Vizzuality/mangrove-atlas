# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

case Rails.env
  when "development"
    rufiji = Location.create(name: 'Rufiji river delta', location_type: 'aoi', iso: 'TZA', area_m2: 5191.75974325, perimeter_m: 299550.49, location_id: 1)
    MangroveDatum.create(location_id: rufiji.location_id, date: Date.new(1996), gain_m2: 0, loss_m2: 0, length_m: 65167.28, area_m2: 507526714.59)
  when "production"
end