json.meta do
  json.location_coast_length_m @location_coast_length_m
  json.dates do
    json.array! @dates do |date|
      json.date date.date
    end 
  end
end

json.data do
  json.array! @mangrove_datum do |mangrove_data|
    json.partial! "mangrove_data", obj: mangrove_data
  end
end